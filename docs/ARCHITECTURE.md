# KICK BUNK — Luxury Restaurant & Bar Customer Experience Platform
## Comprehensive Solution Architecture & Implementation Blueprint

---

### Executive Vision
KICK BUNK is a premier European-style garden restaurant and nightlife resto-bar operating flagship destinations in Bengaluru (Electronic City Phase 1) and Tirupati. The platform delivers an uncompromising, luxury customer-first digital ordering ecosystem across Web, Android, and iOS, seamlessly bridging physical in-restaurant QR table ordering with online discovery, digital takeaway/delivery, and live order tracking.

```
+---------------------------------------------------------------------------------------------------------+
|                                    KICK BUNK MULTI-CHANNEL CLIENT ECOSYSTEM                             |
|                                                                                                         |
|  [ In-Restaurant Physical Dine-In ]                                 [ Online Digital Guest ]            |
|         |                                                                      |                        |
|         v                                                                      v                        |
|  Table QR Code Scan (e.g. /order/{secure-token})                    Direct Web / App Discovery          |
|         |                                                                      |                        |
|         +---------------------------+------------------------------------------+                        |
|                                     |                                                                   |
|                                     v                                                                   |
|         +-------------------------------------------------------+                                       |
|         |           UNIVERSAL APP DETECTION & FALLBACK          |                                       |
|         |  - Android App Links: .well-known/assetlinks.json     |                                       |
|         |  - iOS Universal Links: apple-app-site-association    |                                       |
|         |  - Custom URI Scheme: kickbunk://order/{token}        |                                       |
|         |  - Instant Responsive Web Fallback (Zero Download)    |                                       |
|         +-------------------------------------------------------+                                       |
|                                     |                                                                   |
|                                     v                                                                   |
|  +---------------------------------------------------------------------------------------------------+  |
|  |  AUTHENTICATED TABLE CONTEXT / DINING SESSION                                                     |  |
|  |  - Restaurant: KICK BUNK                                                                          |  |
|  |  - Outlet: Flagship Bengaluru / Tirupati Garden                                                   |  |
|  |  - Table: Table 08 (Outdoor Garden Cabana)                                                        |  |
|  |  - Secure QR Token: Signed HMAC / Timestamped / Cryptographically Tamper-Proof                    |  |
|  +---------------------------------------------------------------------------------------------------+  |
|                                     |                                                                   |
|       +-----------------------------+-----------------------------+                                     |
|       v                                                           v                                     |
|  [ Next.js 14 Web Application ]                             [ React Native Expo Mobile App ]            |
|  - Luxury European Light & Nightlife Palette                - Android APK/AAB & iOS IPA                 |
|  - Digital Menu & Portions & Addons                         - Native Camera QR Scanner                  |
|  - Real-time Cart & Tax Calculation                         - Biometric / Secure Storage                |
|  - WebSocket Live Order Tracker                             - Push Notifications                        |
+---------------------------------------------------------------------------------------------------------+
                                      |
                                      | HTTPS REST (v1) & WebSockets
                                      v
+---------------------------------------------------------------------------------------------------------+
|                                    CENTRALIZED FASTAPI BACKEND (Python 3.12)                            |
|                                                                                                         |
|  [ Security & Middleware ]                                                                              |
|  - CORS Policy, Rate Limiting, JWT Bearer Token Auth, QR HMAC Verification, Audit Logging               |
|                                                                                                         |
|  [ Domain Services ]                                                                                    |
|  +--------------------+  +--------------------+  +--------------------+  +---------------------------+  |
|  | QR Session Service |  | Dynamic Menu Engine|  | Cart & Pricing Calc|  | Order State Machine      |  |
|  +--------------------+  +--------------------+  +--------------------+  +---------------------------+  |
|  | Payment Gateway Adp|  | Real-Time PubSub WS|  | Customer & Loyalty |  | POS Integration Outbox    |  |
|  +--------------------+  +--------------------+  +--------------------+  +---------------------------+  |
+---------------------------------------------------------------------------------------------------------+
                                      |
                 +--------------------+--------------------+
                 v                                         v
+----------------------------------+     +-----------------------------------------------------------------+
|       POSTGRESQL 16 PERSISTENCE  |     |                    FUTURE POS / KOT INTEGRATION                 |
|  - 25+ Normalized Entities       |     |  - Outbox Event Bus: customer.order.created / accepted / ready  |
|  - Relational Foreign Keys       |     |  - KDS Kitchen Stations (Tandoor, Chinese, Curry, Bar Counter)  |
|  - Compound Indexes & Constraints|     |  - High-Speed Split Billing & GST Invoices                      |
|  - Audit & Idempotency Logs      |     |  - Bi-directional Real-Time POS Sync                            |
+----------------------------------+     +-----------------------------------------------------------------+
```

---

### Core Database Architecture (PostgreSQL 16)
The backend model implements 25+ relational entities categorized into 7 core domains:

1. **Organization & Outlets (`restaurants`, `outlets`, `operating_hours`)**
2. **Dining Areas & Tables (`dining_areas`, `restaurant_tables`, `table_qr_tokens`, `qr_sessions`)**
3. **Menu Catalog (`menu_categories`, `menu_items`, `menu_variants`, `menu_addons`, `outlet_menu_overrides`, `item_allergens`)**
4. **Cart & Orders (`carts`, `cart_items`, `orders`, `order_items`, `order_item_addons`, `order_status_history`)**
5. **Payment Ecosystem (`payments`, `payment_transactions`, `refunds`, `payment_webhooks`)**
6. **Customer CRM & Identity (`customers`, `customer_profiles`, `customer_addresses`, `customer_devices`, `reservations`)**
7. **POS & Event Integration (`pos_outbox_events`, `pos_integration_logs`, `audit_logs`)**

---

### Brand Design Tokens
- **Canvas Ivory:** `#F7F3EB` (Primary daylight open-air garden backdrop)
- **Champagne Cream:** `#EFE7DA` (Card borders and secondary elevated surfaces)
- **Rich Charcoal:** `#1A1816` / `#25231F` (High-contrast typography and night-mode accents)
- **Warm Antique Gold:** `#C5A46D` / `#B58A45` (Accents, badges, CTAs, and active tabs)
- **Garden Emerald:** `#254C3C` (Freshness badges, vegetarian indicator, reservation anchors)
- **Nightlife Burgundy:** `#482A32` (Bar & nightlife sections)
- **Card Surfaces:** `#FFFFFF` with soft luxury shadows (`0 8px 30px rgba(37,35,31,0.06)`)
