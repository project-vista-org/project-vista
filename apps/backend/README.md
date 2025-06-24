# Backend Setup (with Virtual Environment)

## Prerequisites

- **Python 3.11** (recommended for best performance and feature support)
- PostgreSQL database (AWS RDS or local)
- Supabase project (for authentication)

## 1. Create and activate a virtual environment

```bash
python3.11 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

## 2. Install dependencies

```bash
pip install -r requirements.txt
```

## 3. Configure environment variables

Create a `.env` file with:

```
# Supabase Configuration (for authentication only)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AWS RDS PostgreSQL Configuration
DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/database_name
```

## 4. Run the application

```bash
uvicorn app.main:app --reload
```

## User Authentication Flow

The backend uses Supabase Auth for authentication but maintains its own `users` table:

1. User authenticates with Supabase (frontend)
2. Frontend sends JWT token with API requests
3. Backend verifies token with Supabase
4. Backend automatically upserts user data into local `users` table
5. All API endpoints use the local `User` model

This approach gives you:
- Secure authentication via Supabase
- Local user data for joins and app-specific data
- Automatic synchronization between Supabase Auth and your database

## Database Schema

- **users**: Stores user profile information
- **tracks**: Stores learning tracks with articles as JSONB

## API Endpoints

- `GET /api/user/profile`: Get current user profile
- `GET /api/tracks/`: Get all tracks for current user
- `POST /api/tracks/`: Create a new track
- `GET /api/tracks/{track_id}`: Get a specific track
- `PUT /api/tracks/{track_id}`: Update a track
- `DELETE /api/tracks/{track_id}`: Delete a track

---
