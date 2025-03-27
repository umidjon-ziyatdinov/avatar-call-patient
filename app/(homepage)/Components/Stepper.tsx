import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  VideoIcon,
  MessageCircleIcon,
  AlertCircleIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Step configuration type
interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

const HowItWorksStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Steps configuration
  const steps: StepConfig[] = [
    {
      id: 1,
      title: "Set up Personalized Avatars",
      description:
        "Create avatars with unique characteristics tailored to individual patients.",
      icon: UserIcon,
    },
    {
      id: 2,
      title: "Patients Connect via Video Calls",
      description:
        "Simple, intuitive interface for seamless video interactions.",
      icon: VideoIcon,
    },
    {
      id: 3,
      title: "AI Engages in Conversations",
      description:
        "Meaningful, personalized discussions that feel natural and supportive.",
      icon: MessageCircleIcon,
    },
    {
      id: 4,
      title: "Caregivers Receive Insights",
      description:
        "Real-time health and emotional alerts to monitor patient well-being.",
      icon: AlertCircleIcon,
    },
  ];

  // Autoplay effect
  useEffect(() => {
    const autoPlayInterval = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % steps.length);
    }, 5000); // Change step every 5 seconds

    return () => clearInterval(autoPlayInterval);
  }, [steps.length]);

  // Progress bar effect
  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 100);
    setProgress(0);

    return () => clearTimeout(timer);
  }, [activeStep]);

  // Animation variants
  const stepVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.2,
        duration: 0.5,
      },
    }),
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  return (
    <section className="w-full py-12 md:py-[150px] bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary-600">
          How Reminisce AI Works
        </h2>

        {/* Desktop Horizontal Stepper */}
        <div className="hidden md:block  mt-6">
          <div className="relative">
            {/* Progress Line */}
            <motion.div
              className="absolute top-8 h-1 bg-secondary"
              style={{ left: "120px", zIndex: 2 }}
              animate={{
                width: `calc(${(activeStep / (steps.length - 1)) * 100}% - ${
                  activeStep * 80
                }px)`,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            <div
              className="absolute inset-x-0 top-8 h-1 mx-[120px] bg-gray-200"
              style={{ zIndex: 1 }}
            />
            {/* Steps Container */}
            <div className="flex justify-between items-center relative">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === activeStep;
                const isPassed = index < activeStep;

                return (
                  <motion.div
                    key={step.id}
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    variants={stepVariants}
                    custom={index}
                    viewport={{ once: true }}
                    className={`
                      flex flex-col items-center z-20 cursor-pointer
                      duration-300 ease-in-out
                    `}
                    onClick={() => setActiveStep(index)}
                  >
                    <div
                      className={`
                        w-16 h-16 rounded-full flex items-center justify-center mb-4
                        border-2 duration-300
                        ${
                          isActive
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/50 a"
                            : isPassed
                            ? "bg-secondary text-white border-primary/50"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }
                      `}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3
                      className={`
                      text-center font-semibold text-sm
                      ${isActive ? "text-primary-600" : "text-gray-600"}
                    `}
                    >
                      {step.title}
                    </h3>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress Bar */}

            {/* Description Card with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-12"
              >
                <Card className="max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle>{steps[activeStep].title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      {steps[activeStep].description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Vertical Stepper */}
        <div className="md:hidden space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;

            return (
              <motion.div
                key={step.id}
                initial="hidden"
                whileInView="visible"
                variants={stepVariants}
                custom={index}
                viewport={{ once: true }}
                className="flex items-center space-x-4"
              >
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${
                      isActive
                        ? "bg-primary text-white shadow-lg"
                        : "bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3
                    className={`
                    font-semibold text-base
                    ${isActive ? "text-primary" : "text-gray-800"}
                  `}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksStepper;
