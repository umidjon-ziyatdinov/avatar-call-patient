"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  HeartHandshakeIcon,
  UserIcon,
  ClockIcon,
  ActivityIcon,
} from "lucide-react";

const ProblemSolutionSection = () => {
  const problemSolutionData = [
    {
      problem: "Isolation & Loneliness",
      description:
        "Dementia patients often feel disconnected, experiencing limited social interactions and emotional support.",
      solution:
        "24/7 AI Companion that provides consistent, personalized conversation",
      icon: HeartHandshakeIcon,
      color: "text-blue-600",
    },
    {
      problem: "Caregiver Burnout",
      description:
        "Family members and caregivers struggle with constant care demands, leading to emotional and physical exhaustion.",
      solution:
        "Reduces caregiver strain by providing ongoing emotional support and engagement",
      icon: UserIcon,
      color: "text-green-600",
    },
    {
      problem: "Memory Deterioration",
      description:
        "Cognitive decline makes it challenging to maintain meaningful conversations and recall personal memories.",
      solution:
        "AI-powered memory prompts and personalized interaction to stimulate cognitive engagement",
      icon: ClockIcon,
      color: "text-purple-600",
    },
    {
      problem: "Health Monitoring",
      description:
        "Limited insights into patient's daily emotional and cognitive state create challenges for proactive care.",
      solution:
        "Real-time health insights and alerts for caregivers and healthcare professionals",
      icon: ActivityIcon,
      color: "text-red-600",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Understanding the <span className="text-blue-600">Challenges</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dementia care is complex. Reminisce AI provides a compassionate,
            technological solution to support patients and their loved ones.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {problemSolutionData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
              }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className={`mr-4 ${item.color}`}>
                    <item.icon size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {item.problem}
                  </h3>
                </div>
                <div className="flex-grow">
                  <p className="text-gray-600 mb-4">{item?.description}</p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className={`font-medium ${item?.color}`}>
                      Solution: {item?.solution}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
