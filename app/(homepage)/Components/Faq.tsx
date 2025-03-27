"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      id: "item-1",
      question: "How does Reminisce AI help patients with dementia?",
      answer:
        "Reminisce AI creates personalized AI companions that provide consistent, compassionate interaction. Our avatars are customized to reflect familiar personalities, helping reduce feelings of isolation and providing cognitive stimulation through tailored conversations.",
      defaultOpen: true,
    },
    {
      id: "item-2",
      question: "Is the platform secure and private?",
      answer:
        "Absolutely. We prioritize patient privacy with end-to-end encryption, HIPAA-compliant data handling, and strict access controls. Only authorized caregivers can access and customize the AI companions, ensuring complete confidentiality.",
      defaultOpen: false,
    },
    {
      id: "item-3",
      question: "How are the AI avatars personalized?",
      answer:
        "Caregivers can customize avatars by inputting personal details, memories, preferences, and interaction styles. Our AI uses this information to create a deeply personalized companion that feels familiar and comforting to the patient.",
      defaultOpen: false,
    },
    {
      id: "item-4",
      question: "What technology powers Reminisce AI?",
      answer:
        "We use advanced natural language processing and machine learning algorithms to create responsive, empathetic AI companions. Our technology adapts to each patient's communication style, emotional state, and cognitive abilities.",
      defaultOpen: false,
    },
    {
      id: "item-5",
      question: "Can the platform be used in different care settings?",
      answer:
        "Yes! Reminisce AI is flexible and can be used in various environments: nursing homes, assisted living facilities, home care settings, and hospitals. Our platform adapts to different care contexts and patient needs.",
      defaultOpen: false,
    },
    {
      id: "item-6",
      question: "How do caregivers monitor interactions?",
      answer:
        "Our comprehensive admin dashboard provides real-time insights, including call logs, conversation summaries, emotional state tracking, and potential health risk alerts. Caregivers can review and adjust avatar interactions as needed.",
      defaultOpen: false,
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-heading">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Learn more about how Reminisce AI supports patients and caregivers
          through innovative AI companionship.
        </p>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full space-y-4"
        defaultValue="item-1"
      >
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="border border-border rounded-lg  hover:border-primary/20"
          >
            <AccordionTrigger className="px-6 py-4  rounded-t-lg text-left text-base font-bold">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 text-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="text-center mt-12">
        <p className="text-muted-foreground text-sm md:text-md">
          Still have questions?
          <a
            href="https://meetings.hubspot.com/reminisceai"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-primary hover:underline"
          >
            Schedule a Free Consultation
          </a>
        </p>
      </div>
    </section>
  );
};

export default FAQSection;
