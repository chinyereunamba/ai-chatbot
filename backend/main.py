from fastapi import FastAPI, UploadFile, File
import ollama
import os
from pydantic import BaseModel
from PyPDF2 import PdfFileReader
from docx import Document

app = FastAPI()


class ChatRequest(BaseModel):
    message: str


chat_history = []
model = "deepseek-r1:1.5b"


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
async def chat(request: ChatRequest):
    response = ollama.chat(
        model=model, messages=[{"role": "user", "content": request.message}]
    )

    reply = response["message"]["content"]
    chat_history.append({"user": request.message, "bot": reply})

    return {"response": reply, "history": chat_history}


@app.get("/")
def index():
    return {"data": "hello world"}


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_path = f"/uploads/{file.filename}"
    os.makedirs("uploads", exist_ok=True)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
        file_content = read_file(file_path)
        response = ollama.chat(
            model=model, messages=[{"role": "user", "content": file_content}]
        )
        reply = response['message']['content']

        return {'response': reply}
