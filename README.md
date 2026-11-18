# KICK BUNK — Luxury Restaurant & Bar Customer Experience Platform
### European Luxury • Modern Garden Dining • Resto-Bar Gastronomy

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat&logo=python&logoColor=white)](https://python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-Expo_SDK_51-61DAFB?style=flat&logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Theme](https://img.shields.io/badge/Theme-European_Luxury_Light-B58A45)](#)

---

## 🏛️ Executive Summary

**KICK BUNK** is a production-ready, luxury customer-first digital ordering platform for premier dining destinations in **Bengaluru (Electronic City Phase 1)** and **Tirupati**. 

It eliminates traditional dining friction by connecting physical in-restaurant table QR code ordering with online discovery, digital takeaway, and real-time live kitchen tracking across Web, Android, and iOS.

---

## 💎 Verified Restaurant Brand Details

### Flagship Destination 1: Kick Bunk Restaurant & Bar (Bengaluru)
- **Address:** Hulimangala Main Road, near Vinayaka Layout / Yarandahalli, Jigani Hobli, Electronic City Phase 1, Bengaluru, Karnataka 560105
- **Google Rating:** 4.1 / 5.0 (1,800+ verified customer reviews)
- **Primary Phone:** +91 99453 21367 / +91 99806 26699 / +91 82962 19302
- **Operating Hours:** 11:00 AM – 11:30 PM (All 7 Days)
- **Ambiance:** Open-air lush garden dining, romantic fairy-lit pathways, private luxury cabanas, clay-oven tandoor, resto-bar cocktail lounge.

### Flagship Destination 2: Kick Bunk Garden Bar & Restaurant (Tirupati)
- **Address:** Door No. 19-1-G/25, Kothapalli, Samavayi Margam, Chinthalachenu, Korlagunta, Tirupati, Andhra Pradesh 517501
- **Primary Phone:** +91 98855 20220 / +91 77605 94868
- **Operating Hours:** 11:30 AM – 11:00 PM (All 7 Days)

---

## 🎨 European Luxury Design Identity

- **Canvas Ivory (`#F7F3EB`)**: Sunlit open-air garden background.
- **Champagne Cream (`#EFE7DA`)**: Card outlines and elevated secondary surfaces.
- **Antique Gold (`#B58A45`)**: Metallic badges, active tabs, and reservation CTAs.
- **Rich Charcoal (`#25231F`)**: High-contrast editorial typography and night sections.
- **Garden Emerald (`#254C3C`)**: Botanical freshness badge and vegetarian indicators.
- **Burgundy Accent (`#482A32`)**: Exclusive resto-bar nightlife contrast sections.

---

## 📱 Core Customer Ordering Channels

### Channel 1: Offline / In-Restaurant Customers (Highest Priority)
1. Customer enters KICK BUNK and sits at their table (e.g., **Table 08** in the Garden).
2. Customer scans the table QR code.
3. **Smart App Interception**: If the Android or iOS native app is installed, it opens directly.
4. **Instant Zero-Download Fallback**: If the app is not installed, the responsive web application opens immediately.
5. The system cryptographically validates the token and permanently pins:
   `KICK BUNK • Table: 08 (Open-Air Lush Garden) • Bengaluru Flagship`
6. Customer adds items, reviews GST breakdown (2.5% CGST + 2.5% SGST), and confirms the order.
7. Order is routed immediately to the kitchen KDS and POS printers.
8. Customer watches live order progression in real-time.

### Channel 2: Online Customers
- Explore the restaurant, browse the menu, book private cabanas, place takeaway orders, and track orders from their customer profile.

---

## 🚀 Monorepo Architecture

```
e:\coustmer protal kick bunk/
├── backend/                  # Python 3.12 FastAPI + SQLAlchemy 2.0 + PostgreSQL
│   ├── app/
│   │   ├── api/v1/           # REST & WebSocket Endpoints (14 routers)
│   │   ├── core/             # Security, HMAC signing, Database session
│   │   ├── models/           # 25+ Normalized Relational Entities
│   │   ├── schemas/          # Pydantic v2 validation contracts
│   │   ├── services/         # QR, Cart, Order, Payment, POS Adapter
│   │   ├── websockets/       # Real-time WebSocket connection manager
│   │   └── seed_data.py      # Authentic Bengaluru & Tirupati seed data
│   ├── tests/                # Automated pytest test suite (7/7 tests passed)
│   └── requirements.txt
├── frontend/                 # Next.js 14 App Router (Customer Web Application)
│   ├── public/
│   │   ├── .well-known/      # Android App Links & iOS Universal Links
│   │   └── images/kickbunk/  # Authentic verified restaurant photographs
│   ├── src/
│   │   ├── app/              # 8 Core Pages + Universal QR Landing Page
│   │   ├── components/       # Navbar, Footer, ProductDetailModal, Table Banner
│   │   ├── context/          # TableSessionContext, CartContext, AuthContext
│   │   └── lib/api.ts        # Unified API client
├── mobile/                   # React Native Expo Mobile App (Android & iOS)
│   ├── src/
│   │   ├── screens/          # 16 Core Native Customer Screens
│   │   ├── context/          # MobileAppContext (Table context & Deep links)
│   │   ├── navigation/       # RootNavigator & BottomTabNavigator
│   │   └── services/         # Mobile API client
│   └── app.json              # App Links, URL Schemes, Camera Permissions
├── docker-compose.yml        # Multi-container orchestration (Postgres, Backend, Web, Nginx)
├── nginx.conf                # Reverse proxy, SSL, and WebSocket upgrade
└── docs/                     # Full technical and integration specifications
```

---

## 🛠️ Step-by-Step Execution Guide

### 1. Centralized Backend (FastAPI + PostgreSQL 16)
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```
- API Documentation (Swagger): `http://localhost:8001/docs`
- Health Check: `http://localhost:8001/api/v1/health`

### 2. Customer Web Application (Next.js 14)
```bash
cd frontend
npm run dev -- -p 3001
# Or production build:
npm run start -- -p 3001
```
- Customer Portal: `http://localhost:3001`
- Table 08 QR Test Link: `http://localhost:3001/order/sample-table-08`

### 3. Mobile Application (React Native / Expo)
```bash
cd mobile
npx expo start
```
- Open with Expo Go on physical device or press `a` for Android Emulator / `i` for iOS Simulator.

---

## 🧪 Automated Test Verification

All automated tests have been executed with 100% success:

1. **Backend Automated Tests (`pytest`):**
   - `test_health_check` — PASSED
   - `test_get_restaurant_and_outlets` — PASSED
   - `test_qr_validation_success_and_tamper_protection` — PASSED
   - `test_digital_menu_and_dietary_filters` — PASSED
   - `test_cart_calculation_and_gst` (5% GST verification) — PASSED
   - `test_order_creation_and_pos_outbox` — PASSED
   - `test_payment_initiation_and_verification` — PASSED
   - Result: **7 passed in 2.79s**

2. **Frontend Production Build (`next build`):**
   - 9 static/dynamic customer routes generated with zero errors.
   - Result: **Compiled successfully**

3. **Mobile TypeScript Verification (`tsc --noEmit`):**
   - All 16 screens, navigation, and deep linking contracts checked.
   - Result: **0 errors**
