// @ts-nocheck
"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Lightbulb,
  Info,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Patient } from "@/lib/db/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Form from "next/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubmitButton } from "@/components/submit-button";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

// Types
type PromptTemplate = {
  id: string;
  question: string;
  orderNumber: number;
};

type PromptAnswer = {
  promptId: string;
  question: string;
  answer: string;
};

export const PatientEditDialog = ({
  patient,
  onClose,
}: {
  patient: Patient;
  onClose: () => void;
}) => {
  // State Management
  const [imagePreview, setImagePreview] = useState(patient.profilePicture);
  const [isPending, setIsPending] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const {
    data: availablePrompts,
    isLoading,
    mutate: refetchPrompts,
  } = useSWR<PromptTemplate[]>("/api/patient/prompt", fetcher);
  // Prompt Management
  const [selectedPrompts, setSelectedPrompts] = useState<PromptAnswer[]>(
    patient?.promptAnswers || []
  );
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [customAnswer, setCustomAnswer] = useState<string>("");

  // Predefined Prompts (moved from previous example)
  // const availablePrompts: PromptTemplate[] = [
  //   {
  //     id: "1",
  //     question:
  //       "What are some of the most cherished childhood memories they have?",
  //     orderNumber: 1,
  //   },
  //   {
  //     id: "2",
  //     question:
  //       "Can you tell a detailed story about a favorite family tradition they always loved?",
  //     orderNumber: 2,
  //   },
  //   {
  //     id: "3",
  //     question:
  //       "What was their career or profession, and what did they love most about it?",
  //     orderNumber: 3,
  //   },
  //   {
  //     id: "4",
  //     question:
  //       "How did they meet their spouse or closest loved one, and what was their love story like?",
  //     orderNumber: 4,
  //   },
  //   {
  //     id: "5",
  //     question:
  //       "What are some stories about their children or grandchildren that bring them the most joy?",
  //     orderNumber: 5,
  //   },
  //   {
  //     id: "6",
  //     question: "What are their favorite stories about their pets?",
  //     orderNumber: 6,
  //   },
  //   {
  //     id: "7",
  //     question:
  //       "Can you share a story about a time they overcame a major challenge in life?",
  //     orderNumber: 7,
  //   },
  //   {
  //     id: "8",
  //     question:
  //       "What kind of music do they love, and do they have any favorite concerts or performances they attended?",
  //     orderNumber: 8,
  //   },
  //   {
  //     id: "9",
  //     question:
  //       "What were their favorite movies or TV shows, and what made them special?",
  //     orderNumber: 9,
  //   },
  //   {
  //     id: "10",
  //     question: "What was their most memorable vacation or travel experience?",
  //     orderNumber: 10,
  //   },
  //   {
  //     id: "11",
  //     question:
  //       "What hobbies or creative activities have they been passionate about?",
  //     orderNumber: 11,
  //   },
  //   {
  //     id: "12",
  //     question:
  //       "What was their favorite meal, and do you have a special story about them cooking or eating it?",
  //     orderNumber: 12,
  //   },
  //   {
  //     id: "13",
  //     question:
  //       "What was a defining moment in their life that they often spoke about?",
  //     orderNumber: 13,
  //   },
  //   {
  //     id: "14",
  //     question:
  //       "Can you tell a funny or embarrassing story about them that they always laughed about?",
  //     orderNumber: 14,
  //   },
  //   {
  //     id: "15",
  //     question:
  //       "What holidays or celebrations were most meaningful to them, and how did they celebrate?",
  //     orderNumber: 15,
  //   },
  //   {
  //     id: "16",
  //     question:
  //       "What is a piece of advice or wisdom they always shared with family or friends?",
  //     orderNumber: 16,
  //   },
  //   {
  //     id: "17",
  //     question:
  //       "What historical events had the biggest impact on their life, and how did they experience them?",
  //     orderNumber: 17,
  //   },
  //   {
  //     id: "18",
  //     question:
  //       "What was their dream job or passion if they could have done anything in life?",
  //     orderNumber: 18,
  //   },
  //   {
  //     id: "19",
  //     question: "What are some of their proudest achievements, big or small?",
  //     orderNumber: 19,
  //   },
  //   {
  //     id: "20",
  //     question:
  //       "If they could relive one perfect day from their past, what do you think it would be and why?",
  //     orderNumber: 20,
  //   },
  // ];

  // Image Handling
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const removePrompt = (index: number) => {
    setSelectedPrompts((prev) => prev.filter((_, i) => i !== index));
  };

  // Prompt Handling
  const handlePromptSelect = (promptId: string) => {
    const prompt = availablePrompts?.find((p) => p.id === promptId);
    if (!prompt) return;

    // Check if prompt is already selected
    const isAlreadySelected = selectedPrompts.some(
      (p) => p.promptId === promptId
    );

    if (isAlreadySelected) {
      toast.error("This prompt has already been selected");
      return;
    }

    setSelectedPrompts((prev) => [
      ...prev,
      {
        promptId: prompt.id,
        question: prompt.question,
        answer: "",
      },
    ]);
  };

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

  // Custom Prompt Handling
  const addCustomPrompt = () => {
    if (customPrompt.trim() && customAnswer.trim()) {
      setSelectedPrompts((prev) => [
        ...prev,
        {
          promptId: `custom_${Date.now()}`,
          question: customPrompt,
          answer: customAnswer,
        },
      ]);
      setCustomPrompt("");
      setCustomAnswer("");
    } else {
      toast.error("Please enter both a custom question and answer");
    }
  };

  // Submit Handler
  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      formData.append("id", patient.id);
      if (newImageFile) {
        formData.append("profilePicture", newImageFile);
      }
      formData.append("promptAnswers", JSON.stringify(selectedPrompts));

      const response = await fetch(`/api/patient/${patient?.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save patient data");
      }

      toast.success("Patient Information Updated");
      onClose();
    } catch (error) {
      toast.error("Update Failed");
      console.error("Error saving patient data:", error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto w-full">
      <style jsx global>{`
        [data-radix-select-item] {
          display: flex !important;
          align-items: flex-start !important;
          gap: 8px !important;
        }

        [data-radix-select-item] svg {
          margin-top: 4px !important;
          margin-right: 10px !important;
          flex-shrink: 0 !important;
        }
      `}</style>
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center h-16 px-6 border-b bg-background">
        <Button variant="ghost" size="sm" onClick={onClose} className="mr-4">
          <ArrowLeft className="size-4 mr-2" />
          Go Back
        </Button>
        <h2 className="text-lg font-semibold">Edit Patient Information</h2>
      </div>

      <div className="max-w-4xl mx-auto py-6 pb-[80px]  sm:pb-0 px-4 w-full">
        <Form action={handleSubmit} className="space-y-8 w-full">
          {/* Personal Information Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <Info className="mr-2 text-primary" />
                  Personal Information
                </div>
              </CardTitle>
              <CardDescription>
                Basic details that help us understand the patient better
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden bg-muted mb-4">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Patient"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                  </div>
                  <Label className="text-sm text-muted-foreground">
                    Click to change profile picture
                  </Label>
                </div>

                {/* Basic Details */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={patient.name}
                      placeholder="Patient's full name"
                    />
                  </div>
                  {[
                    { id: "age", label: "Age", type: "number" },
                    { id: "sex", label: "Sex", type: "text" },
                    { id: "dateOfBirth", label: "Date of Birth", type: "date" },
                    { id: "location", label: "Location", type: "text" },
                  ].map((field) => (
                    <div key={field.id} className="flex flex-col gap-2">
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Input
                        id={field.id}
                        name={field.id}
                        type={field.type}
                        // @ts-ignore
                        defaultValue={patient?.[field.id]}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personalization Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <Lightbulb className="mr-2 text-yellow-500" />
                  Personal Story & Insights
                </div>
              </CardTitle>
              <CardDescription>
                Create a rich narrative by selecting and answering meaningful
                prompts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prompt Selection Area */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Selected Prompts ({selectedPrompts.length})
                  </h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 size-4" /> Add Prompt
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Select a Prompt</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {isLoading ? (
                          // Loading state
                          <div className="col-span-2 flex flex-col items-center justify-center py-8 space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">
                              Loading available prompts...
                            </p>
                          </div>
                        ) : availablePrompts?.length === 0 ? (
                          // Empty state
                          <div className="col-span-2 text-center py-8">
                            <p className="text-sm text-muted-foreground">
                              No prompts available
                            </p>
                          </div>
                        ) : (
                          // Prompts grid
                          availablePrompts
                            ?.filter(
                              (prompt) =>
                                !selectedPrompts.some(
                                  (p) => p.promptId === prompt.id
                                )
                            )
                            .map((prompt) => (
                              <Button
                                key={prompt.id}
                                variant="outline"
                                className="h-auto whitespace-normal text-left p-3"
                                onClick={() => {
                                  handlePromptSelect(prompt.id);
                                  document
                                    .querySelector("[data-radix-dialog-close]")
                                    ?.dispatchEvent(new Event("click"));
                                }}
                              >
                                {prompt.question}
                              </Button>
                            ))
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Existing Prompts List */}
                {selectedPrompts.map((prompt, index) => (
                  <div
                    key={prompt.promptId}
                    className="border rounded-lg p-4 relative bg-muted/30"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-destructive"
                      onClick={() => removePrompt(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <div className="mb-2">
                      <p className="font-medium text-sm text-muted-foreground">
                        {prompt.question}
                      </p>
                    </div>
                    <Textarea
                      value={prompt.answer}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                      placeholder="Share your story..."
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                ))}

                {/* Custom Prompt Option */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2" /> Create Custom Prompt
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a Custom Prompt</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Custom Question</Label>
                        <Input
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder="Enter your unique question"
                        />
                      </div>
                      <div>
                        <Label>Answer</Label>
                        <Textarea
                          value={customAnswer}
                          onChange={(e) => setCustomAnswer(e.target.value)}
                          placeholder="Share the story or answer"
                          rows={4}
                        />
                      </div>
                      <Button onClick={addCustomPrompt} className="w-full">
                        Add Custom Prompt
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* About / Additional Context (unchanged) */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="about">About / Additional Context</Label>
                <Textarea
                  id="about"
                  name="about"
                  defaultValue={patient?.about || ""}
                  placeholder="Any additional information that helps understand the patient better"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Healthcare & Preferences Section */}
          <Card>
            <CardHeader>
              <CardTitle>Healthcare & Preferences</CardTitle>
              <CardDescription>
                Important medical and personal preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="fallRisk">Fall Risk Assessment</Label>
                <Select name="fallRisk" defaultValue={patient?.fallRisk ?? ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fall risk status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">High Risk</SelectItem>
                    <SelectItem value="no">Low Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {[
                { id: "likes", label: "Likes & Interests" },
                { id: "dislikes", label: "Dislikes & Triggers" },
                { id: "symptoms", label: "Current Symptoms & Concerns" },
              ].map((field) => (
                <div key={field.id} className="flex flex-col gap-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Textarea
                    id={field.id}
                    name={field.id}
                    // @ts-ignore
                    defaultValue={patient?.[field.id]}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    rows={2}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <SubmitButton
            loadingText="Saving Patient Information"
            className="w-full"
            isLoading={isPending}
          >
            Save Patient Profile
          </SubmitButton>
        </Form>
      </div>
    </div>
  );
};
