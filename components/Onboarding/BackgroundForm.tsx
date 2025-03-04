import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Info, X, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientDetails } from "@/types/patient";

interface BackgroundFormProps {
  patientDetails: PatientDetails;
  handleInputChange: (field: keyof PatientDetails, value: string) => void;
}

// FallRiskInfo component
const FallRiskInfo: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <Card className="mb-4 relative border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 text-amber-700 dark:text-amber-300 hover:text-amber-900 hover:bg-amber-100 dark:hover:bg-amber-900/30"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center text-amber-700 dark:text-amber-300">
          <AlertCircle className="h-4 w-4 mr-2" />
          What is Fall Risk?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
          A person is considered at risk for falls if they have one or more of
          the following:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-amber-700 dark:text-amber-300">
          <li>History of previous falls</li>
          <li>Balance or mobility issues</li>
          <li>Take medications that might cause dizziness</li>
          <li>Vision problems</li>
          <li>Cognitive impairment</li>
          <li>Environmental hazards at home</li>
        </ul>
        <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
          This information helps us tailor conversations to include safety
          reminders when appropriate.
        </p>
      </CardContent>
    </Card>
  );
};

const BackgroundForm: React.FC<BackgroundFormProps> = ({
  patientDetails,
  handleInputChange,
}) => {
  const [showFallRiskInfo, setShowFallRiskInfo] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Background</h2>
      <p className="text-muted-foreground">
        This information helps us understand your context better to create a
        personalized experience.
      </p>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="education">Education</Label>
          <Input
            id="education"
            value={patientDetails.education}
            onChange={(e) => handleInputChange("education", e.target.value)}
            placeholder="Highest education level or field of study"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="work">Work/Former Occupation</Label>
          <Input
            id="work"
            value={patientDetails.work}
            onChange={(e) => handleInputChange("work", e.target.value)}
            placeholder="Current or previous work"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="fallRisk" className="font-medium">
              Fall Risk Assessment
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-primary"
                    onClick={() => setShowFallRiskInfo(!showFallRiskInfo)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-60">
                    Click for more information about fall risk assessment
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {showFallRiskInfo && (
            <FallRiskInfo onClose={() => setShowFallRiskInfo(false)} />
          )}

          <Select
            value={patientDetails.fallRisk}
            onValueChange={(value) => handleInputChange("fallRisk", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fall risk status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes - At risk for falls</SelectItem>
              <SelectItem value="no">No - Not at risk for falls</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="likes">Things you enjoy</Label>
          <Textarea
            id="likes"
            value={patientDetails.likes}
            onChange={(e) => handleInputChange("likes", e.target.value)}
            placeholder="Activities, topics or things you enjoy"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dislikes">
            Things you dislike or find triggering
          </Label>
          <Textarea
            id="dislikes"
            value={patientDetails.dislikes}
            onChange={(e) => handleInputChange("dislikes", e.target.value)}
            placeholder="Topics or things you prefer to avoid"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="symptoms">Current symptoms or health concerns</Label>
          <Textarea
            id="symptoms"
            value={patientDetails.symptoms}
            onChange={(e) => handleInputChange("symptoms", e.target.value)}
            placeholder="Any health issues you'd like us to be aware of"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

export default BackgroundForm;
