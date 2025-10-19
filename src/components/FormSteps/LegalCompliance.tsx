import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface LegalComplianceProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const regulations = [
  { 
    id: "gdpr", 
    label: "GDPR (Europe)",
    subtitle: "Mandatory by law since 25 May 2018 (EU citizens)",
    tooltip: "General Data Protection Regulation applies to all organizations processing personal data of EU residents, regardless of where the organization is located."
  },
  { 
    id: "ccpa", 
    label: "CCPA/CPRA (California)",
    subtitle: "Mandatory by law since 1 January 2023 (California, USA)",
    tooltip: "California Consumer Privacy Act applies to businesses that collect personal information from California residents and meet certain thresholds."
  },
  { 
    id: "caloppa", 
    label: "CalOPPA (California)",
    subtitle: "Mandatory by law since 1 January 2014 (California websites & apps)",
    tooltip: "California Online Privacy Protection Act requires websites and apps that collect personal information from California residents to post a privacy policy."
  },
  { 
    id: "coppa", 
    label: "COPPA (Children under 13)",
    subtitle: "Mandatory by law since 21 April 2000 (US children's services)",
    tooltip: "Children's Online Privacy Protection Act applies to operators of websites or online services directed to children under 13 years of age."
  },
  { 
    id: "dpdpa", 
    label: "DPDPA (India)",
    subtitle: "Mandatory by law since 11 August 2023 (Indian data processing)",
    tooltip: "Digital Personal Data Protection Act applies to processing of digital personal data within India and to processing outside India if related to offering goods or services in India."
  },
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
      
      <TooltipProvider>
        {regulations.map((reg) => (
          <div key={reg.id} className="space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={reg.id}
                checked={(formData.legalCompliance || []).includes(reg.label)}
                onCheckedChange={() => handleToggle(reg.label)}
              />
              <Label htmlFor={reg.id} className="font-normal cursor-pointer flex-1">{reg.label}</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{reg.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xs italic text-muted-foreground ml-6">{reg.subtitle}</p>
          </div>
        ))}
      </TooltipProvider>

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
