// @ts-nocheck
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import happy from "@/assets/images/happy.png";
import drug from "@/assets/images/together.png";
import patient from "@/assets/images/patient.png";
import phone from "@/assets/images/phone.png";
import "swiper/css";
import "swiper/css/effect-fade";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "./hero.css";

const ReminisceHero = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    patientCondition: "",
    email: "",
  });

  const onboardingQuestions = [
    {
      title: "Tell Us About Your Loved One",
      description: "Help us create a personalized AI companion",
      fields: [
        {
          label: "Patient's Name",
          name: "name",
          type: "text",
          placeholder: "Enter patient's name",
        },
        {
          label: "Your Relationship",
          name: "relationship",
          type: "select",
          options: ["Spouse", "Child", "Grandchild", "Caregiver", "Other"],
        },
      ],
    },
    {
      title: "Understanding Their Needs",
      description: "This helps us tailor the AI companion",
      fields: [
        {
          label: "Patient's Primary Condition",
          name: "patientCondition",
          type: "select",
          options: [
            "Dementia",
            "Alzheimer's",
            "Memory Loss",
            "Cognitive Impairment",
            "Other",
          ],
        },
        {
          label: "Contact Email",
          name: "email",
          type: "email",
          placeholder: "Your email for updates",
        },
      ],
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    if (onboardingStep < onboardingQuestions.length - 1) {
      setOnboardingStep((prev) => prev + 1);
    } else {
      // Submit form logic here
      console.log("Submitting:", formData);
      setIsDialogOpen(false);
    }
  };

  const heroImages = [
    {
      url: happy,
      title: "Compassionate Care",
    },
    {
      url: drug,
      title: "Memory Connection",
    },
    {
      url: phone,
      title: "AI Companion",
    },
  ];

  return (
    <div className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-blue-300 to-white">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-5xl font-bold text-gray-800 leading-tight">
            Reconnect with <br />
            <span className="text-blue-500 font-[800]">Loved Ones</span>
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Personalized AI companions bringing comfort and connection to
            patients with dementia.
          </p>

          <Button
            size="lg"
            className="bg-primary hover:bg-primary/80 hover:scale-105 transition-all text-xl px-8 py-4"
            onClick={() => {
              setIsDialogOpen(true);
              setOnboardingStep(0);
            }}
          >
            Try It For Free
          </Button>
        </motion.div>

        {/* Image Swiper */}
        <div className="hidden md:block relative h-[500px] w-full  mx-auto shadow-inner- shadow-2xl">
          <Swiper
            modules={[EffectFade, Autoplay]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            loop={true}
            className="w-full h-full overflow-hidden  shadow-[0_8px_30px_#ffffff] hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)] transition-shadow duration-300"
          >
            {heroImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img
                    src={image.url?.src}
                    alt={image.title}
                    className="w-full h-full object-cover "
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-white text-xl font-semibold">
                      {image.title}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Onboarding Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-3xl text-blue-600">
              {onboardingQuestions[onboardingStep].title}
            </DialogTitle>
            <DialogDescription>
              {onboardingQuestions[onboardingStep].description}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {onboardingQuestions[onboardingStep].fields.map((field) => (
              <div
                key={field.name}
                className="grid grid-cols-4 items-center gap-4"
              >
                <Label htmlFor={field.name} className="text-right">
                  {field.label}
                </Label>
                {field.type === "select" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="col-span-3 p-2 border rounded-md"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleNextStep}
            >
              {onboardingStep < onboardingQuestions.length - 1
                ? "Next"
                : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReminisceHero;
