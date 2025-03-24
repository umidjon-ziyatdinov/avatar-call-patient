"use client";

import { Patient, User } from "@/lib/db/schema";
import { fetcher } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import PasscodeScreen from "./PasscodeScreen";
import AdminDashboard from "@/components/profile/AdminScreen";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ProtectedAdmin = ({
  patientId,
  signOutAction,
}: {
  patientId: string;
  signOutAction: () => Promise<{ success: boolean; error?: string }>;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Get the passcode requirement from localStorage
  const [showPasscode, setShowPasscode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("showPasscodeScreen") === "true";
    }
    return false;
  });

  // SWR data fetching
  const {
    data: user,
    isLoading: patientLoading,
    mutate: refetchPatient,
  } = useSWR<User>(`/api/patient/admin/${patientId}`, fetcher);

  // Reset authentication when showPasscode changes
  useEffect(() => {
    if (!showPasscode) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [showPasscode]);

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "showPasscodeScreen") {
        setShowPasscode(e.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handlePasscodeSubmit = async (code: string) => {
    setIsAuthenticating(true);
    try {
      if (String(code) === String(user?.passcode)) {
        setTimeout(() => {
          setIsAuthenticated(true);
          setIsAuthenticating(false);
          toast.success(`Welcome to Admin Dashboard, ${user?.name}`);
        }, 300);
      } else {
        toast.error("Authentication failed. Please try again.");
      }
    } catch (error) {
      console.error("Authorization failed:", error);
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (patientLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show passcode screen if required and not authenticated
  if (showPasscode && !isAuthenticated) {
    return (
      <div className="w-full h-full flex items-center justify-center py-8">
        <PasscodeScreen
          onSubmit={handlePasscodeSubmit}
          isAuthenticating={isAuthenticating}
        />
      </div>
    );
  }

  return <AdminDashboard patientId={patientId} signOutAction={signOutAction} />;
};

export default ProtectedAdmin;
