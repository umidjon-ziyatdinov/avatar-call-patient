"use client";
import { Loader2, Check } from "lucide-react";
import { useState } from "react";
import NumPadButton from "../common/NumpadButton";

const PasscodeScreen = ({
  onSubmit,
  isAuthenticating,
  title = "Create Admin Password",
}: {
  title?: string;
  onSubmit: (code: string) => void;
  isAuthenticating: boolean;
}) => {
  const [passcode, setPasscode] = useState<string>("");
  const [confirmPasscode, setConfirmPasscode] = useState<string>("");
  const [isConfirmStep, setIsConfirmStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleNumberPress = async (num: number) => {
    if (isAuthenticating || isSubmitting || isConfirmed) return;

    if (!isConfirmStep) {
      // First passcode entry
      if (passcode.length < 4) {
        const newPasscode = passcode + num;
        setPasscode(newPasscode);
        if (newPasscode.length === 4) {
          setIsConfirmStep(true);
          setErrorMessage(null);
        }
      }
    } else {
      // Confirmation passcode entry
      if (confirmPasscode.length < 4) {
        const newConfirmPasscode = confirmPasscode + num;
        setConfirmPasscode(newConfirmPasscode);
        if (newConfirmPasscode.length === 4) {
          if (newConfirmPasscode === passcode) {
            setIsSubmitting(true);
            await onSubmit(passcode);
            setIsSubmitting(false);
            setIsConfirmed(true);
          } else {
            setErrorMessage("Passcodes do not match. Please try again.");
            resetForm();
          }
        }
      }
    }
  };

  const handleDelete = () => {
    if (isAuthenticating || isSubmitting || isConfirmed) return;

    if (isConfirmStep) {
      setConfirmPasscode((prev) => prev.slice(0, -1));
    } else {
      setPasscode((prev) => prev.slice(0, -1));
    }
  };

  const resetForm = () => {
    setPasscode("");
    setConfirmPasscode("");
    setIsConfirmStep(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      {isConfirmed ? (
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold">Passcode Confirmed</h2>
          <p className="text-center text-muted-foreground">
            Your admin passcode has been successfully set up.
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold">
            {isConfirmStep ? "Confirm Your Passcode" : title}
          </h2>
          <p className="text-center text-muted-foreground">
            {isConfirmStep
              ? "Re-enter your passcode to complete setup"
              : "This passcode will be used to access admin settings and make changes to patient information"}
          </p>

          {/* Passcode dots */}
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-4 w-4 rounded-full transition-all duration-200 ${
                  isAuthenticating
                    ? "animate-pulse bg-primary/50"
                    : isConfirmStep
                    ? confirmPasscode.length > i
                      ? "bg-primary"
                      : "bg-muted"
                    : passcode.length > i
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Loading indicator */}
          {isAuthenticating && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <p className="text-sm text-red-500">
              {errorMessage === "Passcodes do not match. Please try again."
                ? "Passcodes don't match. Let's try again from the beginning."
                : errorMessage}
            </p>
          )}
          {/* Number pad */}
          <div className="grid grid-cols-3 gap-4">
            {/* Numbers 1-9 */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <NumPadButton
                key={num}
                onClick={() => handleNumberPress(num)}
                disabled={isAuthenticating || isSubmitting}
              >
                {num}
              </NumPadButton>
            ))}
            {/* Bottom row */}
            <NumPadButton
              onClick={resetForm}
              disabled={isAuthenticating || isSubmitting}
              className="text-sm"
            >
              Cancel
            </NumPadButton>
            <NumPadButton
              onClick={() => handleNumberPress(0)}
              disabled={isAuthenticating || isSubmitting}
            >
              0
            </NumPadButton>
            <NumPadButton
              onClick={handleDelete}
              disabled={isAuthenticating || isSubmitting}
              className="text-sm"
            >
              Delete
            </NumPadButton>
          </div>

          {/* Status message */}
          {isAuthenticating && (
            <p className="text-sm text-muted-foreground">
              Verifying passcode...
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default PasscodeScreen;
