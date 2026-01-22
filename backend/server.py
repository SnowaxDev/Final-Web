from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
try:
    import resend
    RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
    if RESEND_API_KEY:
        resend.api_key = RESEND_API_KEY
except ImportError:
    resend = None

SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', '')

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============== MODELS ==============

class BookingCreate(BaseModel):
    service: str
    property_size: int
    condition: str
    additional_services: List[str] = []
    preferred_date: str
    preferred_time: str
    alternative_date: Optional[str] = None
    customer_name: str
    customer_phone: str
    customer_email: EmailStr
    property_address: str
    notes: Optional[str] = ""
    estimated_price: int
    gdpr_consent: bool = True

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    service: str
    property_size: int
    condition: str
    additional_services: List[str] = []
    preferred_date: str
    preferred_time: str
    alternative_date: Optional[str] = None
    customer_name: str
    customer_phone: str
    customer_email: str
    property_address: str
    notes: Optional[str] = ""
    estimated_price: int
    status: str = "pending"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class PriceCalculation(BaseModel):
    service: str
    property_size: int
    condition: str
    additional_services: List[str] = []

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    message: str

# ============== PRICING CONFIG ==============

SERVICE_PRICES = {
    "lawn_mowing": 15,          # Kč/m²
    "lawn_with_fertilizer": 20, # Kč/m²
    "overgrown": 25,            # Kč/m²
    "hedge_trimming": 50,       # Kč/bm
    "vip_annual": 6900,         # Kč/rok (fixed)
    "other": 0
}

CONDITION_MULTIPLIERS = {
    "normal": 1.0,
    "overgrown": 1.5,
    "very_neglected": 2.0
}

ADDITIONAL_SERVICE_PRICES = {
    "debris_removal": 500,
    "mulching": 300,
    "vertikutace": 800,
    "hnojeni": 400
}

SERVICE_NAMES_CZ = {
    "lawn_mowing": "Běžné sekání",
    "lawn_with_fertilizer": "Sekání s hnojením",
    "overgrown": "Přerostlá tráva",
    "hedge_trimming": "Údržba živých plotů",
    "vip_annual": "Celoroční VIP balíček",
    "other": "Jiná služba"
}

TIME_NAMES_CZ = {
    "morning": "Dopoledne (8-12h)",
    "afternoon": "Odpoledne (12-16h)",
    "anytime": "Kdykoliv"
}

# ============== EMAIL TEMPLATES ==============

def get_customer_email_html(booking: Booking) -> str:
    service_name = SERVICE_NAMES_CZ.get(booking.service, booking.service)
    time_name = TIME_NAMES_CZ.get(booking.preferred_time, booking.preferred_time)
    
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #222222; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3FA34D, #2d7a38); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✓ Potvrzení rezervace</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">SeknuTo.cz</p>
        </div>
        
        <div style="background: #f8fff9; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 16px;">Dobrý den <strong>{booking.customer_name}</strong>,</p>
            <p>Děkujeme za rezervaci! Vaše objednávka byla úspěšně přijata.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
                <h3 style="color: #3FA34D; margin-top: 0;">📋 Detaily rezervace</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Služba:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{service_name}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Datum:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{booking.preferred_date}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Čas:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{time_name}</td></tr>
                    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Adresa:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">{booking.property_address}</td></tr>
                    <tr><td style="padding: 8px 0;"><strong>Odhadovaná cena:</strong></td><td style="padding: 8px 0; color: #3FA34D; font-weight: bold;">{booking.estimated_price} Kč</td></tr>
                </table>
            </div>
            
            <div style="background: #F0FDF4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #166534; margin: 0 0 10px;">📞 Co dál?</h4>
                <p style="margin: 0; color: #166534;">Brzy vás budeme kontaktovat na tel. <strong>{booking.customer_phone}</strong> pro finální potvrzení termínu.</p>
            </div>
            
            <p style="margin-top: 20px;">Máte dotaz? Napište nám:</p>
            <p>💬 WhatsApp: <a href="https://wa.me/420730588372" style="color: #3FA34D;">730 588 372</a><br>
            📧 Email: info@seknuto.cz</p>
        </div>
        
        <div style="background: #222222; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="color: white; margin: 0;">S pozdravem,<br><strong>Tým SeknuTo.cz</strong></p>
            <p style="color: #3FA34D; margin: 10px 0 0;">🌱 Trávník bez starostí!</p>
        </div>
    </body>
    </html>
    """

def get_admin_email_html(booking: Booking) -> str:
    service_name = SERVICE_NAMES_CZ.get(booking.service, booking.service)
    time_name = TIME_NAMES_CZ.get(booking.preferred_time, booking.preferred_time)
    additional = ", ".join(booking.additional_services) if booking.additional_services else "Žádné"
    
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #222222; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #FF6B35; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🆕 NOVÁ REZERVACE!</h1>
        </div>
        
        <div style="background: #fff; padding: 25px; border: 2px solid #FF6B35; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #222; margin-top: 0;">Zákazník: {booking.customer_name}</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background: #f8f9fa;"><td style="padding: 12px; border: 1px solid #dee2e6;"><strong>📞 Telefon:</strong></td><td style="padding: 12px; border: 1px solid #dee2e6;"><a href="tel:{booking.customer_phone}">{booking.customer_phone}</a></td></tr>
                <tr><td style="padding: 12px; border: 1px solid #dee2e6;"><strong>📧 Email:</strong></td><td style="padding: 12px; border: 1px solid #dee2e6;"><a href="mailto:{booking.customer_email}">{booking.customer_email}</a></td></tr>
                <tr style="background: #f8f9fa;"><td style="padding: 12px; border: 1px solid #dee2e6;"><strong>📍 Adresa:</strong></td><td style="padding: 12px; border: 1px solid #dee2e6;">{booking.property_address}</td></tr>
            </table>
            
            <h3 style="color: #3FA34D;">Detaily objednávky</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Služba:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{service_name}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Velikost:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{booking.property_size} m²</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Stav:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{booking.condition}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Termín:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{booking.preferred_date} - {time_name}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Doplňkové:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{additional}</td></tr>
                <tr><td style="padding: 8px;"><strong>Cena:</strong></td><td style="padding: 8px; color: #3FA34D; font-size: 18px; font-weight: bold;">~{booking.estimated_price} Kč</td></tr>
            </table>
            
            {f'<div style="background: #FFF3CD; padding: 15px; border-radius: 8px; margin: 20px 0;"><strong>📝 Poznámka od zákazníka:</strong><br>{booking.notes}</div>' if booking.notes else ''}
            
            <div style="background: #D4EDDA; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <strong>⚡ AKCE POTŘEBNÁ:</strong><br>
                → Zavolat zákazníkovi pro potvrzení<br>
                → Zapsat do kalendáře
            </div>
        </div>
    </body>
    </html>
    """

