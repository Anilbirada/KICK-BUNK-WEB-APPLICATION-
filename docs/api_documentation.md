# REST API Reference & Endpoint Documentation

The centralized FastAPI backend provides interactive OpenAPI documentation at `/docs` (Swagger UI) and `/redoc`.

All endpoints are prefixed with `/api/v1`.

---

## 1. Health & Discovery

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service health status and database engine type |
| `GET` | `/api/v1/restaurant` | Restaurant metadata, locations, and brand identity |
| `GET` | `/api/v1/outlets` | List operational dining locations (Bengaluru & Tirupati) |

---

## 2. Table QR & Dining Sessions

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/qr-sessions/generate` | Generates a signed cryptographic HMAC table token |
| `POST` | `/api/v1/qr-sessions/validate` | Validates a table token and resolves table context |

---

## 3. Menu & Catalog

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/menu` | Categorized food and drink catalog (Supports `veg_only`, `include_alcohol`) |
| `GET` | `/api/v1/products/{id}` | Detailed dish specification with addons and allergens |

---

## 4. Cart & Order Execution

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/cart/{session_id}` | Fetch active cart with 5% GST computation |
| `POST` | `/api/v1/cart/{session_id}/items` | Add item, portion size, and customization notes |
| `DELETE` | `/api/v1/cart/{session_id}/items/{item_id}` | Remove item from dining cart |
| `POST` | `/api/v1/orders` | Place order, creating KDS and Bar tickets |
| `GET` | `/api/v1/orders/{order_id}` | Fetch order status and receipt breakdown |

---

## 5. Operations & Admin Suites

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/admin/operations/kot/tickets` | Live kitchen display tickets across stations |
| `POST` | `/api/v1/admin/operations/kot/bump` | Advance cooking ticket lifecycle status |
| `GET` | `/api/v1/admin/operations/bar/tickets` | Active cocktail and beverage dispense queue |
| `POST` | `/api/v1/admin/operations/bar/dispense` | Log liquor dispense and volume deduction |
| `GET` | `/api/v1/admin/management/reports/dashboard` | Executive KPIs, turnover, covers, and 5% GST liability |
