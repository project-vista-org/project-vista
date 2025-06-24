import { useState } from "react";
import { X, Plus, Search, GripVertical, Trash2, BookOpen } from "lucide-react";
import { WikipediaArticle } from "@/types";
import {
  searchWikipediaArticles,
  WikipediaSearchResult,
} from "@/lib/wikipedia";
import { useToast } from "@/hooks/use-toast";

interface CreateTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, articles: WikipediaArticle[]) => void;
}

const CreateTrackModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateTrackModalProps) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [articles, setArticles] = useState<WikipediaArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WikipediaSearchResult[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchWikipediaArticles(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: "Failed to search Wikipedia articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const addArticle = (result: WikipediaSearchResult) => {
    const newArticle: WikipediaArticle = {
      title: result.title,
      url: result.url,
    };

    // Check if article is already added
    if (articles.some((article) => article.title === result.title)) {
      toast({
        title: "Article Already Added",
        description: "This article is already in your track.",
        variant: "destructive",
      });
      return;
    }

    setArticles([...articles, newArticle]);
    setSearchQuery("");
    setSearchResults([]);
    toast({
      title: "Article Added",
      description: `"${result.title}" has been added to your track.`,
    });
  };

  const removeArticle = (index: number) => {
    const newArticles = articles.filter((_, i) => i !== index);
    setArticles(newArticles);
  };

  const moveArticle = (fromIndex: number, toIndex: number) => {
    const newArticles = [...articles];
    const [movedArticle] = newArticles.splice(fromIndex, 1);
    newArticles.splice(toIndex, 0, movedArticle);
    setArticles(newArticles);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your track.",
        variant: "destructive",
      });
      return;
    }

    if (articles.length === 0) {
      toast({
        title: "Articles Required",
        description: "Please add at least one article to your track.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(title.trim(), articles);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setTitle("");
    setArticles([]);
    setSearchQuery("");
    setSearchResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-foreground">
            Create New Track
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div
          className="p-6 overflow-y-auto custom-scrollbar"
          style={{ maxHeight: "calc(90vh - 140px)" }}
        >
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Track Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Modern World Conflicts, Space Exploration History..."
                  className="w-full px-4 py-3 bg-background dark:bg-gray-800 border border-input dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-blue-dark focus:border-transparent text-foreground dark:text-gray-50 placeholder-muted-foreground dark:placeholder-gray-400"
                  autoFocus
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!title.trim()}
                  className="bg-accent-blue dark:bg-accent-blue-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-blue-hover dark:hover:bg-accent-blue-hover-dark transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Next: Add Articles
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Track: {title}
                </h3>
                <p className="text-muted-foreground dark:text-gray-400 text-sm">
                  Search and add Wikipedia articles to your learning track
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground dark:text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search Wikipedia articles..."
                    className="w-full pl-10 pr-4 py-3 bg-background dark:bg-gray-800 border border-input dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-blue-dark focus:border-transparent text-foreground dark:text-gray-50 placeholder-muted-foreground dark:placeholder-gray-400"
                  />
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-background dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => addArticle(result)}
                        className="w-full px-4 py-3 text-left hover:bg-muted dark:hover:bg-gray-700 border-b border-border dark:border-gray-700 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-foreground">
                          {result.title}
                        </div>
                        <div className="text-sm text-muted-foreground dark:text-gray-400 line-clamp-2 mt-1">
                          {result.description}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {isSearching && (
                  <div className="absolute z-10 w-full mt-2 bg-background dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-lg p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-blue dark:border-accent-blue-dark mx-auto mb-2"></div>
                    <p className="text-muted-foreground dark:text-gray-400 text-sm">
                      Searching...
                    </p>
                  </div>
                )}
              </div>

              {/* Added Articles */}
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  Articles ({articles.length})
                </h4>

                {articles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground dark:text-gray-400">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No articles added yet</p>
                    <p className="text-sm">
                      Search above to add Wikipedia articles
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {articles.map((article, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-muted dark:bg-gray-700 rounded-lg group"
                      >
                        <GripVertical className="h-5 w-5 text-muted-foreground dark:text-gray-400 cursor-move" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {index + 1}. {article.title}
                          </p>
                        </div>
                        <button
                          onClick={() => removeArticle(index)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t border-border dark:border-gray-700">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-border dark:border-gray-700 rounded-lg font-medium text-foreground hover:bg-muted dark:hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={articles.length === 0}
                  className="bg-accent-blue dark:bg-accent-blue-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-blue-hover dark:hover:bg-accent-blue-hover-dark transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Create Track
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTrackModal;
