import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DevicePermissionsProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const permissions = [
  "Location (GPS)",
  "Camera (Photos)",
  "Microphone",
  "Contacts (Phonebook)",
  "Storage access",
];

export const DevicePermissions = ({ formData, updateFormData }: DevicePermissionsProps) => {
  const handleToggle = (item: string) => {
    const current = formData.devicePermissions || [];
    const updated = current.includes(item)
      ? current.filter((i: string) => i !== item)
      : [...current, item];
    updateFormData({ devicePermissions: updated });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select device permissions your app requests (or skip if none)
      </p>
      
      {permissions.map((item) => (
        <div key={item} className="flex items-center space-x-2">
          <Checkbox
            id={item}
            checked={(formData.devicePermissions || []).includes(item)}
            onCheckedChange={() => handleToggle(item)}
          />
          <Label htmlFor={item} className="font-normal cursor-pointer">{item}</Label>
        </div>
      ))}
    </div>
  );
};
