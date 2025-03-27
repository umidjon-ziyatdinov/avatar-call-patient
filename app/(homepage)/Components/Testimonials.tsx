// @ts-nocheck
import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Home as HomeIcon,
  Hospital as HospitalIcon,
  Stethoscope as StethoscopeIcon,
} from "lucide-react";

interface TimelineItem {
  time: string;
  icon: React.ElementType;
  title: string;
  description: string;
  personName: string;
  role: string;
  color: string;
}

const timelineData: TimelineItem[] = [
  {
    time: "Morning",
    icon: HomeIcon,
    title: "Family Connection Restored",
    description:
      "Using Reminisce AI, I can now connect with my mother daily, understanding her <span class='text-blue-600 font-bold'>emotional state and memories.</span>",
    personName: "Sarah Thompson",
    role: "Daughter and Caregiver",
    color: "bg-blue-100",
  },
  {
    time: "Afternoon",
    icon: HospitalIcon,
    title: "Personalized Companionship",
    description:
      "The AI companion brings joy to my day, helping me <span class='text-green-600 font-bold'>recall cherished memories and feel less isolated.</span>",
    personName: "Robert Martinez",
    role: "Nursing Home Resident",
    color: "bg-green-100",
  },
  {
    time: "Evening",
    icon: StethoscopeIcon,
    title: "Proactive Healthcare Monitoring",
    description:
      "Reminisce AI provides <span class='text-purple-600 font-bold'>critical insights into patient well-being</span>, allowing us to intervene early and provide personalized care.",
    personName: "Dr. Emily Chen",
    role: "Healthcare Administrator",
    color: "bg-purple-100",
  },
];

const InteractiveTimeline: React.FC = () => {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  const timelineVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="container mx-auto px-4 py-16 relative">
      <motion.div
        ref={containerRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={timelineVariants}
        className="relative"
      >
        <h2 className="text-4xl font-bold text-center mb-16 md:mb-[150px] text-gray-800">
          Reminisce AI: A Day in Care
        </h2>

        {/* Desktop Timeline */}
        <div className="hidden md:block relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gray-200 z-0"></div>

          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              className={`
                flex items-center mb-16 relative 
                ${index % 2 === 0 ? "flex-row-reverse" : ""}
              `}
              onHoverStart={() => setActiveItem(index)}
              onHoverEnd={() => setActiveItem(null)}
            >
              {/* Timeline Dot */}
              <div
                className={`
                absolute left-1/2 transform -translate-x-1/2 
                w-6 h-6 rounded-full z-10 
                ${
                  activeItem === index
                    ? "bg-blue-500 scale-150"
                    : "bg-white border-4 border-blue-500"
                }
              `}
              ></div>

              {/* Card */}
              <div
                className={`
                w-1/2 p-6 
                ${index % 2 === 0 ? "mr-auto pl-16" : "ml-auto pr-16"}
              `}
              >
                <Card
                  className={`
                    shadow-lg transition-all duration-300 
                    ${
                      activeItem === index
                        ? "scale-105 shadow-2xl"
                        : "scale-100"
                    } ${item.color}
                  `}
                >
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <div className="bg-white p-3 rounded-full shadow-md">
                      <item.icon className="text-blue-600" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {item.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="text-gray-700 mb-4"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">
                        {item.personName}
                      </p>
                      <p className="text-gray-600">{item.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden space-y-8">
          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              <Card className={`${item.color} shadow-lg`}>
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    <item.icon className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {item.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p
                    className="text-gray-700 mb-4"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />

                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">
                      {item.personName}
                    </p>
                    <p className="text-gray-600">{item.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveTimeline;
