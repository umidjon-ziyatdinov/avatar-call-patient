"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

// Import our custom components
import PrivacyAgreementForm from "./PatientAgreeTermsForm";
import BasicInfoForm from "./BasicInfoForm";
import BackgroundForm from "./BackgroundForm";
import PersonalizationForm from "./PersonalizationForm";
import ReviewForm from "./ReviewForm";

import { PatientDetails } from "@/types/patient";
import PasscodeScreen from "./PasscodeScreen";
import { auth } from "@/app/(auth)/auth";

// Types
export type PromptAnswer = {
  promptId: string;
  question: string;
  answer: string;
};

export type PromptTemplate = {
  id: string;
  question: string;
  orderNumber: number;
};

const PatientOnboarding = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  // Now including the passcode step
  // Start at step 0 (privacy agreement)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showPasscodeScreen, setShowPasscodeScreen] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [loadingStep, setLoadingStep] = useState(0); // Track which step of the loading process we're on

  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    name: "",
    about: "",
    age: "",
    gender: "",
    dateOfBirth: "",
    location: "",
    education: "",
    work: "",
    likes: "",
    dislikes: "",
    symptoms: "",
    fallRisk: "no",
    promptAnswers: [],
    passcode: "",
    profilePicture: "", // Added default value
    createdAt: new Date().toISOString(), // Added default value
    updatedAt: new Date().toISOString(), // Added default value
    email: "", // Added default value
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

  const totalSteps = 5; // Total number of steps including privacy agreement
  const displayStep = step === 0 ? 1 : step; // For display purposes, first step is 1
  const progress = (displayStep / totalSteps) * 100;

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
    if (step > 0) {
      window.scrollTo(0, 0);
      setStep((prev) => prev - 1);
    }
  };

  const handlePrivacyAccept = () => {
    nextStep();
  };

  // Loading steps text content
  const loadingSteps = [
    "Validating patient information...",
    "Processing background details...",
    "Creating personalized profile...",
    "Configuring companion settings...",
    "Finalizing care plan...",
  ];

  // Function to simulate loading process with multiple steps
  const simulateLoadingSteps = () => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length - 1) {
        currentStep += 1;
        setLoadingStep(currentStep);
      } else {
        clearInterval(interval);
      }
    }, 1500); // Change steps every 1.5 seconds

    return () => clearInterval(interval);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setLoadingStep(0); // Start from the first loading step

    // Start the loading step sequence
    const clearLoadingInterval = simulateLoadingSteps();

    try {
      // Create FormData to support file upload
      const formData = new FormData();

      // Add passcode
      formData.append("passcode", adminPasscode);

      // Add patient details
      Object.keys(patientDetails).forEach((key) => {
        if (
          key !== "profilePicture" &&
          patientDetails[key as keyof PatientDetails]
        ) {
          // Special handling for promptAnswers to ensure it's a string
          if (key === "promptAnswers") {
            formData.append(key, JSON.stringify(patientDetails[key]));
          } else {
            formData.append(
              key,
              patientDetails[key as keyof PatientDetails] as string
            );
          }
        }
      });

      // Handle profile picture
      if (
        patientDetails.profilePicture &&
        patientDetails.profilePicture !== "/default-avatar.png"
      ) {
        // Convert base64 to Blob
        const response = await fetch(patientDetails.profilePicture);
        const blob = await response.blob();
        formData.append("profilePicture", blob, "profile-picture.jpg");
      }

      // Send data to the backend
      const response = await fetch(`/api/patient/onboarding`, {
        method: "PUT",
        body: formData,
        // Note: Do NOT set Content-Type header when sending FormData
        // Browser will automatically set the correct multipart/form-data boundary
      });

      if (!response.ok) {
        throw new Error("Failed to save patient data");
      }

      // Ensure the loading animation plays for at least 3.5 seconds
      await new Promise((resolve) => setTimeout(resolve, 3500));

      toast.success("Onboarding Complete! Your avatar is being personalized.");
      router.push("/"); // Redirect to dashboard or confirmation page
    } catch (error) {
      toast.error("Onboarding failed. Please try again.");
      console.error("Error saving patient data:", error);
    } finally {
      clearLoadingInterval(); // Clear the interval when done
      setIsSubmitting(false);
    }
  };

  const handlePasscodeSubmit = async (code: string) => {
    setIsAuthenticating(true);
    try {
      // Save passcode and hide the passcode screen
      setAdminPasscode(code);
      setShowPasscodeScreen(false);
    } catch (error) {
      console.error("Authorization failed:", error);
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const renderStep = () => {
    // Otherwise render the appropriate step
    switch (step) {
      case 0:
        return <PrivacyAgreementForm onAccept={handlePrivacyAccept} />;
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
            currentStep={displayStep}
            totalSteps={totalSteps}
          />
        );
      case 4:
        return <ReviewForm patientDetails={patientDetails} />;
      case 5:
        return (
          <PasscodeScreen
            onSubmit={handlePasscodeSubmit}
            isAuthenticating={isAuthenticating}
          />
        );
      default:
        return null;
    }
  };

  // Determine if we should show the navigation footer
  // Hide it on privacy agreement screen (step 0) and passcode screen
  const showNavigation = step > 0;

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* Header with progress - Hidden on privacy agreement screen and passcode screen */}
      {step > 0 && (
        <div className="sticky top-0 z-50 bg-background border-b">
          <div className="container mx-auto py-4 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  Patient Background
                </h1>
                <p className="text-muted-foreground">
                  Step {displayStep} of {totalSteps}
                </p>
              </div>
              <div className="w-full sm:w-64 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {displayStep}/{totalSteps}
                </span>
                <Progress value={progress} className="h-2 flex-1" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center"
        >
          <div className="w-full max-w-md p-6 rounded-lg bg-card shadow-lg text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            </motion.div>

            <h2 className="text-2xl font-bold mb-3">Creating Your Profile</h2>

            <motion.div
              key={loadingStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <p className="text-lg font-medium text-primary">
                {loadingSteps[loadingStep]}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This may take a moment as we create your personalized care
                experience
              </p>
            </motion.div>

            <Progress
              value={(loadingStep + 1) * (100 / loadingSteps.length)}
              className="h-2 w-full mt-4"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Step {loadingStep + 1} of {loadingSteps.length}
            </p>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div
        className={`flex-1 container ${
          step > 0 && !showPasscodeScreen && "px-4"
        } py-6`}
      >
        <motion.div
          key={showPasscodeScreen ? "passcode" : step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </div>

      {/* Footer with navigation buttons - Hidden on privacy agreement screen and passcode screen */}
      {showNavigation && (
        <div className="sticky bottom-0 z-50 border-t bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto py-4 px-4">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1 || isSubmitting} // Disable back button on first actual form or when submitting
                className="flex items-center"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="flex items-center"
                >
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
                    <>Processing...</>
                  ) : (
                    <>
                      Upload Patient Information
                      <Check className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientOnboarding;
