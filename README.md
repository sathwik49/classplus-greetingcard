# 🎉 Greeting Card App

A full-stack web application that allows users to create personalized greeting cards using templates, overlay their profile image and name, and instantly share or download the final card.

---

## 🚀 Features

- 🔐 JWT Authentication (Access + Refresh Token)
- 🖼️ Template-based card generation
- 👤 Profile image + name overlay
- ⚡ Live preview editing experience
- 📤 Export card as image (html2canvas)
- 📲 Native share support (Web Share API)
- 📂 Category-based template filtering
- 💎 Premium & Free template system
- ☁️ Cloudinary image storage
- 🧠 Stateless backend architecture

---

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- TypeScript
- React Router v6
- TanStack Query
- Axios
- Tailwind CSS
- html2canvas
- react-hot-toast

### Backend
- Node.js + Express
- TypeScript
- Drizzle ORM
- PostgreSQL
- JWT Authentication
- Cookie-based refresh tokens
- Cloudinary
- Multer
- Zod validation

---

## 🔐 Auth Flow

- User logs in / signs up
- Server returns:
  - Access Token (stored in memory)
  - Refresh Token (stored in httpOnly cookie)
- On refresh:
  - `/auth/refresh` restores access token
  - `/user/me` restores user session

---

## 📦 Installation

### 1. Clone Repo
```bash
git clone https://github.com/yourusername/greetingcard-app.git
cd greetingcard-app

cd backend
pnpm install

PORT=9000
DATABASE_URL=your_postgres_url

JWT_ACCESS_TOKEN_SECRET=secret
JWT_REFRESH_TOKEN_SECRET=secret
JWT_COOKIE_NAME=refreshToken

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

pnpm drizzle-kit push
pnpm seed:templates
pnpm dev

cd frontend
pnpm install
pnpm dev

VITE_API_BASE_URL=http://localhost:9000/api