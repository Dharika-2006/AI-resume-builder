# ResumeAI - Full-Stack AI Resume Builder & ATS Optimization

[![CI](https://github.com/Dharika-2006/AI-resume-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/Dharika-2006/AI-resume-builder/actions/workflows/ci.yml)

ResumeAI is a premium SaaS platform designed to help job seekers create professional, tailored resumes and optimize them to bypass Applicant Tracking Systems (ATS). The application leverages AI for bullet point optimization, skills suggestions, summary generation, and real-time ATS scoring based on target job descriptions.

---

## 🚀 Key Features

* **Interactive Resume Builder**: Drag-and-drop sections, template switching, and professional color themes.
* **ATS Analyzer**: Real-time scoring, keyword audit (matched vs. missing keywords), strengths analysis, and improvement suggestions.
* **AI Enhancements**: Generate summaries, tailor work experience, generate project descriptions, and get custom skills suggestions.
* **Version Control & History**: Snapshot saving and version restoration for multiple revisions of a resume.
* **High-Fidelity PDF Export**: Clean, standard-compliant PDF exports ready for applications.
* **Secure Authentication**: JWT-based secure user registration and login systems.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS, Framer Motion, Zustand, React Router DOM, Axios |
| **Backend** | Node.js, Express.js, Multer, PDF-Parse, Mammoth, Groq SDK |
| **Database & ORM** | PostgreSQL (Neon serverless instance), Prisma ORM 6.x |
| **CI/CD & DevOps** | GitHub Actions (CI), Docker, Docker Compose, Nginx (Frontend server) |
| **Cloud Hosting** | Vercel (Frontend), Render (Backend), Neon (Database) |

---

## 📂 Detailed Folder Structure

The project is structured as a monorepo split into the frontend (`client/`) and backend (`server/`):

```text
AI-resume-builder/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # GitHub Actions CI pipeline configuration
│       └── README.md              # Documentation for CI environment secrets
├── client/                        # Frontend React Application
│   ├── public/                    # Static assets & public images
│   ├── src/
│   │   ├── assets/                # Styling and styling entry points
│   │   ├── components/            # Reusable UI widgets & layout wrappers
│   │   │   ├── builder/           # Resume editors & template viewers
│   │   │   └── landing/           # Landing page landing items (Hero, Features)
│   │   ├── forms/                 # Form inputs (Experience, Projects, Education)
│   │   ├── hooks/                 # Custom React hooks (CORS/Auth/API state)
│   │   ├── layouts/               # Dashboard and Auth shell layouts
│   │   ├── pages/                 # Full feature views (ATS, Profile, Builder)
│   │   ├── routes/                # Client routing definitions
│   │   ├── services/              # API request layers (Axios clients)
│   │   ├── store/                 # Client state management (Zustand)
│   │   ├── templates/             # Resume rendering layouts (Modern, Tech, etc.)
│   │   └── utils/                 # Frontend helpers (PDF export, formatters)
│   ├── Dockerfile                 # Client image build configuration (Nginx based)
│   ├── nginx.conf                 # Nginx routing config for SPA router support
│   ├── package.json               # Frontend package manager configuration
│   ├── tailwind.config.js         # Tailwind utility styling settings
│   ├── vercel.json                # Vercel deployment & routing header config
│   └── vite.config.js             # Vite compiler definitions
├── server/                        # Backend Node.js API Service
│   ├── ai/                        # Groq LLM integration client & prompts
│   ├── config/                    # Configurations & Prisma DB instances
│   ├── controllers/               # Request controllers (Auth, Resume, ATS, AI)
│   ├── middleware/                # Route security, upload handling & error catchers
│   ├── prisma/                    # Schema migrations, schema.prisma specification
│   ├── routes/                    # API route entrypoints (Express Routers)
│   ├── services/                  # Business logic (file parser, resume control)
│   ├── uploads/                   # Temporary folder for parsed files
│   ├── utils/                     # Test scripts and helper functions
│   ├── Dockerfile                 # Backend image build configuration
│   ├── package.json               # Backend package manager configuration
│   └── server.js                  # Entry point of the API server
├── .env.example                   # Configuration template for local settings
├── docker-compose.yml             # Local docker compose orchestration script
├── render.yaml                    # Declarative Render service blueprint
├── DEPLOYMENT.md                  # Comprehensive deployment instructions
└── README.md                      # Main readme (this file)
```

---

## 💻 Local Setup & Development

### Prerequisites
- Node.js (v20+ recommended)
- Docker Desktop (Optional, for running via containers)
- Neon PostgreSQL connection string (or a local PostgreSQL server)

---

### Option A: Running Locally with Docker Compose (Recommended)

This compiles both frontend and backend within isolated Docker environments:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Dharika-2006/AI-resume-builder.git
   cd AI-resume-builder
   ```

2. **Configure Environment Variables**:
   Create a `.env` file at the root:
   ```bash
   cp .env.example .env
   ```
   Fill in the missing variables (`DATABASE_URL`, `JWT_SECRET`, `GROQ_API_KEY`).

3. **Spin Up Containers**:
   ```bash
   docker compose up -d --build
   ```

4. **Access the Application**:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)

---

### Option B: Running Locally (Manual Setup)

#### 1. Database Setup
1. Create a PostgreSQL database (or retrieve the Neon connection string).
2. Configure `.env` inside `server/` or in the root.

#### 2. Backend Setup
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate the Prisma Client and run migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. Start the development backend:
   ```bash
   npm run dev
   ```

#### 3. Frontend Setup
1. Open a new terminal tab and navigate to `client/`:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend developer server:
   ```bash
   npm run dev
   ```

---

## ⚙️ CI/CD Pipeline (GitHub Actions)

The repository runs validation automatically on commits to `main`/`develop` and on pull requests to `main`.
- **Frontend Validation**: Runs `npm ci` and `npm run build` to verify clean Vite compiles.
- **Backend Validation**: Runs `npm ci`, generates the Prisma Client (`prisma generate`), and validates the schema (`prisma validate`).
- **Docker Validation**: Evaluates environment interpolation and runs `docker compose config` and `docker compose build` to verify container validity.
- **Concurrency Control**: Running builds on the same branch are cancelled if a newer commit is pushed (`cancel-in-progress: true`).

---

## 🌐 Production Deployment

The project is optimized for deployment on cloud services:

* **Frontend**: Deployed on **Vercel** with full SPA fallback support using [vercel.json](file:///c:/Users/kavit/OneDrive/Desktop/AI-resume-builder/client/vercel.json).
* **Backend**: Deployed on **Render** using the [render.yaml](file:///c:/Users/kavit/OneDrive/Desktop/AI-resume-builder/render.yaml) blueprint Web Service spec.
* **Database**: Hosted on **Neon** serverless database.

For complete, step-by-step setup guides, list of environment variable checklists, and troubleshooting instructions, please read our [DEPLOYMENT.md](file:///c:/Users/kavit/OneDrive/Desktop/AI-resume-builder/DEPLOYMENT.md).
