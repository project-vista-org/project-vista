import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          setError("Authentication failed. Please try again.");
          setIsLoading(false);
          return;
        }

        if (data.session) {
          // Successfully authenticated, redirect to home
          navigate("/", { replace: true });
        } else {
          setError("No session found. Please try logging in again.");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Unexpected error during auth callback:", err);
        setError("An unexpected error occurred. Please try again.");
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue dark:border-accent-blue-dark mx-auto mb-4"></div>
          <p className="text-muted-foreground dark:text-gray-300">
            Completing sign in...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Authentication Error
            </h1>
            <p className="text-muted-foreground dark:text-gray-300 mb-6">
              {error}
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-accent-blue dark:bg-accent-blue-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-blue-hover dark:hover:bg-accent-blue-hover-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
