from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
import uuid

router = APIRouter()

# --- 1. THE KICK BUNK CINEMATIC EXPERIENCE VIDEOS ---

class VideoItem(BaseModel):
    id: str
    title: str
    category: str
    description: str
    video_url: str
    poster_url: str
    duration_seconds: int
    display_order: int
    is_active: bool = True
    tagline: str

# 5 Dedicated cinematic experience videos with luxury streaming CDN clips and high-res posters
INITIAL_VIDEOS: List[dict] = [
    {
        "id": "vid-1",
        "title": "Signature Food Experience",
        "category": "Culinary Gastronomy",
        "description": "Witness the spectacle of authentic live charcoal tandoor embers, slow-simmered Awadhi gravies, and artisanal plating crafted by Executive Chef Hemant Kapoor.",
        "video_url": "/videos/food.mp4",
        "poster_url": "/images/kickbunk/magicpin_01_kalmi_kebab.webp",
        "duration_seconds": 38,
        "display_order": 1,
        "is_active": True,
        "tagline": "Flame, Smoke & Culinary Artistry"
    },
    {
        "id": "vid-2",
        "title": "Cocktail & Bartender Experience",
        "category": "Mixology Showcase",
        "description": "Watch Head Mixologist Marcello D'Souza craft hand-smoked bourbon infusions, flair shaker routines, and botanical gin elderflower highballs.",
        "video_url": "/videos/cocktails.mp4",
        "poster_url": "/images/kickbunk/restaurant_guru_interior.jpg",
        "duration_seconds": 34,
        "display_order": 2,
        "is_active": True,
        "tagline": "Alchemy in Crystal & Oak Smoke"
    },
    {
        "id": "vid-3",
        "title": "Premium Bar Experience",
        "category": "Cellar & Single Malts",
        "description": "Explore our illuminated spirits cellar featuring Speyside single malts, small-batch Kentucky bourbons, and chilled craft European cervezas on tap.",
        "video_url": "/videos/bar.mp4",
        "poster_url": "/images/kickbunk/restaurant_guru_facade.jpg",
        "duration_seconds": 42,
        "display_order": 3,
        "is_active": True,
        "tagline": "World-Class Spirits & Curated Labels"
    },
    {
        "id": "vid-4",
        "title": "Party & DJ Nights",
        "category": "Nightlife & Energy",
        "description": "Feel the electric pulse of weekend DJ sets, ambient acoustic jazz sessions, and champagne toasts under the starlit sky.",
        "video_url": "/videos/party.mp4",
        "poster_url": "/images/kickbunk/magicpin_09_garden_pathway_night.webp",
        "duration_seconds": 45,
        "display_order": 4,
        "is_active": True,
        "tagline": "Electric Beats Under Starlit Canopies"
    },
    {
        "id": "vid-5",
        "title": "Restaurant Ambience & Celebrations",
        "category": "Garden Cabanas & Vibe",
        "description": "Immerse in private romantic cabanas, cascading fairy light garden paths, and warm terracotta luxury designed for unforgettable milestones.",
        "video_url": "/videos/ambience.mp4",
        "poster_url": "/images/kickbunk/google_01_garden_lights_night.jpg",
        "duration_seconds": 40,
        "display_order": 5,
        "is_active": True,
        "tagline": "An Oasis of Elegance & Warmth"
    }
]

# In-memory dynamic video store
videos_db = [dict(v) for v in INITIAL_VIDEOS]

@router.get("/videos")
def get_experience_videos(active_only: bool = True):
    """Retrieve cinematic experience videos sorted by display_order."""
    items = [v for v in videos_db if (v["is_active"] if active_only else True)]
    return sorted(items, key=lambda x: x["display_order"])

@router.post("/videos")
def create_or_update_video(payload: dict):
    """Admin endpoint to create or update an experience video."""
    video_id = payload.get("id") or f"vid-{str(uuid.uuid4())[:6]}"
    existing = next((v for v in videos_db if v["id"] == video_id), None)
    
    video_data = {
        "id": video_id,
        "title": payload.get("title", "Cinematic Experience"),
        "category": payload.get("category", "General"),
        "description": payload.get("description", ""),
        "video_url": payload.get("video_url", ""),
        "poster_url": payload.get("poster_url", ""),
        "duration_seconds": int(payload.get("duration_seconds", 30)),
        "display_order": int(payload.get("display_order", len(videos_db) + 1)),
        "is_active": bool(payload.get("is_active", True)),
        "tagline": payload.get("tagline", "Extraordinary Experience")
    }
    
    if existing:
        existing.update(video_data)
        return {"success": True, "action": "updated", "video": existing}
    else:
        videos_db.append(video_data)
        return {"success": True, "action": "created", "video": video_data}

