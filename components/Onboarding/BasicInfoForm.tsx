import React, { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PatientDetails } from "@/types/patient";
import { User, Upload } from "lucide-react";

interface BasicInfoFormProps {
  patientDetails: PatientDetails;
  handleInputChange: (field: keyof PatientDetails, value: string) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  patientDetails,
  handleInputChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string>(
    patientDetails.profilePicture || "/default-avatar.png"
  );

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setProfileImage(imageDataUrl);
        handleInputChange("profilePicture", imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Basic Information</h2>
      <p className="text-muted-foreground">
        Help us get to know you better to personalize your experience.
      </p>

      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-primary"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-16 h-16 text-gray-500" />
            </div>
          )}
          <button
            type="button"
            onClick={triggerFileInput}
            className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 hover:bg-primary-700 transition-colors"
          >
            <Upload className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePictureChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Click to upload profile picture
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={patientDetails.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            type="text"
            placeholder="Enter your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            value={patientDetails.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            type="number"
            placeholder="Enter your age"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={patientDetails.gender}
            onValueChange={(value) => handleInputChange("gender", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={patientDetails.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={patientDetails.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="City, State"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="about">Tell us a bit about yourself</Label>
        <Textarea
          id="about"
          value={patientDetails.about}
          onChange={(e) => handleInputChange("about", e.target.value)}
          placeholder="Share something about yourself (interests, hobbies, etc.)"
          rows={3}
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
