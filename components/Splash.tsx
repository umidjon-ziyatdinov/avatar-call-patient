'use client';

import React, { useEffect, useState } from 'react';

interface OnboardingSplashProps {
  onComplete?: () => void;
}

export function Splash({ onComplete }: OnboardingSplashProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <style jsx>{`
        @keyframes gradientFlow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes textGradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .gradient-bg {
          background: linear-gradient(
            135deg,
            #0f172a 0%,
            #1e293b 25%,
            #334155 50%,
            #1e293b 75%,
            #0f172a 100%
          );
          background-size: 400% 400%;
          animation: gradientFlow 15s ease infinite;
        }

        .text-animate {
          animation: fadeInUp 0.8s ease forwards;
          background: linear-gradient(
            90deg,
            #60a5fa 0%,
            #38bdf8 20%,
            #818cf8 40%,
            #38bdf8 60%,
            #60a5fa 80%,
            #38bdf8 100%
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: 
            fadeInUp 0.8s ease forwards,
            textGradient 4s linear infinite;
        }

        .glow {
          animation: glowPulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="absolute inset-0 gradient-bg">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.1), transparent 70%)'
          }}
        />
      </div>

      <div className="relative text-center z-10">
        <h1 
          className="text-4xl md:text-6xl font-bold tracking-wider text-animate"
          style={{
            textShadow: '0 0 20px rgba(56, 189, 248, 0.2)'
          }}
        >
          Reminisce AI
        </h1>
        
        <div className="mt-6 flex justify-center">
          <div 
            className="w-16 h-0.5 rounded-full glow"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.7), transparent)'
            }}
          />
        </div>
      </div>
    </div>
  );
}