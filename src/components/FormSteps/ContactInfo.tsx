import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ContactInfoProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export const ContactInfo = ({ formData, updateFormData }: ContactInfoProps) => {
  return (
    <div className="space-y-6">
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

      <div className="flex items-center space-x-2 p-4 rounded-lg border border-border">
        <Checkbox
          id="confirm"
          checked={formData.confirmed || false}
          onCheckedChange={(checked) => updateFormData({ confirmed: checked })}
        />
        <Label htmlFor="confirm" className="font-normal cursor-pointer">
          I confirm that the above information is correct
        </Label>
      </div>

      {!formData.confirmed && (
        <p className="text-sm text-destructive">
          Please confirm the information before generating your policy
        </p>
      )}
    </div>
  );
};
