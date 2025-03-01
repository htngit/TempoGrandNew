-- Migration file for setting up Row Level Security (RLS) policies for Xalesin CRM

-- Enable Row Level Security on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create a function to get the current user's tenant_id
CREATE OR REPLACE FUNCTION get_current_tenant_id() RETURNS UUID AS $$
DECLARE
  tenant_id UUID;
BEGIN
  SELECT u.tenant_id INTO tenant_id
  FROM users u
  WHERE u.id = auth.uid();
  
  RETURN tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies for tenants table
-- Only allow users to see their own tenant
CREATE POLICY tenant_isolation_policy ON tenants
  USING (id = get_current_tenant_id());

-- Only allow tenant admins to update their tenant details
CREATE POLICY tenant_update_policy ON tenants
  FOR UPDATE USING (id = get_current_tenant_id())
  WITH CHECK (id = get_current_tenant_id() AND EXISTS (
    SELECT 1 FROM users WHERE users.tenant_id = tenants.id AND users.id = auth.uid() AND users.role = 'admin'
  ));

-- Create policies for users table
-- Users can only see users in their own tenant
CREATE POLICY users_tenant_isolation_policy ON users
  USING (tenant_id = get_current_tenant_id());

-- Only tenant admins can create new users in their tenant
CREATE POLICY users_insert_policy ON users
  FOR INSERT WITH CHECK (
    tenant_id = get_current_tenant_id() AND 
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin' AND users.tenant_id = tenant_id)
  );

-- Only tenant admins can update users in their tenant
CREATE POLICY users_update_policy ON users
  FOR UPDATE USING (tenant_id = get_current_tenant_id())
  WITH CHECK (
    tenant_id = get_current_tenant_id() AND
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin' AND users.tenant_id = tenant_id)
  );

-- Users can update their own profile
CREATE POLICY users_update_own_profile_policy ON users
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND tenant_id = get_current_tenant_id());

-- Only tenant admins can delete users in their tenant
CREATE POLICY users_delete_policy ON users
  FOR DELETE USING (
    tenant_id = get_current_tenant_id() AND
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin' AND users.tenant_id = tenant_id)
  );

-- Create policies for contacts table
-- Users can only see contacts in their own tenant
CREATE POLICY contacts_tenant_isolation_policy ON contacts
  USING (tenant_id = get_current_tenant_id());

-- Users can create contacts in their own tenant
CREATE POLICY contacts_insert_policy ON contacts
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());

-- Users can update contacts in their own tenant
CREATE POLICY contacts_update_policy ON contacts
  FOR UPDATE USING (tenant_id = get_current_tenant_id())
  WITH CHECK (tenant_id = get_current_tenant_id());

-- Only staff and admin users can delete contacts
CREATE POLICY contacts_delete_policy ON contacts
  FOR DELETE USING (
    tenant_id = get_current_tenant_id() AND
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'staff') AND users.tenant_id = tenant_id)
  );

-- Create policies for leads table
-- Users can only see leads in their own tenant
CREATE POLICY leads_tenant_isolation_policy ON leads
  USING (tenant_id = get_current_tenant_id());

-- Users can create leads in their own tenant
CREATE POLICY leads_insert_policy ON leads
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());

-- Users can update leads in their own tenant
CREATE POLICY leads_update_policy ON leads
  FOR UPDATE USING (tenant_id = get_current_tenant_id())
  WITH CHECK (tenant_id = get_current_tenant_id());

-- Only staff and admin users can delete leads
CREATE POLICY leads_delete_policy ON leads
  FOR DELETE USING (
    tenant_id = get_current_tenant_id() AND
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'staff') AND users.tenant_id = tenant_id)
  );

-- Create policies for activities table
-- Users can only see activities in their own tenant
CREATE POLICY activities_tenant_isolation_policy ON activities
  USING (tenant_id = get_current_tenant_id());

-- Users can create activities in their own tenant
CREATE POLICY activities_insert_policy ON activities
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());

-- Users can update activities in their own tenant
CREATE POLICY activities_update_policy ON activities
  FOR UPDATE USING (tenant_id = get_current_tenant_id())
  WITH CHECK (tenant_id = get_current_tenant_id());

-- Only staff and admin users can delete activities
CREATE POLICY activities_delete_policy ON activities
  FOR DELETE USING (
    tenant_id = get_current_tenant_id() AND
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'staff') AND users.tenant_id = tenant_id)
  );

-- Create policies for settings table
-- Users can only see settings for their own tenant
CREATE POLICY settings_tenant_isolation_policy ON settings
  USING (tenant_id = get_current_tenant_id());

-- Only tenant admins can update settings
CREATE POLICY settings_update_policy ON settings
  FOR UPDATE USING (tenant_id = get_current_tenant_id())
  WITH CHECK (
    tenant_id = get_current_tenant_id() AND
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin' AND users.tenant_id = tenant_id)
  );

-- Only tenant admins can insert settings
CREATE POLICY settings_insert_policy ON settings
  FOR INSERT WITH CHECK (
    tenant_id = get_current_tenant_id() AND
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin' AND users.tenant_id = tenant_id)
  );
