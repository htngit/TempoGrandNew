import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building2, Save, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tenantApi, profileApi } from "@/lib/api";

const TenantSettings = () => {
  const [tenant, setTenant] = useState<any>({
    name: '',
    industry: '',
    website: '',
    address: '',
    phone: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        setLoading(true);
        
        // Check if current user is the tenant owner
        const ownerStatus = await profileApi.isOwner();
        setIsOwner(ownerStatus);
        
        // Fetch tenant data
        const tenantData = await tenantApi.getCurrent();
        if (tenantData) {
          console.log("Fetched tenant data:", tenantData);
          setTenant({
            id: tenantData.id,
            name: tenantData.name || '',
            industry: tenantData.industry || '',
            website: tenantData.website || '',
            address: tenantData.address || '',
            phone: tenantData.phone || '',
          });
        } else {
          console.error("No tenant data returned");
          setNotification({
            type: 'error',
            message: 'Failed to load organization data: No data returned'
          });
        }
      } catch (error) {
        console.error("Error fetching tenant data:", error);
        setNotification({
          type: 'error',
          message: 'Failed to load organization data'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTenantData();
  }, []);
  
  const handleSave = async () => {
    if (!tenant.id) return;
    
    try {
      setSaving(true);
      
      // Update tenant information
      const updated = await tenantApi.update(tenant.id, {
        name: tenant.name,
        industry: tenant.industry,
        website: tenant.website,
        address: tenant.address,
        phone: tenant.phone,
      });
      
      if (updated) {
        setNotification({
          type: 'success',
          message: 'Organization settings saved successfully'
        });
        
        // Auto-dismiss notification after 3 seconds
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      } else {
        throw new Error('Failed to update organization settings');
      }
    } catch (error) {
      console.error("Error saving tenant settings:", error);
      setNotification({
        type: 'error',
        message: 'Failed to save organization settings'
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Notification component
  const NotificationAlert = () => {
    if (!notification) return null;
    
    return (
      <Alert
        variant={notification.type === 'error' ? 'destructive' : 'default'}
        className={notification.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : ''}
      >
        <AlertDescription>
          {notification.message}
        </AlertDescription>
      </Alert>
    );
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tenant Settings</h2>
      
      <NotificationAlert />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Organization Details
            </CardTitle>
            <CardDescription>
              These details were set during onboarding and can be updated here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input 
                id="org-name" 
                value={tenant.name}
                onChange={(e) => setTenant({...tenant, name: e.target.value})}
                disabled={!isOwner || saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select 
                value={tenant.industry}
                onValueChange={(value) => setTenant({...tenant, industry: value})}
                disabled={!isOwner || saving}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                type="url" 
                value={tenant.website}
                onChange={(e) => setTenant({...tenant, website: e.target.value})}
                disabled={!isOwner || saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={tenant.phone}
                onChange={(e) => setTenant({...tenant, phone: e.target.value})}
                disabled={!isOwner || saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={tenant.address}
                onChange={(e) => setTenant({...tenant, address: e.target.value})}
                rows={3}
                disabled={!isOwner || saving}
              />
            </div>
            {!isOwner ? (
              <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Only the organization owner can modify these settings
                </AlertDescription>
              </Alert>
            ) : (
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="mt-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {isOwner && (
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Destructive actions that cannot be undone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" disabled={saving}>
                Delete Organization
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                This will permanently delete your organization and all associated data.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TenantSettings;
