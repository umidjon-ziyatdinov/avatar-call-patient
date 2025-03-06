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
import {
  Upload,
  Loader2,
  Info,
  Check,
  Volume2,
  Trash2,
  Plus,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, fetcher } from "@/lib/utils";
import { InteractionPrompts, OpenAIVoices } from "@/types/enums";
import { Avatar } from "@/lib/db/schema";
import { SubmitButton } from "./submit-button";
import { toast } from "sonner";
import LoadingOverlay from "./LoadingOverlay";
import StatusMessage from "./StatusMessage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

import useSWR from "swr";
import MobileVideoChat from "@/app/(chat)/components/mobile-videochat";

// Voice descriptions - moved from PersonalizationScreen
const VoiceDescriptions = {
  alloy: "Balanced and clear",
  ash: "Deep and thoughtful",
  ballad: "Soft and melodic",
  coral: "Warm and friendly",
  echo: "Confident and direct",
  sage: "Calm and measured",
  shimmer: "Bright and expressive",
  verse: "Gentle and soothing",
};

// Gender mappings - moved and enhanced from original
const OpenAIVoiceGenders = {
  alloy: "Male",
  ash: "Male",
  ballad: "Female",
  coral: "Female",
  echo: "Male",
  sage: "Male",
  shimmer: "Female",
  verse: "Female",
};

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

// Basic Info Section Component
const BasicInfoSection = ({
  avatar,
  avatarPreview,
  setAvatarPreview,
  handleImageChange,
  setAvatarFile,
  isLoading,
}) => {
  return (
    <Card className="p-6 space-y-6 mb-6">
      <h2 className="text-xl font-bold border-b pb-2">Basic Information</h2>

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
              placeholder="Enter avatar's name"
            />
            <p className="text-xs text-gray-500">
              This is how your avatar will be identified in conversations
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              name="role"
              defaultValue={avatar?.role}
              required
              placeholder="E.g., Family member, Friend, Caregiver"
            />
            <p className="text-xs text-gray-500">
              Define the avatar's relationship or role
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About *</Label>
            <Textarea
              id="about"
              name="about"
              defaultValue={avatar?.about}
              required
              rows={3}
              placeholder="Brief description of this avatar's background and purpose"
            />
            <p className="text-xs text-gray-500">
              A brief description that helps establish this avatar's identity
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            name="age"
            type="number"
            defaultValue={avatar?.age}
            required
            placeholder="Enter age"
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
            placeholder="Educational background"
          />
          <p className="text-xs text-gray-500">
            Optional: Adds depth to the avatar's background
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="work">Work</Label>
          <Input
            id="work"
            name="work"
            defaultValue={avatar?.work}
            placeholder="Occupation or profession"
          />
          <p className="text-xs text-gray-500">
            Optional: Helps build the avatar's identity
          </p>
        </div>
      </div>
    </Card>
  );
};

// Initial Prompt Section Component
const InitialPromptSection = ({
  initialPrompt,
  handleInitialPromptChange,
  setIsPersonalityHelpOpen,
}) => {
  return (
    <Card className="p-6 space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Initial Greeting</h2>
        <Button
          size="sm"
          type="button"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            setIsPersonalityHelpOpen(true);
          }}
        >
          <Info className="h-4 w-4 mr-2" /> Help
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Add a custom greeting that your avatar will use when starting
          conversations. This sets the tone for your interactions.
        </p>
        <Textarea
          id="initialPrompt"
          name="initialPrompt"
          placeholder="E.g., 'Hi Mom! It's so good to see you today. How are you feeling?'"
          value={initialPrompt}
          onChange={handleInitialPromptChange}
          rows={3}
          className="placeholder-gray-400"
          required
        />
        <p className="text-xs text-gray-500">
          This greeting should reflect the avatar's personality and relationship
          with the user
        </p>
      </div>
    </Card>
  );
};

