from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pathlib import Path
from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import Depends
from pydantic import EmailStr

import os
import logging
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ---------------- DATABASE ----------------

DATABASE_URL = "sqlite:///./yojnadarshan.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class SchemeDB(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    scheme_type = Column(String, nullable=False)
    state = Column(String, nullable=True)
    benefits = Column(Text, nullable=False)
    documents_required = Column(Text, nullable=False)
    official_link = Column(String, nullable=False)

    min_age = Column(Integer, nullable=True)
    max_age = Column(Integer, nullable=True)
    allowed_genders = Column(String, nullable=True)
    max_income = Column(Integer, nullable=True)
    allowed_categories = Column(String, nullable=True)
    allowed_occupations = Column(String, nullable=True)
    requires_disability = Column(Boolean, default=False)
    # ---------------- USER MODEL ----------------

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")  # user / admin

Base.metadata.create_all(bind=engine)
# ✅ MOVE HERE
def get_db():
    return SessionLocal()


# ---------------- AUTH CONFIG ----------------



SECRET_KEY = "supersecretkey123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def hash_password(password: str):
    return pwd_context.hash(password[:72])

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials"
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(UserDB).filter(UserDB.email == email).first()

    if user is None:
        raise credentials_exception

    return user

def get_admin_user(current_user: UserDB = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    return current_user

# ---------------- Pydantic Models ----------------

class UserProfile(BaseModel):
    age: int = Field(..., ge=0, le=150)
    gender: str
    annualIncome: int
    occupation: str
    category: str
    state: str
    hasDisability: bool = False

class Scheme(BaseModel):
    id: int
    name: str
    description: str
    category: str
    scheme_type: str
    state: Optional[str] = None
    benefits: str
    documents_required: List[str]
    official_link: str
    eligibility_reason: Optional[str] = None

class EligibilityResponse(BaseModel):
    eligible_schemes: List[Scheme]
    total_count: int

class SchemeCreate(BaseModel):
    name: str
    description: str
    category: str
    scheme_type: str
    state: Optional[str] = None
    benefits: str
    documents_required: List[str]
    official_link: str
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    allowed_genders: Optional[List[str]] = None
    max_income: Optional[int] = None
    allowed_categories: Optional[List[str]] = None
    allowed_occupations: Optional[List[str]] = None
    requires_disability: bool = False


    # ---------------- AUTH SCHEMAS ----------------

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# ---------------- FASTAPI ----------------

app = FastAPI(title="YojnaDarshan API")
api_router = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



# ---------------- ELIGIBILITY LOGIC ----------------

def check_eligibility_logic(user: UserProfile, scheme: SchemeDB):

    # Age
    if scheme.min_age is not None and user.age < scheme.min_age:
        return False, "Minimum age requirement not met"

    if scheme.max_age is not None and user.age > scheme.max_age:
        return False, "Maximum age exceeded"

    # Gender
    if scheme.allowed_genders:
        allowed = json.loads(scheme.allowed_genders)
        if user.gender not in allowed:
            return False, "Gender not eligible"

    # Income (FIXED camelCase)
    if scheme.max_income is not None and user.annualIncome > scheme.max_income:
        return False, "Income exceeds limit"

    # Category
    if scheme.allowed_categories:
        allowed = json.loads(scheme.allowed_categories)
        if user.category not in allowed:
            return False, "Category not eligible"

    # Occupation
    if scheme.allowed_occupations:
        allowed = json.loads(scheme.allowed_occupations)
        if user.occupation not in allowed:
            return False, "Occupation not eligible"

    # Disability (FIXED camelCase)
    if scheme.requires_disability and not user.hasDisability:
        return False, "Disability required"

    # State
    if scheme.scheme_type == "State" and scheme.state:
        if user.state != scheme.state:
            return False, "State mismatch"

    return True, "All eligibility conditions satisfied"

# ---------------- AUTH ROUTES ----------------

@api_router.post("/auth/register")
async def register(user: UserCreate):
    db = get_db()

    existing_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = UserDB(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}
@api_router.post("/auth/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = db.query(UserDB).filter(UserDB.email == form_data.username).first()

    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({
        "sub": db_user.email,
        "role": db_user.role
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
@api_router.get("/auth/me")
async def get_me(current_user: UserDB = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }



# ---------------- ROUTES ----------------

@api_router.post("/check-eligibility", response_model=EligibilityResponse)
async def check_eligibility(user_profile: UserProfile):

    db = get_db()
    schemes = db.query(SchemeDB).all()

    eligible_schemes = []

    for scheme_db in schemes:
        is_eligible, reason = check_eligibility_logic(user_profile, scheme_db)

        if is_eligible:
            scheme_dict = {
                "id": scheme_db.id,
                "name": scheme_db.name,
                "description": scheme_db.description,
                "category": scheme_db.category,
                "scheme_type": scheme_db.scheme_type,
                "state": scheme_db.state,
                "benefits": scheme_db.benefits,
                "documents_required": json.loads(scheme_db.documents_required),
                "official_link": scheme_db.official_link,
                "eligibility_reason": reason
            }
            eligible_schemes.append(Scheme(**scheme_dict))

    return EligibilityResponse(
        eligible_schemes=eligible_schemes,
        total_count=len(eligible_schemes)
    )

@api_router.get("/schemes", response_model=List[Scheme])
async def get_schemes():
    db = get_db()
    schemes = db.query(SchemeDB).all()

    result = []
    for scheme_db in schemes:
        scheme_dict = {
            "id": scheme_db.id,
            "name": scheme_db.name,
            "description": scheme_db.description,
            "category": scheme_db.category,
            "scheme_type": scheme_db.scheme_type,
            "state": scheme_db.state,
            "benefits": scheme_db.benefits,
            "documents_required": json.loads(scheme_db.documents_required),
            "official_link": scheme_db.official_link
        }
        result.append(Scheme(**scheme_dict))

    return result

app.include_router(api_router)

@api_router.get("/schemes/{scheme_id}", response_model=Scheme)
async def get_scheme(scheme_id: int):
    """Get a specific scheme by ID."""
    db = get_db()
    scheme_db = db.query(SchemeDB).filter(SchemeDB.id == scheme_id).first()
    
    if not scheme_db:
        raise HTTPException(status_code=404, detail="Scheme not found")
    
    scheme_dict = {
        "id": scheme_db.id,
        "name": scheme_db.name,
        "description": scheme_db.description,
        "category": scheme_db.category,
        "scheme_type": scheme_db.scheme_type,
        "state": scheme_db.state,
        "benefits": scheme_db.benefits,
        "documents_required": json.loads(scheme_db.documents_required),
        "official_link": scheme_db.official_link
    }
    
    return Scheme(**scheme_dict)

@api_router.post("/admin/add-scheme")
async def add_scheme(
    scheme: SchemeCreate,
    admin_user: UserDB = Depends(get_admin_user)
):
    """
    Admin endpoint to add new schemes.
    In production, this should be protected with authentication.
    """
    db = get_db()
    
    scheme_db = SchemeDB(
        name=scheme.name,
        description=scheme.description,
        category=scheme.category,
        scheme_type=scheme.scheme_type,
        state=scheme.state,
        benefits=scheme.benefits,
        documents_required=json.dumps(scheme.documents_required),
        official_link=scheme.official_link,
        min_age=scheme.min_age,
        max_age=scheme.max_age,
        allowed_genders=json.dumps(scheme.allowed_genders) if scheme.allowed_genders else None,
        max_income=scheme.max_income,
        allowed_categories=json.dumps(scheme.allowed_categories) if scheme.allowed_categories else None,
        allowed_occupations=json.dumps(scheme.allowed_occupations) if scheme.allowed_occupations else None,
        requires_disability=scheme.requires_disability
    )
    
    db.add(scheme_db)
    db.commit()
    db.refresh(scheme_db)
    
    return {"message": "Scheme added successfully", "id": scheme_db.id}



@app.on_event("startup")
async def startup_event():
    """Seed database with sample schemes on startup."""
    db = get_db()
    
    # Check if schemes already exist
    existing_schemes = db.query(SchemeDB).count()
    if existing_schemes > 0:
        logger.info(f"Database already has {existing_schemes} schemes. Skipping seed.")
        return
    
    logger.info("Seeding database with sample schemes...")
    
    # Sample Central and State Schemes with realistic eligibility criteria
    sample_schemes = [
        {
            "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
            "description": "Income support scheme for farmers providing ₹6000 per year in three installments.",
            "category": "Agriculture",
            "scheme_type": "Central",
            "state": None,
            "benefits": "Financial assistance of ₹6000 per year directly transferred to farmers' bank accounts in three equal installments.",
            "documents_required": json.dumps(["Aadhaar Card", "Land Ownership Documents", "Bank Account Details", "Farmer ID"]),
            "official_link": "https://pmkisan.gov.in/",
            "min_age": 18,
            "max_age": None,
            "allowed_genders": None,
            "max_income": None,
            "allowed_categories": None,
            "allowed_occupations": json.dumps(["Farmer"]),
            "requires_disability": False
        },
        {
            "name": "Ayushman Bharat (PM-JAY)",
            "description": "Health insurance scheme providing coverage up to ₹5 lakhs per family per year for secondary and tertiary care hospitalization.",
            "category": "Health",
            "scheme_type": "Central",
            "state": None,
            "benefits": "Free health insurance coverage of ₹5 lakhs per family annually for hospitalization at empanelled hospitals.",
            "documents_required": json.dumps(["Aadhaar Card", "Ration Card", "Income Certificate", "Family ID"]),
            "official_link": "https://pmjay.gov.in/",
            "min_age": None,
            "max_age": None,
            "allowed_genders": None,
            "max_income": 5,
            "allowed_categories": json.dumps(["General", "OBC", "SC", "ST", "EWS"]),
            "allowed_occupations": None,
            "requires_disability": False
        },
        {
            "name": "Sukanya Samriddhi Yojana",
            "description": "Small savings scheme for girl child education and marriage expenses with attractive interest rates and tax benefits.",
            "category": "Women",
            "scheme_type": "Central",
            "state": None,
            "benefits": "High interest rate on savings (currently 8.2%), tax benefits under Section 80C, and maturity benefit after 21 years or marriage after 18 years.",
            "documents_required": json.dumps(["Girl Child Birth Certificate", "Parent's Aadhaar Card", "Parent's PAN Card", "Address Proof"]),
            "official_link": "https://www.india.gov.in/sukanya-samriddhi-yojana",
            "min_age": 0,
            "max_age": 10,
            "allowed_genders": json.dumps(["Female"]),
            "max_income": None,
            "allowed_categories": None,
            "allowed_occupations": None,
            "requires_disability": False
        },
        {
            "name": "National Scholarship Portal (NSP)",
            "description": "Centralized portal for various scholarships for students from economically weaker sections, minorities, and meritorious students.",
            "category": "Education",
            "scheme_type": "Central",
            "state": None,
            "benefits": "Financial assistance ranging from ₹10,000 to ₹20,000 per year depending on course and category for educational expenses.",
            "documents_required": json.dumps(["Aadhaar Card", "Income Certificate", "Caste Certificate (if applicable)", "Previous Year Marksheet", "Bank Account Details", "Institution ID"]),
            "official_link": "https://scholarships.gov.in/",
            "min_age": 10,
            "max_age": 35,
            "allowed_genders": None,
            "max_income": 8,
            "allowed_categories": json.dumps(["OBC", "SC", "ST", "EWS"]),
            "allowed_occupations": json.dumps(["Student"]),
            "requires_disability": False
        },
        {
            "name": "MUDRA Loan Scheme",
            "description": "Provides loans up to ₹10 lakhs to non-corporate, non-farm small/micro enterprises under three categories: Shishu, Kishore, and Tarun.",
            "category": "MSME",
            "scheme_type": "Central",
            "state": None,
            "benefits": "Collateral-free loans from ₹50,000 to ₹10 lakhs for starting or expanding small businesses with easy repayment terms.",
            "documents_required": json.dumps(["Aadhaar Card", "PAN Card", "Business Plan", "Address Proof", "Bank Statements", "Income Proof"]),
            "official_link": "https://www.mudra.org.in/",
            "min_age": 18,
            "max_age": None,
            "allowed_genders": None,
            "max_income": None,
            "allowed_categories": None,
            "allowed_occupations": json.dumps(["Self-Employed", "Unemployed"]),
            "requires_disability": False
        },
        {
            "name": "National Social Assistance Programme (NSAP)",
            "description": "Provides pension to elderly, widows, and persons with disabilities who are below poverty line.",
            "category": "Social Welfare",
            "scheme_type": "Central",
            "state": None,
            "benefits": "Monthly pension ranging from ₹200 to ₹500 depending on age and category, directly credited to beneficiary's account.",
            "documents_required": json.dumps(["Aadhaar Card", "Age Proof", "BPL Card", "Bank Account Details", "Disability Certificate (if applicable)"]),
            "official_link": "https://nsap.nic.in/",
            "min_age": 60,
            "max_age": None,
            "allowed_genders": None,
            "max_income": 2,
            "allowed_categories": None,
            "allowed_occupations": json.dumps(["Unemployed", "Retired"]),
            "requires_disability": False
        },
        {
            "name": "Maharashtra Sanjay Gandhi Niradhar Yojana",
            "description": "State pension scheme for destitute individuals in Maharashtra providing monthly financial assistance.",
            "category": "Social Welfare",
            "scheme_type": "State",
            "state": "Maharashtra",
            "benefits": "Monthly pension of ₹600 for eligible beneficiaries who have no source of income or family support.",
            "documents_required": json.dumps(["Aadhaar Card", "Domicile Certificate", "Income Certificate", "Bank Account Details", "Age Proof"]),
            "official_link": "https://aaplesarkar.mahaonline.gov.in/",
            "min_age": 65,
            "max_age": None,
            "allowed_genders": None,
            "max_income": 1,
            "allowed_categories": None,
            "allowed_occupations": None,
            "requires_disability": False
        }
    ]
    
    for scheme_data in sample_schemes:
        scheme_db = SchemeDB(**scheme_data)
        db.add(scheme_db)
    
    db.commit()
    logger.info(f"Successfully seeded {len(sample_schemes)} schemes to database.")
