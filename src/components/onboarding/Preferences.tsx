import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings } from "lucide-react";

interface PreferencesProps {
  onDataChange?: (data: any) => void;
}

const Preferences = ({ onDataChange = () => {} }: PreferencesProps) => {
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [theme, setTheme] = React.useState("light");
  const [dataSharing, setDataSharing] = React.useState(false);
  const [autoSave, setAutoSave] = React.useState(true);

  React.useEffect(() => {
    onDataChange({ emailNotifications, theme, dataSharing, autoSave });
  }, [emailNotifications, theme, dataSharing, autoSave, onDataChange]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Your Preferences</h2>
          <p className="text-muted-foreground">Customize your experience</p>
        </div>
      </div>

      <div className="space-y-6 mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex-1">
              Email Notifications
              <span className="block text-sm text-muted-foreground">
                Receive updates about your account activity
              </span>
            </Label>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Appearance</h3>
          <RadioGroup value={theme} onValueChange={setTheme}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System Default</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Privacy & Data</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="data-sharing" className="flex-1">
              Data Sharing
              <span className="block text-sm text-muted-foreground">
                Allow anonymous usage data to improve our service
              </span>
            </Label>
            <Switch
              id="data-sharing"
              checked={dataSharing}
              onCheckedChange={setDataSharing}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-save" className="flex-1">
              Auto-Save
              <span className="block text-sm text-muted-foreground">
                Automatically save your work as you go
              </span>
            </Label>
            <Switch
              id="auto-save"
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
