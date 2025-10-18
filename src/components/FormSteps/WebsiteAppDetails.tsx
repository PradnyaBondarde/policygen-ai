import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Plus, X } from "lucide-react";

interface WebsiteAppDetailsProps {
  formData: any;
  updateFormData: (data: any) => void;
  onValidation?: (isValid: boolean) => void;
}

export const WebsiteAppDetails = ({ formData, updateFormData, onValidation }: WebsiteAppDetailsProps) => {
  const platformType = formData.platformType || "";
  const [newAppUrl, setNewAppUrl] = React.useState("");
  const [customLanguage, setCustomLanguage] = React.useState("");

  const commonLanguages = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Portuguese", "Hindi", "Arabic"];
  const scopes = ["Local", "National", "International"];
  const ageGroups = ["All ages", "Children (<13)", "Teens (13-17)", "Adults (18+)"];

  const isValid = (formData.languages?.length > 0) && (formData.operationScope?.length > 0);
  
  React.useEffect(() => {
    onValidation?.(isValid);
  }, [isValid, onValidation]);

  const addAppUrl = () => {
    if (newAppUrl.trim()) {
      const urls = formData.appStoreUrls || [];
      updateFormData({ appStoreUrls: [...urls, newAppUrl.trim()] });
      setNewAppUrl("");
    }
  };

  const removeAppUrl = (index: number) => {
    const urls = formData.appStoreUrls || [];
    updateFormData({ appStoreUrls: urls.filter((_: string, i: number) => i !== index) });
  };

  const toggleLanguage = (lang: string) => {
    const current = formData.languages || [];
    const updated = current.includes(lang)
      ? current.filter((l: string) => l !== lang)
      : [...current, lang];
    updateFormData({ languages: updated });
  };

  const addCustomLanguage = () => {
    if (customLanguage.trim()) {
      const languages = formData.languages || [];
      if (!languages.includes(customLanguage.trim())) {
        updateFormData({ languages: [...languages, customLanguage.trim()] });
      }
      setCustomLanguage("");
    }
  };

  const removeLanguage = (lang: string) => {
    const languages = formData.languages || [];
    updateFormData({ languages: languages.filter((l: string) => l !== lang) });
  };

  const toggleScope = (scope: string) => {
    const current = formData.operationScope || [];
    const updated = current.includes(scope)
      ? current.filter((s: string) => s !== scope)
      : [...current, scope];
    updateFormData({ operationScope: updated });
  };

  const toggleAgeGroup = (age: string) => {
    const current = formData.targetAgeGroups || [];
    const updated = current.includes(age)
      ? current.filter((a: string) => a !== age)
      : [...current, age];
    updateFormData({ targetAgeGroups: updated });
  };

  return (
    <div className="space-y-6">
      {(platformType === "website" || platformType === "both") && (
        <div>
          <Label htmlFor="websiteUrl">Website URL *</Label>
          <Input
            id="websiteUrl"
            type="url"
            value={formData.websiteUrl || ""}
            onChange={(e) => updateFormData({ websiteUrl: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
      )}

      {(platformType === "app" || platformType === "both") && (
        <div className="space-y-3">
          <Label htmlFor="appName">App Name *</Label>
          <Input
            id="appName"
            value={formData.appName || ""}
            onChange={(e) => updateFormData({ appName: e.target.value })}
            placeholder="Your app name"
          />

          <Label>App Store URLs</Label>
          <div className="flex gap-2">
            <Input
              value={newAppUrl}
              onChange={(e) => setNewAppUrl(e.target.value)}
              placeholder="https://play.google.com/... or https://apps.apple.com/..."
              onKeyPress={(e) => e.key === "Enter" && addAppUrl()}
            />
            <Button type="button" onClick={addAppUrl} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {(formData.appStoreUrls || []).map((url: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2 p-2 border rounded">
              <span className="flex-1 text-sm truncate">{url}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeAppUrl(idx)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div>
        <Label className="text-base font-semibold mb-3 block">Primary Language(s) *</Label>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {commonLanguages.map((lang) => (
            <div key={lang} className="flex items-center space-x-2">
              <Checkbox
                id={lang}
                checked={(formData.languages || []).includes(lang)}
                onCheckedChange={() => toggleLanguage(lang)}
              />
              <Label htmlFor={lang} className="font-normal cursor-pointer">{lang}</Label>
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Add custom language"
            value={customLanguage}
            onChange={(e) => setCustomLanguage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomLanguage()}
          />
          <Button type="button" size="sm" onClick={addCustomLanguage}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {(formData.languages || []).filter((l: string) => !commonLanguages.includes(l)).map((lang: string) => (
          <div key={lang} className="flex items-center justify-between bg-secondary p-2 rounded mt-2">
            <span className="text-sm">{lang}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeLanguage(lang)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Scope of Operation *</Label>
        <div className="flex flex-wrap gap-3">
          {scopes.map((scope) => (
            <div key={scope} className="flex items-center space-x-2">
              <Checkbox
                id={scope}
                checked={(formData.operationScope || []).includes(scope)}
                onCheckedChange={() => toggleScope(scope)}
              />
              <Label htmlFor={scope} className="font-normal cursor-pointer">{scope}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Target Audience Age Groups *</Label>
        <div className="space-y-2">
          {ageGroups.map((age) => (
            <div key={age} className="flex items-center space-x-2">
              <Checkbox
                id={age}
                checked={(formData.targetAgeGroups || []).includes(age)}
                onCheckedChange={() => toggleAgeGroup(age)}
              />
              <Label htmlFor={age} className="font-normal cursor-pointer">{age}</Label>
            </div>
          ))}
        </div>
        {(formData.targetAgeGroups || []).includes("Children (<13)") && (
          <div className="mt-3 p-3 bg-warning/10 border border-warning rounded-lg">
            <p className="text-sm font-medium">⚠️ COPPA Compliance Required</p>
            <p className="text-xs text-muted-foreground mt-1">
              You'll need to provide parental consent mechanisms in the legal compliance section.
            </p>
          </div>
        )}
      </div>

      {!isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select at least one language and operation scope to continue.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
