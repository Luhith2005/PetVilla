# 🐾 PetVilla — Fullstack Pet Marketplace & Care Platform

PetVilla is a modern, full-stack pet marketplace and care platform built with **React 19**, **Vite**, **Django 6.1**, and **Django REST Framework (DRF)**.

---

## 🌟 Key Features

- **🛍️ Dynamic Pet Catalog**: Multi-category browsing (Food, Toys, Healthcare, Beds, Grooming) for Dogs, Cats, Birds, Fish, Reptiles, and Horses.
- **🔍 Search & Filter**: Real-time debounce search, pet-type dropdown, category filter chips, and sorting by price or rating.
- **🛒 Dual-Mode Basket**: Seamless cart experience for guest visitors (via session key) that automatically merges into account on login.
- **📦 Checkout & Orders**: Address verification, cash-on-delivery / card checkout, and real-time order status tracking with cancellation support.
- **🏪 Multi-Vendor Seller Portal**: Dedicated dashboard with revenue analytics, product inventory CRUD, and customer order management.
- **🔐 JWT Authentication**: SimpleJWT authentication with automatic silent token refresh on 401.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Lucide Icons, Axios, Vanilla CSS.
- **Backend**: Python 3.12, Django 6.1, Django REST Framework, SimpleJWT, Django Filter, WhiteNoise, Gunicorn.
- **Containers & Cloud**: Docker, Nginx Reverse Proxy, Docker Compose, Vercel ready.

---

## 🚀 Quick Start (Local Development)

### 1. Backend (Django)
```bash
cd backend
..\.venv\Scripts\Activate.ps1   # On Windows
python manage.py migrate
python seed_data.py
python manage.py runserver 127.0.0.1:8000
```
- API Root: `http://127.0.0.1:8000/api/`
- Admin: `http://127.0.0.1:8000/admin/`

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- App URL: `http://localhost:5173/`

---

## 🔑 Demo Test Credentials

| Role | Username | Password | Notes |
|---|---|---|---|
| **Customer** | `alex_customer` | `CustomerPass123` | Pre-filled cart & past orders |
| **Seller 1** | `alice_petshop` | `SellerPass123` | Dog & Cat care inventory |
| **Seller 2** | `bob_pawmarket` | `SellerPass123` | Beds, cages & fish care products |

---

## ☁️ Deployment

- **Vercel**: Pre-configured with `vercel.json` for full-stack serverless deployment.
- **Docker**: Run `docker compose up --build` for complete containerized production setup.
