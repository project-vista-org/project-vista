# 🏔️ Project Vista

A knowledge tracking and exploration platform that helps users create and manage personal learning tracks from Wikipedia articles.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.8+
- Supabase account

### 1. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Authentication > Settings > Auth Providers
3. Enable Google OAuth and configure your Google OAuth credentials
4. Copy your project URL and anon key from Settings > API

### 2. Frontend Setup

```bash
cd apps/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your Supabase credentials:
# VITE_SUPABASE_URL=your_supabase_project_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start development server
npm run dev
```

### 3. Backend Setup

```bash
cd apps/backend

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your Supabase credentials:
# SUPABASE_URL=your_supabase_project_url
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Start development server
uvicorn app.main:app --reload
```

## 🔐 Authentication

The app uses **Supabase Auth** with **Google OAuth** for authentication:

- Users can sign in with their Google account
- Sessions persist across page refreshes
- Automatic token refresh and validation
- Secure JWT-based authentication

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:5173/auth/callback` (for development)

## 🏗️ Project Structure

```
the-vista-project/
├── apps/
│   ├── frontend/          # React + Vite frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── lib/
│   │   │   └── types/
│   │   └── package.json
│   └── backend/           # FastAPI backend
│       ├── app/
│       │   ├── main.py
│       │   └── routes/
│       └── requirements.txt
├── docs/                  # Documentation
└── README.md
```

## 🛠️ Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + Google OAuth
- **Deployment**: Vercel (frontend) + AWS Lambda (backend)

## 🔧 Development

### Frontend Commands

```bash
cd apps/frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Backend Commands

```bash
cd apps/backend
uvicorn app.main:app --reload  # Start development server
pytest                        # Run tests
```

## 📚 Features

- **Google OAuth Authentication**: Secure login with Google accounts
- **Learning Tracks**: Create and manage personal knowledge journeys
- **Wikipedia Integration**: Search and add Wikipedia articles to tracks
- **Progress Tracking**: Monitor your learning progress
- **Responsive Design**: Works on desktop and mobile

## 🔒 Security

- JWT-based authentication with automatic token refresh
- Row Level Security (RLS) in PostgreSQL
- CORS protection
- Environment variable management
- HTTPS enforcement

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (AWS Lambda)

1. Use Zappa to deploy FastAPI to Lambda
2. Configure environment variables in AWS
3. Set up API Gateway for HTTP endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.