"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Video, Mic, Settings2, Send, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar as AvatarComponent, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import type { Avatar, User } from "@/lib/db/schema";
import PersonalizedChatInterface from "../../components/ChatBody";
import AvatarProfileSheet from "../../components/AvatarProfile";
import ChatScreen from "../../components/chat-screen";


export default function ChatPage({ avatarId }: { avatarId: string }) {
  const router = useRouter();
  const { data: avatar, isLoading, mutate: refetchAvatars } = useSWR<Avatar>(
    `/api/avatar/${avatarId}`,
    fetcher
  );

  const { data: patient, isLoading: patientLoading, mutate } = useSWR<User>(
    `/api/patient`,
    fetcher
  );
  const handleBack = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!avatar) return null;

  return (
    <div className="flex h-full flex-col  w-full bg-background px-0">
      {/* Header */}
      <Card className="rounded-none border-x-0 border-t-0 mx-0 px-0">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="rounded-full lg:hidden"
                  >
                    <ArrowLeft className="size-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Return to avatar selection</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex items-center gap-4">
              <AvatarComponent className="size-16 ring-2 ring-primary/20">
                <AvatarImage
                  src={avatar.avatarImage || ""}
                  alt={avatar.name}
                  className="object-cover"
                />
                <AvatarFallback>{avatar.name.slice(0, 2)}</AvatarFallback>
              </AvatarComponent>
              <div>
                <h1 className="text-2xl font-semibold">{avatar.name}</h1>
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-green-500" />
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
         

   

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full mr-2">
                  <SlidersHorizontal className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle> About  Me</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                <AvatarProfileSheet avatar={avatar} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Card>
<PersonalizedChatInterface avatar={avatar} patientDetails={patient}/>
      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <Card className="h-full rounded-none border-x-0">
          <div className="flex h-full justify-center">
            <ChatScreen avatar={avatar} onBack={handleBack} />
          </div>
        </Card>
      </div>

    
      {/* <Card className="rounded-none border-x-0 border-b-0">
        <div className="flex items-center gap-2 p-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Mic className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voice message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Input
            className="rounded-full bg-muted/50"
            placeholder="Type your message..."
          />

          <Button size="icon" className="rounded-full">
            <Send className="size-5" />
          </Button>
        </div>
      </Card> */}
    </div>
  );
}