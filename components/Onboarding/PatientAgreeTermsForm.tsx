"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Shield, LockKeyhole, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrivacyAgreementFormProps {
  onAccept: () => void;
}

const PrivacyAgreementForm: React.FC<PrivacyAgreementFormProps> = ({
  onAccept,
}) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToDataUse, setAgreedToDataUse] = useState(false);

  const allAgreed = agreedToTerms && agreedToPrivacy && agreedToDataUse;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl "
    >
      <Card className="border-none rounded-none shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to Reminisce Ai
          </CardTitle>
          <CardDescription className="text-center text-base">
            Before we begin personalizing your care companion, please review and
            accept our terms
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Data Usage Section */}
          <div className="p-4 rounded-lg border bg-card/50">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">
                  How We Use Your Information
                </h3>
                <p className="text-muted-foreground text-sm">
                  The information you provide will be used to create a
                  personalized care avatar tailored to the patient&apos;s
                  background, preferences, and needs. This helps us deliver more
                  meaningful interactions and better support their well-being.
                </p>
              </div>
            </div>
          </div>

          {/* Warning About Sensitive Data */}
          <div className="p-4 rounded-lg border bg-card/50">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Important Warning</h3>
                <p className="text-muted-foreground text-sm">
                  <strong>Do not upload any sensitive patient data</strong> such
                  as medical record numbers, social security numbers, full
                  addresses, or detailed medical histories. This platform is not
                  designed to store or process protected health information
                  (PHI) as defined by HIPAA.
                </p>
              </div>
            </div>
          </div>

          {/* Data Security Section */}
          <div className="p-4 rounded-lg border bg-card/50">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Data Security</h3>
                <p className="text-muted-foreground text-sm">
                  We implement robust security measures to protect your
                  information. The data you provide is encrypted and stored
                  securely. We only collect what&apos;s necessary to create a
                  meaningful care experience.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Policy Section */}
          <div className="p-4 rounded-lg border bg-card/50">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <LockKeyhole className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Privacy Policy</h3>
                <p className="text-muted-foreground text-sm">
                  Our comprehensive privacy policy describes how we handle your
                  information, your rights, and how you can control your data.
                  We never sell your personal information to third parties.
                </p>
                <Button variant="link" className="h-auto p-0">
                  View full Privacy Policy
                </Button>
              </div>
            </div>
          </div>

          {/* Agreement Checkboxes */}
          <div className="space-y-4 pt-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={() => setAgreedToTerms(!agreedToTerms)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the Terms of Service
                </Label>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy"
                checked={agreedToPrivacy}
                onCheckedChange={() => setAgreedToPrivacy(!agreedToPrivacy)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="privacy"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the Privacy Policy
                </Label>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="data-use"
                checked={agreedToDataUse}
                onCheckedChange={() => setAgreedToDataUse(!agreedToDataUse)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="data-use"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I understand how my data will be used and stored
                </Label>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-4">
            <Button
              onClick={onAccept}
              disabled={!allAgreed}
              className="w-full"
              size="lg"
            >
              I Agree, Continue to Onboarding
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-2">
              By continuing, you consent to our terms and privacy policy
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PrivacyAgreementForm;
