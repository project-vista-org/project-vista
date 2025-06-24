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
import { User } from "@supabase/supabase-js";

const TrackPage = () => {
  const { trackId } = useParams<{ trackId: string }>();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getCurrentUser();

    // This is a mock. Replace with actual data fetching.
    const savedTracks = localStorage.getItem("projectvista_tracks");
    if (savedTracks) {
      const tracks: Track[] = JSON.parse(savedTracks);
      const currentTrack = tracks.find((t) => t.id === trackId);
      setTrack(currentTrack || null);
    }
    setLoading(false);
  }, [trackId]);

  if (loading) {
    return <div>Loading...</div>; // Replace with a proper skeleton loader
  }

  if (!track) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-foreground">Track not found</h2>
        <Link
          to="/"
          className="text-accent-blue dark:text-accent-blue-dark hover:underline"
        >
          Go back to your tracks
        </Link>
      </div>
    );
  }

  const completedArticles = track.articles.filter((a) => a.completed).length;
  const progress = (completedArticles / track.articles.length) * 100;

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {/* Header */}
      <header className="bg-background dark:bg-gray-900 border-b border-border dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-2xl font-bold text-foreground">
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-50 mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to all tracks
        </Link>

        {/* Track Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            {track.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>{track.articles.length} articles</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                Created on {new Date(track.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-accent-blue dark:bg-accent-blue-dark h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="font-medium text-muted-foreground dark:text-gray-300">
                {Math.round(progress)}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400 mt-2">
              {completedArticles} of {track.articles.length} articles completed.
            </p>
          </CardContent>
        </Card>

        {/* Articles List */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Track Articles
          </h2>
          <div className="space-y-4">
            {track.articles.map((article, index) => (
              <a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 rounded-lg border border-border dark:border-gray-700 bg-card dark:bg-gray-800 hover:bg-muted dark:hover:bg-gray-700 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {article.title}
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
                      Order: {index + 1}
                    </p>
                  </div>
                  {article.completed ? (
                    <Badge
                      variant="default"
                      className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                    >
                      Completed
                    </Badge>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        // Mock functionality, would update state and call backend
                        console.log(`Marking ${article.title} as complete`);
                      }}
                    >
                      Mark as complete
                    </Button>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackPage;
