import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings } from "lucide-react";
import { useOnboardingContext } from "./OnboardingLayout";

interface PreferencesProps {
  onDataChange?: (data: any) => void;
}

const Preferences = ({ onDataChange = () => {} }: PreferencesProps) => {
  const { preferencesData, updatePreferencesData } = useOnboardingContext();

  const [theme, setTheme] = React.useState(preferencesData.theme || "light");
  const [emailNotifications, setEmailNotifications] = React.useState(
    preferencesData.emailNotifications || false,
  );
  const [dataSharing, setDataSharing] = React.useState(
    preferencesData.dataSharing || false,
  );
  const [autoSave, setAutoSave] = React.useState(
    preferencesData.autoSave || true,
  );

  // Handle form changes manually instead of in useEffect
  const handleChange = React.useCallback(() => {
    const data = { theme, emailNotifications, dataSharing, autoSave };
    updatePreferencesData(data);
    onDataChange(data);
  }, [
    theme,
    emailNotifications,
    dataSharing,
    autoSave,
    onDataChange,
    updatePreferencesData,
  ]);

  // Use a debounced version of handleChange to avoid too many updates
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleChange();
    }, 500);

    return () => clearTimeout(timer);
  }, [handleChange]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Preferences</h2>
          <p className="text-muted-foreground">Customize your CRM experience</p>
        </div>
      </div>

      <div className="space-y-6 mt-6">
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="email-notifications" className="block mb-1">
              Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive email notifications for important updates
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="data-sharing" className="block mb-1">
              Data Sharing
            </Label>
            <p className="text-sm text-muted-foreground">
              Share anonymous usage data to help improve the product
            </p>
          </div>
          <Switch
            id="data-sharing"
            checked={dataSharing}
            onCheckedChange={setDataSharing}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="auto-save" className="block mb-1">
              Auto-Save
            </Label>
            <p className="text-sm text-muted-foreground">
              Automatically save changes as you work
            </p>
          </div>
          <Switch
            id="auto-save"
            checked={autoSave}
            onCheckedChange={setAutoSave}
          />
        </div>
      </div>
    </div>
  );
};

export default Preferences;
