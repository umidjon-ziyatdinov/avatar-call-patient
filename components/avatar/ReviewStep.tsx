import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  PersonStanding,
  Calendar,
  MessageSquare,
  Mic,
  Brain,
  MessageCircle,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";

// Update AvatarData interface to include all the fields
interface PersonalityTraits {
  memoryEngagement: number;
  anxietyManagement: number;
  activityEngagement: number;
  socialConnection: number;
}

interface PersonalizationQuestion {
  question: string;
  answer: string;
}

export interface AvatarData {
  name: string;
  role: string;
  about: string;
  age: string | number;
  sex: string;
  avatar?: File;
  personality: PersonalityTraits;
  promptAnswers?: PersonalizationQuestion[];
  initialPrompt?: string;
  openaiVoice?: string;
}

// Review Step Component
const ReviewStep: React.FC<{
  data: AvatarData;
  prevStep: () => void;
  handleSubmit: () => void;
}> = ({ data, prevStep, handleSubmit }) => {
  // Voice details based on the voiceId
  const voiceDetails: Record<string, { gender: string; description: string }> =
    {
      alloy: { gender: "Male", description: "Balanced and clear" },
      ash: { gender: "Male", description: "Deep and thoughtful" },
      ballad: { gender: "Female", description: "Soft and melodic" },
      coral: { gender: "Female", description: "Warm and friendly" },
      echo: { gender: "Male", description: "Confident and direct" },
      sage: { gender: "Male", description: "Calm and measured" },
      shimmer: { gender: "Female", description: "Bright and expressive" },
      verse: { gender: "Female", description: "Gentle and soothing" },
    };

  const selectedVoice = data.openaiVoice || "alloy";

  return (
    <div className="relative pb-20 min-h-screen">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Review Your Avatar</h2>
          <p className="text-muted-foreground">
            Please review all the information before creating your avatar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Basic Info */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col items-center space-y-4">
                {data.avatar ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(data.avatar)}
                      alt="Avatar Preview"
                      className="w-48 h-48 rounded-full object-cover border-4 border-primary shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-full bg-muted flex items-center justify-center border-4 border-primary shadow-lg">
                    <PersonStanding className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
                <h3 className="text-xl font-bold">{data.name}</h3>
                <Badge variant="outline" className="px-3 py-1">
                  {data.role}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex gap-2 items-center text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Age:</span>
                  <span className="ml-auto">{data.age} years</span>
                </div>

                <div className="flex gap-2 items-center text-sm">
                  <PersonStanding className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Gender:</span>
                  <span className="ml-auto">{data.sex}</span>
                </div>

                <div className="flex gap-2 items-center text-sm">
                  <Mic className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Voice:</span>
                  <span className="ml-auto">
                    {selectedVoice.charAt(0).toUpperCase() +
                      selectedVoice.slice(1)}{" "}
                    ({voiceDetails[selectedVoice]?.gender})
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">About</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {data.about || "No description provided."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Middle & Right Column - Personality & Personalization */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6 space-y-6">
              {/* Personality Traits */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Personality Traits</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(data.personality).map(([trait, value]) => (
                    <div key={trait} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {trait
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </span>
                        <span className="text-sm bg-accent px-2 py-1 rounded">
                          {value}
                        </span>
                      </div>
                      <Progress value={value} max={100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Initial Prompt */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Initial Greeting</h3>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm italic">
                    {data.initialPrompt || "No initial greeting provided."}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Personalization Questions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">
                    Personalization Details
                  </h3>
                </div>

                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {data.promptAnswers && data.promptAnswers.length > 0 ? (
                    data.promptAnswers.map((promptData, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-2 bg-accent/30"
                      >
                        <p className="font-medium text-sm">
                          {promptData.question}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {promptData.answer}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No personalization questions answered.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Edit Details
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-6"
        >
          Create Avatar
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
