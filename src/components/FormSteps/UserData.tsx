import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import React from "react";

interface UserDataProps {
  formData: any;
  updateFormData: (data: any) => void;
  onValidation?: (isValid: boolean) => void;
}

const dataTypes = [
  "Email address",
  "First and last name",
  "Phone number",
  "Address (Street, City, Zip)",
  "Social media profiles",
  "Device Information (IP, Browser, OS)",
  "Uploaded files/photos",
];

export const UserData = ({ formData, updateFormData, onValidation }: UserDataProps) => {
  const [showOther, setShowOther] = useState(false);
  const [otherData, setOtherData] = useState("");

  // Validation is optional for this card - user can proceed without selecting anything
  React.useEffect(() => {
    if (onValidation) {
      onValidation(true); // Always valid - all fields are optional
    }
  }, [onValidation]);

  const handleToggle = (item: string) => {
    const current = formData.userDataCollected || [];
    const updated = current.includes(item)
      ? current.filter((i: string) => i !== item)
      : [...current, item];
    updateFormData({ userDataCollected: updated });
  };

  const handleOtherAdd = () => {
    if (otherData.trim()) {
      const current = formData.userDataCollected || [];
      updateFormData({ userDataCollected: [...current, otherData] });
      setOtherData("");
      setShowOther(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Select all types of user data you collect</p>
      
      {dataTypes.map((item) => (
        <div key={item} className="flex items-center space-x-2">
          <Checkbox
            id={item}
            checked={(formData.userDataCollected || []).includes(item)}
            onCheckedChange={() => handleToggle(item)}
          />
          <Label htmlFor={item} className="font-normal cursor-pointer">{item}</Label>
        </div>
      ))}

      {!showOther && (
        <button
          type="button"
          onClick={() => setShowOther(true)}
          className="text-sm text-primary hover:underline"
        >
          + Add other
        </button>
      )}

      {showOther && (
        <div className="flex gap-2">
          <Input
            value={otherData}
            onChange={(e) => setOtherData(e.target.value)}
            placeholder="Other data type"
          />
          <button
            type="button"
            onClick={handleOtherAdd}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Add
          </button>
        </div>
      )}

      {(formData.userDataCollected || []).filter((item: string) => !dataTypes.includes(item)).map((item: string) => (
        <div key={item} className="flex items-center space-x-2">
          <Checkbox
            checked
            onCheckedChange={() => handleToggle(item)}
          />
          <Label className="font-normal">{item}</Label>
        </div>
      ))}
    </div>
  );
};
