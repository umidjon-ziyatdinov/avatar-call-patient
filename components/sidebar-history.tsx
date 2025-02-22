// @ts-nocheck
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { memo } from 'react';
import useSWR from 'swr';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar } from '@/lib/db/schema';
import { fetcher } from '@/lib/utils';

const PureAvatarItem = ({
  avatar,
  isActive,
  setOpenMobile,
}: {
  avatar: Avatar;
  isActive: boolean;
  setOpenMobile: (open: boolean) => void;
}) => {
  return (
    <SidebarMenuItem  className='w-full'>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link 
          href={`/chat/${avatar.id}`} 
          onClick={() => setOpenMobile(false)}
          className="flex items-center  py-2 overflow-visible h-full"
        >
          <div className="relative">
            <img
              src={avatar.avatar}
              alt={avatar.name}
              className="size-10 rounded-full object-cover"
            />
            <div 
              className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-sidebar bg-green-500 ${
                avatar.openaiModel.includes('gpt-4') ? 'bg-purple-500' : 'bg-blue-500'
              }`}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{avatar.name}</span>
              <span className="text-xs text-sidebar-foreground/50">
                {avatar.openaiVoice}
              </span>
            </div>
            <span className="text-sm text-sidebar-foreground/70 truncate">
              {avatar.role}
            </span>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const AvatarItem = memo(PureAvatarItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false;
  return true;
});

export function SidebarAvatars() {
  const { setOpenMobile } = useSidebar();
  const { id } = useParams();

  const {
    data: avatarList,
    isLoading,
  } = useSWR<Array<Avatar>>('/api/avatar', fetcher, {
    fallbackData: [],
  });

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex flex-col gap-4 p-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 animate-pulse"
              >
                <div className="size-10 rounded-full bg-sidebar-accent-foreground/10" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-sidebar-accent-foreground/10 rounded mb-2" />
                  <div className="h-3 w-32 bg-sidebar-accent-foreground/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (!avatarList || avatarList.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-4 py-8 text-center">
            <div className="text-sm font-medium text-sidebar-foreground/70">
              No avatars found
            </div>
            <div className="text-xs text-sidebar-foreground/50 mt-1">
              Create an avatar to get started
            </div>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className=' h-auto '>
          {avatarList.map((avatar) => (
            <AvatarItem
              key={avatar.id}
              avatar={avatar}
              isActive={avatar.id === id}
              setOpenMobile={setOpenMobile}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}