@router.post("/videos/reorder")
def reorder_videos(ordered_ids: List[str]):
    """Update display order of experience videos."""
    for idx, vid_id in enumerate(ordered_ids):
        for v in videos_db:
            if v["id"] == vid_id:
                v["display_order"] = idx + 1
    return {"success": True, "message": "Videos reordered successfully"}


# --- 2. PARTY AND EVENTS MODULE ---

INITIAL_EVENTS = [
    {
        "id": "evt-1",
        "title": "Bespoke Birthday Celebrations",
        "category": "Private Parties",
        "tagline": "Personalized Luxury with Custom Menus & Cabana Styling",
        "description": "Celebrate your milestone birthday in our fairy-lit private cabanas. Includes custom tiered dessert styling, tailored tasting menus, signature cocktail named after the host, and dedicated steward service.",
        "capacity": "10 to 60 Guests",
        "image_url": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80",
        "inclusions": ["Custom Birthday Cake & Dessert Bar", "Dedicated Bartender & Steward", "Fairy-Light Floral Cabana Decor", "Tailored 4-Course Degustation Menu"]
    },
    {
        "id": "evt-2",
        "title": "Anniversary & Romantic Dining",
        "category": "Intimate Milestones",
        "tagline": "Candlelit European Romance Under the Stars",
        "description": "An intimate sanctuary for couples celebrating anniversaries. Private garden corner decorated with fragrant blooms, chilled vintage champagne on arrival, and a bespoke acoustic violinist upon request.",
        "capacity": "2 to 12 Guests",
        "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
        "inclusions": ["Bottle of Chilled Sparkling Wine", "Custom Rose Petal & Candle Styling", "Private Sommelier Pairing", "Handcrafted Keepsake Menu"]
    },
    {
        "id": "evt-3",
        "title": "Weekend DJ & High-Energy Nights",
        "category": "Nightlife",
        "tagline": "Live Electronic, Deep House & Afrobeats Vibe",
        "description": "Every Friday and Saturday night, KICK BUNK transforms into the city's most refined open-air nightlife destination featuring premier guest DJs, laser ambient lighting, and flair mixology performances.",
        "capacity": "Up to 250 Guests",
        "image_url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80",
        "inclusions": ["VIP Lounge & Bottle Service", "Live International DJ Sets", "Artisanal Finger Food Platters", "Priority Valet Access"]
    },
    {
        "id": "evt-4",
        "title": "Corporate Soirées & Brand Launches",
        "category": "Corporate Events",
        "tagline": "Sophisticated Business Entertaining & Cocktail Hours",
        "description": "Host memorable corporate dinners, product unveilings, or annual celebration mixers. High-speed Wi-Fi, audio-visual projection support, and seamless buffet or plated course arrangements.",
        "capacity": "20 to 180 Guests",
        "image_url": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80",
        "inclusions": ["Wireless Microphones & HD AV Setup", "Corporate GST Tax Invoicing", "Premium Open Bar Packages", "Executive Chef Live Stations"]
    },
    {
        "id": "evt-5",
        "title": "Private Mezzanine Buyouts",
        "category": "Exclusive Venues",
        "tagline": "Total Privacy with Panoramic View of Lush Gardens",
        "description": "Exclusive access to our elevated Mezzanine Lounge featuring private bar, dedicated restroom, lounge sofa clusters, and full control over music and lighting ambiance.",
        "capacity": "30 to 80 Guests",
        "image_url": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1000&q=80",
        "inclusions": ["Exclusive Floor Access", "Private Bar Counter & Mixologist", "Customized Sound & Ambient Lighting", "Multi-Cuisine Live Tandoor Embers"]
    },
    {
        "id": "evt-6",
        "title": "Family Gatherings & Group Feasts",
        "category": "Group Dining",
        "tagline": "Generous Family Sharing Platters in Spacious Lawn Cabanas",
        "description": "Sprawling lawn cabanas with large family tables ideal for multi-generational get-togethers, reunion dinners, and relaxed weekend celebrations.",
        "capacity": "8 to 40 Guests",
        "image_url": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80",
        "inclusions": ["Family-Style Sharing Platters", "Kid-Friendly Mocktail & Sundae Station", "Comfortable Sofa Seating", "Complimentary Celebration Photography"]
    }
]

event_enquiries_db: List[dict] = []

@router.get("/events")
def get_events_list():
    """Retrieve all curated event and party packages."""
    return INITIAL_EVENTS

