"use client";

import { Patient, User } from "@/lib/db/schema";
import { fetcher } from "@/lib/utils";
import React, { useState } from "react";
import useSWR from "swr";
import PasscodeScreen from "./PasscodeScreen";
import AdminDashboard from "@/components/profile/AdminScreen";
import { toast } from "sonner";

const ProtectedAdmin = ({ patientId }: { patientId: string }) => {
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
        setInitialRender(false);
        toast.success(`Welcome to Admin Dashboard, ${user?.name}`);
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
        <PasscodeScreen
          onSubmit={handlePasscodeSubmit}
          isAuthenticating={isAuthenticating}
        />
      </div>
    );
  }
  return <AdminDashboard patientId={patientId} />;
};

export default ProtectedAdmin;
