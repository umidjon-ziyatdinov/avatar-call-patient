'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { memo } from 'react';
import { 
  HomeIcon, 
  UsersIcon, 
  SettingsIcon, 
  LayoutDashboardIcon,
  MessagesSquareIcon,
  BoxIcon
} from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

type SidebarItemType = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const sidebarGroups = [
  {
    groupName: 'Avatars',
    items: [
      {
        label: 'Avatar',
        href: '/admin',
        icon: <LayoutDashboardIcon className="w-4 h-4" />
      },
      
    ]
  },
  {
    groupName: 'Management',
    items: [
      {
        label: 'Users',
        href: '/users',
        icon: <UsersIcon className="w-4 h-4" />
      },
      {
        label: 'Messages',
        href: '/admin/messages',
        icon: <MessagesSquareIcon className="w-4 h-4" />
      }
    ]
  },
 
];

const PureSidebarItem = ({
  item,
  isActive,
  setOpenMobile,
}: {
  item: SidebarItemType;
  isActive: boolean;
  setOpenMobile: (open: boolean) => void;
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link 
          href={item.href} 
          onClick={() => setOpenMobile(false)}
          className="flex items-center gap-3"
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarItem = memo(PureSidebarItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false;
  return true;
});

export function AdminSidebarContent() {
  const { setOpenMobile } = useSidebar();
const pathname = usePathname();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {sidebarGroups.map((group, groupIndex) => (
              <div key={group.groupName}>
                <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-6 first:mt-0">
                  {group.groupName}
                </div>
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.href}
                    item={item}
                    isActive={item.href === (pathname as string)}
                    setOpenMobile={setOpenMobile}
                  />
                ))}
              </div>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}