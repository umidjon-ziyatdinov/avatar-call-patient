import React from 'react';
import { Phone } from 'lucide-react';

const RingingAnimation = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
      <div className="relative">
        {/* Outer ring */}
        <div className="absolute -inset-4 border-4 border-green-400/40 rounded-full animate-ping" />
        
        {/* Middle ring */}
        <div className="absolute -inset-8 border-4 border-green-400/30 rounded-full animate-ping [animation-delay:200ms]" />
        
        {/* Inner ring */}
        <div className="absolute -inset-12 border-4 border-green-400/20 rounded-full animate-ping [animation-delay:400ms]" />
        
        {/* Phone icon in center */}
        <div className="relative z-10 h-16 w-16 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
          <Phone className="h-8 w-8 text-white" />
        </div>
      </div>
      
      {/* Connection text */}
      <div className="absolute bottom-1/4 text-center">
        <p className="text-white text-lg font-medium">Ringing...</p>
        <p className="text-white/70 text-sm mt-2">Please wait while we establish connection</p>
      </div>
    </div>
  );
};

export default RingingAnimation;