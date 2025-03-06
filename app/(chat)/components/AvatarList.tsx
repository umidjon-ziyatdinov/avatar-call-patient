import { UserCog, Globe, AlertCircle, Bell } from "lucide-react";
import Image from "next/image";
import { Avatar } from "@/lib/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AvatarListProps {
  avatars: Avatar[];
  onSelectAvatar: (avatar: Avatar) => void;
}

const AvatarList = ({ avatars, onSelectAvatar }: AvatarListProps) => {
  const handleEditClick = (avatar: Avatar) => {
    if (avatar.userId === null) {
      toast.warning("Public Avatar", {
        description: "Public avatars cannot be edited.",
        duration: 3000,
        position: "top-right",
        icon: <Globe className="size-5 text-yellow-500" />,
      });
    } else {
      onSelectAvatar(avatar);
      // Your existing edit logic here
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Avatars</h3>
        <span className="text-sm text-muted-foreground">
          {avatars?.length} total
        </span>
      </div>
      <div className="grid gap-3">
        {avatars?.map((avatar, index) => (
          <button
            key={avatar.id}
            onClick={() => {
              if (avatar.userId) onSelectAvatar(avatar);
              else handleEditClick(avatar);
            }}
            className={`w-full text-left border border-1 p-4 transition-colors hover:bg-accent/50 focus:outline-none focus:bg-accent/50 ${
              !avatar.isActive ? "border-orange-300 dark:border-orange-700" : ""
            } ${
              avatar.simliFaceId === null
                ? "border-red-300 dark:border-red-700"
                : ""
            }`}
          >
            <div className="flex items-center">
              {/* Avatar Image with Status */}
              <div className="relative mr-4">
                <Image
                  src={avatar.avatarImage || "/default-avatar.png"}
                  alt={avatar.name}
                  width={100}
                  height={100}
                  className={`rounded-2xl size-[80px] sm:size-[80px] object-cover shadow-md dark:shadow-zinc-800/30 ${
                    !avatar.isActive ? "opacity-70" : ""
                  }`}
                />
                {avatar.isActive && (
                  <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-background" />
                )}
                {!avatar.isActive && (
                  <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-orange-500 ring-2 ring-background" />
                )}
                {avatar.userId === null && (
                  <div
                    className="absolute top-0 right-0 bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded-tr-2xl rounded-bl-lg"
                    title="Public Avatar"
                  >
                    Public
                  </div>
                )}
                {avatar.simliFaceId === null && (
                  <div className="absolute top-2 left-2">
                    <AlertCircle className="size-5 text-red-500 bg-background rounded-full p-0.5" />
                  </div>
                )}
              </div>
              {/* Avatar Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col space-y-2">
                    <h3 className="font-medium text-base truncate">
                      {avatar.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                        {avatar.role}
                      </span>
                      {!avatar.isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                          Inactive
                        </span>
                      )}
                      {avatar.simliFaceId === null && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
                          <Bell className="size-3" /> Action Required
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent button
                      handleEditClick(avatar);
                    }}
                  >
                    <UserCog className="size-4" />
                  </Button>
                </div>
                {avatar.isActive && (
                  <span className="text-xs text-green-500 mt-1">Active</span>
                )}
                {!avatar.isActive && (
                  <span className="text-xs text-orange-500 mt-1">
                    Activate to use this avatar
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AvatarList;
