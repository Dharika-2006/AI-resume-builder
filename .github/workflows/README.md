# GitHub Actions CI/CD Secrets & Configuration

This directory contains the GitHub Actions workflows for the ResumeAI application. To enable the CI/CD pipeline to function correctly (especially when moving into CD in Phase 9C-D), several repository secrets need to be configured in your GitHub repository settings.

## Required GitHub Secrets

The following secrets are used by the application during building, testing, or deployment phases:

| Secret Name | Description | Used By |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection URL (e.g., Neon or local postgres connection string) for Prisma schema validation and migrations. | Backend Build & Docker Build validation, Deployment |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens (JWT) for authentication. | Backend validation, Runtime |
| `GROQ_API_KEY` | API key to access Groq SDK for AI-based resume parsing, tailoring, and ATS score insights. | Backend, Runtime |

---

## How to Configure Repository Secrets

To add these secrets to your GitHub repository:

1. On GitHub, navigate to the main page of your repository.
2. Under your repository name, click **Settings** (the gear icon).
3. In the left sidebar, click **Secrets and variables** and select **Actions**.
4. Click the **New repository secret** button.
5. In the **Name** field, input the secret name (e.g., `DATABASE_URL`).
6. In the **Value** field, input the corresponding secret value.
7. Click **Add secret** to save.
8. Repeat steps 4-7 for all required secrets.

---

## Job Secrets Usage

- **`frontend-build`**: No secrets are strictly required for the frontend build validation step, though build-time arguments (like `VITE_API_URL`) can be configured via environment variables if desired.
- **`backend-build`**: Prisma requires the presence of a syntactically valid `DATABASE_URL` during client generation and schema validation. The CI workflow supplies a default dummy fallback value for validation so that pull requests (which do not have access to repository secrets) do not fail. For production environments, the repository secret will override this.
- **`docker-build`**: Docker Compose config validation uses dummy fallback variables to verify compilation syntax without exposing production secrets.
