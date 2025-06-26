import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Book, CheckCircle, Clock } from "lucide-react";
import { Track } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";
import { supabase } from "@/lib/supabase";
import { fetchTrack, updateTrack } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

const TrackPage = () => {
  const { trackId } = useParams<{ trackId: string }>();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingArticles, setUpdatingArticles] = useState<Set<number>>(
    new Set(),
  );
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserAndTrack = async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        // Fetch track from API
        if (trackId && user) {
          const trackData = await fetchTrack(trackId);
          setTrack(trackData);
        }
      } catch (error) {
        console.error("Failed to load track:", error);
        toast({
          title: "Error",
          description: "Failed to load track. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserAndTrack();
  }, [trackId, toast]);

  const handleMarkComplete = async (articleIndex: number) => {
    if (!track || !trackId) return;

    // Add to updating set to show loading state
    setUpdatingArticles((prev) => new Set(prev).add(articleIndex));

    try {
      // Create updated articles array
      const updatedArticles = track.articles.map((article, index) => {
        if (index === articleIndex) {
          return { ...article, completed: !article.completed };
        }
        return article;
      });

      // Update backend
      const updatedTrack = await updateTrack(trackId, {
        articles: updatedArticles,
      });

      // Update local state with backend response
      setTrack(updatedTrack);

      // Show success toast
      const article = updatedArticles[articleIndex];
      toast({
        title: article.completed ? "Article Completed!" : "Article Unmarked",
        description: article.completed
          ? `Great job! You've completed "${article.title}"`
          : `"${article.title}" marked as incomplete`,
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to update article completion:", error);
      toast({
        title: "Error",
        description: "Failed to update article. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Remove from updating set
      setUpdatingArticles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(articleIndex);
        return newSet;
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Replace with a proper skeleton loader
  }

  if (!track) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-foreground">Track not found</h2>
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-600 hover:underline"
        >
          Go back to your tracks
        </Link>
      </div>
    );
  }

  const completedArticles = track.articles.filter((a) => a.completed).length;
  const progress = (completedArticles / track.articles.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-2xl font-bold text-gray-800">
                ProjectVista
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <UserMenu user={user} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to all tracks
        </Link>

        {/* Track Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            {track.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>{track.articles.length} articles</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                Created on {new Date(track.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-8 bg-white border border-gray-200 shadow rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="font-medium text-gray-800 min-w-[3rem] text-right">
                {Math.round(progress)}%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {completedArticles} of {track.articles.length} articles completed.
            </p>
          </CardContent>
        </Card>

        {/* Articles List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Track Articles
          </h2>
          <div className="space-y-3">
            {track.articles.map((article, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-lg border transition-all duration-200 ${
                  article.completed
                    ? "bg-emerald-50 border-emerald-200 shadow-sm"
                    : "bg-white border-gray-200 shadow hover:shadow-md hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          article.completed
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {article.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-lg font-semibold truncate ${
                            article.completed
                              ? "text-emerald-900"
                              : "text-gray-900"
                          }`}
                        >
                          {article.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            article.completed
                              ? "text-emerald-600"
                              : "text-gray-500"
                          }`}
                        >
                          Article {index + 1} of {track.articles.length}
                        </p>
                      </div>
                    </div>
                    <div className="ml-11">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${
                          article.completed
                            ? "text-emerald-600 hover:text-emerald-700"
                            : "text-blue-500 hover:text-blue-600"
                        }`}
                      >
                        Read on Wikipedia
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div className="flex-shrink-0 ml-6">
                    {article.completed ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                          <CheckCircle className="h-4 w-4" />
                          Completed
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkComplete(index)}
                          disabled={updatingArticles.has(index)}
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        >
                          {updatingArticles.has(index) ? "Updating..." : "Undo"}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleMarkComplete(index)}
                        size="sm"
                        disabled={updatingArticles.has(index)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {updatingArticles.has(index)
                          ? "Updating..."
                          : "Mark Complete"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackPage;
