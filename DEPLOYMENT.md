# Deployment & Dockerization Guide - ResumeAI

This guide details how to build, run, and deploy the ResumeAI application locally and to production using Docker and Docker Compose.

---

## 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- Access to a PostgreSQL instance (e.g., Neon Cloud Console).

---

## 2. Environment Variables Configuration

Copy the template env file to your local configuration:

```bash
cp .env.example .env
```

Edit the newly created `.env` file at the root of the workspace, setting the database connection strings and keys:

* **`DATABASE_URL`**: Your PostgreSQL/Neon cloud instance URI (e.g. `postgresql://neondb_owner:...`)
* **`JWT_SECRET`**: A secret key used to sign JSON Web Tokens.
* **`GROQ_API_KEY`**: Your API access token for AI actions.
* **`VITE_API_URL`**: The endpoint where the React frontend points. Use `http://localhost:5000/api` for local docker setups.

---

## 3. Local Startup via Docker Compose

To build and run the services in detached mode:

```bash
docker compose up -d --build
```

This single command will:
1. Compile the React codebase with Vite and mount it inside an optimized **Nginx** container.
2. Build the Node.js API container, installing npm packages and generating the **Prisma Client** matching the current schema definition.
3. Expose the frontend at [http://localhost:5173](http://localhost:5173) and the backend at [http://localhost:5000](http://localhost:5000).

---

## 4. Prisma Database Operations

Prisma behaves differently depending on whether you are running in a **Development** environment versus a **Production** environment.

### Production Database Migrations

For production environments (or when releasing code to a live system), database structure updates must be applied safely using migration histories rather than mutating tables dynamically.

Run the migrations using:

```bash
npx prisma migrate deploy
```

> [!IMPORTANT]
> **Why `npx prisma migrate deploy` in Production?**
> * **Preserves Data**: It reads history and executes the sql changes iteratively. It never resets your database or truncates client data.
> * **Consistency**: Ensures that dev, staging, and production databases are in the exact same schema state.
> * **Transactional**: Changes are committed atomically where supported.

### Development Mode

In local development, if you are making rapid schema changes and prototyping:

```bash
npx prisma db push
```

> [!WARNING]
> **Why avoid `npx prisma db push` in Production?**
> * **Resets/Truncations**: If it detects destructive changes, it might prompt to drop or wipe tables.
> * **No History**: It ignores migration files entirely and pushes the current state of `schema.prisma` directly, making it impossible to audit.

---

## 5. Verification Checklist

To confirm everything runs correctly:

1. Check that both containers are running and healthy:
   ```bash
   docker compose ps
   ```
2. Verify Backend health API returns success:
   ```bash
   curl http://localhost:5000/api/health
   # Expected output: {"status":"ok"}
   ```
3. Open your browser and navigate to `http://localhost:5173`. Confirm the landing page is accessible and that you can register or login.

---

## 6. Restart Policy & Crash Recovery

Containers use the `restart: unless-stopped` policy. This ensures:
- If Node.js crashes (e.g. out of memory, uncaught exception), Docker restarts the container automatically.
- If Nginx crashes, the frontend container recovers immediately.
- If the Docker daemon/desktop restarts, containers boot back up to their previous state.
- Containers will stay stopped if you explicitly run `docker compose down` or `docker stop`.

---

## 7. Production Cloud Deployment (Vercel + Render + Neon)

For production, ResumeAI is designed to run in a split-stack cloud configuration:
* **Frontend**: Deployed to **Vercel** (static React runtime, optimized for fast loading and low latency).
- **Backend**: Deployed to **Render** (as a Node.js Web Service).
- **Database**: Hosted on **Neon** (serverless PostgreSQL).

### Database Setup (Neon)
1. Ensure your Neon database is active and retrieve the connection string.
2. Note that we do **NOT** run `npx prisma db push` in production environments because it can wipe database state or result in undocumented/un-auditable structures.
3. Instead, our Render build command runs `npx prisma migrate deploy` to safely apply database migrations step-by-step.

### Backend Deployment (Render)

You can deploy the backend to Render in two ways: **Declarative Blueprint** (recommended) or **Manual Setup**.

#### Option A: Declarative Blueprint (Recommended)
We provide a [render.yaml](file:///c:/Users/kavit/OneDrive/Desktop/AI-resume-builder/render.yaml) file at the root of the project.
1. In the Render Dashboard, click **New** and select **Blueprint**.
2. Connect your GitHub repository.
3. Render will read `render.yaml` and automatically configure the Web Service, Root Directory (`server`), Node.js environment, health checks (`/api/health`), and build/start scripts.
4. Input the values for the requested environment variables (e.g. `DATABASE_URL`, `GROQ_API_KEY`, `ALLOWED_ORIGINS`).

#### Option B: Manual Setup
If you prefer manual setup:
1. Create a new **Web Service** on Render and connect it to your GitHub repository.
2. Configure the following parameters:
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
3. Add the environment variables manually in the service's **Environment** settings.

---

### Frontend Deployment (Vercel)

The frontend is configured with a [vercel.json](file:///c:/Users/kavit/OneDrive/Desktop/AI-resume-builder/client/vercel.json) configuration inside the `client/` directory.

1. **SPA Fallback Routing**: Includes rewrites mapping all path requests `/(.*)` back to `/index.html` to prevent 404 errors when users reload dashboard/form pages.
2. **Security Headers**: Automatically configures response headers for `X-Frame-Options` (DENY), `X-Content-Type-Options` (nosniff), `Referrer-Policy`, and `X-XSS-Protection`.

#### Deployment Steps:
1. Create a new project in Vercel and link it to your GitHub repository.
2. Configure the project parameters:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add the environment variables in Vercel's project settings.

---

## 8. Production Environment Variable Checklist

Ensure the following variables are configured exactly as listed:

### Backend (Render Web Service)

| Environment Variable | Required | Purpose / Description | Copy-Paste Sample / Value |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **Yes** | Neon PostgreSQL connection URI. Must include `sslmode=require`. | `postgresql://neondb_owner:pass@ep-host.aws.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | **Yes** | Cryptographic key used to sign authentication tokens. | *Click "Generate Value" in Render, or use a 32+ char random string* |
| `GROQ_API_KEY` | **Yes** | Token to access Groq LLM API. | `gsk_mK...` |
| `ALLOWED_ORIGINS` | **Yes** | Comma-separated list of allowed origin URLs (NO trailing slashes). | `http://localhost:5173,https://your-resume-app.vercel.app` |
| `NODE_ENV` | **Yes** | Tells Node to run in optimized production mode. | `production` |
| `PORT` | No | Defines the port Render listens on. | `5000` |

### Frontend (Vercel Project)

| Environment Variable | Required | Purpose / Description | Copy-Paste Sample / Value |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | **Yes** | The base HTTP endpoint of your backend Render service. | `https://resume-ai-backend.onrender.com/api` |

---

## 9. Deployment Troubleshooting Guide

### Issue 1: CORS Error in Browser Console (`Not allowed by CORS`)
* **Symptom**: User actions (Login/Register/ATS Analysis) fail, and the browser console prints a message containing `Access-Control-Allow-Origin` or `Not allowed by CORS`.
* **Cause**: The backend's `ALLOWED_ORIGINS` variable does not match the frontend's current Vercel URL.
* **Solution**:
  1. Open your Render Dashboard.
  2. Navigate to your Web Service -> **Environment**.
  3. Verify `ALLOWED_ORIGINS` contains your Vercel domain (e.g., `https://your-site.vercel.app`).
  4. **Important**: Ensure there are no trailing slashes (`/`) or trailing paths (like `/api`) in the CORS URLs.

### Issue 2: Frontend returns `404 Not Found` on Page Refresh
* **Symptom**: Navigating through the app works fine, but refreshing the page on `/dashboard`, `/builder`, or `/profile` throws a 404 error.
* **Cause**: Vercel tries to serve static files matching the URL path, which do not exist in client-side routed apps.
* **Solution**: Ensure [client/vercel.json](file:///c:/Users/kavit/OneDrive/Desktop/AI-resume-builder/client/vercel.json) exists and contains the rewrite rules mapping `/(.*)` back to `/index.html`.

### Issue 3: Prisma Migration Failure (`prisma migrate deploy`)
* **Symptom**: Render build logs show errors during `npx prisma migrate deploy` or the build fails during deployment.
* **Cause**: A migration file conflict, a schema drift, or temporary connection timeout to Neon database.
* **Solution**:
  1. Verify the `DATABASE_URL` in Render is fully correct and accessible.
  2. If schema structure changes have been made that conflict with existing data, you may need to resolve it by creating a new migration locally first (`npx prisma migrate dev`), committing it, and pushing it.
  3. Avoid using `npx prisma db push` on production databases.

### Issue 4: Frontend requests fail with `Network Error` (Cannot connect)
* **Symptom**: Network inspector shows requests to `http://localhost:5000` or undefined URLs.
* **Cause**: `VITE_API_URL` was not configured during the Vercel build phase.
* **Solution**:
  1. Open Vercel -> Settings -> Environment Variables.
  2. Add `VITE_API_URL` pointing to your Render endpoint (e.g. `https://resume-ai-backend.onrender.com/api`).
  3. Go to the Deployments tab and trigger a **Redeploy** (environment variables in Vite are injected at build time, so you must rebuild the app).


