# ResumeAI - AI-Powered Resume Builder & ATS Optimization Platform

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge&logo=vercel" alt="Status Badge"/>
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-blue?style=for-the-badge&logo=react" alt="Frontend Badge"/>
  <img src="https://img.shields.io/badge/Backend-Node%20%7C%20Express%20%7C%20Prisma-green?style=for-the-badge&logo=node.js" alt="Backend Badge"/>
  <img src="https://img.shields.io/badge/Database-PostgreSQL%20(Neon)-blue?style=for-the-badge&logo=postgresql" alt="Database Badge"/>
  <img src="https://img.shields.io/badge/Docker-Supported-blue?style=for-the-badge&logo=docker" alt="Docker Badge"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License Badge"/>
</p>

---

## 🌟 Project Overview

**ResumeAI** is an advanced, production-grade SaaS platform designed to empower job seekers by combining a high-fidelity interactive resume builder with a powerful Applicant Tracking System (ATS) optimization engine. The platform goes beyond basic template completion by integrating a robust AI service powered by the Groq SDK to score resumes, extract structural flaws, suggest keywords, and rewrite work experience and projects dynamically using the high-impact **STAR method**.

By parsing uploaded documents (PDF/DOCX) and matching them directly against target job descriptions, ResumeAI helps candidates bypass automated gatekeepers and significantly improves interview request rates.

---

## 🚀 Live Demo

Explore the live application in action:

