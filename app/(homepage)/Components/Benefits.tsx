import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HeartPulse,
  MessageCircleHeart,
  BookUser,
  Watch,
  Shield,
} from "lucide-react";

interface BenefitItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <motion.div
    whileHover={{
      scale: 1.05,
      boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
    }}
    transition={{ type: "spring", stiffness: 300 }}
    className="h-full"
  >
    <Card className="h-full hover:border-primary/50 transition-all duration-300">
      <CardHeader>
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.4 }}
          className="mb-2"
        >
          <Icon className="w-10 h-10 text-secondary" />
        </motion.div>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const Benefits: React.FC = () => {
  const patientBenefits: BenefitItemProps[] = [
    {
      icon: HeartPulse,
      title: "Emotional Support",
      description:
        "Personalized AI companions provide consistent, compassionate interaction tailored to individual emotional needs.",
    },
    {
      icon: MessageCircleHeart,
      title: "Familiar Conversations",
      description:
        "Avatars reflect personal memories and communication styles, creating a sense of comfort and familiarity.",
    },
    {
      icon: BookUser,
      title: "Memory Engagement",
      description:
        "Interactive dialogues help stimulate cognitive function and provide meaningful mental stimulation.",
    },
  ];

  const caregiverBenefits: BenefitItemProps[] = [
    {
      icon: Watch,
      title: "Real-time Monitoring",
      description:
        "Receive instant insights and alerts about patient emotional state and potential health risks.",
    },
    {
      icon: Shield,
      title: "Comprehensive Insights",
      description:
        "Access detailed conversation summaries and behavioral analysis to support patient care.",
    },
    {
      icon: HeartPulse,
      title: "Customization Control",
      description:
        "Easily personalize AI avatars to match patient preferences and background.",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-16 md:py-[150px] "
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold text-center mb-12 md:mb-[80px] text"
        >
          Benefits for Everyone
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Patients Column */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 bg-teal-50 p-6 rounded-lg"
          >
            <h3 className="text-3xl font-bold mb-4 text">For Patients</h3>
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
              {patientBenefits.map((benefit, index) => (
                <BenefitItem key={index} {...benefit} />
              ))}
            </div>
          </motion.div>

          {/* Caregivers Column */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 bg-blue-50 p-6 rounded-lg"
          >
            <h3 className="text-3xl font-bold mb-4 text">For Caregivers</h3>
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
              {caregiverBenefits.map((benefit, index) => (
                <BenefitItem key={index} {...benefit} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Benefits;
