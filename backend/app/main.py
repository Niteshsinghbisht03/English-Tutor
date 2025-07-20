from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import tutor

app = FastAPI()

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "English Tutor API is running!"}

# Include routes
app.include_router(tutor.router, prefix="/api")