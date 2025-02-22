// @ts-nocheck
import React, { useState } from 'react';
import { MessageSquare, Brain, Smile, Activity, ArrowDown, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const PersonalizedChatInterface = ({ avatar, patientDetails }) => {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const startChat = (topic) => {
    console.log(`Starting chat about: ${topic}`);
  };

  const quickActions = [
    {
      icon: MessageSquare,
      title: "Open Chat",
      description: "Start a free-flowing conversation",
      color: "bg-blue-500/10 text-blue-500",
      delay: 0.1
    },
    {
      icon: Brain,
      title: "Memory Exercise",
      description: "Quick brain training session",
      color: "bg-purple-500/10 text-purple-500",
      delay: 0.2
    },
    {
      icon: Smile,
      title: "Mood Check",
      description: "Share how you're feeling",
      color: "bg-green-500/10 text-green-500",
      delay: 0.3
    },
    {
      icon: Activity,
      title: "Daily Activities",
      description: "Let's review your day",
      color: "bg-orange-500/10 text-orange-500",
      delay: 0.4
    },
  ];

  return (
    <div className="flex flex-col h-full w-full max-w-lg mx-auto">
      {/* Welcome Section with Fade-in Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative p-6 text-center"
      >
        <div 
          className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent"
          style={{ height: '65%' }}
        />
        <div className="relative">
          <h1 className="text-2xl font-medium mb-2">
            Good {getTimeBasedGreeting()}, {patientDetails?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">
            How would you like to connect with {avatar.name} today?
          </p>
        </div>
      </motion.div>

      {/* Scrolling Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center mb-4"
      >
        <ArrowDown className="size-6 text-primary animate-bounce" />
      </motion.div>

      {/* Quick Actions - Vertical Stack */}
      <div className="px-4 space-y-3 mb-6">
        {quickActions.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: item.delay, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="ghost"
              className="w-full p-4 h-auto flex items-center gap-4 hover:bg-accent transition-all duration-200 rounded-xl"
              onClick={() => startChat(item.title)}
            >
              <div className={`p-3 rounded-xl ${item.color}`}>
                <item.icon className="size-5" />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="font-medium">{item.title}</span>
                <span className="text-sm text-muted-foreground">
                  {item.description}
                </span>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Interactive Bottom Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-auto p-6 flex flex-col items-center gap-4 bg-gradient-to-t from-background to-transparent"
      >
        <div className="text-center mb-2">
          <p className="text-sm text-muted-foreground mb-2">
            Need immediate assistance?
          </p>
        
        </div>
        
        <motion.div 
          className="w-1.5 h-1.5 bg-primary rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.div>
    </div>
  );
};

export default PersonalizedChatInterface;