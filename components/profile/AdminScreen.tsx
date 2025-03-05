// @ts-nocheck
"use client";

import React, { useState } from "react";
import {
  Users,
  Clock,
  Plus,
  Edit,
  Shield,
  AlertTriangle,
  ArrowLeft,
  ScanFace,
  FileText,
  Settings,
} from "lucide-react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { fetcher } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// TypeScript interfaces
import { User, Avatar as AvatarType } from "@/lib/db/schema";
import AvatarList from "@/app/(chat)/components/AvatarList";
import { PatientEditDialog } from "@/app/(chat)/components/PatientsEditDialog";
import CallHistoryScreen from "@/app/(chat)/components/CallHistoryScreen";
import { AvatarForm } from "../AvatarEditForm";

const AdminDashboard = ({ patientId }: { patientId: string }) => {
  // State management
  const [activeTab, setActiveTab] = useState<string>("patient");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  const [openCallDialog, setOpenCallDialog] = useState(false);
  const [openAvatarDialog, setOpenAvatarDialog] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType | null>(null);

  // SWR data fetching
  const {
    data: patient,
    isLoading: patientLoading,
    mutate: refetchPatient,
  } = useSWR<User>(`/api/patient/${patientId}`, fetcher);

  const {
    data: avatars,
    isLoading: avatarsLoading,
    mutate: refetchAvatars,
  } = useSWR<AvatarType[]>(`/api/avatar?isAdmin=true`, fetcher);

  // Handler for closing avatar dialog
  const handleCloseAvatarDialog = () => {
    setSelectedAvatar(null);
    setOpenAvatarDialog(false);
    refetchAvatars();
  };

  // Get patient initials
  const getInitials = (name?: string) => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-full bg-background dark:bg-background/80 p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage patient profiles and avatars
          </p>
        </div>

        {/* Admin Mode Toggle */}
        {/* <div className="flex items-center space-x-2">
          <span className="text-sm dark:text-gray-300">Admin Mode</span>
          <Switch
            checked={isAdminMode}
            onCheckedChange={(checked) => {
              setIsAdminMode(checked);
              toast(
                checked ? "Admin mode activated" : "Returned to standard view"
              );
            }}
            className="data-[state=checked]:bg-primary"
          />
        </div> */}
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient Overview Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Patient Overview
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenPatientDialog(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {patientLoading ? (
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Loading patient data...</p>
              </div>
            ) : patient ? (
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  {patient.profilePicture ? (
                    <AvatarImage
                      src={patient.profilePicture}
                      alt={patient.name}
                    />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(patient.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{patient.name}</h3>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">
                      {patient.email}
                    </p>
                    {patient?.fallRisk === "yes" && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Fall Risk
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No patient data available</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Card
              className="hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => setOpenPatientDialog(true)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center h-24">
                <Users className="size-5 text-primary" />
                <p className="text-sm font-medium">Manage Profile</p>
              </CardContent>
            </Card>
            <Card
              className="hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => setOpenCallDialog(true)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center gap-2 text-center h-24">
                <Clock className="size-5 text-primary" />
                <p className="text-sm font-medium">Call Logs</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Tabs for Detailed View */}
        <div className="md:col-span-3">
          <Tabs defaultValue="avatars" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="avatars">
                <ScanFace className="h-4 w-4 mr-2" />
                Avatars
              </TabsTrigger>
              <TabsTrigger value="logs">
                <FileText className="h-4 w-4 mr-2" />
                Activity Logs
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="avatars">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Avatar Management</CardTitle>
                    <Button size="sm" onClick={() => setOpenAvatarDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Avatar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <AvatarList
                    avatars={avatars || []}
                    onSelectAvatar={setSelectedAvatar}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No recent activity</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Enable Advanced Reporting</span>
                    <Switch />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Research Data Sharing</span>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      {/* Patient Edit Dialog */}
      {openPatientDialog && patient && (
        <PatientEditDialog
          patient={patient}
          onClose={() => {
            setOpenPatientDialog(false);
            refetchPatient();
          }}
        />
      )}

      {/* Call History Dialog */}
      <CallHistoryScreen open={openCallDialog} setOpen={setOpenCallDialog} />

      {/* Avatar Edit Dialog */}
      <Dialog
        open={selectedAvatar !== null}
        onOpenChange={(open) => !open && handleCloseAvatarDialog()}
      >
        <DialogContent className="h-svh w-full max-w-full sm:max-h-[90vh] overflow-y-auto sm:max-w-[600px] p-0">
          <DialogHeader className="sticky w-full max-w-full top-[-1px] flex-nowrap flex-row bg-background z-10 shadow-md p-4 flex items-center border-b-1 justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedAvatar(null);
                refetchAvatars();
              }}
              className="border-1 p-2"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <DialogTitle className="text-md font-semibold">
              Edit {selectedAvatar?.name}&apos;s Background
            </DialogTitle>
          </DialogHeader>
          {selectedAvatar && (
            <AvatarForm
              avatar={selectedAvatar}
              onClose={handleCloseAvatarDialog}
              setAvatar={(value: AvatarType) => setSelectedAvatar(value)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* New Avatar Dialog */}
      <Dialog
        open={openAvatarDialog}
        onOpenChange={(open) => {
          if (!open) handleCloseAvatarDialog();
        }}
      >
        <DialogContent className="h-svh sm:max-h-[90vh] overflow-y-auto sm:max-w-[600px] p-0">
          <DialogHeader className="sticky top-[-1px] flex flex-row bg-background z-10 shadow-md p-4  items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                setOpenAvatarDialog(false);
                refetchAvatars();
              }}
              className="text-sm font-medium hover:underline"
            >
              <ArrowLeft className="size-4 mr-2" />
            </Button>
            <DialogTitle className="text-lg font-semibold">
              Create Avatar
            </DialogTitle>
          </DialogHeader>
          <AvatarForm onClose={handleCloseAvatarDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
