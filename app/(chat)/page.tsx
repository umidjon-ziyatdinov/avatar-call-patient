"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { User2, Shield, Clock, Settings, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";

import { Avatar } from '@/lib/db/schema';
import Image from 'next/image';




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
  onSelectAvatar 
}: { 
  avatars: Avatar[], 
  onSelectAvatar: (id: string) => void 
}) => {
  return (
    <div className="grid gap-4 w-full max-w-full px-0 sm:px-6">
      {avatars.map((avatar) => (
        <button
          key={avatar.id}
          onClick={() => onSelectAvatar(avatar.id)}
          className="w-full text-left  rounded-lg"
        >
          <Card className="transform transition-all rounded-none border-x-0 duration-200   hover:shadow-lg dark:hover:shadow-primary/20">
            <div className="flex items-center p-4 sm:p-6 gap-6 sm:gap-6">
              {/* Larger Avatar Image with Status */}
              <div className="relative flex-shrink-0">
                <Image
                  src={avatar.avatarImage || '/default-avatar.png'}
                  alt={avatar.name}
                  width={100}
                  height={100}
                  className="rounded-2xl size-[80px] sm:size-[80px] object-cover shadow-md dark:shadow-zinc-800/30"
                />
                {avatar.isActive && (
                  <div className="absolute -bottom-1 -right-1">
                    <span className="flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                    </span>
                  </div>
                )}
              </div>

              {/* Avatar Info - Simplified for Patients */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1">
                  <h2 className="font-bold text-xl sm:text-xl truncate text-foreground">
                    {avatar.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20">
                      {avatar.role}
                    </span>
                    {avatar.isActive && (
                      <span className="text-sm text-muted-foreground">
                        Available now
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {avatar.about || "Hey there! I'm here to chat."}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </button>
      ))}
    </div>
  );
};




export default function HomePage() {
  const router = useRouter();

  const { data: avatars, isLoading } = useSWR<Avatar[]>("/api/avatar", fetcher);


  const handleSelectAvatar = (avatarId: string) => {
    router.push(`/chat/${avatarId}`);
  };


  return (
    <>
      
      <div className="h-full bg-background pb-4 w-full  flex flex-col items-center justify-start  mx-auto">
        <div  className="w-full  max-w-3xl">
         
          
          
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : !avatars?.length ? (
              <div className="flex h-40 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed">
                <p className="text-xl font-medium">No avatars available</p>
                <p className="text-sm text-muted-foreground">Please contact an administrator to set up avatars.</p>
              </div>
            ) : (
              <ChatList avatars={avatars} onSelectAvatar={handleSelectAvatar} />
            )}
  
          
  
        </div>
      </div>
    
    </>
  );
}