/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  Heart,
  HeartOff,
  Stethoscope,
  User,
  Info,
  BadgeCheck,
  FileText,
  ClipboardList,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PatientDetails, PromptAnswer } from "@/types/patient";

interface ReviewFormProps {
  patientDetails: PatientDetails;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ patientDetails }) => {
  // Count answered questions
  const answeredQuestions = patientDetails.promptAnswers.filter(
    (answer: PromptAnswer) => answer.answer.trim().length > 0
  ).length;

  // Format date of birth
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-semibold">Review Your Information</h2>
        <p className="text-muted-foreground">
          Please review all your information before Submission. You can edit
          them from profile screen too
        </p>
      </div>

      <div className="grid gap-4">
        {/* Basic Information Card */}
        <Card className="shadow-sm border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Added Patient Name field */}
              <div className="rounded-md bg-primary/5 p-3 border border-primary/10">
                <div className="flex items-center">
                  <BadgeCheck className="h-4 w-4 mr-2 text-primary" />
                  <p className="text-sm font-medium text-primary">
                    Patient Name
                  </p>
                </div>
                <p className="font-medium text-lg mt-1">
                  {patientDetails.name || "Not provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-muted/50 p-3">
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">
                    {patientDetails.age || "Not provided"}
                  </p>
                </div>
                <div className="rounded-md bg-muted/50 p-3">
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">
                    {patientDetails.gender || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="rounded-md bg-muted/50 p-3">
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                </div>
                <p className="font-medium">
                  {formatDate(patientDetails.dateOfBirth)}
                </p>
              </div>

              <div className="rounded-md bg-muted/50 p-3">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Location</p>
                </div>
                <p className="font-medium">
                  {patientDetails.location || "Not provided"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Background Information Card */}
        <Card className="shadow-sm border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Info className="h-5 w-5 mr-2 text-primary" />
              Background Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-md bg-muted/50 p-3">
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Education</p>
                </div>
                <p className="font-medium">
                  {patientDetails.education || "Not provided"}
                </p>
              </div>

              <div className="rounded-md bg-muted/50 p-3">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Work History</p>
                </div>
                <p className="font-medium">
                  {patientDetails.work || "Not provided"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="rounded-md bg-muted/50 p-3">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Likes</p>
                  </div>
                  <p className="font-medium">
                    {patientDetails.likes || "Not provided"}
                  </p>
                </div>

                <div className="rounded-md bg-muted/50 p-3">
                  <div className="flex items-center">
                    <HeartOff className="h-4 w-4 mr-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Dislikes</p>
                  </div>
                  <p className="font-medium">
                    {patientDetails.dislikes || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="rounded-md bg-muted/50 p-3">
                <div className="flex items-center">
                  <Stethoscope className="h-4 w-4 mr-2 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Health Symptoms
                  </p>
                </div>
                <p className="font-medium">
                  {patientDetails.symptoms || "Not provided"}
                </p>
              </div>

              {patientDetails.fallRisk === "yes" && (
                <div className="rounded-md bg-amber-100 dark:bg-amber-950/30 p-3 border border-amber-200 dark:border-amber-900">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-500" />
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                      Fall Risk Identified
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        {patientDetails.about && (
          <Card className="shadow-sm border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-muted/50 p-3">
                <p>{patientDetails.about}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personalization Answers */}
        <Card className="shadow-sm border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-primary" />
                Personalization Questions
              </CardTitle>
              <Badge variant="outline" className="ml-2 bg-primary/10">
                {answeredQuestions} Answered
              </Badge>
            </div>
            <CardDescription>
              Personal stories and memories you&apos;ve shared
            </CardDescription>
          </CardHeader>
          <CardContent>
            {patientDetails.promptAnswers.length > 0 ? (
              <ScrollArea className="max-h-[60vh] pr-2">
                <Accordion type="multiple" className="w-full">
                  {patientDetails.promptAnswers.map((answer: PromptAnswer) => (
                    <AccordionItem
                      key={answer.promptId}
                      value={answer.promptId}
                      className={!answer.answer.trim() ? "opacity-70" : ""}
                    >
                      <AccordionTrigger className="text-left">
                        <div className="flex items-start">
                          <span className="text-sm flex-1 pr-2">
                            {answer.question}
                          </span>
                          {!answer.answer.trim() && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            >
                              Not Answered
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="rounded-md bg-muted/50 p-3 my-2">
                          {answer.answer.trim() ? (
                            <p className="whitespace-pre-wrap">
                              {answer.answer}
                            </p>
                          ) : (
                            <p className="text-muted-foreground italic">
                              No answer provided
                            </p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            ) : (
              <div className="text-center p-6 rounded-md bg-muted/20 border border-dashed">
                <p className="text-muted-foreground">
                  No personalization questions answered
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewForm;
