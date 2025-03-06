import { Info } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { AvatarData } from "./AvatarCreation";

const PrivacyStep: React.FC<{
  data: AvatarData;
  updateData: React.Dispatch<React.SetStateAction<AvatarData>>;
  nextStep: () => void;
}> = ({ data, updateData, nextStep }) => {
  const handleAgree = () => {
    updateData((prev) => ({ ...prev, privacyAgreed: true }));
    nextStep();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">
        Welcome to Avatar Creation
      </h2>
      <div className="space-y-4">
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
          <Info className="text-blue-500" />
          <p className="text-sm text-blue-800">
            We collect minimal personal information to create a personalized AI
            avatar.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">What Information We'll Use:</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Name and basic demographic information</li>
            <li>Profile picture for visual representation</li>
            <li>Personality traits to guide AI interactions</li>
            <li>Role and background context</li>
          </ul>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="privacy-agreement"
            checked={data.privacyAgreed}
            onCheckedChange={(checked) =>
              updateData((prev) => ({
                ...prev,
                privacyAgreed: checked === true,
              }))
            }
          />
          <Label
            htmlFor="privacy-agreement"
            className="text-sm font-medium leading-none"
          >
            I agree to the data collection and usage terms
          </Label>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleAgree} disabled={!data.privacyAgreed}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PrivacyStep;
