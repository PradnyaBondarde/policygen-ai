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

  const handleNoneToggle = () => {
    const currentNone = formData.userDataNone || false;
    if (!currentNone) {
      // If selecting None, clear all selections
      updateFormData({ userDataNone: true, userDataCollected: [] });
    } else {
      updateFormData({ userDataNone: false });
    }
  };

  // Validation: Allow if None is selected OR at least one data type is selected
  const isValid = (formData.userDataNone || (formData.userDataCollected || []).length > 0);

  React.useEffect(() => {
    if (onValidation) {
      onValidation(isValid);
    }
  }, [isValid, onValidation]);

  const handleToggle = (item: string) => {
    const current = formData.userDataCollected || [];
    const updated = current.includes(item)
      ? current.filter((i: string) => i !== item)
      : [...current, item];
    updateFormData({ userDataCollected: updated, userDataNone: false });
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
      <p className="text-sm text-muted-foreground">Select all types of user data you collect (or select None if you don't collect any data)</p>
      
      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-muted/30">
        <Checkbox
          id="userDataNone"
          checked={formData.userDataNone || false}
          onCheckedChange={handleNoneToggle}
        />
        <Label htmlFor="userDataNone" className="font-medium cursor-pointer">None - I don't collect user data</Label>
      </div>
      
      {dataTypes.map((item) => (
        <div key={item} className="flex items-center space-x-2">
          <Checkbox
            id={item}
            checked={(formData.userDataCollected || []).includes(item)}
            onCheckedChange={() => handleToggle(item)}
            disabled={formData.userDataNone}
          />
          <Label htmlFor={item} className="font-normal cursor-pointer">{item}</Label>
        </div>
      ))}

      {!showOther && !formData.userDataNone && (
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
