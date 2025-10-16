import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface TrackingMarketingProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const analyticsTools = ["Google Analytics", "Firebase", "Mixpanel", "Matomo"];
const emailTools = ["Mailchimp", "Constant Contact", "AWeber"];
const adTools = ["AdSense", "AdMob", "Bing Ads"];
const paymentTools = ["Stripe", "PayPal", "Google Pay"];
const remarketingTools = ["Google Ads", "Facebook Ads", "Twitter Ads"];

export const TrackingMarketing = ({ formData, updateFormData }: TrackingMarketingProps) => {
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
      },
    });
  };

  const renderCategory = (
    category: string,
    label: string,
    tools: string[]
  ) => (
    <div key={category} className="space-y-3 p-4 rounded-lg border border-border">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Switch
          checked={formData[category]?.enabled || false}
          onCheckedChange={(enabled) => toggleCategory(category, enabled)}
        />
      </div>
      
      {formData[category]?.enabled && (
        <div className="ml-4 space-y-2">
          {tools.map((tool) => (
            <div key={tool} className="flex items-center space-x-2">
              <Checkbox
                id={`${category}-${tool}`}
                checked={(formData[category]?.tools || []).includes(tool)}
                onCheckedChange={() => toggleTool(category, tool)}
              />
              <Label htmlFor={`${category}-${tool}`} className="font-normal cursor-pointer text-sm">
                {tool}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Configure tracking and marketing services you use
      </p>
      
      {renderCategory("analytics", "Do you use Analytics?", analyticsTools)}
      {renderCategory("emailMarketing", "Do you send Emails to users?", emailTools)}
      {renderCategory("advertising", "Do you show Ads?", adTools)}
      {renderCategory("payments", "Do you allow payments?", paymentTools)}
      {renderCategory("remarketing", "Do you use Remarketing?", remarketingTools)}
    </div>
  );
};
