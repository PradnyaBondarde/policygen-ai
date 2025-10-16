import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export const BasicInfo = ({ formData, updateFormData }: BasicInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="appName">Website/App Name *</Label>
        <Input
          id="appName"
          value={formData.appName || ""}
          onChange={(e) => updateFormData({ appName: e.target.value })}
          placeholder="My Amazing App"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Website URL *</Label>
        <Input
          id="websiteUrl"
          type="url"
          value={formData.websiteUrl || ""}
          onChange={(e) => updateFormData({ websiteUrl: e.target.value })}
          placeholder="https://example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Entity Type *</Label>
        <RadioGroup
          value={formData.entityType || ""}
          onValueChange={(value) => updateFormData({ entityType: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="business" id="business" />
            <Label htmlFor="business" className="font-normal cursor-pointer">Business</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual" className="font-normal cursor-pointer">Individual</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country *</Label>
        <Select value={formData.country || ""} onValueChange={(value) => updateFormData({ country: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usa">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="canada">Canada</SelectItem>
            <SelectItem value="australia">Australia</SelectItem>
            <SelectItem value="india">India</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">State/Province</Label>
        <Input
          id="state"
          value={formData.state || ""}
          onChange={(e) => updateFormData({ state: e.target.value })}
          placeholder="California"
        />
      </div>
    </div>
  );
};
