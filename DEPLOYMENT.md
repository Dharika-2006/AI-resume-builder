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
