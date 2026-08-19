from fastapi import FastAPI, Depends, Form, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
import re

from database import engine, get_db, Base
import models

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Practice Project API",
    description="FastAPI Backend for the Practice Project",
    version="1.0.0"
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

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

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_FILE_SIZE = 5 * 1024 * 1024 # 5MB
ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

@app.get("/")
async def root():
    return {"status": "ok", "message": "FastAPI backend is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "API is healthy"}

@app.get("/api/listings")
async def get_listings(db: Session = Depends(get_db)):
    listings = db.query(models.LaptopListing).order_by(models.LaptopListing.id.desc()).all()
    return listings

@app.post("/api/listings")
async def create_listing(
    brand: str = Form(..., min_length=1),
    model: str = Form(..., min_length=3),
    condition: str = Form(...),
    price: float = Form(..., gt=0),
    name: str = Form(..., min_length=2),
    phone: str = Form(...),
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    # Validation
    if condition not in ['Excellent', 'Good', 'Fair', 'Poor']:
        raise HTTPException(status_code=400, detail="Invalid condition")
    
    if not re.match(r"^\+?[0-9]{10,15}$", phone):
        raise HTTPException(status_code=400, detail="Invalid phone number format")

    # File validation & saving
    valid_files = [img for img in images if img.filename]
    if len(valid_files) < 1 or len(valid_files) > 5:
        raise HTTPException(status_code=400, detail="Must upload between 1 and 5 images")

    saved_paths = []
    for img in valid_files:
        if img.content_type not in ACCEPTED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {img.content_type}")
        
        content = await img.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail=f"File {img.filename} exceeds 5MB limit")
        
        # Save file
        file_extension = img.filename.split(".")[-1] if "." in img.filename else "jpg"
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as f:
            f.write(content)
        
        saved_paths.append(file_path)

    # Database insertion
    new_listing = models.LaptopListing(
        brand=brand,
        model_name=model,
        condition=condition,
        price=price,
        user_name=name,
        phone=phone,
        image_paths=saved_paths
    )
    
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)

    return {"message": "Listing created successfully", "id": new_listing.id}