# ============== API ENDPOINTS ==============

@api_router.get("/")
async def root():
    return {"message": "SeknuTo.cz API", "status": "running"}

@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_data: BookingCreate):
    booking = Booking(**booking_data.model_dump())
    doc = booking.model_dump()
    
    await db.bookings.insert_one(doc)
    logger.info(f"New booking created: {booking.id} for {booking.customer_name}")
    
    # Send emails asynchronously
    if resend and RESEND_API_KEY:
        try:
            # Customer email
            customer_params = {
                "from": SENDER_EMAIL,
                "to": [booking.customer_email],
                "subject": "✓ Potvrzení rezervace - SeknuTo.cz",
                "html": get_customer_email_html(booking)
            }
            await asyncio.to_thread(resend.Emails.send, customer_params)
            logger.info(f"Customer confirmation email sent to {booking.customer_email}")
            
            # Admin email
            if ADMIN_EMAIL:
                admin_params = {
                    "from": SENDER_EMAIL,
                    "to": [ADMIN_EMAIL],
                    "subject": f"🆕 Nová rezervace - {booking.customer_name}",
                    "html": get_admin_email_html(booking)
                }
                await asyncio.to_thread(resend.Emails.send, admin_params)
                logger.info(f"Admin notification email sent to {ADMIN_EMAIL}")
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
    
    return booking

@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@api_router.get("/bookings", response_model=List[Booking])
async def get_all_bookings():
    bookings = await db.bookings.find({}, {"_id": 0}).to_list(1000)
    return bookings

@api_router.post("/pricing/calculate")
async def calculate_price(data: PriceCalculation):
    base_price = SERVICE_PRICES.get(data.service, 15)
    
    if data.service == "vip_annual":
        total = SERVICE_PRICES["vip_annual"]
    elif data.service == "hedge_trimming":
        total = base_price * data.property_size  # property_size = bm for hedges
    else:
        multiplier = CONDITION_MULTIPLIERS.get(data.condition, 1.0)
        total = int(base_price * data.property_size * multiplier)
    
    # Add additional services
    for service in data.additional_services:
        total += ADDITIONAL_SERVICE_PRICES.get(service, 0)
    
    return {
        "estimated_price": total,
        "base_price_per_unit": base_price,
        "property_size": data.property_size,
        "condition_multiplier": CONDITION_MULTIPLIERS.get(data.condition, 1.0),
        "additional_services_cost": sum(ADDITIONAL_SERVICE_PRICES.get(s, 0) for s in data.additional_services)
    }

@api_router.get("/availability")
async def get_availability():
    # Return available dates (next 30 days, excluding Sundays)
    from datetime import timedelta
    today = datetime.now(timezone.utc).date()
    available_dates = []
    
    for i in range(1, 31):
        date = today + timedelta(days=i)
        if date.weekday() != 6:  # Exclude Sundays
            available_dates.append(date.isoformat())
    
    return {"available_dates": available_dates}

@api_router.post("/contact")
async def submit_contact_form(form: ContactForm):
    doc = {
        "id": str(uuid.uuid4()),
        "name": form.name,
        "email": form.email,
        "phone": form.phone,
        "message": form.message,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "new"
    }
    
    await db.contact_messages.insert_one(doc)
    logger.info(f"Contact form submitted by {form.name}")
    
    # Send email notification if configured
    if resend and RESEND_API_KEY and ADMIN_EMAIL:
        try:
            params = {
                "from": SENDER_EMAIL,
                "to": [ADMIN_EMAIL],
                "subject": f"📬 Nová zpráva od {form.name} - SeknuTo.cz",
                "html": f"""
                <h2>Nová zpráva z kontaktního formuláře</h2>
                <p><strong>Jméno:</strong> {form.name}</p>
                <p><strong>Email:</strong> {form.email}</p>
                <p><strong>Telefon:</strong> {form.phone or 'Neuvedeno'}</p>
                <p><strong>Zpráva:</strong></p>
                <p>{form.message}</p>
                """
            }
            await asyncio.to_thread(resend.Emails.send, params)
        except Exception as e:
            logger.error(f"Failed to send contact notification: {str(e)}")
    
    return {"message": "Děkujeme za zprávu! Brzy se vám ozveme.", "id": doc["id"]}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
