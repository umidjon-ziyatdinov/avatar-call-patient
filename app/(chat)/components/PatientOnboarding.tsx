"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

// Import our custom components
import BasicInfoForm from "./BasicInfoRorm";
import BackgroundForm from "./BackgroundForm";
import PersonalizationForm from "./PersonalizationForm";
// import ReviewForm from "./ReviewForm";

// Types
export type PromptAnswer = {
  promptId: string;
  question: string;
  answer: string;
};

export type PatientDetails = {
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

export type PromptTemplate = {
  id: string;
  question: string;
  orderNumber: number;
};

const PatientOnboarding = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Available prompts for personalization
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

  const totalSteps = 4; // Total number of steps in onboarding
  const progress = (step / totalSteps) * 100;

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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <BasicInfoForm
            patientDetails={patientDetails}
            handleInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <BackgroundForm
            patientDetails={patientDetails}
            handleInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <PersonalizationForm
            patientDetails={patientDetails}
            setPatientDetails={setPatientDetails}
            availablePrompts={availablePrompts}
            onNext={nextStep}
            onPrevious={prevStep}
            currentStep={step}
            totalSteps={totalSteps}
          />
        );
      //   case 4:
      //     return <ReviewForm patientDetails={patientDetails} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* Header with progress */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto py-4 px-4">
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
      <div className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </div>

      {/* Footer with navigation buttons */}
      <div className="sticky bottom-0 z-50 border-t bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto py-4 px-4">
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
