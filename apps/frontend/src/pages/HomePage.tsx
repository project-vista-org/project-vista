import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  BookOpen,
  Search,
  Home,
  List,
  Compass,
  Menu,
  X,
  Layers3,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Track } from "@/types";
import TrackCard from "@/components/TrackCard";
import CreateTrackModal from "@/components/CreateTrackModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";
import { useToast } from "@/hooks/use-toast";
import { supabase, signOut } from "@/lib/supabase";
import { fetchTracks, createTrack } from "@/lib/api";
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
import { Button } from "@/components/ui/button";

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
  const { setOpenMobile, setOpen, isMobile, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    if (isMobile) {
      setOpenMobile(false);
    }

    // Navigate to explore page
    if (viewId === "explore") {
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
  const { open, isMobile } = useSidebar();

  // Show title when sidebar is closed OR when on wide screen with sidebar open
  const showTitle = !open || (!isMobile && open);

  return (
    <div className="flex items-center gap-3">
      <SidebarTrigger />
      {showTitle && (
        <h1 className="text-2xl font-bold text-foreground">ProjectVista</h1>
      )}
    </div>
  );
};

const HomePage = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState("home");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user and load tracks
    const loadUserAndTracks = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        try {
          const userTracks = await fetchTracks();
          setTracks(userTracks);
        } catch (error) {
          console.error("Failed to load tracks:", error);
          toast({
            title: "Error",
            description: "Failed to load your tracks. Please try again.",
            variant: "destructive",
          });
        }
      }
    };
    loadUserAndTracks();
  }, [toast]);

  const handleCreateTrack = async (title: string, articles: any[]) => {
    try {
      const newTrack = await createTrack(title, articles);
      setTracks([...tracks, newTrack]);

      toast({
        title: "Track Created!",
        description: `"${title}" has been added to your tracks.`,
      });
    } catch (error) {
      console.error("Failed to create track:", error);
      toast({
        title: "Error",
        description: "Failed to create track. Please try again.",
        variant: "destructive",
      });
    }
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
      setTracks([]);
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
    <SidebarProvider defaultOpen={true}>
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
            {/* Home View */}
            {activeView === "home" && (
              <div className="space-y-6">
                <div className="text-center py-16">
                  <div className="w-full">
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      Hello
                    </h2>
                    <p className="text-muted-foreground dark:text-gray-300">
                      Welcome to ProjectVista. More content coming soon!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tracks View */}
            {activeView === "tracks" && (
              <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                    className="bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors flex items-center gap-2 self-start sm:self-auto"
                  >
                    <Plus className="h-5 w-5" />
                    Create Track
                  </button>
                </div>

                {/* Search */}
                {tracks.length > 0 && (
                  <div>
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground dark:text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search your tracks..."
                        className="w-full pl-10 pr-4 py-3 bg-background dark:bg-gray-800 border border-input dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-foreground dark:text-gray-50 placeholder-muted-foreground dark:placeholder-gray-400"
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
                    <div className="w-full">
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
                        className="bg-blue-500 dark:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors inline-flex items-center gap-3"
                      >
                        <Plus className="h-5 w-5" />
                        Create Your First Track
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Explore View */}
            {activeView === "explore" && (
              <div className="space-y-6">
                <div className="text-center py-16">
                  <div className="w-full">
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      Explore
                    </h2>
                    <p className="text-muted-foreground dark:text-gray-300">
                      Explore more tracks
                    </p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Create Track Modal */}
        <CreateTrackModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTrack}
        />
      </div>
    </SidebarProvider>
  );
};

export default HomePage;