// Voice Selection Component
const VoiceSelectionSection = ({ selectedVoice, handleVoiceChange }) => {
  return (
    <Card className="p-6 space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Avatar Voice</h2>
        <Button
          size="sm"
          type="button"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            // Play voice sample functionality would go here
            alert(`This would play a sample of the ${selectedVoice} voice`);
          }}
        >
          <Volume2 className="h-4 w-4 mr-2" /> Preview
        </Button>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Choose a voice that best represents your avatar's personality and
          sound.
        </p>

        <Select
          value={selectedVoice}
          onValueChange={handleVoiceChange}
          name="openaiVoice"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            {OpenAIVoices.map((voice) => (
              <SelectItem key={voice} value={voice} className="relative pl-8">
                <span className="font-medium">
                  {voice.charAt(0).toUpperCase() + voice.slice(1)}
                </span>
                <span className="ml-2 text-sm text-muted-foreground">
                  {OpenAIVoiceGenders[voice]} • {VoiceDescriptions[voice]}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {OpenAIVoices.map((voice) => (
            <div
              key={voice}
              className={`p-3 rounded-lg text-center cursor-pointer transition-colors
              ${
                selectedVoice === voice
                  ? "bg-primary/10 border-2 border-primary"
                  : "bg-accent/50 hover:bg-accent border border-accent"
              }`}
              onClick={() => handleVoiceChange(voice)}
            >
              <div className="flex justify-center items-center mb-1 h-6">
                {selectedVoice === voice && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="font-medium truncate">
                {voice.charAt(0).toUpperCase() + voice.slice(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                {OpenAIVoiceGenders[voice]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Prompts Section Component
const PromptsSection = ({
  selectedPrompts,
  availablePrompts,
  handlePromptSelect,
  handleAnswerChange,
  handleRemovePrompt,
  handleAddPrompt,
  setIsQuestionDialogOpen,
  promptLoading,
}) => {
  return (
    <Card className="p-6 space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Personalization Questions</h2>
        <Button
          size="sm"
          type="button"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            setIsQuestionDialogOpen(true);
          }}
          disabled={!availablePrompts?.length || promptLoading}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Question
        </Button>
      </div>

      <p className="text-sm text-gray-600">
        Answering these questions will help create a more personalized
        experience. The avatar will use these responses to guide conversations
        and recall important details.
      </p>

      {promptLoading ? (
        <div className="text-center py-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-sm text-gray-500">
            Loading available prompts...
          </p>
        </div>
      ) : (
        <>
          {selectedPrompts.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">
                No personalization questions added yet. Click "Add Question" to
                begin personalizing your avatar.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedPrompts.map((prompt, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-2 bg-gray-50"
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-semibold text-sm">{prompt.question}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePrompt(index);
                      }}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Share a detailed, heartfelt response that captures the essence of your relationship..."
                    value={prompt.answer || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    rows={3}
                    className="placeholder-gray-400"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
};

// Personality Traits Section Component
const PersonalityTraitsSection = ({
  personalityValues,
  handlePersonalityChange,
  setIsPersonalityHelpOpen,
}) => {
  return (
    <Card className="p-6 space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Personality Traits</h2>
        <Button
          size="sm"
          type="button"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            setIsPersonalityHelpOpen(true);
          }}
        >
          <Info className="h-4 w-4 mr-2" /> About Traits
        </Button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Adjust these sliders to fine-tune your avatar's personality traits.
        These settings will influence how your avatar responds in different
        situations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(personalityValues).map(([trait, value]) => (
          <div key={trait} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">
                {trait
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <span className="text-sm bg-accent px-2 py-1 rounded">
                {value}
              </span>
            </div>
            <Slider
              name={`personality.${trait}`}
              value={[value]}
              onValueChange={(newValue) =>
                handlePersonalityChange(trait, newValue)
              }
              max={100}
              step={1}
            />
            <p className="text-xs text-gray-500">
              {trait === "memoryEngagement" &&
                "How deeply the avatar connects with past experiences and memories"}
              {trait === "anxietyManagement" &&
                "The avatar's ability to provide calm and emotional support"}
              {trait === "activityEngagement" &&
                "The avatar's enthusiasm and engagement in interactions"}
              {trait === "socialConnection" &&
                "The avatar's capacity for empathy and emotional rapport"}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
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

  // Test dialog state
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);

  // Help dialogs states
  const [isPersonalityHelpOpen, setIsPersonalityHelpOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);

  // Prompt state
  const {
    data: availablePrompts,
    isLoading: promptLoading,
    mutate: refetchPrompts,
  } = useSWR<Prompt[]>("/api/avatar/prompt", fetcher);

  // State for selected prompts from avatar or empty array
  const [selectedPrompts, setSelectedPrompts] = useState<PromptAnswer[]>(
    avatar?.promptAnswers || []
  );

  // State for personality traits
  const [personalityValues, setPersonalityValues] = useState({
    memoryEngagement: avatar?.personality?.memoryEngagement || 50,
    anxietyManagement: avatar?.personality?.anxietyManagement || 50,
    activityEngagement: avatar?.personality?.activityEngagement || 50,
    socialConnection: avatar?.personality?.socialConnection || 50,
  });

  // State for initial prompt
  const [initialPrompt, setInitialPrompt] = useState(
    avatar?.initialPrompt || ""
  );

  // State for voice selection
  const [selectedVoice, setSelectedVoice] = useState(
    avatar?.openaiVoice || "coral"
  );

  const handleInitialPromptChange = (e) => {
    setInitialPrompt(e.target.value);
  };

  const handleVoiceChange = (value) => {
    setSelectedVoice(value);
  };

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

  // Modified to handle prompt removal
  const handleRemovePrompt = (indexToRemove: number) => {
    setSelectedPrompts((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // Add a prompt from available prompts
  const handleAddPrompt = (promptId: string) => {
    const prompt = availablePrompts?.find((p) => p.id === promptId);
    if (!prompt) return;

    setSelectedPrompts((prev) => [
      ...prev,
      { promptId: prompt.id, question: prompt.question, answer: "" },
    ]);

    setIsQuestionDialogOpen(false);
  };

  // Answer change handler
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

  // Handler for prompt selection (used in dialog)
  const handlePromptSelect = (index: number, promptId: string) => {
    const prompt = availablePrompts?.find((p) => p.id === promptId);
    if (!prompt) return;

    setSelectedPrompts((prev) => {
      const newPrompts = [...prev];
      // Ensure the array has the correct length and preserve existing answers
      while (newPrompts.length <= index) {
        newPrompts.push({ promptId: "", question: "", answer: "" });
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

  const generateFace = useCallback(
    async (e) => {
      e.stopPropagation();
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
        });
      } finally {
        setIsLoading(false);
        setLoadingMessage("");
      }
    },
    [avatar, setAvatar]
  );

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
          initialPrompt: formData.get("initialPrompt") || initialPrompt,
          personality: personalityValues,
          openaiVoice: formData.get("openaiVoice") || selectedVoice,
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

  // Filtered available prompts (exclude already selected ones)
  const filteredAvailablePrompts = availablePrompts?.filter(
    (prompt) =>
      !selectedPrompts.some((selected) => selected.promptId === prompt.id)
  );

  // Action buttons for editing mode
  const renderActionButtons = () => {
    if (!avatar) return null;

    return (
      <div className="flex gap-2 w-full max-w-full">
        {!avatar.isActive && !avatar.simliFaceId && (
          <Button
            onClick={generateFace}
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white animate-pulse"
            size="sm"
            disabled={isLoading}
          >
            Generate Face
          </Button>
        )}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setIsTestDialogOpen(true);
          }}
          variant="outline"
          type="button"
          disabled={isLoading || !avatar.isActive || !avatar.simliFaceId}
        >
          Test Avatar
        </Button>
      </div>
    );
  };

  return (
    <>
      {isLoading && <LoadingOverlay message={loadingMessage} />}

      {/* Test Dialog */}
      <Dialog
        open={isTestDialogOpen}
        onOpenChange={(open) => {
          // Prevent form submission when closing dialog
          if (!open) {
            setIsTestDialogOpen(false);
          }
        }}
      >
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          className="flex w-full max-w-full flex-col h-svh"
          onInteractOutside={(e) => {
            e.preventDefault();
            setIsTestDialogOpen(false);
          }}
        >
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

      {/* Personality Traits Help Dialog */}
      <Dialog
        open={isPersonalityHelpOpen}
        onOpenChange={(open) => {
          // Prevent form submission when closing dialog
          if (!open) {
            setIsPersonalityHelpOpen(false);
          }
        }}
      >
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          onInteractOutside={(e) => {
            e.preventDefault();
            setIsPersonalityHelpOpen(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Understanding Avatar Personalization</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Initial Greeting</h3>
              <p className="text-sm text-gray-600">
                This sets how your avatar will first engage with the user. A
                personalized greeting helps create an immediate emotional
                connection.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Memory Engagement</h3>
              <p className="text-sm text-gray-600">
                How deeply the avatar connects with and recalls past experiences
                and memories.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Anxiety Management</h3>
              <p className="text-sm text-gray-600">
                The avatar's ability to handle stress, provide calm, and support
                emotional well-being.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Activity Engagement</h3>
              <p className="text-sm text-gray-600">
                The avatar's enthusiasm and involvement in interactions and
                activities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Social Connection</h3>
              <p className="text-sm text-gray-600">
                The avatar's capacity for empathy, understanding, and building
                emotional rapport.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Question Selection Dialog */}
      <Dialog
        open={isQuestionDialogOpen}
        onOpenChange={(open) => {
          // Prevent form submission when closing dialog
          if (!open) {
            setIsQuestionDialogOpen(false);
          }
        }}
      >
        <DialogContent
          className="max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          onInteractOutside={(e) => {
            e.preventDefault();
            setIsQuestionDialogOpen(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Select a Personalization Question</DialogTitle>
            <DialogDescription>
              Choose a question to help personalize your avatar's responses and
              memory
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {filteredAvailablePrompts?.map((prompt) => (
              <Button
                key={prompt.id}
                variant="outline"
                className="w-full text-left justify-start whitespace-normal h-auto py-3"
                onClick={() => handleAddPrompt(prompt.id)}
              >
                {prompt.question}
              </Button>
            ))}
            {filteredAvailablePrompts?.length === 0 && (
              <p className="text-center py-4 text-gray-500">
                You've added all available questions. You can remove some to add
                different ones.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Buttons Card (only for edit mode) */}
      {avatar && (
        <Card className="p-2 pb-2 flex justify-start items-center mx-4 mb-4">
          <div className="flex flex-col space-y-2 items-center w-full">
            {/* <div className="flex-1 text-left">
              <h3 className="font-medium">Avatar Status: {avatar.isActive ? 
                <span className="text-green-600">Active</span> : 
                <span className="text-amber-600">Inactive</span>}
              </h3>
            </div> */}
            {renderActionButtons()}
          </div>
        </Card>
      )}

      <Form action={handleSubmit} className="w-full max-w-full px-4">
        {/* Basic Info Section */}
        <BasicInfoSection
          avatar={avatar}
          avatarPreview={avatarPreview}
          setAvatarPreview={setAvatarPreview}
          handleImageChange={handleImageChange}
          setAvatarFile={setAvatarFile}
          isLoading={isLoading}
        />

        {/* Initial Prompt Section */}
        <InitialPromptSection
          initialPrompt={initialPrompt}
          handleInitialPromptChange={handleInitialPromptChange}
          setIsPersonalityHelpOpen={setIsPersonalityHelpOpen}
        />

        {/* Voice Selection Section */}
        <VoiceSelectionSection
          selectedVoice={selectedVoice}
          handleVoiceChange={handleVoiceChange}
        />

        {/* Prompts Section */}
        <PromptsSection
          selectedPrompts={selectedPrompts}
          availablePrompts={filteredAvailablePrompts}
          handlePromptSelect={handlePromptSelect}
          handleAnswerChange={handleAnswerChange}
          handleRemovePrompt={handleRemovePrompt}
          handleAddPrompt={handleAddPrompt}
          setIsQuestionDialogOpen={setIsQuestionDialogOpen}
          promptLoading={promptLoading}
        />

        {/* Personality Traits Section */}
        <PersonalityTraitsSection
          personalityValues={personalityValues}
          handlePersonalityChange={handlePersonalityChange}
          setIsPersonalityHelpOpen={setIsPersonalityHelpOpen}
        />

        {/* Submit Button */}
        <div className="flex justify-end mb-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="mr-2"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <SubmitButton
            className="min-w-[150px] w-full"
            isLoading={isLoading}
            loadingText={avatar ? "Updating..." : "Creating..."}
          >
            {avatar ? "Update Avatar" : "Create Avatar"}
          </SubmitButton>
        </div>
      </Form>
    </>
  );
}
