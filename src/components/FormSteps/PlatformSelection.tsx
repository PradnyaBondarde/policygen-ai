import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PlatformSelectionProps {
  formData: any;
  updateFormData: (data: any) => void;
  onValidation?: (isValid: boolean) => void;
}

export const PlatformSelection = ({ formData, updateFormData, onValidation }: PlatformSelectionProps) => {
  const isValid = !!formData.platformType;
  
  React.useEffect(() => {
    onValidation?.(isValid);
  }, [isValid, onValidation]);
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Select the type of platform for your privacy policy
      </p>

      <RadioGroup
        value={formData.platformType || ""}
        onValueChange={(value) => updateFormData({ platformType: value })}
      >
        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer">
          <RadioGroupItem value="website" id="website" />
          <Label htmlFor="website" className="font-normal cursor-pointer flex-1">
            <div className="font-semibold">Website</div>
            <div className="text-sm text-muted-foreground">Web-based application or service</div>
          </Label>
        </div>

        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer">
          <RadioGroupItem value="app" id="app" />
          <Label htmlFor="app" className="font-normal cursor-pointer flex-1">
            <div className="font-semibold">App (Mobile/Desktop)</div>
            <div className="text-sm text-muted-foreground">Native mobile or desktop application</div>
          </Label>
        </div>

        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer">
          <RadioGroupItem value="both" id="both" />
          <Label htmlFor="both" className="font-normal cursor-pointer flex-1">
            <div className="font-semibold">Both (Website + App)</div>
            <div className="text-sm text-muted-foreground">Combined web and app platform</div>
          </Label>
        </div>
      </RadioGroup>

      {!formData.platformType && (
        <p className="text-sm text-destructive">Please select a platform type to continue</p>
      )}
    </div>
  );
};
