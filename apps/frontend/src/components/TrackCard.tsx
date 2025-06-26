import { Track } from "@/types";
import { ExternalLink, BookOpen } from "lucide-react";

interface TrackCardProps {
  track: Track;
  onClick: () => void;
}

const TrackCard = ({ track, onClick }: TrackCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-background dark:bg-gray-800 border border-border dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-accent-blue/30 dark:hover:border-accent-blue-dark/30 group"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground group-hover:text-accent-blue dark:group-hover:text-accent-blue-dark transition-colors duration-200 line-clamp-2">
          {track.title}
        </h3>
        <ExternalLink className="h-5 w-5 text-muted-foreground dark:text-gray-400 group-hover:text-accent-blue dark:group-hover:text-accent-blue-dark transition-colors duration-200 flex-shrink-0 ml-2" />
      </div>

      <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400 mb-4">
        <BookOpen className="h-4 w-4" />
        <span className="text-sm">
          {track.articles.length}{" "}
          {track.articles.length === 1 ? "article" : "articles"}
        </span>
      </div>

      {track.articles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground dark:text-gray-300">
            Preview:
          </p>
          <div className="space-y-1">
            {track.articles.slice(0, 3).map((article, index) => (
              <div
                key={index}
                className="text-sm text-muted-foreground dark:text-gray-400 truncate"
              >
                {index + 1}. {article.title}
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

      <div className="mt-4 pt-4 border-t border-border/50 dark:border-gray-700/50">
        <p className="text-xs text-muted-foreground dark:text-gray-400">
          Created {new Date(track.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default TrackCard;
