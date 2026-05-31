# AI Resume Builder SaaS

A premium, modern Full-Stack AI-powered Resume Builder and ATS Optimization platform built using React (Vite), Tailwind CSS, Express, Prisma, and PostgreSQL.

---

## Tech Stack

### Frontend
- **Framework**: React (Vite) [React 18.3.x]
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS & Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **State Management**: Zustand
- **HTTP Client**: Axios

### Backend
- **Framework**: Node.js & Express.js
- **Database**: PostgreSQL (Neon / Prisma compatible)
- **ORM**: Prisma 6.x Stable
- **Authentication**: JWT & bcryptjs
- **Uploads**: Multer, pdf-parse, mammoth
- **AI Integrations**: Future Groq API for ATS scores and content generation

---

## Folder Structure

```
AI-resume-builder/
├── client/                     # Frontend Vite + React application
│   ├── src/
│   │   ├── assets/             # Static images, assets, styling entry points
│   │   ├── components/         # Reusable global UI elements
│   │   ├── forms/              # Input forms for different resume sections
│   │   ├── pages/              # High-level feature pages
│   │   ├── services/           # API integration and client services
│   │   ├── store/              # Zustand state stores
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Client side helper utilities
│   │   ├── layouts/            # Layout wrappers (e.g. Dashboard/Auth layouts)
│   │   ├── routes/             # App routing configs
│   │   └── templates/          # Resume rendering templates
│   ├── .env                    # Client environment settings
│   ├── .prettierrc             # Prettier rules configuration
│   └── tailwind.config.js      # Tailwind configurations
│
├── server/                     # Backend Node.js Express server
│   ├── config/                 # Configurations (e.g., db connection, env settings)
│   ├── controllers/            # Request handlers matching route bindings
│   ├── routes/                 # Express route definitions
│   ├── middleware/             # Custom express middleware (Auth, error handlers, uploads)
│   ├── services/               # Core business services
│   ├── ai/                     # AI parsing and generation processors
│   ├── prisma/                 # Prisma database configuration and schemas
│   ├── uploads/                # Temporary/permanent file uploads
│   ├── utils/                  # Backend utilities
│   ├── server.js               # Entry point of Express server
│   └── .env                    # Server environment secrets and configs
│
├── .gitignore                  # Git patterns to ignore
└── README.md                   # Project overview & documentation
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (Local or Neon)
- npm or yarn

### Frontend Setup
1. Navigate to client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `server/.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/resumedb
   JWT_SECRET=your_jwt_secret_here
   GROQ_API_KEY=your_groq_key_here
   PORT=5000
   ```
4. Run Prisma database migrations/scaffold:
   ```bash
   npx prisma db push
   ```
5. Start backend development server:
   ```bash
   npm run dev
   ```
