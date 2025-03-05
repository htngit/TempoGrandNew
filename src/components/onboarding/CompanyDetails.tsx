import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building } from "lucide-react";
import { useOnboardingContext } from "./OnboardingLayout";

interface CompanyDetailsProps {
  onDataChange?: (data: any) => void;
}

const CompanyDetails = ({ onDataChange = () => {} }: CompanyDetailsProps) => {
  const { companyData, updateCompanyData } = useOnboardingContext();

  const [address, setAddress] = React.useState(companyData.address || "");
  const [website, setWebsite] = React.useState(companyData.website || "");
  const [phone, setPhone] = React.useState(companyData.phone || "");
  const [description, setDescription] = React.useState(
    companyData.description || "",
  );

  // Handle form changes manually instead of in useEffect
  const handleChange = React.useCallback(() => {
    const data = { address, website, phone, description };
    updateCompanyData(data);
    onDataChange(data);
  }, [address, website, phone, description, onDataChange, updateCompanyData]);

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
          <Building className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Company Details</h2>
          <p className="text-muted-foreground">
            Tell us more about your company
          </p>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <div className="space-y-2">
          <Label htmlFor="website">Company Website</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://example.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Company Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Company Address</Label>
          <Textarea
            id="address"
            placeholder="Enter your company address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Company Description</Label>
          <Textarea
            id="description"
            placeholder="Brief description of your company"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
