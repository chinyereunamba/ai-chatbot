from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "chat_ai"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
chat_collection = db["chats"]
users_collection = db["users"]
