from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.config import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    estimated_daily = Column(Float)  # 'en' or 'hi'
    estimated_monthly = Column(Float)
    estimated_weekly = Column(Float)
    language = Column(String, default = "en")
    essentials_pct = Column(Float, default=0.50)  # 50%
    bills_pct      = Column(Float, default=0.20)  # 20%
    savings_pct    = Column(Float, default=0.20)  # 20%
    fun_pct        = Column(Float, default=0.10)  # 10%
    transactions = relationship("Expenses", back_populates="user")


class Expenses(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    date = Column(DateTime, default=datetime.utcnow, index=True)
    amount = Column(Float, nullable=False)  # +ve income, -ve expense
    description = Column(String, nullable=False)
    category = Column(String, nullable=True)  # 'food', 'rent', etc
    bucket = Column(String, nullable=True) 

    user = relationship("User", back_populates="transactions")