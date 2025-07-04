import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  Book,
  CheckCircle,
  Clock,
  Trophy,
  BookOpen,
  Home,
  List,
  Compass,
  Menu,
  X,
  Layers3,
} from "lucide-react";
import { Track } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { supabase } from "@/lib/supabase";
import { fetchTrack, updateTrack } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

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

    // Navigate to appropriate routes
    if (viewId === "tracks" || viewId === "home") {
      navigate("/");
    } else if (viewId === "explore") {
      // Future: navigate to explore page
      navigate("/");
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
        <h1 className="text-2xl font-bold text-foreground dark:text-gray-100">
          ProjectVista
        </h1>
      )}
    </div>
  );
};

const TrackPage = () => {
  const { trackId } = useParams<{ trackId: string }>();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingArticles, setUpdatingArticles] = useState<Set<number>>(
    new Set(),
  );
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState("tracks");
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
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">
        <div className="text-foreground dark:text-gray-100">Loading...</div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-foreground dark:text-gray-100">
            Track not found
          </h2>
          <Link
            to="/"
            className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline"
          >
            Go back to your tracks
          </Link>
        </div>
      </div>
    );
  }

  const completedArticles = track.articles.filter((a) => a.completed).length;
  const progress = (completedArticles / track.articles.length) * 100;

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
            <div className="max-w-7xl mx-auto">
              {/* Back Button */}
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200 mb-6 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to all tracks
              </Link>

              {/* Track Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground dark:text-gray-100 mb-3">
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
                      Created on{" "}
                      {new Date(track.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <Card
                className={`mb-8 shadow rounded-lg transition-all duration-300 ${
                  progress === 100
                    ? "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-700"
                    : "bg-card dark:bg-gray-800 border border-border dark:border-gray-700"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground dark:text-gray-100 flex items-center gap-2">
                    {progress === 100 ? (
                      <>
                        <Trophy className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        Track Completed! 🎉
                      </>
                    ) : (
                      "Your Progress"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                          progress === 100
                            ? "bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-400 dark:to-green-400"
                            : "bg-blue-500 dark:bg-blue-400"
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span
                      className={`font-medium min-w-[3rem] text-right ${
                        progress === 100
                          ? "text-emerald-700 dark:text-emerald-300 font-bold"
                          : "text-foreground dark:text-gray-100"
                      }`}
                    >
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <p
                    className={`text-sm mt-2 ${
                      progress === 100
                        ? "text-emerald-600 dark:text-emerald-300 font-medium"
                        : "text-muted-foreground dark:text-gray-400"
                    }`}
                  >
                    {progress === 100
                      ? `🎊 Congratulations! You've completed all ${track.articles.length} articles in this track!`
                      : `${completedArticles} of ${track.articles.length} articles completed.`}
                  </p>
                  {progress === 100 && (
                    <div className="mt-4 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-700">
                      <p className="text-sm text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        You've mastered this learning track! Consider exploring
                        more tracks or sharing your achievement.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Articles List */}
              <div>
                <h2 className="text-2xl font-bold text-foreground dark:text-gray-100 mb-6">
                  Track Articles
                </h2>
                <div className="space-y-3">
                  {track.articles.map((article, index) => (
                    <div
                      key={index}
                      className={`relative p-6 rounded-lg border transition-all duration-200 ${
                        article.completed
                          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 shadow-sm"
                          : "bg-card dark:bg-gray-800 border-border dark:border-gray-700 shadow hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                article.completed
                                  ? "bg-emerald-500 dark:bg-emerald-600 text-white"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                              }`}
                            >
                              {article.completed ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <span>{index + 1}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3
                                  className={`text-lg font-semibold truncate ${
                                    article.completed
                                      ? "text-emerald-900 dark:text-emerald-100"
                                      : "text-foreground dark:text-gray-100"
                                  }`}
                                >
                                  {article.title}
                                </h3>
                                <a
                                  href={article.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex-shrink-0 transition-colors ${
                                    article.completed
                                      ? "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                                      : "text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                                  }`}
                                >
                                  <svg
                                    className="h-4 w-4"
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
                              <p
                                className={`text-sm ${
                                  article.completed
                                    ? "text-emerald-600 dark:text-emerald-300"
                                    : "text-muted-foreground dark:text-gray-400"
                                }`}
                              >
                                Article {index + 1} of {track.articles.length}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex-shrink-0 ml-6">
                          <div className="flex items-center gap-3">
                            {/* Read Button - Always visible */}
                            <Button
                              variant="secondary"
                              size="sm"
                              asChild
                              className="bg-secondary dark:bg-gray-700 text-secondary-foreground dark:text-gray-200 hover:bg-secondary/80 dark:hover:bg-gray-600"
                            >
                              <Link
                                to={`/track/${trackId}/item/${index}`}
                                className="flex items-center gap-2"
                              >
                                <BookOpen className="h-4 w-4" />
                                Read
                              </Link>
                            </Button>

                            {/* Complete/Undo Button */}
                            {article.completed ? (
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 rounded-full text-sm font-medium">
                                  <CheckCircle className="h-4 w-4" />
                                  Completed
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkComplete(index)}
                                  disabled={updatingArticles.has(index)}
                                  className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                                >
                                  {updatingArticles.has(index)
                                    ? "Updating..."
                                    : "Undo"}
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => handleMarkComplete(index)}
                                size="sm"
                                disabled={updatingArticles.has(index)}
                                className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TrackPage;
