// app/OnboardingWrapper.tsx
'use client';

import React, { useState } from 'react';
import { Splash } from './Splash';


interface OnboardingWrapperProps {
  children: React.ReactNode;
}

export function SplashWrapper({ children }: OnboardingWrapperProps) {
  const [showContent, setShowContent] = useState(false);

  return (
    <>
      <Splash onComplete={() => setShowContent(true)} />
      <div className={`transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'} w-full`}>
        {children}
      </div>
    </>
  );
}