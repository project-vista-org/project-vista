# Project Vista - Learning Tracks Platform

A modern web application for creating and managing personalized learning tracks using Wikipedia articles, built with React, FastAPI, and AWS RDS PostgreSQL.

## 🚀 Features

- **Persistent Learning Tracks**: Create and manage learning tracks that persist across devices
- **Wikipedia Integration**: Search and add Wikipedia articles to your tracks
- **User Authentication**: Secure authentication via Supabase Auth (Google OAuth2)
- **Real-time Updates**: Optimistic UI updates with TanStack Query
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **AWS Infrastructure**: Scalable backend on AWS Lambda with RDS PostgreSQL

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** - Modern React development
- **TypeScript** - Type safety and better developer experience
- **TanStack Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

### Backend
- **FastAPI** - Modern Python web framework
- **SQLModel** - SQLAlchemy + Pydantic integration
- **Alembic** - Database migrations
- **AWS Lambda** - Serverless hosting
- **Mangum** - ASGI to Lambda adapter

### Database
- **AWS RDS PostgreSQL** - Managed PostgreSQL database
- **JSONB** - Store article data efficiently
- **Connection Pooling** - Optimized database connections

### Authentication
- **Supabase Auth** - JWT-based authentication
- **Google OAuth2** - Social login integration

### Infrastructure
- **AWS Lambda** - Serverless backend hosting
- **AWS API Gateway** - REST API management
- **AWS RDS** - Managed PostgreSQL database
- **Vercel** - Frontend hosting (optional)

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.9+
- AWS Account with RDS and Lambda access
- Supabase project for authentication
- PostgreSQL client (for local development)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd the-vista-project
```

### 2. Backend Setup

```bash
cd apps/backend

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp env.example .env

# Edit .env with your configuration
# - DATABASE_URL: Your AWS RDS PostgreSQL connection string
# - SUPABASE_URL: Your Supabase project URL
# - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key

# Initialize database
python scripts/setup_db.py

# Start development server
uvicorn app.main:app --reload
```

### 3. Frontend Setup

```bash
cd apps/frontend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your configuration
# - VITE_SUPABASE_URL: Your Supabase project URL
# - VITE_SUPABASE_ANON_KEY: Your Supabase anon key
# - VITE_API_BASE_URL: Your backend API URL (http://localhost:8000 for local)

# Start development server
npm run dev
```

### 4. AWS RDS Setup

Follow the detailed guide in [docs/aws-rds-setup.md](docs/aws-rds-setup.md) to:

1. Create an AWS RDS PostgreSQL instance
2. Configure security groups and networking
3. Set up environment variables
4. Deploy to AWS Lambda

## 📁 Project Structure

```
the-vista-project/
├── apps/
│   ├── backend/                 # FastAPI backend
│   │   ├── app/
│   │   │   ├── main.py         # FastAPI application
│   │   │   ├── models.py       # SQLModel database models
│   │   │   ├── database.py     # Database configuration
│   │   │   └── routes/         # API routes
│   │   ├── alembic/            # Database migrations
│   │   ├── scripts/            # Setup and deployment scripts
│   │   └── requirements.txt    # Python dependencies
│   └── frontend/               # React frontend
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── hooks/          # Custom React hooks
│       │   ├── lib/            # API client and utilities
│       │   ├── pages/          # Page components
│       │   └── types/          # TypeScript type definitions
│       └── package.json        # Node.js dependencies
├── docs/                       # Documentation
└── README.md                   # This file
```

## 🔧 API Endpoints

### Authentication Required
All endpoints require a valid Supabase JWT token in the Authorization header.

- `GET /api/tracks/` - Get all tracks for the authenticated user
- `POST /api/tracks/` - Create a new track
- `GET /api/tracks/{track_id}` - Get a specific track
- `PUT /api/tracks/{track_id}` - Update a track
- `DELETE /api/tracks/{track_id}` - Delete a track
- `GET /api/user/profile` - Get current user profile

### Public Endpoints
- `GET /` - API health check
- `GET /api/health` - Detailed health status

## 🗄️ Database Schema

### Tracks Table
```sql
CREATE TABLE tracks (
    id VARCHAR PRIMARY KEY,
    title VARCHAR NOT NULL,
    description VARCHAR,
    user_id VARCHAR NOT NULL,
    articles JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX ix_tracks_user_id ON tracks(user_id);
```

## 🔐 Security

- **JWT Authentication**: All API endpoints require valid Supabase JWT tokens
- **User Scoping**: Users can only access their own tracks
- **Input Validation**: All inputs are validated using Pydantic models
- **CORS**: Configured for secure cross-origin requests
- **Database Security**: RDS encryption and security groups

## 🚀 Deployment

### Backend (AWS Lambda)

```bash
cd apps/backend

# Install Zappa
pip install zappa

# Configure deployment
# Edit zappa_settings.json with your AWS configuration

# Deploy
zappa deploy dev
```

### Frontend (Vercel)

```bash
cd apps/frontend

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 🧪 Testing

### Backend Tests
```bash
cd apps/backend
pytest
```

### Frontend Tests
```bash
cd apps/frontend
npm test
```

## 📚 Documentation

- [Tech Stack](docs/tech-stack.md) - Detailed technology choices
- [AWS RDS Setup](docs/aws-rds-setup.md) - Database setup guide
- [Design System](docs/design-system.md) - UI/UX guidelines
- [Product Requirements](docs/prd.md) - Product specifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

## 🔄 Changelog

### v2.0.0 - AWS RDS Integration
- ✅ Replaced Supabase database with AWS RDS PostgreSQL
- ✅ Implemented persistent user tracks
- ✅ Added TanStack Query for data management
- ✅ Enhanced security with proper user scoping
- ✅ Added comprehensive error handling
- ✅ Improved loading states and UX

### v1.0.0 - Initial Release
- ✅ Basic track creation and management
- ✅ Supabase integration
- ✅ Wikipedia article search
- ✅ Responsive design
