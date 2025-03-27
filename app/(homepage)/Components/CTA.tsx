"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, Calendar, Play, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const FinalCTASection = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Infographic & Questions */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4 mb-4">
            <HelpCircle className="w-12 h-12 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Still Not Sure?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center space-x-4">
                <Calendar className="w-8 h-8 text-secondary" />
                <div>
                  <h3 className="font-semibold">Personalized Walkthrough</h3>
                  <p className="text-sm text-muted-foreground">
                    Book a 30-minute consultation
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center space-x-4">
                <Play className="w-8 h-8 text-accent" />
                <div>
                  <h3 className="font-semibold">Quick Demo</h3>
                  <p className="text-sm text-muted-foreground">
                    See ReminisceAI in action
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            We understand choosing a care solution is a significant decision.
            Let us help you explore how ReminisceAI can provide comfort and
            support for your loved ones.
          </p>
        </div>

        {/* Right Side: CTA Buttons */}
        <div className="space-y-6">
          <div className="bg-muted/50 rounded-2xl p-8 border border-border">
            <h3 className="text-2xl font-bold mb-4 text-primary">
              Ready to Transform Care?
            </h3>

            <div className="space-y-4">
              <Button asChild size="lg" className="w-full group">
                <Link
                  href="https://meetings.hubspot.com/reminisceai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Schedule a Free Consultation
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted-foreground/30"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                asChild
                size="lg"
                className="w-full group"
              >
                <Link href="/product-overview">
                  Try It For Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                No credit card required • Instant setup •
                <span className="text-primary ml-1 hover:underline">
                  <Link href="/privacy">Privacy Guaranteed</Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
