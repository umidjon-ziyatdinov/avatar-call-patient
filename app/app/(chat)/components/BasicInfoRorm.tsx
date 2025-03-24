import React from "react";
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
import { PatientDetails } from "./PatientOnboarding";

interface BasicInfoFormProps {
  patientDetails: PatientDetails;
  handleInputChange: (field: keyof PatientDetails, value: string) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  patientDetails,
  handleInputChange,
}) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Basic Information</h2>
      <p className="text-muted-foreground">
        Help us get to know you better to personalize your experience.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <Label htmlFor="sex">Sex</Label>
          <Select
            value={patientDetails.sex}
            onValueChange={(value) => handleInputChange("sex", value)}
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
