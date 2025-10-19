import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface CookiesConsentProps {
  formData: any;
  updateFormData: (data: any) => void;
  onValidation?: (isValid: boolean) => void;
}

const cookieTypes = [
  { id: "essential", label: "Essential Cookies", description: "Required for basic site functionality" },
  { id: "analytics", label: "Analytics Cookies", description: "Track user behavior and site performance" },
  { id: "marketing", label: "Marketing Cookies", description: "Used for advertising and retargeting" },
  { id: "preference", label: "Preference Cookies", description: "Remember user settings and preferences" },
  { id: "social", label: "Social Media Cookies", description: "Enable social sharing features" },
];

export const CookiesConsent = ({ formData, updateFormData, onValidation }: CookiesConsentProps) => {
  const cookiesData = formData.cookiesConsent || { usesCookies: false, cookieTypes: [], consentMethod: "" };

  const handleNoneToggle = () => {
    const currentNone = formData.cookiesConsentNone || false;
    if (!currentNone) {
      updateFormData({ 
        cookiesConsentNone: true, 
        cookiesConsent: { usesCookies: false, cookieTypes: [], consentMethod: "" } 
      });
    } else {
      updateFormData({ cookiesConsentNone: false });
    }
  };

  const isValid = (
    formData.cookiesConsentNone || 
    cookiesData.usesCookies === false ||
    (cookiesData.usesCookies && cookiesData.cookieTypes?.length > 0)
  );

  React.useEffect(() => {
    onValidation?.(isValid);
  }, [isValid, onValidation]);

  const handleCookieToggle = () => {
    updateFormData({
      cookiesConsent: {
        ...cookiesData,
        usesCookies: !cookiesData.usesCookies
      },
      cookiesConsentNone: false
    });
  };

  const handleCookieTypeToggle = (type: string) => {
    const current = cookiesData.cookieTypes || [];
    const updated = current.includes(type)
      ? current.filter((t: string) => t !== type)
      : [...current, type];
    
    updateFormData({
      cookiesConsent: {
        ...cookiesData,
        cookieTypes: updated
      }
    });
  };

  const handleConsentMethodChange = (method: string) => {
    updateFormData({
      cookiesConsent: {
        ...cookiesData,
        consentMethod: method
      }
    });
  };

  const handleUserControlsChange = (value: string) => {
    updateFormData({
      cookiesConsent: {
        ...cookiesData,
        userControls: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Specify your cookie usage and consent mechanisms (or select None)
      </p>

      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-muted/30">
        <Checkbox
          id="cookiesConsentNone"
          checked={formData.cookiesConsentNone || false}
          onCheckedChange={handleNoneToggle}
        />
        <Label htmlFor="cookiesConsentNone" className="font-medium cursor-pointer">None - No cookies used</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="usesCookies"
          checked={cookiesData.usesCookies}
          onCheckedChange={handleCookieToggle}
          disabled={formData.cookiesConsentNone}
        />
        <Label htmlFor="usesCookies" className="cursor-pointer font-medium">
          This website/app uses cookies
        </Label>
      </div>

      {cookiesData.usesCookies && (
        <>
          <div className="space-y-3 pl-6 border-l-2 border-primary/20">
            <Label className="text-sm font-medium">Cookie Types Used</Label>
            {cookieTypes.map((cookie) => (
              <div key={cookie.id} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={cookie.id}
                    checked={(cookiesData.cookieTypes || []).includes(cookie.id)}
                    onCheckedChange={() => handleCookieTypeToggle(cookie.id)}
                  />
                  <Label htmlFor={cookie.id} className="font-normal cursor-pointer flex-1">
                    {cookie.label}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6">{cookie.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Consent Method</Label>
            <RadioGroup value={cookiesData.consentMethod || ""} onValueChange={handleConsentMethodChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="banner" id="banner" />
                <Label htmlFor="banner" className="cursor-pointer font-normal">
                  Cookie Banner (opt-in or opt-out)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="implied" id="implied" />
                <Label htmlFor="implied" className="cursor-pointer font-normal">
                  Implied Consent (continued use = consent)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="explicit" id="explicit" />
                <Label htmlFor="explicit" className="cursor-pointer font-normal">
                  Explicit Consent (required before any cookies)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userControls">User Controls & Rights</Label>
            <Textarea
              id="userControls"
              value={cookiesData.userControls || ""}
              onChange={(e) => handleUserControlsChange(e.target.value)}
              placeholder="e.g., Users can manage cookie preferences via settings page, withdraw consent anytime, access/delete their data"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Describe how users can control their data and exercise their rights
            </p>
          </div>
        </>
      )}
    </div>
  );
};
