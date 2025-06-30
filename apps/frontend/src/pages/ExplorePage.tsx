import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Clock,
  Home,
  List,
  Compass,
  Menu,
  X,
  Layers3,
  Eye,
  Plus,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { fetchPublicTracks } from "@/lib/api";

// Types for community tracks - simplified to match backend response
interface CommunityTrack {
  id: string;
  title: string;
  description: string | null;
  creator: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  articles_count: number;
  created_at: string;
  participant_count: number;
  is_joined: boolean;
}

// Navigation items
const navigationItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "tracks", label: "Tracks", icon: List },
  { id: "explore", label: "Explore", icon: Compass },
];

// Navigation Sidebar Component
const NavigationSidebar = ({
  activeView,
  setActiveView,
}: {
  activeView: string;
  setActiveView: (view: string) => void;
}) => {
  const { setOpenMobile, setOpen, isMobile } = useSidebar();
  const navigate = useNavigate();

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    if (isMobile) {
      setOpenMobile(false);
    }

    // Navigate to appropriate routes
    if (viewId === "tracks" || viewId === "home") {
      navigate("/");
    } else if (viewId === "explore") {
      navigate("/explore");
    }
  };

  const handleCloseSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  return (
    <Sidebar
      className="border-r border-border dark:border-gray-700"
      collapsible="offcanvas"
    >
      <SidebarHeader className="border-b border-border dark:border-gray-700 px-4 h-16">
        <div className="flex items-center justify-between w-full h-full">
          <Layers3 className="h-6 w-6 text-blue-500" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseSidebar}
            className="h-8 w-8 p-0 hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu className="space-y-1">
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => handleNavClick(item.id)}
                isActive={activeView === item.id}
                className="w-full justify-start px-4 py-3 rounded-md hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

// Header Content Component
const HeaderContent = () => {
  return (
    <div className="flex items-center gap-3">
      <SidebarTrigger className="md:hidden" />
      <Link
        to="/"
        className="text-2xl font-bold text-foreground dark:text-gray-100"
      >
        ProjectVista
      </Link>
    </div>
  );
};

// Community Track Card Component
const CommunityTrackCard = ({
  track,
  onJoin,
}: {
  track: CommunityTrack;
  onJoin: (trackId: string) => void;
}) => {
  return (
    <Card className="transition-shadow hover:shadow-sm cursor-pointer group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold text-foreground mb-2 group-hover:text-blue-500 transition-colors">
              {track.title}
            </CardTitle>
            <p
              className="text-sm text-muted-foreground mb-3 overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {track.description || "No description available"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>{track.articles_count} articles</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Created by {track.creator.name}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Community Stats */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-foreground">
              {track.participant_count} participants
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onJoin(track.id)}
          className={`w-full ${
            track.is_joined
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {track.is_joined ? (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Joined
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Join Track
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

// Main Explore Page Component
const ExplorePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState("explore");
  const [joinedTracks, setJoinedTracks] = useState<Set<string>>(new Set());
  const [publicTracks, setPublicTracks] = useState<CommunityTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayedCount, setDisplayedCount] = useState(6); // Show more initially
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        // Fetch public tracks
        const tracks = await fetchPublicTracks();
        setPublicTracks(tracks);
      } catch (err) {
        console.error("Error loading explore data:", err);
        setError(err instanceof Error ? err.message : "Failed to load tracks");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleJoinTrack = (trackId: string) => {
    const track = publicTracks.find((t) => t.id === trackId);
    if (!track) return;

    if (joinedTracks.has(trackId)) {
      // Already joined - could show track or navigate to it
      toast({
        title: "Track opened",
        description: `Opening ${track.title}...`,
      });
    } else {
      // Join the track (for now, just update local state)
      setJoinedTracks((prev) => new Set([...prev, trackId]));
      toast({
        title: "Joined track!",
        description: `You've joined "${track.title}". This will be fully implemented in the next step.`,
      });
    }
  };

  // Update tracks with join status
  const displayedTracks = publicTracks
    .slice(0, displayedCount)
    .map((track) => ({
      ...track,
      is_joined: joinedTracks.has(track.id),
    }));

  const hasMoreTracks = displayedCount < publicTracks.length;

  const handleSeeMore = () => {
    setDisplayedCount((prev) => prev + 6);
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen bg-background dark:bg-gray-900 flex w-full">
        {/* Sidebar */}
        <NavigationSidebar
          activeView={activeView}
          setActiveView={setActiveView}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          {/* Header */}
          <header className="bg-background dark:bg-gray-900 border-b border-border dark:border-gray-700 sticky top-0 z-40">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <HeaderContent />
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <UserMenu user={user} />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-3">
                  Explore Community Tracks
                </h1>
                <p className="text-lg text-muted-foreground">
                  Join tracks created by learners around the world and
                  participate together in shared knowledge journeys
                </p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-16">
                  <div className="text-muted-foreground">Loading tracks...</div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-16">
                  <div className="text-red-500 mb-4">Error: {error}</div>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && publicTracks.length === 0 && (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    No Public Tracks Yet
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Be the first to create a public track for the community!
                  </p>
                  <Button onClick={() => window.history.back()}>Go Back</Button>
                </div>
              )}

              {/* Community Tracks Grid */}
              {!loading && !error && publicTracks.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {displayedTracks.map((track) => (
                      <CommunityTrackCard
                        key={track.id}
                        track={track}
                        onJoin={handleJoinTrack}
                      />
                    ))}
                  </div>

                  {/* See More Button */}
                  {hasMoreTracks && (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={handleSeeMore}
                        className="px-8 py-2"
                      >
                        See More
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ExplorePage;
