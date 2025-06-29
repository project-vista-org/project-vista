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
| **Hosting (BE)**  | AWS EC2                   | Backend API running in Docker container          |
| **HTTPS & CDN**   | Cloudflare Tunnel         | Secure HTTPS access with built-in CDN           |
| **API Gateway**   | Cloudflare Proxy          | Routes HTTPS traffic to EC2 backend             |
| **Static Storage**| AWS S3                    | Stores generated article summaries or files     |
| **Database**      | Supabase (PostgreSQL)     | Managed PostgreSQL with auth and real-time      |

---

## 🌐 Domain & HTTPS Setup

| Component         | Choice                     | Notes                                      |
|-------------------|----------------------------|--------------------------------------------|
| **Domain**         | project-vista.com          | Registered and managed through Cloudflare  |
| **DNS Management** | Cloudflare DNS             | DNS records with orange cloud (proxied)    |
| **SSL/TLS**        | Cloudflare SSL             | Automatic HTTPS with valid certificates    |
| **Tunnel**         | Cloudflare Tunnel          | Secure tunnel from EC2 to Cloudflare edge  |
| **API Endpoint**   | api.project-vista.com      | Custom subdomain for backend API          |
| **Backend Port**   | 80 (Docker proxy)          | FastAPI running in container on EC2        |

### Tunnel Configuration
- **Tunnel ID**: `e39fdaa8-0523-4161-98ff-c95bd1302ae0`
- **Service**: `http://localhost:80` (routes to Docker container)
- **DNS Record**: `CNAME api -> tunnel_id.cfargotunnel.com`
- **Proxy Status**: Enabled (Orange cloud) for security and performance

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
| **Docker**          | Backend containerization on EC2         |
| **systemctl**       | Managing cloudflared tunnel service     |
| **cloudflared**     | Cloudflare tunnel daemon on EC2         |
| **Monorepo Tooling** | Basic NPM + custom scripts (`concurrently`) |

### Service Management Commands
```bash
# Tunnel service management on EC2
sudo systemctl start cloudflared
sudo systemctl status cloudflared
sudo systemctl enable cloudflared

# Check tunnel logs
sudo journalctl -u cloudflared -f
```

---

## 🛡️ Security Practices

- Store secrets using Supabase environment variables
- Sanitize all Wikipedia inputs before display
- Enforce HTTPS via Cloudflare Tunnel with automatic SSL certificates
- Cloudflare DDoS protection and Web Application Firewall (WAF)
- Apply CORS rules in FastAPI config
- JWT tokens are short-lived and refreshable via Supabase
- Row Level Security (RLS) policies in PostgreSQL
- EC2 backend protected behind Cloudflare tunnel (no direct internet access)
- DNS proxied through Cloudflare for additional security and caching

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
VITE_API_BASE_URL=https://api.project-vista.com
```

### Backend (.env)
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_postgres_connection_string
```

### Cloudflare Tunnel
```bash
# Tunnel service runs with this token on EC2
CLOUDFLARE_TUNNEL_TOKEN=your_tunnel_token
```

---
