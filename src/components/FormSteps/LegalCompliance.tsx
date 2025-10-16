import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface LegalComplianceProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const regulations = [
  { id: "gdpr", label: "GDPR (Europe)" },
  { id: "ccpa", label: "CCPA/CPRA (California)" },
  { id: "caloppa", label: "CalOPPA (California)" },
  { id: "coppa", label: "COPPA (Children under 13)" },
];

export const LegalCompliance = ({ formData, updateFormData }: LegalComplianceProps) => {
  const handleToggle = (item: string) => {
    const current = formData.legalCompliance || [];
    const updated = current.includes(item)
      ? current.filter((i: string) => i !== item)
      : [...current, item];
    updateFormData({ legalCompliance: updated });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select applicable legal frameworks for compliance
      </p>
      
      {regulations.map((reg) => (
        <div key={reg.id} className="flex items-center space-x-2">
          <Checkbox
            id={reg.id}
            checked={(formData.legalCompliance || []).includes(reg.label)}
            onCheckedChange={() => handleToggle(reg.label)}
          />
          <Label htmlFor={reg.id} className="font-normal cursor-pointer">{reg.label}</Label>
        </div>
      ))}

      <div className="mt-6 p-4 rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground">
          {(formData.legalCompliance || []).length === 0 && (
            "A general privacy policy will be included if no specific regulations are selected."
          )}
          {(formData.legalCompliance || []).length > 0 && (
            `Your policy will comply with: ${formData.legalCompliance.join(", ")}`
          )}
        </p>
      </div>
    </div>
  );
};
