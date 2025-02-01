from fastapi import FastAPI, HTTPException, Depends, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from .database import users_collection
from .auth import hash_password, verify_password, create_access_token, decode_access_token
from datetime import timedelta

router = APIRouter()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


class AuthRequest(BaseModel):
    username: str
    password: str


@router.post("/register/")
async def register(data: AuthRequest):
    existing_user = await users_collection.find_one({"username": data.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_pw = hash_password(data.password)
    new_user = {"username": data.username, "password": hashed_pw}
    await users_collection.insert_one(new_user)
    return {"message": "User registered successfully"}


@router.get("/me/")
async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = await users_collection.find_one({"username": payload["sub"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"username": user["username"]}
