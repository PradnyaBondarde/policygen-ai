import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ContactInfoProps {
  formData: any;
  updateFormData: (data: any) => void;
  onValidation?: (isValid: boolean) => void;
  isFinalStep?: boolean;
}

export const ContactInfo = ({ formData, updateFormData, onValidation, isFinalStep }: ContactInfoProps) => {
  const isValid = isFinalStep 
    ? !!(formData.contactEmail && formData.privacyContactName && formData.confirmAccuracy)
    : !!(formData.contactEmail);
  
  React.useEffect(() => {
    onValidation?.(isValid);
  }, [isValid, onValidation]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="privacyContactName">Privacy Contact Name *</Label>
        <Input
          id="privacyContactName"
          value={formData.privacyContactName || ""}
          onChange={(e) => updateFormData({ privacyContactName: e.target.value })}
          placeholder="Full Name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactEmail">Contact Email *</Label>
        <Input
          id="contactEmail"
          type="email"
          value={formData.contactEmail || ""}
          onChange={(e) => updateFormData({ contactEmail: e.target.value })}
          placeholder="privacy@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPage">Contact Page URL</Label>
        <Input
          id="contactPage"
          type="url"
          value={formData.contactPage || ""}
          onChange={(e) => updateFormData({ contactPage: e.target.value })}
          placeholder="https://example.com/contact"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone || ""}
          onChange={(e) => updateFormData({ phone: e.target.value })}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      {isFinalStep && (
        <div className="space-y-4 mt-6 p-4 border rounded-lg bg-muted/50">
          <div className="flex items-start space-x-2">
            <Checkbox
              checked={formData.confirmAccuracy}
              onCheckedChange={(checked) => updateFormData({ confirmAccuracy: checked })}
              id="confirmAccuracy"
            />
            <label htmlFor="confirmAccuracy" className="text-sm leading-relaxed cursor-pointer">
              I confirm that the information provided is accurate and complete. I understand that this 
              generated policy is a starting point and should be reviewed by a legal professional before use.
            </label>
          </div>
        </div>
      )}
      
      {!isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {isFinalStep 
              ? "Please fill in all required fields and confirm accuracy to continue."
              : "Please fill in all required contact fields to continue."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
