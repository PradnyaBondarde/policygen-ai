import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ContactFinalizationProps {
  formData: any;
  updateFormData: (data: any) => void;
  onValidation?: (isValid: boolean) => void;
}

export const ContactFinalization = ({ formData, updateFormData, onValidation }: ContactFinalizationProps) => {
  const contactData = formData.contactFinalization || {};
  
  const isValid = !!(
    contactData.privacyContactName &&
    contactData.contactEmail &&
    formData.confirmAccuracy
  );
  
  React.useEffect(() => {
    onValidation?.(isValid);
  }, [isValid, onValidation]);

  const handleUpdate = (field: string, value: string) => {
    updateFormData({
      contactFinalization: {
        ...contactData,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="privacyContactName">Privacy Contact Name *</Label>
        <Input
          id="privacyContactName"
          value={contactData.privacyContactName || ""}
          onChange={(e) => handleUpdate("privacyContactName", e.target.value)}
          placeholder="Full Name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactEmail">Contact Email *</Label>
        <Input
          id="contactEmail"
          type="email"
          value={contactData.contactEmail || ""}
          onChange={(e) => handleUpdate("contactEmail", e.target.value)}
          placeholder="privacy@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPage">Contact Page URL</Label>
        <Input
          id="contactPage"
          type="url"
          value={contactData.contactPage || ""}
          onChange={(e) => handleUpdate("contactPage", e.target.value)}
          placeholder="https://example.com/contact"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          value={contactData.phone || ""}
          onChange={(e) => handleUpdate("phone", e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="space-y-4 mt-6 p-4 border rounded-lg bg-muted/50">
        <div className="flex items-start space-x-2">
          <Checkbox
            checked={formData.confirmAccuracy || false}
            onCheckedChange={(checked) => updateFormData({ confirmAccuracy: checked })}
            id="confirmAccuracy"
          />
          <label htmlFor="confirmAccuracy" className="text-sm leading-relaxed cursor-pointer">
            I confirm that the information provided is accurate and complete. I understand that this 
            generated policy is a starting point and should be reviewed by a legal professional before use.
          </label>
        </div>
      </div>
      
      {!isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fill in all required fields and confirm accuracy to continue.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
