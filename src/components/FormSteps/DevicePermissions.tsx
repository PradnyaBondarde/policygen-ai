import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface DevicePermissionsProps {
  formData: any;
  updateFormData: (data: any) => void;
  onValidation?: (isValid: boolean) => void;
}

const permissions = [
  "Location (GPS)",
  "Camera (Photos)",
  "Microphone",
  "Contacts (Phonebook)",
  "Storage access",
];

const collectionMethods = [
  "Forms (registration, contact)",
  "Cookies & tracking",
  "Analytics tools",
  "Third-party integrations",
  "Device features",
];

export const DevicePermissions = ({ formData, updateFormData, onValidation }: DevicePermissionsProps) => {
  const [customMethod, setCustomMethod] = React.useState("");

  // This step has no required fields; always mark as valid so Next works
  React.useEffect(() => {
    onValidation?.(true);
  }, [onValidation]);

  const handleTogglePermission = (item: string) => {
    const current = formData.devicePermissions || [];
    const updated = current.includes(item)
      ? current.filter((i: string) => i !== item)
      : [...current, item];
    updateFormData({ devicePermissions: updated });
  };

  const handleToggleMethod = (method: string) => {
    const current = formData.collectionMethods || [];
    const updated = current.includes(method)
      ? current.filter((m: string) => m !== method)
      : [...current, method];
    updateFormData({ collectionMethods: updated });
  };

  const addCustomMethod = () => {
    if (customMethod.trim()) {
      const methods = formData.collectionMethods || [];
      if (!methods.includes(customMethod.trim())) {
        updateFormData({ collectionMethods: [...methods, customMethod.trim()] });
      }
      setCustomMethod("");
    }
  };

  const removeMethod = (method: string) => {
    const methods = formData.collectionMethods || [];
    updateFormData({ collectionMethods: methods.filter((m: string) => m !== method) });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-3 block">Device Permissions</Label>
        <p className="text-sm text-muted-foreground mb-3">
          Select device permissions your app requests (or skip if none)
        </p>
        
        <div className="space-y-2">
          {permissions.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={item}
                checked={(formData.devicePermissions || []).includes(item)}
                onCheckedChange={() => handleTogglePermission(item)}
              />
              <Label htmlFor={item} className="font-normal cursor-pointer">{item}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">How Data Is Collected</Label>
        <p className="text-sm text-muted-foreground mb-3">
          Select collection methods
        </p>
        
        <div className="space-y-2">
          {collectionMethods.map((method) => (
            <div key={method} className="flex items-center space-x-2">
              <Checkbox
                id={method}
                checked={(formData.collectionMethods || []).includes(method)}
                onCheckedChange={() => handleToggleMethod(method)}
              />
              <Label htmlFor={method} className="font-normal cursor-pointer">{method}</Label>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2 mt-3">
          <Input
            placeholder="Add custom collection method"
            value={customMethod}
            onChange={(e) => setCustomMethod(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomMethod()}
          />
          <Button type="button" size="sm" onClick={addCustomMethod}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {(formData.collectionMethods || []).filter((m: string) => !collectionMethods.includes(m)).map((method: string) => (
          <div key={method} className="flex items-center justify-between bg-secondary p-2 rounded mt-2">
            <span className="text-sm">{method}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeMethod(method)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
