import React, { useState } from "react";
import { toast } from "sonner";
import { AvatarData } from "./AvatarCreation";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const AvatarImageStep: React.FC<{
  data: AvatarData;
  updateData: React.Dispatch<React.SetStateAction<AvatarData>>;
  nextStep: () => void;
  prevStep: () => void;
}> = ({ data, updateData, nextStep, prevStep }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size and type
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image must be smaller than 5MB");
        return;
      }
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        toast.error("Please upload a valid image (JPEG, PNG, or GIF)");
        return;
      }

      // Check image dimensions
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        if (img.width < 512 || img.height < 512) {
          toast.error("Image must be at least 512x512 pixels");
          return;
        }
        updateData((prev) => ({ ...prev, avatar: file }));
      };

      img.src = objectUrl;
    }
  };

  const handleInitiateAvatarCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.avatar) {
      toast.error("Please upload an avatar image");
      return;
    }

    try {
      setIsProcessing(true);
      // Simulated avatar creation initiation
      // In actual implementation, this would be your API call to start avatar processing
      await initiateAvatarCreation(data.avatar);

      toast.info("Avatar creation started!", {
        description:
          "Your image is being processed. This may take 5-10 minutes.",
        duration: 5000,
      });

      // Move to next step or show waiting state
      nextStep();
    } catch (error) {
      toast.error("Failed to start avatar creation", {
        description: "Please try again or contact support.",
      });
      setIsProcessing(false);
    }
  };

  // Simulated avatar creation initiation function
  const initiateAvatarCreation = async (file: File) => {
    // Placeholder for actual API call
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(resolve, 1000);
    });
  };

  return (
    <form onSubmit={handleInitiateAvatarCreation} className="space-y-6">
      <h2 className="text-2xl font-bold text-center">
        Create Your Digital Avatar
      </h2>

      <div className="text-center text-muted-foreground mb-4">
        <p>
          Upload a clear, high-quality photo to create a personalized digital
          avatar.
        </p>
        <p className="text-sm mt-2">Requirements:</p>
        <ul className="text-sm list-disc list-inside mt-1">
          <li>Well-lit, front-facing photo with a neutral expression</li>
          <li>Minimum image size: 512x512 pixels</li>
          <li>Maximum file size: 5MB</li>
          <li>Supported formats: JPEG, PNG, or GIF</li>
        </ul>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {data.avatar ? (
          <img
            src={URL.createObjectURL(data.avatar)}
            alt="Avatar Preview"
            className="w-48 h-48 rounded-full object-cover border-4 border-primary"
          />
        ) : (
          <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center text-muted-foreground">
            No Image Selected
          </div>
        )}

        <Input
          type="file"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleImageChange}
          className="hidden"
          id="avatar-upload"
        />
        <Label
          htmlFor="avatar-upload"
          className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          {data.avatar ? "Change Image" : "Upload Image"}
        </Label>
      </div>

      {data.avatar && (
        <div className="text-center text-sm text-muted-foreground">
          <p>✨ Avatar Creation Process:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Upload your image</li>
            <li>We'll process your photo to create a digital avatar</li>
            <li>Processing takes 5-10 minutes</li>
            <li>You'll be able to finalize your avatar in the next step</li>
          </ol>
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep}>
          Previous
        </Button>
        <Button type="submit" disabled={!data.avatar || isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Start Avatar Creation"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AvatarImageStep;
