import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RetentionSecurityProps {
  formData: any;
  updateFormData: (data: any) => void;
  onValidation?: (isValid: boolean) => void;
}

export const RetentionSecurity = ({ formData, updateFormData, onValidation }: RetentionSecurityProps) => {
  React.useEffect(() => {
    // All fields are optional for this card
    onValidation?.(true);
  }, [onValidation]);

  const retentionData = formData.retentionSecurity || {};

  const handleUpdate = (field: string, value: string) => {
    updateFormData({
      retentionSecurity: {
        ...retentionData,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Specify how long you retain user data, security measures, and breach response procedures
      </p>

      <div className="space-y-2">
        <Label htmlFor="retentionPeriod">Data Retention Period</Label>
        <Input
          id="retentionPeriod"
          value={retentionData.retentionPeriod || ""}
          onChange={(e) => handleUpdate("retentionPeriod", e.target.value)}
          placeholder="e.g., 2 years from last login"
        />
        <p className="text-xs text-muted-foreground">
          How long do you keep user data?
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="securityMeasures">Security Measures</Label>
        <Textarea
          id="securityMeasures"
          value={retentionData.securityMeasures || ""}
          onChange={(e) => handleUpdate("securityMeasures", e.target.value)}
          placeholder="e.g., Encryption, access controls, regular security audits"
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Describe technical and organizational security measures
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="breachProcedure">Data Breach Response</Label>
        <Textarea
          id="breachProcedure"
          value={retentionData.breachProcedure || ""}
          onChange={(e) => handleUpdate("breachProcedure", e.target.value)}
          placeholder="e.g., Notification within 72 hours, incident response team, user communication plan"
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          How do you handle data breaches?
        </p>
      </div>
    </div>
  );
};
