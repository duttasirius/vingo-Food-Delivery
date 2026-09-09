# 🍔 Vingo — AI-Powered Food Delivery Platform

> A production-style full-stack food delivery application built with the MERN stack, real-time communication, secure authentication, location-aware discovery, online payments, reviews, shop management, and an AI food-finding assistant powered by Google Gemini.

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/API-Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redux Toolkit](https://img.shields.io/badge/State-Redux%20Toolkit-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-010101?logo=socketdotio&logoColor=white)](https://socket.io/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

## ✨ Why Vingo?

Vingo is more than a basic food-ordering CRUD application. The project combines several production-oriented concerns in one system:

- **AI-assisted food discovery** using Google Gemini plus a deterministic catalog fallback
- **JWT-based authentication** with protected API routes and role-aware application flows
- **Google authentication** for faster sign-in
- **Location-aware discovery** so users can discover shops and food relevant to their city
- **Real-time order communication** through Socket.IO
- **Razorpay payments** with backend-side payment verification
- **Verified reviews and ratings** tied to real purchases
- **Cloudinary image uploads** for restaurants and food items
- **Separate customer, shop-owner, and delivery workflows**
- Responsive UI built with **React, Tailwind CSS, and reusable components**

## 🤖 AI Food Assistant

Vingo includes a floating **Vingo AI** chat experience designed around the actual food catalog rather than generic chatbot output.

### What the assistant can do

- Understand natural food requests such as `"veg pizza"`, `"something spicy"`, or `"I want something sweet"`
- Handle partial names and common misspellings
- Use food categories, food type, item names, restaurant names, and related search terms
- Return **real food items from MongoDB** instead of hallucinated products
- Show item image, name, price, and restaurant directly inside the chat UI
- Let users add an AI-discovered item directly to the Redux cart
- Keep the user experience responsive with loading states and graceful fallback behavior

### AI architecture

The AI endpoint first loads the real catalog from MongoDB and sends a controlled catalog representation to Gemini. Gemini is asked to return only catalog item IDs. The server then validates those IDs against the database before returning products to the client.

That validation layer is important: the model helps interpret intent, but the database remains the source of truth for products.

A deterministic search layer also scores matches using item names, categories, food types, restaurant metadata, synonyms, and lightweight typo tolerance. When the Gemini request fails or is unavailable, the catalog matcher still provides useful results.

**Flow:**

```text
User message
     ↓
React AI chat UI
     ↓
POST /api/item/ai-search
     ↓
MongoDB catalog lookup
     ↓
Gemini intent + item selection
     ↓
Validate returned item IDs
     ↓
Merge AI + deterministic matches
     ↓
Real food cards in chat
     ↓
Add to Redux cart
```

### AI technology used

- **Google Gemini API** — natural-language food intent understanding and catalog selection
- **Express.js API route** — secure server-side Gemini integration
- **MongoDB + Mongoose** — source of truth for item and shop data
- **React** — interactive chat interface
- **Redux Toolkit** — add AI-discovered items to the existing cart state
- **Axios** — frontend API communication
- **Lucide React** — lightweight AI/chat interface icons

## 🔐 Authentication & Security

- JWT-based login and registration
- HTTP-only authentication cookie
- Password hashing with `bcryptjs`
- Protected backend middleware using JWT verification
- Role-aware application routing for `user`, `owner`, and `deliveryBoy`
- Google authentication flow
- OTP-based password reset flow
- CORS configuration with credentialed requests

## 📍 Location-Aware Food Discovery

Vingo uses location data as part of the discovery experience:

- Detects the user's city/location
- Fetches shops based on city
- Fetches food items from nearby/relevant shops
- Stores shop/user location information using GeoJSON-compatible coordinates
- Uses MongoDB `2dsphere` indexing for location-aware operations
- Supports location-aware order and delivery experiences

## 🛒 Customer Experience

- Browse restaurants and food items
- Search for items by keyword
- AI-powered natural-language food search
- Product/item details
- Add to cart and update quantities
- Checkout
- Order history
- Order status tracking
- Delivery tracking flow
- Reviews and ratings for purchased items

## 🏪 Shop Owner Experience

Shop owners have a dedicated workflow for operating their storefront:

- Create and edit shops
- Upload restaurant and food images
- Add food items
- Edit food items
- Manage menu data
- View incoming orders
- Track shop performance and earnings
- Review customer feedback

## 🚴 Delivery & Realtime Features

- Delivery-boy role and dashboard
- Socket.IO integration
- User/socket identity mapping
- Realtime order-related events
- Location and delivery tracking foundation

> Realtime tracking is an active area of the project and can be extended with more granular live-map events and delivery state transitions.

## 💳 Payments

Vingo integrates **Razorpay** for online checkout.

- Razorpay checkout flow
- Backend-side payment verification
- Payment status stored with order data
- Order creation tied to successful payment flow
- Webhook support can be extended for stronger payment reconciliation

## ⭐ Reviews & Ratings

The review system is designed around real orders rather than open anonymous feedback.

- 1–5 star ratings
- Reviews tied to purchased items/orders
- Average rating calculation
- Shop/item review display
- Verified-buyer review workflow

## 🖼️ UI Highlights

The project includes separate interfaces for customers, shop owners, food management, authentication, and ordering flows.

### Customer UI

![Customer Home](./UI-SCREENSHOT/userUI.png)

![Customer Experience](./UI-SCREENSHOT/userUI2.png)

### Authentication

![Login](./UI-SCREENSHOT/login.png)

### Shop Owner Dashboard

![Owner Dashboard](./UI-SCREENSHOT/ownerDashboard.png)

![Shop Owner](./UI-SCREENSHOT/shopOwner.png)

### Menu Management

![Add Food](./UI-SCREENSHOT/addFood.png)

![Edit Food](./UI-SCREENSHOT/editFood.png)

![Owner Add Food](./UI-SCREENSHOT/owner-add-food-UI.png)

### 🤖 AI Assistant Highlight

The **Vingo AI** assistant is integrated as a floating, mobile-friendly chat surface so users can search without leaving the shopping flow.

![Vingo AI Assistant](./UI-SCREENSHOT/ai-assistant.png)

> If `UI-SCREENSHOT/ai-assistant.png` is not yet present in the repository, add the latest AI assistant screenshot there. GitHub will render it automatically after the image is committed.

## 🧱 Technology Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- Redux Toolkit / React Redux
- React Router
- Axios
- Lucide React
- React Icons
- Leaflet / React Leaflet
- Socket.IO Client
- Firebase integration present in the frontend

The current frontend package uses React, Vite, Tailwind, Redux Toolkit, Axios, Firebase, Leaflet/React Leaflet, Socket.IO Client, and Lucide React. 

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT (`jsonwebtoken`)
- `bcryptjs`
- Cookie Parser
- CORS
- Socket.IO
- Nodemailer
- Multer
- Cloudinary
- Razorpay SDK

### AI

- Google Gemini API
- Model configured through `GEMINI_MODEL` with `gemini-2.5-flash` as the default
- Hybrid AI + deterministic catalog matching

### Infrastructure / Services

- MongoDB for application data
- Cloudinary for media storage
- Razorpay for payments
- Google Gemini for AI search
- SMTP/Nodemailer for transactional email

## 📁 Project Structure

```text
vingo-Food-Delivery/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── aiSearchController.js
│   │   ├── item.controllers.js
│   │   └── ...
│   ├── middlewares/
│   │   └── isAuth.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── item.model.js
│   │   ├── shop.model.js
│   │   └── ...
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── user.routes.js
│   │   ├── shop.routes.js
│   │   ├── item.routes.js
│   │   └── order.routes.js
│   ├── utils/
│   │   ├── token.js
│   │   └── sockt.js
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AiFoodAssistant.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── DeliveryDashboard.jsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
│
├── UI-SCREENSHOT/
├── README.md
└── .gitignore
```

> `frontend/src` is the React application, while `backend` contains the Express API, authentication, business logic, data models, AI search, payment integration, and realtime infrastructure.

## 🔌 Important API Areas

| Area | Route Prefix | Purpose |
|---|---|---|
| Authentication | `/api/auth` | Register, login, logout, password reset, Google auth |
| Users | `/api/user` | User profile and user-related operations |
| Shops | `/api/shop` | Restaurant/shop management and discovery |
| Items | `/api/item` | Menu CRUD, item search, ratings, AI search |
| Orders | `/api/order` | Cart checkout, orders, status and tracking |
| AI Search | `POST /api/item/ai-search` | Natural-language food discovery |

## 🧪 Local Development

### 1. Clone

```bash
git clone -b dev https://github.com/duttasirius/vingo-Food-Delivery.git
cd vingo-Food-Delivery
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs locally on:

```text
http://localhost:8000
```

### 3. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite normally serves the frontend on:

```text
http://localhost:5173
```

## 🔑 Environment Variables

Never commit real credentials or API keys. Use local `.env` files and configure production secrets in your hosting provider.

### Backend `.env`

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret

SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

### Frontend `.env`

```env
VITE_SERVER_URL=http://localhost:8000
```

## 🧠 Engineering Decisions Worth Discussing in an Interview

### 1. Why hybrid AI + deterministic search?

AI is useful for understanding natural language, but an e-commerce/food catalog must remain grounded in real inventory. Vingo therefore combines Gemini intent interpretation with a deterministic database matcher and validates model-selected IDs before displaying products.

### 2. Why keep the Gemini key on the backend?

The API key is a secret and should not be exposed in browser-side code. The frontend calls the Express API, and the server communicates with Gemini.

### 3. How does the assistant avoid hallucinated food items?

Gemini receives a catalog representation and is instructed to select catalog IDs only. The backend then maps those IDs back to MongoDB records. Unknown IDs are discarded.

### 4. Why JWT + HTTP-only cookies?

The backend stores the authentication token in an HTTP-only cookie, reducing direct JavaScript access to the token while allowing credentialed API requests.

### 5. Why Socket.IO?

Food delivery is event-driven. Socket.IO provides a natural foundation for order state updates, delivery identity, and future live tracking features.

### 6. Why MongoDB?

The platform has flexible restaurant/menu data and location-oriented documents. Mongoose provides schema validation and model-level access to that data.

## 🚀 Production / Deployment Notes

The repository is structured as a frontend + backend monorepo. For deployment, configure the frontend and backend as separate applications/projects when required by the hosting provider.

Recommended production environment variables:

```text
Frontend:
VITE_SERVER_URL=<backend-production-url>

Backend:
FRONTEND_URL=<frontend-production-url>
GEMINI_API_KEY=<gemini-key>
MONGO_URI=<mongodb-uri>
JWT_SECRET=<strong-random-secret>
...
```

For production, use secure cookie configuration and ensure the frontend/backend origins are configured correctly for credentialed requests.

> Socket.IO requires a persistent realtime-capable server architecture. If your deployment platform is serverless, verify its realtime/runtime limitations before relying on the same Socket.IO server setup in production.

## 🛣️ Roadmap

- [x] JWT authentication
- [x] Google authentication flow
- [x] Password reset with OTP
- [x] Location-aware restaurant discovery
- [x] Cart and checkout
- [x] Razorpay integration
- [x] User reviews and ratings
- [x] Shop-owner dashboard
- [x] Delivery workflow
- [x] Socket.IO integration
- [x] AI food assistant
- [x] AI fallback catalog search
- [ ] Expanded real-time delivery map experience
- [ ] Advanced analytics and recommendation ranking
- [ ] Stronger payment webhook reconciliation

## 👨‍💻 Recruiter Snapshot

**Vingo demonstrates:**

- Full-stack MERN application architecture
- REST API design with Express
- Authentication and authorization
- Secure password hashing and token handling
- Google authentication integration
- MongoDB/Mongoose data modeling
- Geolocation and GeoJSON concepts
- Realtime systems with Socket.IO
- Online payment integration with Razorpay
- Cloudinary-based media uploads
- Transactional email / OTP flows
- Redux state management
- Responsive React UI development
- AI integration with Google Gemini
- AI grounding and hallucination-resistant catalog retrieval
- Error handling and deterministic fallback design
- Monorepo-style frontend/backend organization

## 📌 Project Status

The project is actively developed. Core customer, owner, delivery, authentication, payment, location, realtime, and AI-search functionality is implemented, while several advanced realtime and production-hardening areas remain open for further iteration.

## 🔗 Repository

**GitHub:** https://github.com/duttasirius/vingo-Food-Delivery

**Primary development branch:** `dev`
