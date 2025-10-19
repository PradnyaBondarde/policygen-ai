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
  React.useEffect(() => {
    // All fields are optional
    onValidation?.(true);
  }, [onValidation]);

  const thirdPartiesData = formData.thirdPartiesSharing || { categories: [], details: "" };

  const handleCategoryToggle = (category: string) => {
    const current = thirdPartiesData.categories || [];
    const updated = current.includes(category)
      ? current.filter((c: string) => c !== category)
      : [...current, category];
    
    updateFormData({
      thirdPartiesSharing: {
        ...thirdPartiesData,
        categories: updated
      }
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
        Specify which third parties have access to user data and why
      </p>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Third Party Categories</Label>
        {thirdPartyCategories.map((category) => (
          <div key={category.id} className="space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={(thirdPartiesData.categories || []).includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
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
        />
        <p className="text-xs text-muted-foreground">
          Explain how and why data is shared with third parties
        </p>
      </div>
    </div>
  );
};
