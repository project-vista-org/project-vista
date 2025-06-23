# 🛠️ Tech Stack – The Vista Project

This document outlines the full technical stack used to build and deploy **The Vista Project**, across frontend, backend, database, infrastructure, and external integrations.

---

## 🌐 Frontend

| Component           | Choice                        | Notes                                           |
|---------------------|-------------------------------|-------------------------------------------------|
| **Framework**        | Next.js (React)               | For server-side rendering + static generation   |
| **Styling**          | Tailwind CSS                  | Utility-first, clean, modern UI system          |
| **State Management** | React Context (early phase)   | Lightweight; can move to Zustand/Recoil later   |
| **Routing**          | Next.js router                | Built-in with support for nested and dynamic    |
| **Forms**            | React Hook Form               | Declarative and scalable                        |
| **Data Fetching**    | SWR or Axios                  | Optimistic UI and caching                       |
| **Device Support**   | Fully responsive + mobile-first design |

---

## 🔁 Backend

| Component         | Choice                | Notes                                                       |
|-------------------|-----------------------|-------------------------------------------------------------|
| **Framework**      | FastAPI               | Async Python web framework with automatic OpenAPI docs      |
| **Adapter**        | Mangum                | Bridges FastAPI (ASGI) with AWS Lambda                      |
| **Routing**        | FastAPI Routers       | Modular structure for scalability                           |
| **Auth**           | Google OAuth2         | Firebase Auth or direct OAuth flow                          |
| **ORM**            | SQLModel              | SQLAlchemy + Pydantic = fast dev + type safety              |
| **Env Management** | `python-dotenv`       | For local development and Lambda secrets                    |

---

## 🗃️ Database

| Component         | Choice                     | Notes                                      |
|-------------------|----------------------------|--------------------------------------------|
| **Primary DB**     | PostgreSQL (on AWS RDS)    | Relational DB, robust and flexible         |
| **Local Dev**      | Dockerized Postgres        | For local testing                          |
| **Schema**         | SQLModel ORM               | Auto-generates schema from Pydantic models |
| **Migrations**     | Alembic                    | Database schema versioning                 |

---

## ☁️ Cloud Infrastructure

| Layer            | Tool / Service            | Purpose                                          |
|------------------|---------------------------|--------------------------------------------------|
| **Hosting (FE)**  | Vercel                    | Serverless deploy for Next.js frontend           |
| **Hosting (BE)**  | AWS Lambda                | FastAPI deployed as serverless function          |
| **API Gateway**   | AWS API Gateway           | Exposes Lambda endpoints as REST API            |
| **Static Storage**| AWS S3                    | Stores generated article summaries or files     |
| **Database**      | AWS RDS (PostgreSQL)      | Managed PostgreSQL DB                           |

---

## 🔐 Authentication & Authorization

| Component       | Choice             | Notes                                              |
|-----------------|--------------------|----------------------------------------------------|
| **Auth Provider**| Google OAuth2      | Secure and familiar login                          |
| **User Mgmt**    | Firebase Auth *(optional)* | Simplifies token generation and session handling   |
| **Session**      | JWT tokens         | Passed via HTTP headers from frontend              |

---

## 🧠 AI & Summarization

| Component         | Choice               | Notes                                          |
|-------------------|----------------------|------------------------------------------------|
| **LLM Provider**   | OpenAI (GPT-4)       | Used for summarizing Wikipedia content         |
| **Summaries**      | ~1500-word outputs   | Stored in DB or S3 for reuse                   |
| **Track Creation** | GPT + Wikipedia API  | Generates 7-article journeys from vague prompts|

---

## 🔍 Search & Wikipedia Integration

| Component           | Source                          | Notes                            |
|---------------------|----------------------------------|----------------------------------|
| **Autocomplete**     | Wikipedia Opensearch API        | For adding articles to tracks    |
| **Content Fetching** | Wikipedia REST API              | Gets raw content for summaries   |
| **Article URLs**     | English Wikipedia               | Default source                   |

---

## 🧪 Testing & Linting

| Type            | Tool              | Notes                                |
|-----------------|-------------------|--------------------------------------|
| **Unit Tests**   | Pytest, Vitest    | Python for BE, Vitest for FE         |
| **Linting**      | flake8, ESLint    | Clean and consistent codebase        |
| **Formatting**   | Black, Prettier   | Auto-formatting for Python + JS      |

---

## ⚙️ DevOps & Tooling

| Tool                | Purpose                                  |
|---------------------|------------------------------------------|
| **GitHub Actions**   | CI/CD for tests + deployments            |
| **Zappa** *(BE)*     | Deploy FastAPI to Lambda easily          |
| **Docker (optional)**| Local Postgres or backend isolation      |
| **Monorepo Tooling** | Basic NPM + custom scripts (`concurrently`) |

---

## 🛡️ Security Practices

- Store secrets using AWS Secrets Manager or environment variables
- Sanitize all Wikipedia inputs before display
- Enforce HTTPS (API Gateway + Vercel provide this by default)
- Apply CORS rules in FastAPI config
- OAuth tokens are short-lived and refreshable

---

## 💡 Future Enhancements

- Add Redis (Elasticache) for caching summaries
- Add rate limiting with AWS WAF or API Gateway throttling
- Add GraphQL layer for more flexible querying (optional)
- Enable user-to-user sharing and auth scopes (read-only, edit)

---
