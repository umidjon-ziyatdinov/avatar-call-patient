"use client";

import { Patient, User } from "@/lib/db/schema";
import { fetcher } from "@/lib/utils";
import React, { useState } from "react";
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
  const [initialRender, setInitialRender] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  // SWR data fetching
  const {
    data: user,
    isLoading: patientLoading,
    mutate: refetchPatient,
  } = useSWR<User>(`/api/patient/admin/${patientId}`, fetcher);

  const handlePasscodeSubmit = async (code: string) => {
    setIsAuthenticating(true);
    try {
      if (String(code) === String(user?.passcode)) {
        setTimeout(() => {
          setInitialRender(false);
          setIsAuthenticating(false);
          toast.success(`Welcome to Admin Dashboard, ${user?.name}`);
        }, 300);
      } else {
        console.error("Authorization failed: Admin  passcode invalid");
        toast.error("Authentication failed. Please try again.");
      }
    } catch (error) {
      console.error("Authorization failed:", error);
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (initialRender) {
    return (
      <div className="w-full h-full flex items-center justify-center py-8">
        {patientLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <PasscodeScreen
            onSubmit={handlePasscodeSubmit}
            isAuthenticating={isAuthenticating}
          />
        )}
      </div>
    );
  }

  return <AdminDashboard patientId={patientId} signOutAction={signOutAction} />;
};

export default ProtectedAdmin;
