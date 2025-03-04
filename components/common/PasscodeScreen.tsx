"use client";
import { Loader2 } from "lucide-react";
import NumPadButton from "./NumpadButton";
import { useState } from "react";

const PasscodeScreen = ({
  onSubmit,
  isAuthenticating,
}: {
  onSubmit: (code: string) => void;
  isAuthenticating: boolean;
}) => {
  const [passcode, setPasscode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNumberPress = async (num: number) => {
    if (isAuthenticating || isSubmitting) return;

    if (passcode.length < 4) {
      const newPasscode = passcode + num;
      setPasscode(newPasscode);

      if (newPasscode.length === 4) {
        setIsSubmitting(true);
        await onSubmit(newPasscode);
        setPasscode("");
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = () => {
    if (isAuthenticating || isSubmitting) return;
    setPasscode((prev) => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <h2 className="text-2xl font-semibold">Enter Admin Passcode</h2>

      {/* Passcode dots */}
      <div className="flex gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-4 w-4 rounded-full transition-all duration-200 ${
              isAuthenticating
                ? "animate-pulse bg-primary/50"
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
        <div className="h-16 w-16" /> {/* Empty space */}
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

      {/* Error message */}
      {isAuthenticating && (
        <p className="text-sm text-muted-foreground">Verifying passcode...</p>
      )}
    </div>
  );
};

export default PasscodeScreen;