* 🖥️ **Frontend Client (Vercel):** [https://ai-resume-builder-swart-kappa.vercel.app](https://ai-resume-builder-swart-kappa.vercel.app)
* ⚙️ **Backend REST API (Render):** [https://ai-resume-builder-hqr6.onrender.com](https://ai-resume-builder-hqr6.onrender.com)

---

## ✨ Implemented Features

ResumeAI offers a complete suite of professional tools to build, analyze, optimize, and manage career profiles:

### 📝 Core Resume Management
* **Interactive Resume Builder:** A dynamic, drag-and-drop enabled workspace allowing users to rearrange sections, update entries, and view rendering updates in real-time.
* **Premium Templates:** Six professionally styled, industry-standard templates:
  * 🎨 *Modern:* Sleek grid designs tailored for technology, startups, and creative fields.
  * 🏢 *Corporate:* Trustworthy, structured layouts optimized for finance, legal, and operational roles.
  * 🌿 *Minimal:* Clean, high-readability layouts focusing on typography and balanced spacing.
  * 👔 *Executive:* Polished structures emphasizing leadership, high-level metrics, and career progression.
  * 💻 *Tech:* Compact layouts highlighting technical stacks, repositories, and technical contributions.
  * 💡 *Creative:* Bold styling with subtle accents designed for marketing and design-oriented careers.
* **Accent Color Themes:** Live customizable color palettes to personalize template aesthetics instantly.
* **High-Fidelity PDF Export:** Perfect standard-compliant PDF exports utilizing advanced CSS break controls, ensuring page layouts remain pristine.

### 🧠 AI Optimization Suite (Powered by Groq)
* **Resume Parsing:** Upload an existing PDF or DOCX file to automatically extract structure, experience, education, and contact details.
* **ATS Analyzer:** Evaluates resumes against specific target job descriptions, producing an instant score based on matching algorithms.
* **ATS Deep Insights:** Diagnostic reports auditing match statistics, keyword densities, formatting red flags, and styling guidelines.
* **AI Summary Generator:** Instant generation of compelling, role-tailored professional summaries.
* **AI Experience Enhancement:** Automatically rewrites work experience bullet points to emphasize impact, action verbs, and quantifiable metrics using the **STAR methodology**.
* **AI Project Enhancement:** Polishes technical and academic projects to highlight technologies, architecture, and complexity.
* **AI Skill Suggestions:** Recommends missing hard and soft skills based on target roles to maximize ATS score matching.
* **Resume Tailoring:** Adjusts wording, tone, and keyword alignment to target specific industries or job descriptions.

### 📂 History & Security
* **Version History:** Automatic snapshot-saving to log resume revisions.
* **Compare Versions:** Side-by-side comparison interfaces to review historical changes.
* **Restore Versions:** Restore any previous point-in-time resume version back to active development with a single click.
* **Dashboard Analytics:** Comprehensive visualization charts tracking resume counts, overall completion rates, and average ATS optimization scores.
* **User Profile Management:** Edit personal contact details, profiles, and configure system preferences.
* **Secure Authentication:** Complete JWT-based user sign-up, secure login, salted password hashing (BcryptJS), and routing guards.

---

## 🛠️ Tech Stack

### Frontend
* **React.js & Vite:** Fast, modern compilation framework with hot module reloading.
* **Tailwind CSS:** Premium custom utility styles and theme controls.
* **Framer Motion:** Smooth, hardware-accelerated animations and user interaction transitions.
* **Zustand:** Lightweight, high-performance global state management.
* **React Router DOM v6:** Declarative client-side SPA routing.
* **Axios:** Standardized HTTP client config with interceptors for JWT injection.
* **HTML2PDF.js:** Vector-perfect, client-side PDF document generation.

### Backend
* **Node.js & Express.js:** Fast, asynchronous REST API architecture.
* **Multer:** Multi-part file upload processing middleware.
* **PDF-Parse & Mammoth:** Advanced extraction engines to read text content from PDF and DOCX files.
* **BcryptJS & JWT:** Secure user password hashing and token-based state authorization.

### Database
* **PostgreSQL (Neon):** Serverless Postgres database instance with scaling support.
* **Prisma ORM (v6.x):** Type-safe query builder, schema migration tool, and database client generator.

### AI Engine
* **Groq Cloud SDK:** Advanced inference acceleration using Llama-3 and Mixtral models for ultra-fast text transformations and analyses.

### DevOps & Deployment
* **Docker:** Full containerization setup for backend node applications and frontend static servers.
* **Nginx:** Static file distribution server serving the React SPA bundle with fallback routing support.
* **GitHub Actions:** CI pipeline automating project builds and configuration validations.
* **Vercel / Render:** Deployment targets for global frontend and backend scale.

---

## 📂 Project Structure

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

## ⚙️ Environment Variables

Copy `.env.example` to `.env` in the root folder before starting development:

```bash
cp .env.example .env
```

### Backend (`server/.env` or root `.env` for Docker)
| Variable Name | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL Connection String (supports pooling/Neon SSL). | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | Secret key for signing web tokens securely. | `super_secure_development_jwt_secret_phrase` |
| `GROQ_API_KEY` | API Key retrieved from the Groq Cloud Console. | `gsk_AbCdEf123456789...` |
| `NODE_ENV` | Environment context. | `development` (use `production` on servers) |
| `ALLOWED_ORIGINS`| CORS allowed origin URL list (comma-separated). | `http://localhost:5173` |

### Frontend (`client/.env`)
| Variable Name | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base endpoint URL target for React Axios clients. | `http://localhost:5000/api` |

---

## 💻 Local Setup & Development

Follow these steps to run ResumeAI locally on your system:

### Option A: Local Development (Manual Setup)

#### 1. Setup the Database
1. Run a PostgreSQL database locally or provision a database on Neon.
2. Store your credentials in a `.env` file inside the `server/` directory.

#### 2. Start the Backend API
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client & migrate tables:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   *The server runs on [http://localhost:5000](http://localhost:5000)*

#### 3. Start the Frontend Client
1. Open a new terminal session and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The client runs on [http://localhost:5173](http://localhost:5173)*

---

### Option B: Containerized Development (Docker Compose)

Ensure you have Docker Desktop installed.

1. **Build Container Images:**
   ```bash
   docker compose build
   ```
2. **Launch Services in Background:**
   ```bash
   docker compose up -d
   ```
3. **Shutdown and Clean Resources:**
   ```bash
   docker compose down
   ```

*When using Docker, access the frontend at [http://localhost:5173](http://localhost:5173) and the backend API at [http://localhost:5000](http://localhost:5000).*

---

## ⚙️ CI/CD Pipeline (GitHub Actions)

This project has an integrated CI pipeline structured in `.github/workflows/ci.yml` that triggers on:
* Pushes to `main` and `develop`
* Pull requests targeted to the `main` branch

### Pipeline Verifications
* **Frontend Build Validation:** Installs all project dependencies via `npm ci` and runs `npm run build` to verify standard, error-free Vite compiles.
* **Prisma Schema Checks:** Run `prisma generate` to build TypeScript types, and execute `prisma validate` to verify the DB schemas are structured correctly.
* **Docker Compose Validation:** Validates container variable interpolation and compose configurations through `docker compose config`.
* **Docker Image Build Checks:** Automates test builds of the frontend and backend Dockerfiles to verify that the containerized applications build successfully.

---

## 🌐 Production Deployment

The project is optimized for direct hosting on Render, Vercel, and Neon.

### Hosting Breakdown
* **Database:** Managed Serverless Database hosted on **Neon**.
* **Backend REST API:** Hosted on **Render** (via blue-green container deploy or native Node).
* **Frontend:** Hosted on **Vercel** with full client-side router config in `vercel.json`.

### Example Production Environment Variables

#### Backend (Render Configuration)
```env
DATABASE_URL=postgresql://neondb_owner:password@ep-cool-snowflake-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=production_jwt_high_entropy_secret_key_987654321
GROQ_API_KEY=gsk_prod_aBcdEFGhIjKlmNoPqrStUvWxYz12345
NODE_ENV=production
ALLOWED_ORIGINS=https://ai-resume-builder-swart-kappa.vercel.app
```

#### Frontend (Vercel Configuration)
```env
VITE_API_URL=https://ai-resume-builder-hqr6.onrender.com/api
```

---

## 🧪 Testing Checklist

Use the following checklist to verify that all modules are operating normally:

* [ ] **Register:** Verify user registration behaves correctly, rejects duplicate emails, and hashes passwords securely.
* [ ] **Login:** Confirm JWT validation issues and correctly signs authentication states.
* [ ] **Resume CRUD:** Ensure resumes can be created, updated with details, loaded on login, and deleted cleanly.
* [ ] **ATS Analysis:** Verify uploading resumes and matching them to job descriptions outputs dynamic percentage scores.
* [ ] **AI Features:** Confirm Groq integration generates professional summaries, rewrites achievements, and lists valid skill suggestions.
* [ ] **Version History:** Confirm manual or autosave states log, allow comparative reviews, and successfully restore past configurations.
* [ ] **PDF Export:** Verify that downloading PDF format files compiles layout styling options and separates pages nicely.

---

## 🗺️ Future Roadmap

* 📈 **SEO Optimization:** Server-side landing page optimization, custom metadata headers, and dynamic site maps.
* 📊 **Google Analytics:** Integrate analytical trackers to measure conversion rates and page view durations.
* 🚨 **Sentry Monitoring:** Add error reporting packages to catch backend and frontend exceptions instantly.
* ✉️ **Cover Letter Generator:** Custom matching algorithm generating targeted cover letters for specific job posts.
* 🤖 **Interview Preparation AI:** Generates custom mock interview questions and answer guidelines based on resume profiles.

---

## ✍️ Author

* **Dharikashree Karthikeyan** - [GitHub Profile](https://github.com/Dharika-2006)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
