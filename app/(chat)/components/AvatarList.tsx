// AvatarList.tsx
import { UserCog } from "lucide-react";
import Image from 'next/image';
import { Avatar } from '@/lib/db/schema';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AvatarListProps {
  avatars: Avatar[];
  onSelectAvatar: (avatar: Avatar) => void;
}

const AvatarList = ({ avatars, onSelectAvatar }: AvatarListProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold">Avatars</h3>
      <span className="text-sm text-muted-foreground">
        {avatars?.length} total
      </span>
    </div>
    <div className="grid gap-3">
      {avatars?.map((avatar) => (
               <Card
               onClick={() => onSelectAvatar(avatar)}
                 key={avatar.id} 
                 className="hover:bg-accent/50 transition-colors cursor-pointer"
               >
                 <CardContent className="p-4">
                   <div className="flex flex-1 gap-4  items-center">
                   <Image
             src={avatar.avatarImage || '/default-avatar.png'}
             alt={avatar.name}
         width={48}
         height={48}
             className="rounded-full object-cover min-w-[48px] min-h-[48px]"
           />
                     <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-start gap-2">
                         <div>
                           <h3 className="font-medium text-base sm:text-lg truncate">{avatar.name}</h3>
                           <p className="text-sm text-muted-foreground">{avatar.role}</p>
                         </div>
                         <Button variant="ghost" size="sm" className="shrink-0">
                           <UserCog className="size-4" />
                         </Button>
                       </div>
                       
                       <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                         <p className="truncate">
                           <span className="text-muted-foreground">Voice:</span> {avatar.openaiVoice}
                         </p>
                         
                         <p className="truncate">
                           <span className="text-muted-foreground">Face ID:</span> {avatar.simliFaceId}
                         </p>
                         {/* {avatar.lastMessageTime && (
                           <p className="truncate text-muted-foreground">
                             Last active: {avatar.lastMessageTime}
                           </p>
                         )} */}
                       </div>
                     </div>
                   </div>
                 </CardContent>
               </Card>
      ))}
    </div>
  </div>
);


export default AvatarList