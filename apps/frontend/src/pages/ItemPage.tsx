import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  Circle,
  ArrowUpRight,
  Book,
  Clock,
} from "lucide-react";
import { Track, WikipediaArticle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ThemeToggle } from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";
import { supabase } from "@/lib/supabase";
import { fetchTrack, updateTrack } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

const ItemPage = () => {
  const { trackId, itemIndex } = useParams<{
    trackId: string;
    itemIndex: string;
  }>();
  const navigate = useNavigate();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const currentIndex = itemIndex ? parseInt(itemIndex, 10) : 0;
  const currentArticle = track?.articles[currentIndex] || null;

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

  const handleMarkComplete = async () => {
    if (!track || !trackId || !currentArticle) return;

    setUpdating(true);

    try {
      // Create updated articles array
      const updatedArticles = track.articles.map((article, index) => {
        if (index === currentIndex) {
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
      const updatedArticle = updatedArticles[currentIndex];
      toast({
        title: updatedArticle.completed
          ? "Article Completed!"
          : "Article Unmarked",
        description: updatedArticle.completed
          ? `Great job! You've completed "${updatedArticle.title}"`
          : `"${updatedArticle.title}" marked as incomplete`,
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
      setUpdating(false);
    }
  };

  const navigateToItem = useCallback(
    (newIndex: number) => {
      if (track && newIndex >= 0 && newIndex < track.articles.length) {
        navigate(`/track/${trackId}/item/${newIndex}`);
      }
    },
    [track, trackId, navigate],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLElement &&
        (event.target.tagName === "INPUT" ||
          event.target.tagName === "TEXTAREA")
      ) {
        return; // Don't interfere with input fields
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          if (currentIndex > 0) {
            navigateToItem(currentIndex - 1);
          }
          break;
        case "ArrowRight":
          event.preventDefault();
          if (track && currentIndex < track.articles.length - 1) {
            navigateToItem(currentIndex + 1);
          }
          break;
        case " ":
          event.preventDefault();
          handleMarkComplete();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, track, navigateToItem, handleMarkComplete]);

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

  if (!currentArticle) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-foreground dark:text-gray-100">
            Article not found
          </h2>
          <Link
            to={`/track/${trackId}`}
            className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline"
          >
            Go back to track
          </Link>
        </div>
      </div>
    );
  }

  const hasNextItem = currentIndex < track.articles.length - 1;
  const hasPreviousItem = currentIndex > 0;
  const completedArticles = track.articles.filter((a) => a.completed).length;
  const progress = Math.round(
    (completedArticles / track.articles.length) * 100,
  );

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {/* Header */}
      <header className="bg-background dark:bg-gray-900 border-b border-border dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="text-2xl font-bold text-foreground dark:text-gray-100"
              >
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
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200"
                >
                  <Link to={`/track/${trackId}`}>{track.title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-muted-foreground dark:text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground dark:text-gray-100 font-medium">
                  {currentArticle.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Item Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground dark:text-gray-100">
              {currentArticle.title}
            </h1>
            <a
              href={currentArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              aria-label="Read original article on Wikipedia"
            >
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>
                Article {currentIndex + 1} of {track.articles.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{progress}% track completed</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <Card className="bg-card dark:bg-gray-800 rounded-lg shadow border border-border dark:border-gray-700 mb-8">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none font-serif">
              <p className="text-lg leading-relaxed text-foreground dark:text-gray-100 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>

              <p className="text-lg leading-relaxed text-foreground dark:text-gray-100 mb-6">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum. Sed ut
                perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo.
              </p>

              <h2 className="text-xl font-semibold text-foreground dark:text-gray-100 mb-4 mt-8">
                Key Concepts
              </h2>

              <p className="text-lg leading-relaxed text-foreground dark:text-gray-100 mb-6">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                aut fugit, sed quia consequuntur magni dolores eos qui ratione
                voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
                ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia
                non numquam eius modi tempora incidunt ut labore et dolore
                magnam aliquam quaerat voluptatem.
              </p>

              <p className="text-lg leading-relaxed text-foreground dark:text-gray-100 mb-6">
                Ut enim ad minima veniam, quis nostrum exercitationem ullam
                corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
                consequatur? Quis autem vel eum iure reprehenderit qui in ea
                voluptate velit esse quam nihil molestiae consequatur, vel illum
                qui dolorem eum fugiat quo voluptas nulla pariatur?
              </p>

              <h2 className="text-xl font-semibold text-foreground dark:text-gray-100 mb-4 mt-8">
                Historical Context
              </h2>

              <p className="text-lg leading-relaxed text-foreground dark:text-gray-100 mb-6">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum deleniti atque corrupti quos
                dolores et quas molestias excepturi sint occaecati cupiditate
                non provident, similique sunt in culpa qui officia deserunt
                mollitia animi, id est laborum et dolorum fuga.
              </p>

              <p className="text-lg leading-relaxed text-foreground dark:text-gray-100 mb-6">
                Et harum quidem rerum facilis est et expedita distinctio. Nam
                libero tempore, cum soluta nobis est eligendi optio cumque nihil
                impedit quo minus id quod maxime placeat facere possimus, omnis
                voluptas assumenda est, omnis dolor repellendus. Temporibus
                autem quibusdam et aut officiis debitis aut rerum necessitatibus
                saepe eveniet ut et voluptates repudiandae sint et molestiae non
                recusandae.
              </p>

              <p className="text-lg leading-relaxed text-foreground dark:text-gray-100">
                Itaque earum rerum hic tenetur a sapiente delectus, ut aut
                reiciendis voluptatibus maiores alias consequatur aut
                perferendis doloribus asperiores repellat. The concept continues
                to influence modern thought and remains relevant in contemporary
                discussions about knowledge acquisition and learning
                methodologies.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background dark:bg-gray-900 border-t border-border dark:border-gray-700 shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back to Track */}
            <Button
              variant="ghost"
              asChild
              className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200 hover:bg-accent dark:hover:bg-gray-700"
            >
              <Link
                to={`/track/${trackId}`}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Track</span>
              </Link>
            </Button>

            {/* Center: Navigation and Complete */}
            <div className="flex items-center gap-3">
              {/* Previous Button */}
              <Button
                variant="ghost"
                onClick={() => navigateToItem(currentIndex - 1)}
                disabled={!hasPreviousItem}
                className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200 hover:bg-accent dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous article"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              {/* Mark Complete Button */}
              <Button
                onClick={handleMarkComplete}
                disabled={updating}
                variant={currentArticle.completed ? "secondary" : "default"}
                className={`flex items-center gap-2 px-6 ${
                  currentArticle.completed
                    ? "bg-secondary dark:bg-gray-700 text-secondary-foreground dark:text-gray-200 hover:bg-secondary/80 dark:hover:bg-gray-600"
                    : "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
                }`}
              >
                {currentArticle.completed ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                <span>
                  {updating
                    ? "Updating..."
                    : currentArticle.completed
                      ? "Completed"
                      : "Mark Complete"}
                </span>
              </Button>

              {/* Next Button */}
              <Button
                variant="ghost"
                onClick={() => navigateToItem(currentIndex + 1)}
                disabled={!hasNextItem}
                className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200 hover:bg-accent dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next article"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Right: Progress Indicator */}
            <div className="text-sm text-muted-foreground dark:text-gray-400 text-right min-w-0">
              <div className="font-medium">
                {currentIndex + 1} / {track.articles.length}
              </div>
              <div className="text-xs">{progress}% complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
};

export default ItemPage;
