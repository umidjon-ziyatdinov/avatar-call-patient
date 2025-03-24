// @ts-nocheck
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar as avatarProps } from "@/lib/db/schema";
import { Brain, Heart, Users, Zap } from "lucide-react";

export default function AvatarProfileSheet({ avatar }) {
  const personalityTraits = [
    {
      name: "Memory Engagement",
      value: avatar.personality.memoryEngagement,
      icon: <Brain className="size-4" />,
    },
    {
      name: "Anxiety Management",
      value: avatar.personality.anxietyManagement,
      icon: <Heart className="size-4" />,
    },
    {
      name: "Activity Engagement",
      value: avatar.personality.activityEngagement,
      icon: <Zap className="size-4" />,
    },
    {
      name: "Social Connection",
      value: avatar.personality.socialConnection,
      icon: <Users className="size-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Avatar Header */}
      <div className="flex flex-col items-center">
      <div className="relative size-full overflow-hidden rounded-xl">
              <img
                src={avatar.avatarImage}
                alt={avatar.name}
                className="size-full object-cover transition-transform duration-300 hover:scale-105"
              />
              {!avatar.avatarImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted text-2xl font-semibold">
                  {avatar.name.slice(0, 2)}
                </div>
              )}
            </div>
        <h2 className="mt-4 text-2xl font-semibold">{avatar.name}</h2>
        <Badge variant="secondary" className="mt-2">
          {avatar.role}
        </Badge>
      </div>

      {/* Basic Info */}
      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm leading-relaxed">{avatar.about}</p>
      </div>

      {/* Personal Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <p className="text-muted-foreground">Age</p>
          <p className="font-medium">{avatar.age} years</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Gender</p>
          <p className="font-medium">{avatar.sex}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Education</p>
          <p className="font-medium">{avatar.education}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">Occupation</p>
          <p className="font-medium">{avatar.work}</p>
        </div>
      </div>

      {/* Personality Traits */}
      <div className="space-y-4">
        <h3 className="font-semibold">Personality Traits</h3>
        <div className="space-y-3">
          {personalityTraits.map((trait) => (
            <div key={trait.name} className="space-y-1.5">
              <div className="flex items-center gap-2">
                {trait.icon}
                <span className="text-sm">{trait.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={trait.value} className="flex-1" />
                <span className="text-sm text-muted-foreground">
                  {trait.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}