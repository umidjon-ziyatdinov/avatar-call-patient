"use client";
import React from "react";
import ReminisceHero from "./Components/Hero";
import ProblemSolutionSection from "./Components/Problem";
import FeatureShowcase from "./Components/Features";
import HowItWorksStepper from "./Components/Stepper";
import BenefitsSection from "./Components/Benefits";
import TestimonialTimeline from "./Components/Testimonials";
import FAQSection from "./Components/Faq";
import FinalCTASection from "./Components/CTA";

const Home = () => {
  return (
    <div className="max-w-full">
      <ReminisceHero />
      <ProblemSolutionSection />
      <FeatureShowcase />
      <HowItWorksStepper />
      <BenefitsSection />
      <TestimonialTimeline />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
};

export default Home;
