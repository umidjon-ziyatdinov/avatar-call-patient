"use client";

import React, { useState, useTransition } from "react";
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
  LogOut,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Lock,
  Key,
  ChevronRight,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { useTheme } from "next-themes";

// TypeScript interfaces
import { User, Avatar as AvatarType, Patient } from "@/lib/db/schema";
import AvatarList from "@/app/(chat)/components/AvatarList";
import { PatientEditDialog } from "@/app/(chat)/components/PatientsEditDialog";
import CallHistoryScreen, {
  CallData,
} from "@/app/(chat)/components/CallHistoryScreen";
import { AvatarForm } from "../AvatarEditForm";
import { Skeleton } from "@/components/ui/skeleton";
import AvatarCreationForm from "../avatar/AvatarCreation";
import PasscodeScreen from "../Onboarding/PasscodeScreen";
import { useRouter } from "next/navigation";

// Patient Overview Component
const PatientOverview = ({
  patient,
  onEditProfile,
  loading,
}: {
  patient?: Patient;
  onEditProfile: () => void;
  loading: boolean;
}) => {
  const getInitials = (name?: string) => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Patient Overview</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onEditProfile}
            title="Edit Profile"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {patient ? (
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              {patient.profilePicture ? (
                <AvatarImage src={patient.profilePicture} alt={patient.name} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(patient.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-1 flex-1">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{patient.name}</h3>
                {patient?.fallRisk === "yes" && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Fall Risk
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{patient.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No patient data available</p>
        )}
      </CardContent>
    </Card>
  );
};

// Quick Actions Component

const QuickActions = ({
  patient,
  onViewCallLogs,
  calls,
}: {
  patient?: Patient;
  calls?: CallData[];
  onViewCallLogs: () => void;
}) => {
  // This would ideally come from an API or prop
  const hasRisk = false;

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Patient Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`
            w-full p-4 rounded-lg border 
            ${
              hasRisk
                ? "border-red-200 dark:border-red-700/50"
                : "hover:bg-accent/50"
            }
            transition-colors cursor-pointer 
            flex items-center justify-between
            relative
          `}
          onClick={onViewCallLogs}
        >
          <div className="flex items-center space-x-3">
            {/* Indicator placement */}
            {hasRisk && (
              <div className="absolute top-1 right-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            )}

            <Clock
              className={`
              size-6 
              ${hasRisk ? "text-red-500" : "text-primary"}
            `}
            />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Call Logs</p>
                {Array.isArray(calls) && calls?.length > 0 && (
                  <Badge
                    variant={hasRisk ? "destructive" : "secondary"}
                    className="px-1.5 py-0 text-xs"
                  >
                    {calls?.length}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasRisk
                  ? "High Risk - Immediate Attention"
                  : "Recent communication history"}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            {hasRisk && <AlertTriangle className="size-4 text-red-500 mr-2" />}
            <ChevronRight className="text-muted-foreground size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Top Header Component
const TopHeader = ({ signOutAction }: { signOutAction: () => void }) => {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Manage patient profiles and avatars
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="destructive"
          size="icon"
          title="Sign Out"
          onClick={() => {
            // TODO: Implement sign out logic
            signOutAction();
          }}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

const AdminDashboard = ({
  patientId,
  signOutAction,
}: {
  patientId: string;
  signOutAction: () => Promise<{ success: boolean; error?: string }>;
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<string>("avatars");
  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  const [openCallDialog, setOpenCallDialog] = useState(false);
  const [openAvatarDialog, setOpenAvatarDialog] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType | null>(null);
  const { data: calls, isLoading, mutate } = useSWR("/api/calls", fetcher);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPasscodeDialog, setShowPasscodeDialog] = useState(false);
  const [passcodeSubmitting, setPasscodeSubmitting] = useState(false);
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // SWR data fetching
  const {
    data: patient,
    isLoading: patientLoading,
    mutate: refetchPatient,
  } = useSWR<Patient>(`/api/patient/${patientId}`, fetcher);

  const {
    data: avatars,
    isLoading: avatarsLoading,
    mutate: refetchAvatars,
  } = useSWR<AvatarType[]>(`/api/avatar?isAdmin=true`, fetcher);

  const handleCloseAvatarDialog = () => {
    setSelectedAvatar(null);
    setOpenAvatarDialog(false);
    refetchAvatars();
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
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPassword(true);

    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      setIsSubmittingPassword(false);
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      setIsSubmittingPassword(false);
      return;
    }

    try {
      const response = await fetch(`/api/patient/${patientId}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update password");
      }

      toast.success("Password changed successfully");

      // Reset form and close dialog
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordDialog(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update password"
      );
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  // Passcode change handler
  const handlePasscodeChange = async (code: string) => {
    setPasscodeSubmitting(true);
    try {
      const response = await fetch(`/api/patient/${patientId}/passcode`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPasscode: code,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update passcode");
      }
      toast.success("Security passcode changed successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update password"
      );
    }
    setTimeout(() => {
      setPasscodeSubmitting(false);
      setShowPasscodeDialog(false);
    }, 500);
  };

  return (
    <div className="h-full bg-background dark:bg-background/80 pt-4 px-2  md:p-8">
      {/* Top Header with Theme Toggle and Sign Out */}
      <TopHeader signOutAction={handleSignOut} />

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 pb-[70px] gap-6">
        {/* Patient Overview Card */}
        <PatientOverview
          patient={patient}
          loading={patientLoading}
          onEditProfile={() => setOpenPatientDialog(true)}
        />

        {/* Quick Actions */}
        <QuickActions
          patient={patient}
          calls={calls?.data}
          onViewCallLogs={() => setOpenCallDialog(true)}
        />

        {/* Tabs for Detailed View */}
        <div className="md:col-span-3">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            defaultValue="avatars"
            className="w-full"
          >
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
                  {avatarsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <AvatarList
                      avatars={avatars || []}
                      onSelectAvatar={setSelectedAvatar}
                    />
                  )}
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
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span>Change Admin Password</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordDialog(true)}
                    >
                      Update
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <span>Change Security Passcode</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowPasscodeDialog(true)}
                    >
                      Update
                    </Button>
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
        <DialogContent className="h-svh sm:max-h-[90vh] flex flex-col  overflow-y-auto sm:max-w-[600px] p-0">
          <DialogHeader className="sticky top-[-1px] flex flex-row bg-background z-10 shadow-md p-4 max-h-[64px]  items-center justify-between">
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
          <AvatarCreationForm onClose={() => handleCloseAvatarDialog()} />
        </DialogContent>
      </Dialog>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="h-svh sm:max-h-[90vh] flex flex-col overflow-y-auto sm:max-w-[600px] p-0">
          <DialogHeader className="sticky top-[-1px] flex flex-row bg-background z-10 shadow-md p-4 max-h-[64px] items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setShowPasswordDialog(false)}
              className="text-sm font-medium hover:underline"
            >
              <ArrowLeft className="size-4 mr-2" />
            </Button>
            <DialogTitle className="text-lg font-semibold">
              Change Password
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    disabled={isSubmittingPassword}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    disabled={isSubmittingPassword}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isSubmittingPassword}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isSubmittingPassword}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 4 characters and include a
                  combination of letters, numbers.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isSubmittingPassword}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmittingPassword}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordDialog(false)}
                  disabled={isSubmittingPassword}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmittingPassword}>
                  {isSubmittingPassword ? (
                    <>
                      <motion.div
                        className="animate-spin mr-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        ◌
                      </motion.div>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Passcode Change Dialog */}
      <Dialog open={showPasscodeDialog} onOpenChange={setShowPasscodeDialog}>
        <DialogContent className="h-svh sm:max-h-[90vh] flex flex-col overflow-y-auto sm:max-w-[600px] p-0">
          <DialogHeader className="sticky top-[-1px] flex flex-row bg-background z-10 shadow-md p-4 max-h-[64px] items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setShowPasscodeDialog(false)}
              className="text-sm font-medium hover:underline"
            >
              <ArrowLeft className="size-4 mr-2" />
            </Button>
            <DialogTitle className="text-lg font-semibold">
              Change Security Passcode
            </DialogTitle>
          </DialogHeader>

          <PasscodeScreen
            title="Reset Admin Passcode"
            onSubmit={handlePasscodeChange}
            isAuthenticating={passcodeSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
