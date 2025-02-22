'use client';
import Link from 'next/link';
import { memo, useTransition } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { Moon, Sun, ShieldCheck, User, LogOut, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useSidebar } from './ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { User as UserType } from '@/lib/db/schema';

interface ChatHeaderProps {
  isAdmin: boolean;
  userInitials: string;
  userDetails?: UserType,
  signOutAction: () => Promise<{ success: boolean; error?: string }>;
}

function PureChatHeader({ isAdmin, userInitials, userDetails, signOutAction }: ChatHeaderProps) {
  console.log('userDetails', userDetails);
  const { theme, setTheme } = useTheme();

  const { width: windowWidth } = useWindowSize();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignOut = () => {
    startTransition(async () => {
      const result = await signOutAction();
      window.location.reload();
      if (result.success) {
        router.push('/login');
      }
    });
  };

  return (
    <header className="sticky top-0 flex items-center  justify-between bg-background px-2 py-1.5 md:px-2 z-10">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="size-9 rounded-md hover:bg-accent"
            >
              <Sun className="size-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle theme</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2">
    
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative size-9"
              disabled={isPending}
            >
              <Avatar className="size-8">
              {userDetails && <AvatarImage src={userDetails.profilePicture || '/images/default-profile.png'} alt={userDetails.name}/>}
                <AvatarFallback className="bg-primary/10">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
   
      
      
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="text-red-600 dark:text-red-400"
              disabled={isPending}
            >
              <LogOut className="mr-2 size-4" />
              {isPending ? 'Signing out...' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader);