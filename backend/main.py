from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Practice Project API",
    description="FastAPI Backend for the Practice Project",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:5173", # Vite default port
    # Add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthCheckResponse(BaseModel):
    status: str
    message: str

@app.get("/", response_model=HealthCheckResponse)
async def root():
    return {"status": "ok", "message": "FastAPI backend is running"}

@app.get("/api/health", response_model=HealthCheckResponse)
async def health_check():
    return {"status": "ok", "message": "API is healthy"}
