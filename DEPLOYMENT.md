# 🐾 PetVilla — Production & Deployment Guide

Welcome to **PetVilla**, a full-stack, enterprise-grade Pet Care & Marketplace platform built with:
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), React.js 19, Vite, Lucide Icons, Axios.
- **Backend**: Python 3.12+, Django 6.1, Django REST Framework (DRF), SimpleJWT, Django Filter, WhiteNoise, Gunicorn.
- **Testing & API Specs**: Postman Collection (v2.1) + Django Test Suite.
- **Deployment & Containers**: Docker, Multi-Stage Nginx Build, Docker Compose.

---

## 🚀 1. Local Development Setup

### Backend (Django REST Framework)
1. Open terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Activate your virtual environment:
   - **Windows PowerShell**: `..\.venv\Scripts\Activate.ps1`
   - **macOS / Linux**: `source ../.venv/bin/activate`
3. Run migrations (already pre-migrated):
   ```bash
   python manage.py migrate
   ```
4. Seed demo data (12 products, 6 categories, 5 pet types, test accounts):
   ```bash
   python seed_data.py
   ```
5. Run the Django development server:
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
   API root: `http://127.0.0.1:8000/api/`  
   Django Admin: `http://127.0.0.1:8000/admin/`

---

### Frontend (React + Vite)
1. Open another terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   Access the app at: `http://localhost:5173/`

---

## 🐳 2. Containerized Deployment (Docker & Docker Compose)

Deploy the entire stack with a single command:
```bash
docker-compose up --build
```
- **Frontend App**: `http://localhost/` (Served via high-performance Nginx reverse proxy)
- **Django API**: `http://localhost:8000/api/`
- **Volume persistence**: Database (`db.sqlite3`) and uploads (`media/`) are mapped to the host.

To run in the background:
```bash
docker-compose up -d
```

---

## ☁️ 3. Cloud Deployment Options

### Option A: Render.com (Recommended Free/Low Cost)
1. **Backend Service (Web Service on Render)**:
   - Build Command: `pip install -r requirements.txt && python manage.py migrate && python seed_data.py`
   - Start Command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
   - Environment Variables:
     - `DEBUG`: `False`
     - `SECRET_KEY`: `<Your-Secure-Random-Key>`
     - `ALLOWED_HOSTS`: `your-backend.onrender.com`
     - `CORS_ALLOWED_ORIGINS`: `https://your-frontend.vercel.app`
2. **Frontend Service (Static Site on Vercel or Netlify)**:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

---

## 📮 4. Postman API Testing Collection

Two ready-to-import Postman JSON files are included in the repository root:
1. `PetVilla_Postman_Collection.json` — Contains 25+ organized requests across:
   - **01. Authentication & Users** (`Register`, `Login Customer`, `Login Seller`, `Profile`, `Update Profile`, `Token Refresh`, `Logout`)
   - **02. Products & Catalog** (`List All`, `Filter by Pet Type`, `Filter by Category`, `Search`, `Featured`, `Product Detail`)
   - **03. Cart** (`Get Cart`, `Add Item`, `Update Quantity`, `Remove Item`, `Clear Cart`)
   - **04. Orders & Checkout** (`Place Order`, `List My Orders`, `Order Detail`, `Cancel Pending Order`)
   - **05. Seller Portal** (`Dashboard KPIs`, `List Own Products`, `Create Product`, `Update Product`, `Seller Orders Received`)
2. `PetVilla_Postman_Environment.json` — Environment variables including `base_url` (`http://127.0.0.1:8000`), `access_token`, `refresh_token`, `seller_access_token`.

### How to use in Postman:
1. Open Postman.
2. Click **Import** and select `PetVilla_Postman_Collection.json` and `PetVilla_Postman_Environment.json`.
3. In the top-right environment selector, pick **PetVilla Local Environment**.
4. Run `01. Authentication & Users -> Login (Customer)` or `Login (Seller)`.
   *The built-in Postman test script will automatically store your JWT access token directly into `{{access_token}}`!*

---

## 🔑 5. Pre-Seeded Test Credentials

| Role | Username | Password | Notes |
|---|---|---|---|
| **Customer** | `alex_customer` | `CustomerPass123` | Has pre-filled sample cart and order history |
| **Seller 1** | `alice_petshop` | `SellerPass123` | Verified seller with listed dog/cat foods & toys |
| **Seller 2** | `bob_pawmarket` | `SellerPass123` | Verified seller with beds, cages, and fish care |
