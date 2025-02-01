from datetime import datetime
from fastapi import FastAPI, UploadFile, File, WebSocket, Depends, HTTPException
from fastapi.responses import StreamingResponse
import asyncio
from fastapi.security import OAuth2PasswordRequestForm
import ollama
import os
from pydantic import BaseModel
from PyPDF2 import PdfFileReader
from docx import Document
from fastapi.middleware.cors import CORSMiddleware
from .database import chat_collection, users_collection
from .user import router as user_router
from .auth import hash_password, verify_password, create_access_token, decode_access_token
from datetime import timedelta


origins = [
    'http://localhost:3000'
]


app = FastAPI()
app.include_router(user_router, prefix='/auth', tags=['auth'])


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


chat_history = []
MODEL_NAME = "deepseek-r1:1.5b"


async def generate_response(message: str):
    """Streams AI response incrementally"""
    def get_stream():
        return ollama.chat(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": message}],
            stream=True,
        )

    # Run blocking code in a thread
    stream = await asyncio.to_thread(get_stream)

    for chunk in stream:
        content = chunk.get("message", {}).get("content", "")
        if content:
            yield content
            await asyncio.sleep(0.05)  # Simulated delay


def read_file(file_path):
    ext: str = os.path.splitext(file_path)[1]
    file_extension = ext.lower()

    if file_extension == ".pdf":
        reader = PdfFileReader(file_path)
        text = "".join(
            [page.extract_text()] for page in reader.pages if page.extract_text()
        )
    elif file_extension == "docx" or file_extension == "odt":
        doc = Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
    else:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

    return text


@app.post("/chat/")
async def chat_stream(data: dict):
    """Handles chat requests and streams responses"""
    message = data.get("message", "")
    chat_history.append({"role": "user", "message": message})

    return StreamingResponse(generate_response(message), media_type="text/plain")


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_path = f"/uploads/{file.filename}"
    os.makedirs("uploads", exist_ok=True)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
        file_content = read_file(file_path)
        response = ollama.chat(
            model=MODEL_NAME, messages=[
                {"role": "user", "content": file_content}]
        )
        reply = response['message']['content']

        return {'response': reply}


@app.post("/save_chat/")
async def save_chat(user: str, message: str):
    chat = {"user": user, "message": message, "timestamp": datetime.utcnow()}
    await chat_collection.insert_one(chat)
    return {"message": "Chat saved"}


@app.get("/get_chat_history/")
async def get_chat_history(user: str):
    chats = await chat_collection.find({"user": user}).sort("timestamp", 1).to_list(100)
    return {"history": chats}


@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"AI Response: {data}")


@app.post("/auth/token/")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        {"sub": user["username"]}, expires_delta=timedelta(hours=1))
    return {"access_token": access_token, "token_type": "bearer", 'username': user['username']}
