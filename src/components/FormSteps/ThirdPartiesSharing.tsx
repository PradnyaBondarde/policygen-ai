import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ThirdPartiesSharingProps {
  formData: any;
  updateFormData: (data: any) => void;
  onValidation?: (isValid: boolean) => void;
}

const thirdPartyCategories = [
  { id: "analytics", label: "Analytics Providers", description: "e.g., Google Analytics, Mixpanel" },
  { id: "payment", label: "Payment Processors", description: "e.g., Stripe, PayPal" },
  { id: "cloud", label: "Cloud Service Providers", description: "e.g., AWS, Azure, Google Cloud" },
  { id: "marketing", label: "Marketing Partners", description: "e.g., Mailchimp, HubSpot" },
  { id: "social", label: "Social Media Platforms", description: "e.g., Facebook, Twitter" },
  { id: "legal", label: "Legal/Regulatory Authorities", description: "When required by law" },
];

export const ThirdPartiesSharing = ({ formData, updateFormData, onValidation }: ThirdPartiesSharingProps) => {
  const thirdPartiesData = formData.thirdPartiesSharing || { categories: [], details: "" };

  const handleNoneToggle = () => {
    const currentNone = formData.thirdPartiesSharingNone || false;
    if (!currentNone) {
      updateFormData({ 
        thirdPartiesSharingNone: true, 
        thirdPartiesSharing: { categories: [], details: "" } 
      });
    } else {
      updateFormData({ thirdPartiesSharingNone: false });
    }
  };

  const isValid = (formData.thirdPartiesSharingNone || (thirdPartiesData.categories || []).length > 0);

  React.useEffect(() => {
    onValidation?.(isValid);
  }, [isValid, onValidation]);

  const handleCategoryToggle = (category: string) => {
    const current = thirdPartiesData.categories || [];
    const updated = current.includes(category)
      ? current.filter((c: string) => c !== category)
      : [...current, category];
    
    updateFormData({
      thirdPartiesSharing: {
        ...thirdPartiesData,
        categories: updated
      },
      thirdPartiesSharingNone: false
    });
  };

  const handleDetailsChange = (value: string) => {
    updateFormData({
      thirdPartiesSharing: {
        ...thirdPartiesData,
        details: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Specify which third parties have access to user data and why (or select None)
      </p>

      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-muted/30">
        <Checkbox
          id="thirdPartiesSharingNone"
          checked={formData.thirdPartiesSharingNone || false}
          onCheckedChange={handleNoneToggle}
        />
        <Label htmlFor="thirdPartiesSharingNone" className="font-medium cursor-pointer">None - No third-party data sharing</Label>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Third Party Categories</Label>
        {thirdPartyCategories.map((category) => (
          <div key={category.id} className="space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={(thirdPartiesData.categories || []).includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
                disabled={formData.thirdPartiesSharingNone}
              />
              <Label htmlFor={category.id} className="font-normal cursor-pointer flex-1">
                {category.label}
              </Label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">{category.description}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="thirdPartyDetails">Additional Details</Label>
        <Textarea
          id="thirdPartyDetails"
          value={thirdPartiesData.details || ""}
          onChange={(e) => handleDetailsChange(e.target.value)}
          placeholder="Describe data sharing agreements, safeguards, and purposes"
          rows={4}
          disabled={formData.thirdPartiesSharingNone}
        />
        <p className="text-xs text-muted-foreground">
          Explain how and why data is shared with third parties
        </p>
      </div>
    </div>
  );
};
