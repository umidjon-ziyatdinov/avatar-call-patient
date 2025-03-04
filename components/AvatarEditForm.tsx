// @ts-nocheck
"use client";
import { useCallback, useEffect, useState } from "react";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Upload, Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, fetcher } from "@/lib/utils";
import { InteractionPrompts, OpenAIVoices, OpenAIModels } from "@/types/enums";
import { Avatar } from "@/lib/db/schema";
import { SubmitButton } from "./submit-button";
import { toast } from "sonner";
import LoadingOverlay from "./LoadingOverlay";
import StatusMessage from "./StatusMessage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

import useSWR from "swr";
import MobileVideoChat from "@/app/(chat)/components/mobile-videochat";

interface AvatarFormProps {
  avatar?: Avatar;
  onClose: () => void;
  setAvatar?: (value: Avatar) => void;
  createEndpoint?: string;
}
// Type for prompt
type Prompt = {
  id: string;
  question: string;
};

// Type for prompt answer
type PromptAnswer = {
  promptId: string;
  question: string;
  answer: string;
};

const OpenAIVoiceGenders: Record<(typeof OpenAIVoices)[number], string> = {
  alloy: "Male",
  ash: "Male",
  ballad: "Female",
  coral: "Female",
  echo: "Male",
  sage: "Male",
  shimmer: "Female",
  verse: "Female",
};

