// @ts-nocheck
"use client";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  User,
  Heart,
  X,
  AlertTriangle,
  MapPin,
  Briefcase,
  BookOpen,
  Calendar,
  Shield,
  MessageCircleQuestion,
  MoreVertical,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { useRouter } from "next/navigation";

import { toast } from "sonner";
// import PasscodeScreen from "../common/PasscodeScreen";
import { Patient } from "@/lib/db/schema";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTheme } from "next-themes";

// To this:
interface PatientProfileProps {
  patientId: string;
  signOutAction: () => Promise<{ success: boolean; error?: string }>;
}
export default function PatientProfile({
  patientId,
  signOutAction,
}: PatientProfileProps) {
  const {
    data: patient,
    isLoading,
    mutate: refetchPatient,
  } = useSWR<Patient>(`/api/patient/${patientId}`, fetcher);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { theme, setTheme } = useTheme();
  const router = useRouter();
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSignOut = () => {
    startTransition(async () => {
      const result = await signOutAction();
      window.location.reload();
      if (result.success) {
        router.push("/login");
      }
    });
  };
  const formatGender = (gender: string) => {
    if (!gender) return "";
    return gender
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const ageDisplay = patient?.age ? `${patient.age} years` : "Not specified";

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="container flex-grow-1 h-full max-w-md mx-0 px-0 py-0"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading patient data...</p>
        </div>
      ) : patient ? (
        <Card className="overflow-hidden h-full flex flex-col justify-between  mx-0 px-0 rounded-none pb-0">
          {/* Profile Header */}
          <CardHeader className="relative p-0">
            <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500 relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-white hover:bg-white/20"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={toggleTheme}
                    className="cursor-pointer"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        Switch to Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        Switch to Dark Mode
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={handleSignOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="absolute -bottom-16 left-0 w-full flex justify-center">
              <Avatar className="h-32 w-32 border-4 border-white bg-white">
                {patient.profilePicture ? (
                  <AvatarImage
                    src={patient.profilePicture}
                    alt={patient.name}
                  />
                ) : (
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {getInitials(patient.name)}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </CardHeader>

          <CardContent className="pt-20 pb-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">{patient.name}</h1>
              <p className="text-gray-500">{patient?.email}</p>

              {patient.fallRisk === "yes" && (
                <Badge variant="destructive" className="mt-2">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Fall Risk
                </Badge>
              )}
            </div>

            <div className="px-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  className="w-full relative rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md"
                  onClick={() => router.push("/patient-admin")}
                >
                  <div className="flex items-center justify-between py-2 px-3">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-white" />
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          Admin Management
                        </h3>
                      </div>
                    </div>
                    <div className="rounded-full p-1">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Button>
              </motion.div>
            </div>
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="health">Health</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <div className="space-y-3">
                  {patient.about && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{patient.about}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-[24px_1fr] gap-3 items-center">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Age & Gender</p>
                      <p className="text-sm text-gray-500">
                        {ageDisplay} • {formatGender(patient.sex || "")}
                      </p>
                    </div>
                  </div>

                  {patient.location && (
                    <div className="grid grid-cols-[24px_1fr] gap-3 items-center">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-gray-500">
                          {patient.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {patient.dateOfBirth && (
                    <div className="grid grid-cols-[24px_1fr] gap-3 items-center">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Date of Birth</p>
                        <p className="text-sm text-gray-500">
                          {patient.dateOfBirth}
                        </p>
                      </div>
                    </div>
                  )}

                  {patient.education && (
                    <div className="grid grid-cols-[24px_1fr] gap-3 items-center">
                      <BookOpen className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Education</p>
                        <p className="text-sm text-gray-500">
                          {patient.education}
                        </p>
                      </div>
                    </div>
                  )}

                  {patient.work && (
                    <div className="grid grid-cols-[24px_1fr] gap-3 items-center">
                      <Briefcase className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Work</p>
                        <p className="text-sm text-gray-500">{patient.work}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4">
                <div className="space-y-4">
                  {patient.likes && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-rose-500" />
                        <h3 className="font-medium">Likes</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{patient.likes}</p>
                      </div>
                    </div>
                  )}

                  {patient.dislikes && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4 text-gray-500" />
                        <h3 className="font-medium">Dislikes</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {patient.dislikes}
                        </p>
                      </div>
                    </div>
                  )}

                  {patient?.promptAnswers?.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800">
                          Personalization Q&As
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {patient.promptAnswers.length}{" "}
                          {patient.promptAnswers.length === 1
                            ? "Response"
                            : "Responses"}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {patient.promptAnswers.map(
                          ({ question, answer }, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="group hover:shadow-md transition-all duration-200"
                            >
                              <div className="bg-white border rounded-lg overflow-hidden">
                                <div className="bg-gray-50 p-3 border-b">
                                  <p className="text-sm font-medium text-gray-700">
                                    {question || "Question not available"}
                                  </p>
                                </div>
                                <div className="p-3">
                                  {answer ? (
                                    <div className="prose prose-sm max-w-none">
                                      <p className="text-gray-600 whitespace-pre-wrap">
                                        {String(answer)}
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-400 italic">
                                      No answer provided
                                    </p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <div className="text-gray-400 mb-2">
                        <MessageCircleQuestion className="h-8 w-8 mx-auto" />
                      </div>
                      <p className="text-sm text-gray-600">
                        No personalization answers available yet
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="health" className="space-y-4">
                {patient.symptoms && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Symptoms</h3>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {patient.symptoms}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-medium">Fall Risk Assessment</h3>
                  <div
                    className={`p-3 rounded-lg ${
                      patient.fallRisk === "yes" ? "bg-red-50" : "bg-green-50"
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        patient.fallRisk === "yes"
                          ? "text-red-700"
                          : "text-green-700"
                      }`}
                    >
                      {patient.fallRisk === "yes"
                        ? "Patient has been identified as having a fall risk."
                        : "No fall risk identified."}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="border-t border-b pt-4 flex justify-between text-xs text-gray-500">
            <p>Joined: {new Date(patient.createdAt).toLocaleDateString()}</p>
            <p>
              Last Updated: {new Date(patient.updatedAt).toLocaleDateString()}
            </p>
          </CardFooter>
        </Card>
      ) : (
        <p className="text-center text-gray-500">Patient data not found.</p>
      )}
      {/* We would implement a proper edit form here when isEditing is true */}
    </motion.div>
  );
}
