import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OwnerEntityDetailsProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export const OwnerEntityDetails = ({ formData, updateFormData }: OwnerEntityDetailsProps) => {
  const ownerType = formData.ownerType || "";

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">Owner Type</Label>
        <RadioGroup
          value={ownerType}
          onValueChange={(value) => updateFormData({ ownerType: value })}
          className="mt-3"
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

      {ownerType === "business" && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          <div>
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={formData.businessName || ""}
              onChange={(e) => updateFormData({ businessName: e.target.value })}
              placeholder="Enter business name"
            />
          </div>

          <div>
            <Label htmlFor="businessType">Business Type *</Label>
            <Select
              value={formData.businessType || ""}
              onValueChange={(value) => updateFormData({ businessType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="llc">LLC</SelectItem>
                <SelectItem value="corporation">Corporation</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="sole_proprietor">Sole Proprietor</SelectItem>
                <SelectItem value="nonprofit">Nonprofit</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="businessRegNumber">Business Registration Number</Label>
            <Input
              id="businessRegNumber"
              value={formData.businessRegNumber || ""}
              onChange={(e) => updateFormData({ businessRegNumber: e.target.value })}
              placeholder="Optional"
            />
          </div>

          <div>
            <Label htmlFor="businessAddress">Business Address *</Label>
            <Input
              id="businessAddress"
              value={formData.businessAddress || ""}
              onChange={(e) => updateFormData({ businessAddress: e.target.value })}
              placeholder="Street address"
              className="mb-2"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={formData.businessCity || ""}
                onChange={(e) => updateFormData({ businessCity: e.target.value })}
                placeholder="City"
              />
              <Input
                value={formData.businessState || ""}
                onChange={(e) => updateFormData({ businessState: e.target.value })}
                placeholder="State/Province"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Input
                value={formData.businessPostalCode || ""}
                onChange={(e) => updateFormData({ businessPostalCode: e.target.value })}
                placeholder="Postal code"
              />
              <Input
                value={formData.businessCountry || ""}
                onChange={(e) => updateFormData({ businessCountry: e.target.value })}
                placeholder="Country"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="businessEmail">Business Contact Email *</Label>
            <Input
              id="businessEmail"
              type="email"
              value={formData.businessEmail || ""}
              onChange={(e) => updateFormData({ businessEmail: e.target.value })}
              placeholder="contact@business.com"
            />
          </div>

          <div>
            <Label htmlFor="businessPhone">Business Contact Phone *</Label>
            <Input
              id="businessPhone"
              type="tel"
              value={formData.businessPhone || ""}
              onChange={(e) => updateFormData({ businessPhone: e.target.value })}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
      )}

      {ownerType === "individual" && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          <div>
            <Label htmlFor="individualName">Full Name *</Label>
            <Input
              id="individualName"
              value={formData.individualName || ""}
              onChange={(e) => updateFormData({ individualName: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label htmlFor="individualEmail">Contact Email *</Label>
            <Input
              id="individualEmail"
              type="email"
              value={formData.individualEmail || ""}
              onChange={(e) => updateFormData({ individualEmail: e.target.value })}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="individualPhone">Phone Number</Label>
            <Input
              id="individualPhone"
              type="tel"
              value={formData.individualPhone || ""}
              onChange={(e) => updateFormData({ individualPhone: e.target.value })}
              placeholder="+1 (555) 000-0000 (optional)"
            />
          </div>
        </div>
      )}
    </div>
  );
};
