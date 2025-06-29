import { Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface VisibilityToggleProps {
  isPublic: boolean;
  onToggle: (isPublic: boolean) => void;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  disabled?: boolean;
  className?: string;
}

export const VisibilityToggle = ({
  isPublic,
  onToggle,
  size = "md",
  showLabel = true,
  disabled = false,
  className,
}: VisibilityToggleProps) => {
  const sizeClasses = {
    sm: "text-xs gap-1.5 px-2 py-1",
    md: "text-sm gap-2 px-3 py-2",
    lg: "text-base gap-2.5 px-4 py-3",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <button
      onClick={() => onToggle(!isPublic)}
      disabled={disabled}
      className={cn(
        "inline-flex items-center rounded-lg border transition-all duration-200 font-medium",
        sizeClasses[size],
        isPublic
          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
        disabled && "opacity-50 cursor-not-allowed hover:bg-current",
        !disabled && "hover:shadow-sm",
        className,
      )}
      title={isPublic ? "Track is public" : "Track is private"}
    >
      {isPublic ? (
        <Globe
          className={cn(iconSizes[size], "text-blue-500 dark:text-blue-400")}
        />
      ) : (
        <Lock
          className={cn(iconSizes[size], "text-gray-500 dark:text-gray-400")}
        />
      )}
      {showLabel && <span>{isPublic ? "Public" : "Private"}</span>}
    </button>
  );
};

// Compact version for inline use
export const VisibilityBadge = ({
  isPublic,
  className,
}: {
  isPublic: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
        isPublic
          ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
          : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400",
        className,
      )}
      title={
        isPublic
          ? "This track is visible to the community"
          : "This track is private"
      }
    >
      {isPublic ? (
        <Globe className="h-3 w-3 text-blue-500 dark:text-blue-400" />
      ) : (
        <Lock className="h-3 w-3 text-gray-500 dark:text-gray-400" />
      )}
      <span>{isPublic ? "Public" : "Private"}</span>
    </div>
  );
};
