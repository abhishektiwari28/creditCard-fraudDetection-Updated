from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'fraud.db')}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    trans_date_trans_time = Column(String, default=lambda: datetime.datetime.now().isoformat())
    merchant = Column(String)
    category = Column(String)
    amt = Column(Float)
    gender = Column(String)
    state = Column(String)
    job = Column(String)
    city_pop = Column(Integer)
    lat = Column(Float)
    long = Column(Float)
    merch_lat = Column(Float)
    merch_lon = Column(Float)
    
    # Analysis Results
    dist = Column(Float)
    prediction = Column(Integer)
    risk_score = Column(Float)
    is_fraud = Column(Boolean)
    risk_level = Column(String)
    action_taken = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)
