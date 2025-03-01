-- Migration file for setting up Row Level Security (RLS) policies for Xalesin CRM

-- Enable Row Level Security on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create a function to get the current user's tenant_id
CREATE OR REPLACE FUNCTION public.get_current_tenant_id() RETURNS UUID AS $$
DECLARE
  tenant_id UUID;
BEGIN
  SELECT p.tenant_id INTO tenant_id
  FROM public.profiles p
  WHERE p.id = auth.uid();
  
  RETURN tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if current user has admin role
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT (role = 'admin') INTO is_admin
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(is_admin, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if current user has staff or admin role
CREATE OR REPLACE FUNCTION public.is_staff_or_admin() RETURNS BOOLEAN AS $$
DECLARE
  has_role BOOLEAN;
BEGIN
  SELECT (role IN ('admin', 'staff')) INTO has_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(has_role, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies for tenants table
-- Only allow users to see their own tenant
CREATE POLICY tenant_isolation_policy ON public.tenants
  USING (id = public.get_current_tenant_id());

-- Only allow tenant admins to update their tenant details
CREATE POLICY tenant_update_policy ON public.tenants
  FOR UPDATE USING (id = public.get_current_tenant_id() AND public.is_admin())
  WITH CHECK (id = public.get_current_tenant_id() AND public.is_admin());

-- Create policies for profiles table
-- Users can only see profiles in their own tenant
CREATE POLICY profiles_tenant_isolation_policy ON public.profiles
  USING (tenant_id = public.get_current_tenant_id());

-- Only tenant admins can create new profiles in their tenant
CREATE POLICY profiles_insert_policy ON public.profiles
  FOR INSERT WITH CHECK (
    tenant_id = public.get_current_tenant_id() AND public.is_admin()
  );

-- Only tenant admins can update profiles in their tenant
CREATE POLICY profiles_update_policy ON public.profiles
  FOR UPDATE USING (tenant_id = public.get_current_tenant_id() AND public.is_admin())
  WITH CHECK (tenant_id = public.get_current_tenant_id() AND public.is_admin());

-- Users can update their own profile
CREATE POLICY profiles_update_own_profile_policy ON public.profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND tenant_id = public.get_current_tenant_id());

-- Only tenant admins can delete profiles in their tenant
CREATE POLICY profiles_delete_policy ON public.profiles
  FOR DELETE USING (
    tenant_id = public.get_current_tenant_id() AND public.is_admin()
  );

-- Create policies for contacts table
-- Users can only see contacts in their own tenant
CREATE POLICY contacts_tenant_isolation_policy ON public.contacts
  USING (tenant_id = public.get_current_tenant_id());

-- Users can create contacts in their own tenant
CREATE POLICY contacts_insert_policy ON public.contacts
  FOR INSERT WITH CHECK (tenant_id = public.get_current_tenant_id());

-- Users can update contacts in their own tenant
CREATE POLICY contacts_update_policy ON public.contacts
  FOR UPDATE USING (tenant_id = public.get_current_tenant_id())
  WITH CHECK (tenant_id = public.get_current_tenant_id());

-- Only staff and admin users can delete contacts
CREATE POLICY contacts_delete_policy ON public.contacts
  FOR DELETE USING (
    tenant_id = public.get_current_tenant_id() AND public.is_staff_or_admin()
  );

-- Create policies for leads table
-- Users can only see leads in their own tenant
CREATE POLICY leads_tenant_isolation_policy ON public.leads
  USING (tenant_id = public.get_current_tenant_id());

-- Users can create leads in their own tenant
CREATE POLICY leads_insert_policy ON public.leads
  FOR INSERT WITH CHECK (tenant_id = public.get_current_tenant_id());

-- Users can update leads in their own tenant
CREATE POLICY leads_update_policy ON public.leads
  FOR UPDATE USING (tenant_id = public.get_current_tenant_id())
  WITH CHECK (tenant_id = public.get_current_tenant_id());

-- Only staff and admin users can delete leads
CREATE POLICY leads_delete_policy ON public.leads
  FOR DELETE USING (
    tenant_id = public.get_current_tenant_id() AND public.is_staff_or_admin()
  );

-- Create policies for activities table
-- Users can only see activities in their own tenant
CREATE POLICY activities_tenant_isolation_policy ON public.activities
  USING (tenant_id = public.get_current_tenant_id());

-- Users can create activities in their own tenant
CREATE POLICY activities_insert_policy ON public.activities
  FOR INSERT WITH CHECK (tenant_id = public.get_current_tenant_id());

-- Users can update activities in their own tenant
CREATE POLICY activities_update_policy ON public.activities
  FOR UPDATE USING (tenant_id = public.get_current_tenant_id())
  WITH CHECK (tenant_id = public.get_current_tenant_id());

-- Only staff and admin users can delete activities
CREATE POLICY activities_delete_policy ON public.activities
  FOR DELETE USING (
    tenant_id = public.get_current_tenant_id() AND public.is_staff_or_admin()
  );

-- Create policies for settings table
-- Users can only see settings for their own tenant
CREATE POLICY settings_tenant_isolation_policy ON public.settings
  USING (tenant_id = public.get_current_tenant_id());

-- Only tenant admins can update settings
CREATE POLICY settings_update_policy ON public.settings
  FOR UPDATE USING (tenant_id = public.get_current_tenant_id() AND public.is_admin())
  WITH CHECK (tenant_id = public.get_current_tenant_id() AND public.is_admin());

-- Only tenant admins can insert settings
CREATE POLICY settings_insert_policy ON public.settings
  FOR INSERT WITH CHECK (
    tenant_id = public.get_current_tenant_id() AND public.is_admin()
  );

-- Allow anonymous access for initial signup
CREATE POLICY allow_public_tenant_select ON public.tenants FOR SELECT USING (true);

-- Allow new users to be created
CREATE POLICY allow_public_profiles_insert ON public.profiles FOR INSERT WITH CHECK (true);