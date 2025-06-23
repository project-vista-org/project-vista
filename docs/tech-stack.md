# 🛠️ Tech Stack – The Vista Project

This document outlines the full technical stack used to build and deploy **The Vista Project**, across frontend, backend, database, infrastructure, and external integrations.

---

## 🌐 Frontend

| Component           | Choice                        | Notes                                           |
|---------------------|-------------------------------|-------------------------------------------------|
| **Framework**        | React + Vite                  | Fast development with hot reload                |
| **Styling**          | Tailwind CSS                  | Utility-first, clean, modern UI system          |
| **State Management** | React Context + Supabase      | Real-time auth state with Supabase client       |
| **Routing**          | React Router                  | Client-side routing with nested and dynamic     |
| **Forms**            | React Hook Form               | Declarative and scalable                        |
| **Data Fetching**    | TanStack Query + Supabase     | Optimistic UI and caching                       |
| **Device Support**   | Fully responsive + mobile-first design |

---

## 🔁 Backend

| Component         | Choice                | Notes                                                       |
|-------------------|-----------------------|-------------------------------------------------------------|
| **Framework**      | FastAPI               | Async Python web framework with automatic OpenAPI docs      |
| **Adapter**        | Mangum                | Bridges FastAPI (ASGI) with AWS Lambda                      |
| **Routing**        | FastAPI Routers       | Modular structure for scalability                           |
| **Auth**           | Supabase Auth         | Google OAuth2 integration with JWT validation               |
| **ORM**            | SQLModel              | SQLAlchemy + Pydantic = fast dev + type safety              |
| **Env Management** | `python-dotenv`       | For local development and Lambda secrets                    |

---

## 🗃️ Database

| Component         | Choice                     | Notes                                      |
|-------------------|----------------------------|--------------------------------------------|
| **Primary DB**     | Supabase (PostgreSQL)      | Managed PostgreSQL with built-in auth      |
| **Local Dev**      | Supabase Local             | For local testing                          |
| **Schema**         | SQLModel ORM               | Auto-generates schema from Pydantic models |
| **Migrations**     | Alembic                    | Database schema versioning                 |

---

## ☁️ Cloud Infrastructure

| Layer            | Tool / Service            | Purpose                                          |
|------------------|---------------------------|--------------------------------------------------|
| **Hosting (FE)**  | Vercel                    | Serverless deploy for React frontend             |
| **Hosting (BE)**  | AWS Lambda                | FastAPI deployed as serverless function          |
| **API Gateway**   | AWS API Gateway           | Exposes Lambda endpoints as REST API            |
| **Static Storage**| AWS S3                    | Stores generated article summaries or files     |
| **Database**      | Supabase (PostgreSQL)     | Managed PostgreSQL with auth and real-time      |

---

## 🔐 Authentication & Authorization

| Component       | Choice             | Notes                                              |
|-----------------|--------------------|----------------------------------------------------|
| **Auth Provider**| Supabase Auth      | Google OAuth2 integration with session management |
| **User Mgmt**    | Supabase Auth      | Built-in user profiles and metadata               |
| **Session**      | JWT tokens         | Automatic token refresh and validation            |
| **Security**     | Row Level Security | Database-level access control                     |

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

- Store secrets using Supabase environment variables
- Sanitize all Wikipedia inputs before display
- Enforce HTTPS (API Gateway + Vercel provide this by default)
- Apply CORS rules in FastAPI config
- JWT tokens are short-lived and refreshable via Supabase
- Row Level Security (RLS) policies in PostgreSQL

---

## 💡 Future Enhancements

- Add Redis (Elasticache) for caching summaries
- Add rate limiting with AWS WAF or API Gateway throttling
- Add GraphQL layer for more flexible querying (optional)
- Enable user-to-user sharing and auth scopes (read-only, edit)
- Implement real-time features with Supabase subscriptions

---

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (.env)
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_postgres_connection_string
```

---
