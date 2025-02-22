import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Phone, Video, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface ChatControlsProps {
  isLoading?: boolean;
  onVideoCall: () => void;
  onAudioCall: () => void;
  onCancel?: () => void;
}

const ChatControls = ({ 
  isLoading, 
  onVideoCall, 
  onAudioCall,
  onCancel 
}: ChatControlsProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full border-t dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60 shadow-lg">
      <div className="container flex items-center justify-center gap-3 py-3 px-4 md:py-4 md:gap-4 max-w-2xl mx-auto">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onAudioCall}
                disabled={isLoading}
                variant="outline"
                size="lg"
                className="h-12 w-auto md:h-14 md:w-auto rounded-full border-2 hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/20 transition-all duration-200 ease-in-out dark:border-gray-700 dark:hover:border-primary"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin" />
                ) : (
                  <Phone className="h-5 w-5 md:h-6 md:w-6" />
                )}
                <span >Audio call</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="dark:bg-gray-800 dark:text-gray-100">
              <p>Start audio call</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onVideoCall}
                disabled={isLoading}
                size="lg"
                className="h-12 w-auto md:h-14 md:w-auto rounded-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 transition-all duration-200 ease-in-out text-primary-foreground shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin" />
                ) : (
                  <Video className="h-5 w-5 md:h-6 md:w-6" />
                )}
                <span > Video call</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="dark:bg-gray-800 dark:text-gray-100">
              <p>Start video call</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {isLoading && onCancel && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onCancel}
                  variant="destructive"
                  size="lg"
                  className="h-12 w-12 md:h-14 md:w-14 rounded-full transition-all duration-200 ease-in-out"
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="sr-only">Cancel call</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="dark:bg-gray-800 dark:text-gray-100">
                <p>Cancel call</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default ChatControls;