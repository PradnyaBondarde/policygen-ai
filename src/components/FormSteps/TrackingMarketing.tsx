import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TrackingMarketingProps {
  formData: any;
  updateFormData: (data: any) => void;
  onValidation?: (isValid: boolean) => void;
}

const analyticsTools = ["Google Analytics", "Firebase", "Mixpanel", "Matomo"];
const emailTools = ["Mailchimp", "Constant Contact", "AWeber"];
const adTools = ["AdSense", "AdMob", "Bing Ads"];
const paymentTools = ["Stripe", "PayPal", "Google Pay"];
const remarketingTools = ["Google Ads", "Facebook Ads", "Twitter Ads"];

export const TrackingMarketing = ({ formData, updateFormData, onValidation }: TrackingMarketingProps) => {
  const [otherTexts, setOtherTexts] = React.useState<{[key: string]: string}>({
    analytics: "",
    emailMarketing: "",
    advertising: "",
    payments: "",
    remarketing: ""
  });

  const toggleTool = (category: string, tool: string) => {
    const current = formData[category]?.tools || [];
    const updated = current.includes(tool)
      ? current.filter((t: string) => t !== tool)
      : [...current, tool];
    
    updateFormData({
      [category]: {
        ...formData[category],
        tools: updated,
      },
    });
  };

  const toggleCategory = (category: string, enabled: boolean) => {
    updateFormData({
      [category]: {
        ...formData[category],
        enabled,
        tools: enabled ? formData[category]?.tools || [] : [],
        other: enabled ? formData[category]?.other || "" : "",
      },
    });
  };

  const addOtherTool = (category: string) => {
    const otherText = otherTexts[category]?.trim();
    if (otherText) {
      const current = formData[category]?.tools || [];
      if (!current.includes(otherText)) {
        updateFormData({
          [category]: {
            ...formData[category],
            tools: [...current, otherText],
          },
        });
      }
      setOtherTexts(prev => ({ ...prev, [category]: "" }));
    }
  };

  const handleNoneToggle = () => {
    const currentNone = formData.processingNone || false;
    updateFormData({ processingNone: !currentNone });
    
    // If selecting None, disable all categories
    if (!currentNone) {
      updateFormData({
        processingNone: true,
        analytics: { enabled: false, tools: [] },
        emailMarketing: { enabled: false, tools: [] },
        advertising: { enabled: false, tools: [] },
        payments: { enabled: false, tools: [] },
        remarketing: { enabled: false, tools: [] },
      });
    }
  };

  // Validation: Check if None is selected OR at least one enabled category has sub-options
  const isValid = React.useMemo(() => {
    if (formData.processingNone) return true;
    
    const categories = ['analytics', 'emailMarketing', 'advertising', 'payments', 'remarketing'];
    const enabledCategories = categories.filter(cat => formData[cat]?.enabled);
    
    if (enabledCategories.length === 0) return false;
    
    // Check if all enabled categories have at least one tool selected
    return enabledCategories.every(cat => (formData[cat]?.tools || []).length > 0);
  }, [formData]);

  React.useEffect(() => {
    onValidation?.(isValid);
  }, [isValid, onValidation]);

  const renderCategory = (
    category: string,
    label: string,
    tools: string[]
  ) => {
    const isEnabled = formData[category]?.enabled || false;
    const selectedTools = formData[category]?.tools || [];
    const hasError = isEnabled && selectedTools.length === 0 && !formData.processingNone;

    return (
      <div key={category} className={`space-y-3 p-4 rounded-lg border ${hasError ? 'border-destructive' : 'border-border'}`}>
        <div className="flex items-center justify-between">
          <Label>{label}</Label>
          <Switch
            checked={isEnabled}
            onCheckedChange={(enabled) => toggleCategory(category, enabled)}
            disabled={formData.processingNone}
          />
        </div>
        
        {isEnabled && (
          <div className="ml-4 space-y-2">
            {tools.map((tool) => (
              <div key={tool} className="flex items-center space-x-2">
                <Checkbox
                  id={`${category}-${tool}`}
                  checked={selectedTools.includes(tool)}
                  onCheckedChange={() => toggleTool(category, tool)}
                />
                <Label htmlFor={`${category}-${tool}`} className="font-normal cursor-pointer text-sm">
                  {tool}
                </Label>
              </div>
            ))}
            
            <div className="flex items-center space-x-2 mt-3">
              <Input
                placeholder="Other (specify)"
                value={otherTexts[category]}
                onChange={(e) => setOtherTexts(prev => ({ ...prev, [category]: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && addOtherTool(category)}
                className="text-sm"
              />
              <button
                type="button"
                onClick={() => addOtherTool(category)}
                className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Add
              </button>
            </div>
            
            {hasError && (
              <p className="text-xs text-destructive mt-2">Please select at least one option or add your own</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Configure tracking and marketing services you use (Purpose of Processing)
      </p>
      
      <div className="flex items-center space-x-2 p-4 rounded-lg border border-border bg-muted/30">
        <Checkbox
          id="processingNone"
          checked={formData.processingNone || false}
          onCheckedChange={handleNoneToggle}
        />
        <Label htmlFor="processingNone" className="font-medium cursor-pointer">
          None - I don't use any of these services
        </Label>
      </div>
      
      {renderCategory("analytics", "Do you use Analytics?", analyticsTools)}
      {renderCategory("emailMarketing", "Do you send Emails to users?", emailTools)}
      {renderCategory("advertising", "Do you show Ads?", adTools)}
      {renderCategory("payments", "Do you allow payments?", paymentTools)}
      {renderCategory("remarketing", "Do you use Remarketing?", remarketingTools)}
      
      {!isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {formData.processingNone ? "" : "Please select 'None' or enable at least one category and select sub-options for each enabled category."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