export function AvatarForm({
  avatar,
  onClose,
  setAvatar,
  createEndpoint = "/api/avatar",
}: AvatarFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    avatar?.avatarImage || null
  );

  // New state for prompts
  const {
    data: availablePrompts,
    isLoading: promptLoading,
    mutate: refetchPrompts,
  } = useSWR<Prompt[]>("/api/avatar/prompt", fetcher);
  const [selectedPrompts, setSelectedPrompts] = useState<PromptAnswer[]>(
    avatar?.promptAnswers || []
  );

  // const pathname = usePathname();
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [personalityValues, setPersonalityValues] = useState({
    memoryEngagement: avatar?.personality?.memoryEngagement || 50,
    anxietyManagement: avatar?.personality?.anxietyManagement || 50,
    activityEngagement: avatar?.personality?.activityEngagement || 50,
    socialConnection: avatar?.personality?.socialConnection || 50,
  });

  const handleAnswerChange = (index: number, answer: string) => {
    setSelectedPrompts((prev) => {
      const newPrompts = [...prev];
      if (newPrompts[index]) {
        newPrompts[index] = {
          ...newPrompts[index],
          answer,
        };
      }
      return newPrompts;
    });
  };

  // Replace the existing handlePromptSelect function with this updated version
  const handlePromptSelect = (index: number, promptId: string) => {
    console.log("data", index, "promptId", promptId);
    const prompt = availablePrompts?.find((p) => p.id === promptId);
    if (!prompt) return;

    setSelectedPrompts((prev) => {
      const newPrompts = [...prev];
      // Ensure the array has the correct length and preserve existing answers
      while (newPrompts.length <= index) {
        newPrompts.push({ promptId: 0, question: "", answer: "" });
      }
      // Preserve the existing answer if the same prompt is selected
      const existingAnswer =
        newPrompts[index]?.promptId === prompt.id
          ? newPrompts[index]?.answer
          : "";
      newPrompts[index] = {
        promptId: prompt.id,
        question: prompt.question,
        answer: existingAnswer,
      };
      return newPrompts;
    });
  };
  const generateFace = useCallback(async () => {
    if (!avatar?.id || avatar.isActive || !avatar.simliCharacterId) return;

    try {
      setIsLoading(true);
      setLoadingMessage("Generating avatar face...");

      const avatarResponse = await fetch(
        `/api/avatar/${avatar.id}/generate-face`
      );
      const responseData = await avatarResponse.json();

      if (avatarResponse.status === 202) {
        // Processing state
        setIsLoading(false);
        setLoadingMessage("");
        toast.warning("Face Generation In Progress", {
          description: responseData.message,
          duration: 10000, // 10 seconds for processing message
          action: {
            label: "Try Again",
            onClick: () => generateFace(),
          },
        });
        return;
      }

      if (!avatarResponse.ok) {
        throw new Error(responseData.error || "Failed to generate face");
      }

      setAvatarPreview(responseData.avatarImage);
      setAvatar(responseData);
      toast.success("Face Generated Successfully", {
        description:
          "Your avatar face has been generated successfully. You can now test your avatar.",
        duration: 5000, // 5 seconds for success message
      });
    } catch (error) {
      console.error("Error generating face:", error);
      toast.error("Face Generation Failed", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate avatar face",
        duration: 8000, // 8 seconds for error messages
        // action: {
        //   label: 'Try Again',
        //   onClick: () => generateFace()
        // }
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  }, [avatar]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (avatar) return;
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalityChange = (trait: string, value: number[]) => {
    setPersonalityValues((prev) => ({
      ...prev,
      [trait]: value[0],
    }));
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      let endpoint = avatar ? `/api/avatar/${avatar.id}` : "/api/avatar";

      // Validate required fields
      const requiredFields = [
        "name",
        "role",
        "about",
        "age",
        "sex",
        "initialPrompt",
      ];
      for (const field of requiredFields) {
        if (!formData.get(field)) {
          throw new Error(
            `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
          );
        }
      }

      if (avatar) {
        setLoadingMessage("Updating avatar details...");
        const jsonData = {
          name: formData.get("name"),
          role: formData.get("role"),
          about: formData.get("about"),
          age: formData.get("age"),
          sex: formData.get("sex"),
          education: formData.get("education"),
          work: formData.get("work"),
          promptAnswers: selectedPrompts,
          initialPrompt: formData.get("initialPrompt"),
          personality: personalityValues,
          openaiVoice: formData.get("openaiVoice"),
          openaiModel: formData.get("openaiModel"),
          avatarImage: avatar.avatarImage,
        };

        const response = await fetch(endpoint, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        });

        if (!response.ok) {
          throw new Error("Failed to update avatar");
        }

        toast.success("Avatar Updated", {
          description: "Your avatar has been successfully updated",
        });

        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        if (!avatarFile) {
          throw new Error("Avatar image is required");
        }

        const newFormData = new FormData();
        formData.forEach((value, key) => {
          if (!key.startsWith("personality.")) {
            newFormData.append(key, value);
          }
        });

        newFormData.append("personality", JSON.stringify(personalityValues));
        newFormData.append("avatarFile", avatarFile);

        setLoadingMessage("Uploading image and creating your avatar...");
        const response = await fetch(endpoint, {
          method: "POST",
          body: newFormData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create avatar");
        }

        const result = await response.json();

        if (result.simli?.characterId) {
          toast.success("Avatar Created Successfully", {
            description:
              "Your avatar is being processed. The face generation has been queued and will be ready shortly.",
          });
        }

        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving avatar:", error);
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to save avatar",
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  // Action buttons for editing mode
  const renderActionButtons = () => {
    if (!avatar) return null;

    return (
      <div className="flex gap-2  w-full max-w-full">
        {!avatar.isActive && !avatar.simliFaceId && (
          <Button
            onClick={generateFace}
            className="bg-blue-500 hover:bg-blue-600 text-white animate-pulse"
            size="sm"
            disabled={isLoading}
          >
            Generate Face
          </Button>
        )}
        <Button
          onClick={() => setIsTestDialogOpen(true)}
          variant="outline"
          disabled={isLoading || !avatar.isActive || !avatar.simliFaceId}
        >
          Test Avatar
        </Button>
        {/* <Button
          onClick={async () => {
            try {
              const response = await fetch(`/api/avatar/${avatar.id}/deactivate`, {
                method: 'POST'
              });
              if (!response.ok) throw new Error('Failed to deactivate avatar');
              toast.success('Avatar Deactivated');
              router.refresh();
            } catch (error) {
              toast.error('Failed to deactivate avatar');
            }
          }}
          variant="destructive"
          disabled={isLoading}
        >
          Deactivate
        </Button> */}
      </div>
    );
  };

  return (
    <>
      {isLoading && <LoadingOverlay message={loadingMessage} />}

      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent className="flex w-full max-w-full flex-col  h-svh">
          <DialogHeader className="h-auto">
            <DialogTitle>Test Avatar</DialogTitle>
          </DialogHeader>
          <div className="flex-grow-1 h-full z-50">
            {avatar ? (
              <MobileVideoChat
                className="z-50"
                avatar={avatar}
                onBack={() => {
                  setIsTestDialogOpen(false);
                }}
              />
            ) : (
              <p className="text-center">Avatar Not found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {avatar && (
        <Card className="p-2 pb: 0 flex justify-start items-center mx-4">
          {renderActionButtons()}
        </Card>
      )}
      <Form action={handleSubmit} className="w-full max-w-full  px-4">
        <Card className="p-2 space-y-6">
          {/* Header Section with Image Upload */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/3 space-y-4">
              <div className="relative mx-auto sm:mx-0">
                <img
                  src={avatarPreview || "/images/default-profile.png"}
                  alt="Avatar preview"
                  className="w-40 h-40 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-700 mx-auto sm:mx-0"
                />
                {avatarPreview && !avatar && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPreview(null);
                      setAvatarFile(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
                {!avatar && (
                  <>
                    <Input
                      type="file"
                      name="avatarImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="avatar-upload"
                      disabled={isLoading}
                      required
                    />
                    <label
                      htmlFor="avatar-upload"
                      className={cn(
                        "mt-4 flex justify-center cursor-pointer items-center gap-2",
                        "rounded-md border px-4 py-2 hover:bg-accent transition-colors",
                        "text-sm font-medium w-full",
                        isLoading && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <Upload className="size-4" />
                      {avatarPreview ? "Change Image" : "Upload Image"}
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={avatar?.name}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  name="role"
                  defaultValue={avatar?.role}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About *</Label>
                <Textarea
                  id="about"
                  name="about"
                  defaultValue={avatar?.about}
                  required
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                name="age"
                type="number"
                defaultValue={avatar?.age}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Sex *</Label>
              <Select name="sex" defaultValue={avatar?.sex} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Input
                id="education"
                name="education"
                defaultValue={avatar?.education}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="work">Work</Label>
              <Input id="work" name="work" defaultValue={avatar?.work} />
            </div>
          </div>

          {/* Initial Prompt */}
          <div className="space-y-2">
            <Label htmlFor="initialPrompt">Initial Prompt *</Label>
            <Textarea
              id="initialPrompt"
              name="initialPrompt"
              defaultValue={avatar?.initialPrompt}
              required
              rows={3}
            />
          </div>

          {/* Interaction Prompts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Interaction Prompts *</h3>
            {/* Prompts */}

            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-4 w-full">
                <div className="flex flex-col gap-2 max-w-full relative w-full [&_.select-trigger]:whitespace-normal [&_.select-trigger]:break-words [&_.select-trigger]:min-h-[60px] [&_.select-content]:break-words [&_.select-content]:whitespace-normal">
                  <Label>Prompt {index + 1}</Label>
                  <Select
                    onValueChange={(value) => handlePromptSelect(index, value)}
                    value={selectedPrompts[index]?.promptId}
                  >
                    <SelectTrigger className="max-w-full py-2">
                      <SelectValue
                        placeholder={`Select prompt ${index + 1}`}
                        className="max-w-full py-4 h-auto"
                      >
                        {selectedPrompts[index] && (
                          <span className="max-w-full py-2 line-clamp-2 whitespace-pre-line break-words text-left">
                            {selectedPrompts[index].question}
                          </span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-w-[350px] w-full line-clamp-2 whitespace-pre-line break-words text-left">
                      {availablePrompts?.map((prompt, index) => (
                        <SelectItem
                          key={prompt.id}
                          className="max-w-full line-clamp-2 whitespace-pre-line break-words text-left"
                          value={prompt.id}
                        >
                          <span className=" max-w-full line-clamp-2 whitespace-pre-line break-words text-left min-h-[2.5rem]">
                            {index + 1}. {prompt.question}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Textarea
                    value={selectedPrompts[index]?.answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Enter your answer..."
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Personality Traits */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Personality Traits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(personalityValues).map(([trait, value]) => (
                <div key={trait} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base">
                      {trait.split(/(?=[A-Z])/).join(" ")}
                    </Label>
                    <span className="text-sm bg-accent px-2 py-1 rounded">
                      {value}
                    </span>
                  </div>
                  <Slider
                    name={`personality.${trait}`}
                    value={[value]}
                    max={100}
                    step={1}
                    onValueChange={(newValue) =>
                      handlePersonalityChange(trait, newValue)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* OpenAI Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="openaiVoice">Voice</Label>
                <Select name="openaiVoice" defaultValue={avatar?.openaiVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {OpenAIVoices.map((voice) => (
                      <SelectItem key={voice} value={voice}>
                        {`${voice.charAt(0).toUpperCase() + voice.slice(1)} - ${
                          OpenAIVoiceGenders[voice]
                        }`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="openaiModel">Model</Label>
                <Select name="openaiModel" defaultValue={avatar?.openaiModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {OpenAIModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <SubmitButton
              className="min-w-[150px]"
              isLoading={isLoading}
              loadingText={avatar ? "Updating..." : "Creating..."}
            >
              {avatar ? "Update Avatar" : "Create Avatar"}
            </SubmitButton>
          </div>
        </Card>
      </Form>
    </>
  );
}
