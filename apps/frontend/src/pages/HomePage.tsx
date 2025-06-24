import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BookOpen, Search } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Track } from "@/types";
import TrackCard from "@/components/TrackCard";
import CreateTrackModal from "@/components/CreateTrackModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { supabase, signOut } from "@/lib/supabase";

const HomePage = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getCurrentUser();

    // Load tracks from localStorage (will be replaced with Supabase)
    const savedTracks = localStorage.getItem("projectvista_tracks");
    if (savedTracks) {
      setTracks(JSON.parse(savedTracks));
    }
  }, []);

  const saveTracksToStorage = (newTracks: Track[]) => {
    localStorage.setItem("projectvista_tracks", JSON.stringify(newTracks));
    setTracks(newTracks);
  };

  const handleCreateTrack = (title: string, articles: any[]) => {
    const newTrack: Track = {
      id: `track_${Date.now()}`,
      userId: user?.id || "unknown",
      title,
      articles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTracks = [...tracks, newTrack];
    saveTracksToStorage(updatedTracks);

    toast({
      title: "Track Created!",
      description: `"${title}" has been added to your tracks.`,
    });
  };

  const handleTrackClick = (track: Track) => {
    navigate(`/track/${track.id}`);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      // Clear local storage
      localStorage.removeItem("projectvista_tracks");
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    }
  };

  const filteredTracks = tracks.filter((track) =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {/* Header */}
      <header className="bg-background dark:bg-gray-900 border-b border-border dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                ProjectVista
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground dark:text-gray-300 hidden sm:block">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-gray-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              My Learning Tracks
            </h2>
            <p className="text-muted-foreground dark:text-gray-300">
              Create and organize your personal knowledge journeys
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-accent-blue dark:bg-accent-blue-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-blue-hover dark:hover:bg-accent-blue-hover-dark transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="h-5 w-5" />
            Create Track
          </button>
        </div>

        {/* Search */}
        {tracks.length > 0 && (
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground dark:text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your tracks..."
                className="w-full pl-10 pr-4 py-3 bg-background dark:bg-gray-800 border border-input dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-blue-dark focus:border-transparent text-foreground dark:text-gray-50 placeholder-muted-foreground dark:placeholder-gray-400"
              />
            </div>
          </div>
        )}

        {/* Tracks Grid */}
        {filteredTracks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onClick={() => handleTrackClick(track)}
              />
            ))}
          </div>
        ) : tracks.length > 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground dark:text-gray-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium text-foreground mb-2">
              No tracks found
            </h3>
            <p className="text-muted-foreground dark:text-gray-300">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <BookOpen className="h-16 w-16 text-muted-foreground dark:text-gray-400 mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Start Your Learning Journey
              </h3>
              <p className="text-muted-foreground dark:text-gray-300 mb-8 leading-relaxed">
                Create your first learning track by organizing Wikipedia
                articles into a structured path of knowledge.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-accent-blue dark:bg-accent-blue-dark text-white px-8 py-4 rounded-lg font-medium hover:bg-accent-blue-hover dark:hover:bg-accent-blue-hover-dark transition-colors inline-flex items-center gap-3"
              >
                <Plus className="h-5 w-5" />
                Create Your First Track
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Create Track Modal */}
      <CreateTrackModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTrack}
      />
    </div>
  );
};

export default HomePage;
