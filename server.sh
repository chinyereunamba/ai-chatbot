# !/bin/bash

cd backend
fastapi dev --host localhost --port 8000 &

cd ../frontend
bun run dev