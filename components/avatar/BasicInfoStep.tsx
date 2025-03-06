import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AvatarData } from "./AvatarCreation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const BasicInfoStep: React.FC<{
  data: AvatarData;
  updateData: React.Dispatch<React.SetStateAction<AvatarData>>;
  nextStep: () => void;
  prevStep: () => void;
}> = ({ data, updateData, nextStep, prevStep }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-1">
      <h2 className="text-2xl font-bold text-center">
        Avatar Basic Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={data.name}
            onChange={(e) =>
              updateData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="Enter avatar name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Input
            value={data.role}
            onChange={(e) =>
              updateData((prev) => ({
                ...prev,
                role: e.target.value,
              }))
            }
            placeholder="E.g., Friendly Assistant"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Age</Label>
          <Input
            type="number"
            value={data.age}
            onChange={(e) =>
              updateData((prev) => ({
                ...prev,
                age: e.target.value,
              }))
            }
            placeholder="Enter age"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Sex</Label>
          <Select
            value={data.sex}
            onValueChange={(value) =>
              updateData((prev) => ({
                ...prev,
                sex: value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>About</Label>
        <Textarea
          value={data.about}
          onChange={(e) =>
            updateData((prev) => ({
              ...prev,
              about: e.target.value,
            }))
          }
          placeholder="Brief description of the avatar"
          required
          rows={3}
        />
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep}>
          Previous
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default BasicInfoStep;
