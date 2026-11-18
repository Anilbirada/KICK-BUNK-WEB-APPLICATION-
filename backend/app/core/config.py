import os
from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "KICK BUNK Customer Experience Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgres@localhost:5433/kickbunk_customer"
    )
    SQL_ECHO: bool = False
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "kickbunk_luxury_dining_hmac_secret_2026_secure_key_9945321367")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # QR Token Security
    QR_TOKEN_SALT: str = os.getenv("QR_TOKEN_SALT", "kickbunk_table_qr_salt_secret_hash_2026")
    QR_TOKEN_EXPIRY_HOURS: int = 24
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8081",
        "http://localhost:19006",
        "https://kickbunk.com",
        "https://kickbunk-frontend.onrender.com",
        "*"
    ]
    
    # Host and Base URLs
    WEB_BASE_URL: str = os.getenv("WEB_BASE_URL", "http://localhost:3000")
    API_BASE_URL: str = os.getenv("API_BASE_URL", "http://localhost:8001")
    APP_SCHEME: str = "kickbunk"
    
    # POS Integration Mode: "LOCAL_EMULATOR" or "DIRECT_API"
    POS_INTEGRATION_MODE: str = os.getenv("POS_INTEGRATION_MODE", "LOCAL_EMULATOR")
    
    # Tax Configuration (Indian GST for Restaurant Dining: 5% total = 2.5% CGST + 2.5% SGST)
    TAX_RATE_CGST: float = 0.025
    TAX_RATE_SGST: float = 0.025
    PACKAGING_CHARGE_TAKEAWAY: float = 25.0
    DELIVERY_FEE_FLAT: float = 40.0

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
