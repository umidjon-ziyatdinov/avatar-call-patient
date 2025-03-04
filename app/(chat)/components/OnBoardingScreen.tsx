"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Trash2,
  Info,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";

// Optional: Define types based on your schema
type PromptAnswer = {
  promptId: string;
  question: string;
  answer: string;
};

type PatientDetails = {
  about: string;
  age: string;
  sex: string;
  dateOfBirth: string;
  location: string;
  education: string;
  work: string;
  likes: string;
  dislikes: string;
  symptoms: string;
  fallRisk: string;
  promptAnswers: PromptAnswer[];
};

type PromptTemplate = {
  id: string;
  question: string;
  orderNumber: number;
};

const PatientOnboarding = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFallRiskInfo, setShowFallRiskInfo] = useState(false);

  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    about: "",
    age: "",
    sex: "",
    dateOfBirth: "",
    location: "",
    education: "",
    work: "",
    likes: "",
    dislikes: "",
    symptoms: "",
    fallRisk: "no",
    promptAnswers: [],
  });

  // Personalization prompts from your list
  const availablePrompts: PromptTemplate[] = [
    {
      id: "1",
      question:
        "What are some of the most cherished childhood memories they have?",
      orderNumber: 1,
    },
    {
      id: "2",
      question:
        "Can you tell a detailed story about a favorite family tradition they always loved?",
      orderNumber: 2,
    },
    {
      id: "3",
      question:
        "What was their career or profession, and what did they love most about it?",
      orderNumber: 3,
    },
    {
      id: "4",
      question:
        "How did they meet their spouse or closest loved one, and what was their love story like?",
      orderNumber: 4,
    },
    {
      id: "5",
      question:
        "What are some stories about their children or grandchildren that bring them the most joy?",
      orderNumber: 5,
    },
    {
      id: "6",
      question: "What are their favorite stories about their pets?",
      orderNumber: 6,
    },
    {
      id: "7",
      question:
        "Can you share a story about a time they overcame a major challenge in life?",
      orderNumber: 7,
    },
    {
      id: "8",
      question:
        "What kind of music do they love, and do they have any favorite concerts or performances they attended?",
      orderNumber: 8,
    },
    {
      id: "9",
      question:
        "What were their favorite movies or TV shows, and what made them special?",
      orderNumber: 9,
    },
    {
      id: "10",
      question: "What was their most memorable vacation or travel experience?",
      orderNumber: 10,
    },
    {
      id: "11",
      question:
        "What hobbies or creative activities have they been passionate about?",
      orderNumber: 11,
    },
    {
      id: "12",
      question:
        "What was their favorite meal, and do you have a special story about them cooking or eating it?",
      orderNumber: 12,
    },
    {
      id: "13",
      question:
        "What was a defining moment in their life that they often spoke about?",
      orderNumber: 13,
    },
    {
      id: "14",
      question:
        "Can you tell a funny or embarrassing story about them that they always laughed about?",
      orderNumber: 14,
    },
    {
      id: "15",
      question:
        "What holidays or celebrations were most meaningful to them, and how did they celebrate?",
      orderNumber: 15,
    },
    {
      id: "16",
      question:
        "What is a piece of advice or wisdom they always shared with family or friends?",
      orderNumber: 16,
    },
    {
      id: "17",
      question:
        "What historical events had the biggest impact on their life, and how did they experience them?",
      orderNumber: 17,
    },
    {
      id: "18",
      question:
        "What was their dream job or passion if they could have done anything in life?",
      orderNumber: 18,
    },
    {
      id: "19",
      question: "What are some of their proudest achievements, big or small?",
      orderNumber: 19,
    },
    {
      id: "20",
      question:
        "If they could relive one perfect day from their past, what do you think it would be and why?",
      orderNumber: 20,
    },
  ];

  const totalSteps = 4; // Revised total number of steps in onboarding
  const progress = (step / totalSteps) * 100;

  const handlePromptSelect = (promptId: string) => {
    const selectedPrompt = availablePrompts.find((p) => p.id === promptId);
    if (!selectedPrompt) return;

    // Check if this prompt is already in the answers
    const existingIndex = patientDetails.promptAnswers.findIndex(
      (a) => a.promptId === promptId
    );

    if (existingIndex === -1) {
      // Add new prompt
      setPatientDetails((prev) => ({
        ...prev,
        promptAnswers: [
          ...prev.promptAnswers,
          {
            promptId: promptId,
            question: selectedPrompt.question,
            answer: "",
          },
        ],
      }));
    }
  };

  const handlePromptAnswerChange = (index: number, answer: string) => {
    setPatientDetails((prev) => {
      const updatedAnswers = [...prev.promptAnswers];
      if (updatedAnswers[index]) {
        updatedAnswers[index] = {
          ...updatedAnswers[index],
          answer,
        };
      }
      return { ...prev, promptAnswers: updatedAnswers };
    });
  };

  const removePrompt = (index: number) => {
    setPatientDetails((prev) => {
      const updatedAnswers = [...prev.promptAnswers];
      updatedAnswers.splice(index, 1);
      return { ...prev, promptAnswers: updatedAnswers };
    });
  };

  const handleInputChange = (field: keyof PatientDetails, value: string) => {
    setPatientDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      window.scrollTo(0, 0);
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      window.scrollTo(0, 0);
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Prepare the data to be sent to the backend
      const formData = new FormData();

      // Add all patient details to formData
      Object.entries(patientDetails).forEach(([key, value]) => {
        if (key === "promptAnswers") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });

      // Send data to the backend
      const response = await fetch("/api/patient/onboard", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save patient data");
      }

      toast.success("Onboarding Complete! Your avatar is being personalized.");
      router.push("/dashboard"); // Redirect to dashboard or confirmation page
    } catch (error) {
      toast.error("Onboarding failed. Please try again.");
      console.error("Error saving patient data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter out prompts that have already been selected
  const getAvailablePromptOptions = () => {
    return availablePrompts.filter(
      (prompt) =>
        !patientDetails.promptAnswers.some(
          (answer) => answer.promptId === prompt.id
        )
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-semibold">Basic Information</h2>
            <p className="text-muted-foreground">
              Help us get to know you better to personalize your experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  value={patientDetails.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  type="number"
                  placeholder="Enter your age"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sex">Sex</Label>
                <Select
                  value={patientDetails.sex}
                  onValueChange={(value) => handleInputChange("sex", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={patientDetails.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={patientDetails.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="City, State"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">Tell us a bit about yourself</Label>
              <Textarea
                id="about"
                value={patientDetails.about}
                onChange={(e) => handleInputChange("about", e.target.value)}
                placeholder="Share something about yourself (interests, hobbies, etc.)"
                rows={3}
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-semibold">Background</h2>
            <p className="text-muted-foreground">
              This information helps us better understand your context.
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={patientDetails.education}
                  onChange={(e) =>
                    handleInputChange("education", e.target.value)
                  }
                  placeholder="Highest education level or field of study"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="work">Work/Former Occupation</Label>
                <Input
                  id="work"
                  value={patientDetails.work}
                  onChange={(e) => handleInputChange("work", e.target.value)}
                  placeholder="Current or previous work"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="fallRisk">Fall Risk Assessment</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setShowFallRiskInfo(!showFallRiskInfo)}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80">
                          Click for more information about fall risk
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {showFallRiskInfo && (
                  <div className="bg-muted p-4 rounded-md relative my-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => setShowFallRiskInfo(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <h4 className="font-medium mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      What is Fall Risk?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      A person is considered at risk for falls if they:
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Have a history of falls</li>
                        <li>Have balance or mobility issues</li>
                        <li>Take medications that might affect balance</li>
                        <li>Have vision problems</li>
                        <li>Experience dizziness or lightheadedness</li>
                      </ul>
                      This information helps us tailor safety recommendations in
                      interactions.
                    </p>
                  </div>
                )}

                <Select
                  value={patientDetails.fallRisk}
                  onValueChange={(value) =>
                    handleInputChange("fallRisk", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fall risk status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes - At risk for falls</SelectItem>
                    <SelectItem value="no">
                      No - Not at risk for falls
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="likes">Things you enjoy</Label>
                <Textarea
                  id="likes"
                  value={patientDetails.likes}
                  onChange={(e) => handleInputChange("likes", e.target.value)}
                  placeholder="Activities, topics or things you enjoy"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dislikes">
                  Things you dislike or find triggering
                </Label>
                <Textarea
                  id="dislikes"
                  value={patientDetails.dislikes}
                  onChange={(e) =>
                    handleInputChange("dislikes", e.target.value)
                  }
                  placeholder="Topics or things you prefer to avoid"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">
                  Current symptoms or health concerns
                </Label>
                <Textarea
                  id="symptoms"
                  value={patientDetails.symptoms}
                  onChange={(e) =>
                    handleInputChange("symptoms", e.target.value)
                  }
                  placeholder="Any health issues you'd like us to be aware of"
                  rows={2}
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-semibold">
              Personalization Questions
            </h2>
            <p className="text-muted-foreground">
              These answers help us personalize your avatar. The more you share
              about yourself or your loved one, the more personal and meaningful
              your avatar's interactions will be.
            </p>

            <div className="space-y-8">
              {patientDetails.promptAnswers.length > 0 ? (
                patientDetails.promptAnswers.map((promptAnswer, index) => (
                  <div
                    key={index}
                    className="space-y-2 p-4 border border-border rounded-lg relative"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePrompt(index)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <Label className="font-medium">
                      {promptAnswer.question}
                    </Label>
                    <Textarea
                      value={promptAnswer.answer}
                      onChange={(e) =>
                        handlePromptAnswerChange(index, e.target.value)
                      }
                      placeholder="Your answer here"
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-muted-foreground rounded-lg bg-muted/20">
                  <p className="text-muted-foreground mb-4 text-center">
                    Select questions to answer that will help us personalize
                    your avatar.
                  </p>
                </div>
              )}

              {getAvailablePromptOptions().length > 0 && (
                <div className="pt-4">
                  <Select onValueChange={handlePromptSelect}>
                    <SelectTrigger className="bg-primary/10 border-primary/20">
                      <SelectValue placeholder="+ Add a personalization question" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {getAvailablePromptOptions().map((prompt) => (
                        <SelectItem key={prompt.id} value={prompt.id}>
                          {prompt.question}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-center py-2">
                <p className="text-sm text-muted-foreground text-center max-w-lg">
                  You don't need to answer all questions - just choose the ones
                  that are most meaningful to you. We recommend answering at
                  least 3-5 questions for the best experience.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-semibold">Review & Finalize</h2>
            <p className="text-muted-foreground">
              Review your information before creating your personalized avatar.
            </p>

            <div className="divide-y divide-border">
              <div className="py-4">
                <h3 className="font-medium mb-2">Basic Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Age:</div>
                  <div>{patientDetails.age || "Not provided"}</div>

                  <div className="text-muted-foreground">Sex:</div>
                  <div>{patientDetails.sex || "Not provided"}</div>

                  <div className="text-muted-foreground">Location:</div>
                  <div>{patientDetails.location || "Not provided"}</div>
                </div>
              </div>

              <div className="py-4">
                <h3 className="font-medium mb-2">Background & Preferences</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Education:</div>
                  <div>{patientDetails.education || "Not provided"}</div>

                  <div className="text-muted-foreground">Work:</div>
                  <div>{patientDetails.work || "Not provided"}</div>

                  <div className="text-muted-foreground">Fall Risk:</div>
                  <div>
                    {patientDetails.fallRisk === "yes"
                      ? "Yes - At risk for falls"
                      : "No - Not at risk for falls"}
                  </div>
                </div>
              </div>

              <div className="py-4">
                <h3 className="font-medium mb-2">Personalization Questions</h3>
                {patientDetails.promptAnswers.length > 0 ? (
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      You've answered {patientDetails.promptAnswers.length}{" "}
                      personalization questions.
                    </p>
                    <div className="ml-4 space-y-1">
                      {patientDetails.promptAnswers.map((pa, i) => (
                        <div key={i} className="line-clamp-1">
                          • {pa.question}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-amber-500">
                    You haven't answered any personalization questions. We
                    recommend adding at least a few answers to create a more
                    meaningful experience.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">
                  Ready to create your personalized avatar
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Your information will be used to create a personalized avatar
                experience tailored to your answers and preferences. You can
                always update this information later.
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* Header with progress */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="container max-w-7xl mx-auto py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Avatar Personalization
              </h1>
              <p className="text-muted-foreground">
                Step {step} of {totalSteps}
              </p>
            </div>
            <div className="w-full sm:w-64 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {step}/{totalSteps}
              </span>
              <Progress value={progress} className="h-2 flex-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        {renderStep()}
      </div>

      {/* Footer with navigation buttons */}
      <div className="sticky bottom-0 z-50 border-t bg-background/80 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto py-4 px-4">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {step < totalSteps ? (
              <Button onClick={nextStep} className="flex items-center">
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center"
              >
                {isSubmitting ? (
                  <>Creating Avatar...</>
                ) : (
                  <>
                    Create My Avatar
                    <Check className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientOnboarding;
