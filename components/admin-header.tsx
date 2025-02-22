'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';
import { useTheme } from 'next-themes';
import { LogOut, Moon, Sun, User } from 'lucide-react';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useSidebar } from './ui/sidebar';
import Link from 'next/link';

function PureAdminHeader() {
  const router = useRouter();
  const { open } = useSidebar();
  const { width: windowWidth } = useWindowSize();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-background border-b">
      {/* Sidebar Toggle */}
      <div className="flex items-center gap-2">
        <SidebarToggle />
          {/* Theme Toggle */}
          <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle Theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Theme</TooltipContent>
        </Tooltip>
      </div>

      {/* Actions: Patient View & Theme Toggle */}
      <div className="flex items-center gap-4">
        {/* Go to Patient View */}
        <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="outline"
                className="ml-auto  gap-2 md:flex"
              >
                <Link href="/">
                  <LogOut className="size-4" />
                  <span>Patient View</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go Back to Patients View</p>
            </TooltipContent>
          </Tooltip>

  
      </div>
    </header>
  );
}

export const AdminHeader = memo(PureAdminHeader);
