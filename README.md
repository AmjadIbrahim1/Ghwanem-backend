# 🏫 Ghwanem Backend — School Results System API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.22-000000?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtoken)

**REST API for managing school results with Excel processing and analytics**

</div>

---

## 📌 Project Overview

**Ghwanem Backend** (School Results System API) is a production-ready REST API that manages school academic data — students, grades, academic years, and analytics. It features **JWT authentication**, **Excel file processing** for bulk grade imports, and **statistical analytics** for performance insights.

---

## ✨ Key Features

### 🔐 Authentication & Security
- JWT-based authentication with role-based access
- Admin seeding with secure password hashing (bcrypt)
- Rate limiting, Helmet security headers, and CORS configuration
- Input validation (express-validator + Joi + Yup)

### 📊 Academic Management
- Academic years and semesters management
- Grade management with Excel bulk import (`exceljs`)
- School/class structure management
- Statistical analytics with `simple-statistics`

### 🛠️ Engineering
- Modular architecture (`modules/` folder)
- Structured logging with Winston
- Centralized error handling
- Prisma migrations and seeding
- Jest + Supertest test suite

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | >= 18 | Runtime |
| **TypeScript** | 5.7 | Type safety |
| **Express** | 4.22 | Web framework |
| **Prisma** | 5.22 | ORM & migrations |
| **PostgreSQL** | 16 | Database |
| **JWT** | 9.0 | Authentication |
| **ExcelJS** | 4.4 | Excel processing |
| **Winston** | 3.11 | Logging |
| **Jest** | 29 | Testing |

---

## 📁 Project Structure

```
Ghwanem-backend/
├── src/
│   ├── server.ts          # Server entry point
│   ├── app.ts             # Express app setup
│   ├── config/            # Configuration
│   ├── middleware/        # Auth, validation, error handling
│   ├── modules/
│   │   ├── academic/      # Academic years & semesters
│   │   ├── analytics/     # Statistics & reports
│   │   ├── auth/          # Authentication
│   │   ├── excel/         # Excel import/export
│   │   ├── grades/        # Grade management
│   │   └── school/        # School structure
│   ├── types/             # TypeScript types
│   └── utils/             # Helpers
├── prisma/                # Schema & migrations
├── uploads/               # Uploaded files
├── .env.example           # Environment template
├── railway.json           # Railway deployment config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL 16+

### Installation

1. **Clone & install**
   ```bash
   git clone https://github.com/AmjadIbrahim1/Ghwanem-backend.git
   cd Ghwanem-backend
   npm install
   ```

2. **Configure environment** — copy `.env.example` to `.env` and fill in:
   ```env
   DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   ADMIN_EMAIL="admin@school.com"
   ADMIN_PASSWORD="Admin@123456"
   PORT=5000
   FRONTEND_URL="https://your-frontend-domain.vercel.app"
   ```

3. **Run database migrations**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:5000`.

---

## 📦 Available Scripts

```bash
npm run dev                 # Dev server (tsx watch)
npm run build               # Compile TypeScript
npm start                   # Production server
npm test                    # Run Jest tests
npm run lint                # ESLint
npm run format              # Prettier
npm run prisma:generate     # Generate Prisma client
npm run prisma:migrate      # Run migrations
npm run prisma:migrate:prod # Deploy migrations
npm run prisma:studio       # Prisma Studio GUI
npm run prisma:seed         # Seed database
npm run prisma:reset        # Reset database
npm run db:push             # Push schema without migrations
```

---

## 🚢 Deployment

The project includes a `railway.json` for one-click deployment on **Railway**. The `vercel-build` script runs migrations before building.

---

## 👨‍💻 Author

**Amjad Ibrahim**

- GitHub: [AmjadIbrahim1](https://github.com/AmjadIbrahim1)
