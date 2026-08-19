from sqlalchemy import Column, Integer, String, Float, JSON
from database import Base

class LaptopListing(Base):
    __tablename__ = "laptop_listings"

    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, index=True, nullable=False)
    model_name = Column(String, nullable=False)
    condition = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    user_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    image_paths = Column(JSON, nullable=False)