@router.post("/events/enquiry")
def submit_event_enquiry(payload: dict):
    """Submit a private party or event enquiry."""
    enquiry_id = f"ENQ-{datetime.now().strftime('%Y%m')}-{str(uuid.uuid4())[:5].upper()}"
    enquiry = {
        "id": enquiry_id,
        "event_type": payload.get("event_type", "Birthday Celebration"),
        "guest_name": payload.get("guest_name", "Valued Guest"),
        "phone": payload.get("phone", ""),
        "email": payload.get("email", ""),
        "preferred_date": payload.get("preferred_date", datetime.now().strftime("%Y-%m-%d")),
        "preferred_time": payload.get("preferred_time", "07:30 PM"),
        "guest_count": int(payload.get("guest_count", 20)),
        "special_requests": payload.get("special_requests", ""),
        "status": "NEW_INQUIRY",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    event_enquiries_db.append(enquiry)
    return {
        "success": True,
        "enquiry_id": enquiry_id,
        "message": f"Thank you, {enquiry['guest_name']}. Our Event Director will reach out at {enquiry['phone']} within 2 hours to curate your celebration."
    }

@router.get("/events/enquiries")
def get_all_enquiries():
    """Admin endpoint to view and manage event enquiries."""
    return sorted(event_enquiries_db, key=lambda x: x["created_at"], reverse=True)


# --- 3. AI RESTAURANT ASSISTANT & SOMMELIER ---

class AiChatPayload(BaseModel):
    message: str
    guest_context: Optional[dict] = None

@router.post("/ai/chat")
def ai_restaurant_assistant(payload: AiChatPayload):
    """
    Intelligent AI Sommelier & Restaurant Concierge.
    Provides food/wine pairings, chef signature recommendations, FAQ answers, and reservation advice.
    """
    msg = payload.message.lower().strip()
    
    # 1. Pairing & Wine questions
    if any(k in msg for k in ["wine", "cocktail", "pair", "drink", "whisky", "malt", "beer", "alcohol"]):
        if any(k in msg for k in ["kebab", "chicken", "tikka", "meat"]):
            reply = (
                "🍷 **Sommelier Recommendation:** For our **Charcoal Kalmi Kebab** or **Old Delhi Butter Chicken**, "
                "I highly recommend pairing with our **Smoked Bourbon Old Fashioned** (the charred oak notes echo the tandoor embers) "
                "or a dram of **The Macallan 12 Yrs Sherry Oak**, whose dried fruit and spice notes balance the rich makhani gravy perfectly."
            )
        elif any(k in msg for k in ["paneer", "veg", "dal", "vegetarian"]):
            reply = (
                "🍸 **Sommelier Recommendation:** With our **Truffle Malai Paneer Tikka** or **24-Hour Dal Makhani**, "
                "our **Botanical Gin & Tonic** made with Bombay Sapphire and elderflower tonic provides crisp effervescence that cuts through the creaminess, "
                "leaving a refreshed palate with every bite."
            )
        else:
            reply = (
                "🥂 **KICK BUNK Cellar Highlights:** Our cellar features single malts like **Glenfiddich 12 Yrs** and **The Macallan 12 Yrs**, "
                "small-batch **Buffalo Trace Bourbon**, and artisan cocktails like our **Smoked Old Fashioned**. "
                "Let me know what dish you are considering, and I'll curate the perfect pour!"
            )

    # 2. Signature dish / food recommendations
    elif any(k in msg for k in ["recommend", "best", "signature", "popular", "famous", "food", "eat"]):
        if "veg" in msg:
            reply = (
                "🌿 **Chef's Vegetarian Signatures:**\n"
                "1. **Truffle Malai Paneer Tikka (₹420):** Organic cottage cheese infused with cardamom and Urbani white truffle oil.\n"
                "2. **KICK BUNK 24-Hour Dal Makhani (₹375):** Simmered overnight on glowing embers with churned white butter.\n"
                "3. **Chur-Chur Garlic Naan (₹110):** Multi-layered crispy bread with clarified cow ghee."
            )
        else:
            reply = (
                "🔥 **Executive Chef Hemant Kapoor's Masterpieces:**\n"
                "1. **Charcoal Kalmi Kebab (₹440):** Succulent drumsticks steeped in hung curd, saffron, and roasted spices.\n"
                "2. **Old Delhi Butter Chicken (₹490):** Smoked boneless tandoori chicken in San Marzano velvet gravy.\n"
                "3. **Awadhi Gosht Dum Biryani (₹590):** Prime mountain mutton layered with aged Daawat Gold Basmati in a sealed pot."
            )

    # 3. Reservation & Booking advice
    elif any(k in msg for k in ["reserve", "table", "book", "cabana", "seating", "timing", "hours"]):
        reply = (
            "✨ **Reservation Concierge:** We offer three signature dining zones:\n"
            "• **Open-Air Garden Cabanas:** Ideal for romantic dinners and birthday celebrations.\n"
            "• **Mezzanine Resto-Bar:** Elevated high-energy ambiance near the DJ console.\n"
            "• **Main Dining Hall:** Classic European family dining with plush banquet seating.\n\n"
            "You can book immediately using our **Reservations** tab or by calling our host at **+91 99453 21367**."
        )

    # 4. Location, Dress Code, Parking
    elif any(k in msg for k in ["location", "where", "address", "parking", "dress code", "timing"]):
        reply = (
            "📍 **Location & Guest Details:**\n"
            "• **Bengaluru Flagship:** Hulimangala Main Road, Electronic City Phase 1 (Valet Parking available).\n"
            "• **Tirupati Outlet:** Samavayi Margam, Chinthalachenu, Korlagunta.\n"
            "• **Hours:** 11:30 AM to 12:30 AM daily.\n"
            "• **Dress Code:** Smart casual / evening luxury elegance."
        )

    # 5. Default friendly response
    else:
        reply = (
            "Welcome to **KICK BUNK**! I am your AI Hospitality Concierge. "
            "I can assist you with pairing recommendations from our bar cellar, guide you through our culinary signatures, "
            "help curate a private celebration cabana, or answer any dining questions. How may I serve you today?"
        )

    return {
        "reply": reply,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# --- 4. AI PROMOTIONAL CONTENT & VIDEO WORKFLOWS ---

INITIAL_PROMOS = [
    {
        "id": "promo-1",
        "title": "Weekend Single Malt & Jazz Soirée",
        "channel": "Instagram Reels & WhatsApp VIP Broadcast",
        "content_type": "Social Reel Copy & Video Script",
        "generated_content": "Whispers of Speyside oak meet the cool Bangalore breeze. 🎷🥃 Indulge in complimentary chef tasting bites with every twin peg of Glenfiddich or Macallan this Saturday night at KICK BUNK. Reserve your cabana early.",
        "video_prompt_concept": "Cinematic slow-motion pour of amber single malt over hand-carved ice sphere with soft golden bokeh background and saxophone jazz score.",
        "status": "APPROVED",
        "created_at": "2026-11-15T18:00:00Z",
        "reviewed_by": "General Manager"
    },
    {
        "id": "promo-2",
        "title": "Live Charcoal Tandoor Culinary Spotlight",
        "channel": "Website Hero & Email Newsletter",
        "content_type": "Culinary Storytelling",
        "generated_content": "24 hours of patience. Real embers. White churned butter. Experience the legend of Old Delhi recreated in our lush gardens. Taste the smoke, cherish the luxury.",
        "video_prompt_concept": "High-speed macro capture of glowing red embers, skewers being lifted from clay tandoor, and velvety saffron butter gravy bubbling in handi.",
        "status": "PENDING_APPROVAL",
        "created_at": "2026-11-17T09:30:00Z",
        "reviewed_by": None
    }
]

promos_db: List[dict] = [dict(p) for p in INITIAL_PROMOS]

@router.get("/ai/promos")
def get_ai_promotions():
    """Retrieve all AI promotional contents with review status."""
    return sorted(promos_db, key=lambda x: x["created_at"], reverse=True)

@router.post("/ai/generate-promo")
def generate_ai_promotional_content(payload: dict):
    """
    AI Content Generator for Restaurant Marketers.
    Generates promotional copy and video script concept, set to PENDING_APPROVAL.
    Must be reviewed and approved by administrator before publication.
    """
    theme = payload.get("theme", "Cocktail Hour")
    channel = payload.get("channel", "Instagram & Web")
    
    promo_id = f"promo-{str(uuid.uuid4())[:6]}"
    new_promo = {
        "id": promo_id,
        "title": f"AI Spotlight: {theme.title()}",
        "channel": channel,
        "content_type": "Video Script & Social Campaign",
        "generated_content": f"Elevate your evenings where exquisite gastronomy meets transcendent ambiance. At KICK BUNK, every pour tells a story, and every dish is a celebration of taste. Experience {theme.lower()} redefined in our lush garden cabanas.",
        "video_prompt_concept": f"Cinematic sweeping drone shot starting over fairy-lit garden cabanas, zooming into a bartender shaking a smoking cocktail with golden rim lighting.",
        "status": "PENDING_APPROVAL",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "reviewed_by": None
    }
    promos_db.insert(0, new_promo)
    return {
        "success": True,
        "promo": new_promo,
        "message": "AI content generated. Saved to review queue for Administrator approval."
    }

@router.post("/ai/promos/{promo_id}/approve")
def approve_ai_promotion(promo_id: str):
    """Admin reviews and approves AI promotional content for publication."""
    promo = next((p for p in promos_db if p["id"] == promo_id), None)
    if not promo:
        raise HTTPException(status_code=404, detail="Promotion not found")
    
    promo["status"] = "APPROVED"
    promo["reviewed_by"] = "General Manager (Admin)"
    promo["approved_at"] = datetime.now(timezone.utc).isoformat()
    return {"success": True, "promo": promo}
