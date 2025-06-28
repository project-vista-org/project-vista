import React from "react";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";

interface UserAvatarProps {
  user: User | null;
  size?: "sm" | "md" | "lg";
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = "md" }) => {
  // Get user initials for the fallback
  const getUserInitials = () => {
    if (!user) return "";

    // Try to get initials from full_name in user metadata
    if (user.user_metadata?.full_name) {
      const nameParts = user.user_metadata.full_name.split(" ");
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      }
      return nameParts[0][0].toUpperCase();
    }

    // Fallback to email
    if (user.email) {
      return user.email[0].toUpperCase();
    }

    return "";
  };

  // Determine avatar size based on the size prop
  const getAvatarSize = () => {
    switch (size) {
      case "sm":
        return "h-8 w-8";
      case "lg":
        return "h-12 w-12";
      case "md":
      default:
        return "h-10 w-10";
    }
  };

  const avatarUrl = user?.user_metadata?.avatar_url;

  // Debug logging to help diagnose avatar issues
  console.log("UserAvatar debug:", {
    user: user ? "exists" : "null",
    userMetadata: user?.user_metadata,
    avatarUrl,
    fullName: user?.user_metadata?.full_name,
    email: user?.email,
  });

  return (
    <Avatar className={getAvatarSize()}>
      {avatarUrl ? (
        <AvatarImage
          src={avatarUrl}
          alt={user?.user_metadata?.full_name || "User"}
          onError={() => console.log("Avatar image failed to load:", avatarUrl)}
          onLoad={() =>
            console.log("Avatar image loaded successfully:", avatarUrl)
          }
        />
      ) : null}
      <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
        {getUserInitials() || <UserIcon className="h-5 w-5" />}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
