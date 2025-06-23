
import { useEffect, useState } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

// Temporary auth state management (will be replaced with Supabase)
const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check - replace with actual Supabase auth
    const checkAuth = async () => {
      const authToken = localStorage.getItem('projectvista_auth');
      setIsAuthenticated(!!authToken);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return <>{children}</>;
};

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const handleGoogleLogin = () => {
    // Simulate Google login - replace with actual Supabase auth
    localStorage.setItem('projectvista_auth', 'demo_token');
    localStorage.setItem('projectvista_user', JSON.stringify({
      id: 'demo_user',
      email: 'demo@example.com',
      name: 'Demo User'
    }));
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-4">ProjectVista</h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            Create and manage your personal learning tracks from Wikipedia articles
          </p>
        </div>
        
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-accent-blue text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-3"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
        
        <p className="text-sm text-text-secondary mt-6">
          Secure authentication to access your learning tracks
        </p>
      </div>
    </div>
  );
};

export default AuthGuard;
