import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface RetentionSecurityProps {
  formData: any;
  updateFormData: (data: any) => void;
  onValidation?: (isValid: boolean) => void;
}

export const RetentionSecurity = ({ formData, updateFormData, onValidation }: RetentionSecurityProps) => {
  const retentionData = formData.retentionSecurity || {};

  const handleNoneToggle = () => {
    const currentNone = formData.retentionSecurityNone || false;
    if (!currentNone) {
      updateFormData({ 
        retentionSecurityNone: true, 
        retentionSecurity: {} 
      });
    } else {
      updateFormData({ retentionSecurityNone: false });
    }
  };

  const isValid = (
    formData.retentionSecurityNone || 
    retentionData.retentionPeriod || 
    retentionData.securityMeasures || 
    retentionData.breachProcedure
  );

  React.useEffect(() => {
    onValidation?.(isValid);
  }, [isValid, onValidation]);

  const handleUpdate = (field: string, value: string) => {
    updateFormData({
      retentionSecurity: {
        ...retentionData,
        [field]: value
      },
      retentionSecurityNone: false
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Specify how long you retain user data, security measures, and breach response procedures (or select None)
      </p>

      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-muted/30">
        <Checkbox
          id="retentionSecurityNone"
          checked={formData.retentionSecurityNone || false}
          onCheckedChange={handleNoneToggle}
        />
        <Label htmlFor="retentionSecurityNone" className="font-medium cursor-pointer">None - No specific retention/security policies</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="retentionPeriod">Data Retention Period</Label>
        <Input
          id="retentionPeriod"
          value={retentionData.retentionPeriod || ""}
          onChange={(e) => handleUpdate("retentionPeriod", e.target.value)}
          placeholder="e.g., 2 years from last login"
          disabled={formData.retentionSecurityNone}
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
          disabled={formData.retentionSecurityNone}
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
          disabled={formData.retentionSecurityNone}
        />
        <p className="text-xs text-muted-foreground">
          How do you handle data breaches?
        </p>
      </div>
    </div>
  );
};
