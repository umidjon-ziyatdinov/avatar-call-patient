// @ts-nocheck
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import PrivacyStep from "./PrivacyStep";
import BasicInfoStep from "./BasicInfoStep";
import AvatarImageStep from "./AvatarImageStep";
import PersonalityStep from "./PersonalityStep";
import ReviewStep from "./ReviewStep";

// Types
export type AvatarData = {
  privacyAgreed: boolean;
  name: string;
  role: string;
  about: string;
  age: string;
  sex: string;
  avatar: File | null;
  personality: {
    memoryEngagement: number;
    anxietyManagement: number;
    activityEngagement: number;
    socialConnection: number;
  };
};

const AvatarCreationForm = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(0);
  const [avatarData, setAvatarData] = useState<AvatarData>({
    privacyAgreed: false,
    name: "",
    role: "",
    about: "",
    age: "",
    sex: "",
    avatar: null,
    personality: {
      memoryEngagement: 50,
      anxietyManagement: 50,
      activityEngagement: 50,
      socialConnection: 50,
    },
  });

  const pageVariants = {
    initial: { opacity: 0, x: "-100%" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100%" },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0); // Track which step of the loading process we're on

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));
  const loadingSteps = [
    "Validating patient information...",
    "Processing background details...",
    "Creating personalized profile...",
    "Configuring companion settings...",
    "Finalizing care plan...",
  ];
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
    const clearLoadingInterval = simulateLoadingSteps();
    try {
      // Validate all fields
      const requiredFields = [
        "name",
        "role",
        "about",
        "age",
        "sex",
        "avatar",
        "privacyAgreed",
      ];

      const missingFields = requiredFields.filter((field) => {
        if (field === "avatar") return !avatarData.avatar;
        if (field === "privacyAgreed") return !avatarData.privacyAgreed;
        return !avatarData[field as keyof AvatarData];
      });

      if (missingFields.length > 0) {
        toast.error("Please fill in all required fields", {
          description: `Missing: ${missingFields.join(", ")}`,
        });
        return;
      }

      // Create FormData for submission
      const formData = new FormData();
      Object.entries(avatarData).forEach(([key, value]) => {
        if (key === "avatar" && value) {
          formData.append("avatarFile", value);
        } else if (key === "personality") {
          formData.append("personality", JSON.stringify(value));
        } else if (key === "promptAnswers") {
          formData.append("promptAnswers", JSON.stringify(value));
        } else if (key !== "privacyAgreed") {
          formData.append(key, String(value as string));
        }
      });

      const response = await fetch("/api/avatar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();

        if (result.simli?.characterId) {
          toast.success("Avatar Created Successfully", {
            description:
              "Your avatar is being processed. The face generation has been queued and will be ready shortly.",
          });

          onClose();
        }

        // Redirect or reset form
      } else {
        const errorData = await response.json();
        toast.error("Avatar Creation Failed", {
          description: errorData.error || "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Submission Failed", {
        description: "Please try again later",
      });
    } finally {
      clearLoadingInterval(); // Clear the interval when done
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <PrivacyStep
            data={avatarData}
            updateData={setAvatarData}
            nextStep={nextStep}
          />
        );
      case 1:
        return (
          <BasicInfoStep
            data={avatarData}
            updateData={setAvatarData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 2:
        return (
          <AvatarImageStep
            data={avatarData}
            updateData={setAvatarData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <PersonalityStep
            data={avatarData}
            updateData={setAvatarData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <ReviewStep
            data={avatarData}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex-grow-1 w-full flex flex-col  items-start justify-start bg-background pb-4 overflow-y-auto ">
      {/* Loading Overlay */}
      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center"
        >
          <div className="w-full max-w-md p-8 rounded-xl bg-card shadow-2xl text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className="relative"
            >
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary relative" />
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">
                Creating Your Avatar
              </h2>

              <motion.div
                key={loadingStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-3"
              >
                <p className="text-xl font-medium text-primary">
                  {loadingSteps[loadingStep]}
                </p>
                <p className="text-sm text-muted-foreground">
                  Please wait while we process your information and create your
                  personalized avatar
                </p>
              </motion.div>

              <div className="space-y-2">
                <Progress
                  value={(loadingStep + 1) * (100 / loadingSteps.length)}
                  className="h-2.5 w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>
                    {Math.round(
                      (loadingStep + 1) * (100 / loadingSteps.length)
                    )}
                    %
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 mt-4">
                {loadingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-colors duration-300 ${
                      index <= loadingStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Step {loadingStep + 1} of {loadingSteps.length}
            </p>
          </div>
        </motion.div>
      )}

      {step > 0 && (
        <div className="sticky top-[-20px] mt-[-20px] z-50 bg-background border-b w-full">
          <div className="container mx-auto py-4 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  Avtar Creation
                </h1>
                <p className="text-muted-foreground">
                  Step {step} of {4}
                </p>
              </div>
              <div className="w-full sm:w-64 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {step}/{4}
                </span>
                <Progress value={(step / 4) * 100} className="h-2 flex-1" />
              </div>
            </div>
          </div>
        </div>
      )}
      <Card className="w-full px-2  flex-grow-1  max-w-full p-4 h-full relative border-none  ">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial="initial"
            animate="in"
            exit="out"
            className="overflow-y-auto"
            variants={pageVariants}
            transition={pageTransition}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default AvatarCreationForm;
