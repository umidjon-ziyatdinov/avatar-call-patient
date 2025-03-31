"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User2, Shield, Clock, Settings, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";

import { Avatar } from "@/lib/db/schema";
import Image from "next/image";
import { MobileNavigation } from "@/components/layout/BottomNavigation";

interface AuthResponse {
  success: boolean;
  user?: {
    role: string;
    name: string;
    id: string;
  };
  error?: string;
}

const ChatList = ({
  avatars,
  onSelectAvatar,
}: {
  avatars: Avatar[];
  onSelectAvatar: (id: string) => void;
}) => {
  return (
    <div className="flex flex-col w-full">
      {avatars.map((avatar, index) => (
        <button
          key={avatar.id}
          onClick={() => onSelectAvatar(avatar.id)}
          className="w-full text-left transition-colors hover:bg-accent/50 focus:outline-none focus:bg-accent/50"
        >
          <div
            className={`flex items-center p-4 ${
              index !== avatars.length - 1 ? "border-b border-border/40" : ""
            }`}
          >
            {/* Avatar Image with Status */}
            <div className="relative mr-4">
              <Image
                src={avatar.avatarImage || "/default-avatar.png"}
                alt={avatar.name}
                width={100}
                height={100}
                className="rounded-2xl size-[80px] sm:size-[80px] object-cover shadow-md dark:shadow-zinc-800/30"
              />
              {avatar.isActive && (
                <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-background" />
              )}
            </div>

            {/* Avatar Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-base truncate">
                  {avatar.name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                  {avatar.role}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {avatar.about || "Hey there! I'm here to chat."}
              </p>
              {avatar.isActive && (
                <span className="text-xs text-green-500 mt-1">
                  Available now
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default function HomePage() {
  const router = useRouter();
  const { data: avatars, isLoading } = useSWR<Avatar[]>("/api/avatar", fetcher);

  const handleSelectAvatar = (avatarId: string) => {
    router.push(`/app/chat/${avatarId}`);
  };

  return (
    <>
      <div className="h-full bg-background flex flex-col items-center py-4 px-2 sm:px-4">
        <div className="w-full max-w-2xl bg-card rounded-lg shadow-sm dark:shadow-primary/5 overflow-hidden">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !avatars?.length ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 p-4">
              <p className="text-lg font-medium">No chats available</p>
              <p className="text-sm text-muted-foreground">
                Please contact an administrator to set up avatars.
              </p>
            </div>
          ) : (
            <ChatList avatars={avatars} onSelectAvatar={handleSelectAvatar} />
          )}
        </div>
      </div>
      <MobileNavigation />
    </>
  );
}
