import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  UserIcon,
  VideoIcon,
  BellIcon,
  ActivityIcon,
  ShieldIcon,
} from "lucide-react";
import patient from "@/assets/images/benefit.png";
import Image from "next/image";

const FeatureShowcase = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const features = [
    {
      icon: UserIcon,
      title: "Personalized AI Avatars",
      description:
        "Custom companions tailored to individual memories and preferences",
      color: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: VideoIcon,
      title: "Lifelike Conversations",
      description:
        "Natural, engaging video and chat interactions mimicking human connection",
      color: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: BellIcon,
      title: "Real-time Monitoring",
      description:
        "Continuous insights into emotional state and potential health risks",
      color: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      icon: ActivityIcon,
      title: "Cognitive Engagement",
      description:
        "Memory prompts and interactive tools to support mental stimulation",
      color: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      icon: ShieldIcon,
      title: "Caregiver Dashboard",
      description:
        "Comprehensive tools for avatar management and patient insights",
      color: "bg-red-50",
      textColor: "text-red-600",
    },
  ];

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={ref} className="relative py-16 bg-white overflow-clip">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our <span className="text-blue-600">Key Features</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Innovative technology designed to provide compassionate,
            personalized care
          </p>
        </motion.div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 gap-12 items-center">
            {/* Left Side: Illustration Placeholder */}
            <motion.div
              style={{ y }}
              className="bg-blue-50/50 rounded-xl aspect-square flex items-center justify-center"
            >
              <Image
                src={patient}
                alt="Reminisce AI Features"
                className="max-w-full rounded-xl object-cover shadow-lg"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </motion.div>

            {/* Right Side: Features Carousel */}
            <div className="space-y-6 overflow-hidden">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 200 }}
                  layout
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.3,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  viewport={{ once: true }}
                  className={`${feature.color} rounded-xl p-6 shadow-md hover:shadow-xl `}
                >
                  <div className="flex items-center mb-4">
                    <feature.icon
                      className={`mr-4 ${feature.textColor}`}
                      size={48}
                      strokeWidth={1.5}
                    />
                    <h3 className="text-2xl font-bold text-gray-800">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                }}
                viewport={{ once: true }}
                className={`${feature.color} rounded-xl p-6 shadow-md`}
              >
                <div className="flex items-center mb-4">
                  <feature.icon
                    className={`mr-4 ${feature.textColor}`}
                    size={40}
                    strokeWidth={1.5}
                  />
                  <h3 className="text-2xl font-bold text-gray-800">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-lg text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
