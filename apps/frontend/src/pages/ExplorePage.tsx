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

// Types for community tracks
interface CommunityTrack {
  id: string;
  title: string;
  description: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
  participantCount: number;
  completedThisWeek: number;
  recentParticipants: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  categories: string[];
  articlesCount: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  isJoined: boolean;
  trending: boolean;
  featured: boolean;
}

// Mock data - In real implementation, this would come from backend
const mockCommunityTracks: CommunityTrack[] = [
  {
    id: "1",
    title: "Modern Physics Fundamentals",
    description:
      "Explore quantum mechanics, relativity, and particle physics through carefully curated Wikipedia articles.",
    creator: {
      id: "user1",
      name: "Dr. Sarah Chen",
      avatar: undefined,
    },
    participantCount: 203,
    completedThisWeek: 47,
    recentParticipants: [
      { id: "p1", name: "Alex", avatar: undefined },
      { id: "p2", name: "Maria", avatar: undefined },
      { id: "p3", name: "John", avatar: undefined },
    ],
    categories: ["Physics", "Science"],
    articlesCount: 15,
    difficulty: "Advanced",
    estimatedTime: "4-6 hours",
    isJoined: false,
    trending: true,
    featured: true,
  },
  {
    id: "2",
    title: "Ancient Civilizations Journey",
    description:
      "Discover the rise and fall of great civilizations from Mesopotamia to the Roman Empire.",
    creator: {
      id: "user2",
      name: "Prof. Michael Torres",
      avatar: undefined,
    },
    participantCount: 156,
    completedThisWeek: 23,
    recentParticipants: [
      { id: "p4", name: "Emma", avatar: undefined },
      { id: "p5", name: "David", avatar: undefined },
      { id: "p6", name: "Lisa", avatar: undefined },
    ],
    categories: ["History", "Culture"],
    articlesCount: 22,
    difficulty: "Intermediate",
    estimatedTime: "6-8 hours",
    isJoined: true,
    trending: true,
    featured: false,
  },
  {
    id: "3",
    title: "Introduction to Machine Learning",
    description:
      "Start your AI journey with fundamental concepts, algorithms, and real-world applications.",
    creator: {
      id: "user3",
      name: "Dr. Priya Patel",
      avatar: undefined,
    },
    participantCount: 89,
    completedThisWeek: 12,
    recentParticipants: [
      { id: "p7", name: "Carlos", avatar: undefined },
      { id: "p8", name: "Sophie", avatar: undefined },
    ],
    categories: ["Technology", "AI", "Computer Science"],
    articlesCount: 18,
    difficulty: "Beginner",
    estimatedTime: "5-7 hours",
    isJoined: false,
    trending: false,
    featured: true,
  },
  {
    id: "4",
    title: "Climate Science Essentials",
    description:
      "Understand climate change, atmospheric science, and environmental impacts through scientific articles.",
    creator: {
      id: "user4",
      name: "Dr. James Wilson",
      avatar: undefined,
    },
    participantCount: 124,
    completedThisWeek: 31,
    recentParticipants: [
      { id: "p9", name: "Ana", avatar: undefined },
      { id: "p10", name: "Tom", avatar: undefined },
      { id: "p11", name: "Rachel", avatar: undefined },
    ],
    categories: ["Environment", "Science"],
    articlesCount: 20,
    difficulty: "Intermediate",
    estimatedTime: "4-5 hours",
    isJoined: false,
    trending: true,
    featured: false,
  },
  {
    id: "5",
    title: "Philosophy of Mind",
    description:
      "Explore consciousness, free will, and the nature of mental states through philosophical works.",
    creator: {
      id: "user5",
      name: "Prof. Elena Rodriguez",
      avatar: undefined,
    },
    participantCount: 67,
    completedThisWeek: 8,
    recentParticipants: [
      { id: "p12", name: "Oliver", avatar: undefined },
      { id: "p13", name: "Maya", avatar: undefined },
    ],
    categories: ["Philosophy", "Psychology"],
    articlesCount: 12,
    difficulty: "Advanced",
    estimatedTime: "3-4 hours",
    isJoined: false,
    trending: false,
    featured: true,
  },
  {
    id: "6",
    title: "Space Exploration Timeline",
    description:
      "Journey through humanity's quest to explore space, from Sputnik to Mars missions.",
    creator: {
      id: "user6",
      name: "Captain Lisa Park",
      avatar: undefined,
    },
    participantCount: 178,
    completedThisWeek: 42,
    recentParticipants: [
      { id: "p14", name: "Kevin", avatar: undefined },
      { id: "p15", name: "Zoe", avatar: undefined },
      { id: "p16", name: "Marcus", avatar: undefined },
    ],
    categories: ["Space", "Technology", "History"],
    articlesCount: 25,
    difficulty: "Beginner",
    estimatedTime: "6-8 hours",
    isJoined: true,
    trending: true,
    featured: false,
  },
];

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
              {track.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>{track.articlesCount} articles</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{track.estimatedTime}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Community Stats */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-foreground">
              {track.participantCount} participants
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onJoin(track.id)}
          className={`w-full ${
            track.isJoined
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {track.isJoined ? (
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
  const [joinedTracks, setJoinedTracks] = useState<Set<string>>(
    new Set(["2", "6"]),
  );
  const [displayedCount, setDisplayedCount] = useState(3);
  const { toast } = useToast();

  // Show all tracks in one list
  const allTracks = mockCommunityTracks;
  const displayedTracks = allTracks.slice(0, displayedCount);
  const hasMoreTracks = displayedCount < allTracks.length;

  useEffect(() => {
    // Get current user
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    loadUser();
  }, []);

  const handleJoinTrack = (trackId: string) => {
    const track = mockCommunityTracks.find((t) => t.id === trackId);
    if (!track) return;

    if (joinedTracks.has(trackId)) {
      // Already joined - could show track or navigate to it
      toast({
        title: "Track opened",
        description: `Opening ${track.title}...`,
      });
    } else {
      // Join the track
      setJoinedTracks((prev) => new Set([...prev, trackId]));
      toast({
        title: "Joined track!",
        description: `You've joined "${track.title}" with ${track.participantCount + 1} other participants.`,
      });
    }
  };

  // Update track join status based on state
  const tracksWithJoinStatus = displayedTracks.map((track) => ({
    ...track,
    isJoined: joinedTracks.has(track.id),
  }));

  const handleSeeMore = () => {
    setDisplayedCount((prev) => prev + 3);
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

              {/* Community Tracks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {tracksWithJoinStatus.map((track) => (
                  <CommunityTrackCard
                    key={track.id}
                    track={track}
                    onJoin={handleJoinTrack}
                  />
                ))}
              </div>

              {/* See More Button */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={handleSeeMore}
                  disabled={!hasMoreTracks}
                  className="px-8 py-2"
                >
                  {hasMoreTracks ? "See More" : "No More Tracks"}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ExplorePage;
