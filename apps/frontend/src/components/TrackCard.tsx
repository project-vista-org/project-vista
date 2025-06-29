import { Track } from "@/types";
import { ExternalLink, BookOpen, Trophy, CheckCircle } from "lucide-react";
import {
  VisibilityBadge,
  VisibilityToggle,
} from "@/components/ui/visibility-toggle";
import { useToast } from "@/hooks/use-toast";

interface TrackCardProps {
  track: Track;
  onClick: () => void;
  onVisibilityChange?: (trackId: string, isPublic: boolean) => void;
}

const TrackCard = ({ track, onClick, onVisibilityChange }: TrackCardProps) => {
  const { toast } = useToast();
  const completedArticles = track.articles.filter(
    (article) => article.completed,
  ).length;
  const totalArticles = track.articles.length;
  const completionPercentage =
    totalArticles > 0
      ? Math.round((completedArticles / totalArticles) * 100)
      : 0;
  const isCompleted = completionPercentage === 100;

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group relative overflow-hidden ${
        isCompleted
          ? "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-700 hover:border-emerald-300 dark:hover:border-emerald-600"
          : "bg-background dark:bg-gray-800 border border-border dark:border-gray-700 hover:border-accent-blue/30 dark:hover:border-accent-blue-dark/30"
      }`}
    >
      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-500 dark:bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium">
          <Trophy className="h-3 w-3" />
          Complete
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <h3
          className={`text-xl font-semibold transition-colors duration-200 line-clamp-2 ${
            isCompleted
              ? "text-emerald-900 dark:text-emerald-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-200"
              : "text-foreground group-hover:text-accent-blue dark:group-hover:text-accent-blue-dark"
          }`}
        >
          {track.title}
        </h3>
        {!isCompleted && (
          <ExternalLink className="h-5 w-5 text-muted-foreground dark:text-gray-400 group-hover:text-accent-blue dark:group-hover:text-accent-blue-dark transition-colors duration-200 flex-shrink-0 ml-2" />
        )}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm">
            {track.articles.length}{" "}
            {track.articles.length === 1 ? "article" : "articles"}
          </span>
        </div>

        {/* Completion Status */}
        <div
          className={`flex items-center gap-2 text-sm ${
            isCompleted
              ? "text-emerald-600 dark:text-emerald-400 font-medium"
              : "text-muted-foreground dark:text-gray-400"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Completed</span>
            </>
          ) : (
            <span>
              {completedArticles} of {totalArticles} done
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {totalArticles > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground dark:text-gray-400">
              Progress
            </span>
            <span
              className={`text-xs font-medium ${
                isCompleted
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground dark:text-gray-400"
              }`}
            >
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isCompleted
                  ? "bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-400 dark:to-green-400"
                  : "bg-blue-500 dark:bg-blue-400"
              }`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {track.articles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground dark:text-gray-300">
            Preview:
          </p>
          <div className="space-y-1">
            {track.articles.slice(0, 3).map((article, index) => (
              <div
                key={index}
                className={`text-sm truncate flex items-center gap-2 ${
                  article.completed
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground dark:text-gray-400"
                }`}
              >
                {article.completed && (
                  <CheckCircle className="h-3 w-3 flex-shrink-0" />
                )}
                <span>
                  {index + 1}. {article.title}
                </span>
              </div>
            ))}
            {track.articles.length > 3 && (
              <div className="text-sm text-muted-foreground dark:text-gray-400 italic">
                +{track.articles.length - 3} more articles
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border/50 dark:border-gray-700/50 flex items-center justify-between">
        <p className="text-xs text-muted-foreground dark:text-gray-400">
          Created {new Date(track.created_at).toLocaleDateString()}
        </p>

        {/* Visibility Toggle */}
        <div onClick={(e) => e.stopPropagation()}>
          {onVisibilityChange ? (
            <VisibilityToggle
              isPublic={track.is_public || false}
              onToggle={(newIsPublic) => {
                onVisibilityChange?.(track.id, newIsPublic);
                toast({
                  title: newIsPublic
                    ? "Track made public"
                    : "Track made private",
                  description: newIsPublic
                    ? "Your track is now visible to the community"
                    : "Your track is now private",
                });
              }}
              size="sm"
              showLabel={false}
              className="hover:scale-105 transition-transform"
            />
          ) : (
            <VisibilityBadge
              isPublic={track.is_public || false}
              className="opacity-75"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
