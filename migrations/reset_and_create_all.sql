-- Reset and Create All Database Objects
-- This migration will:
-- 1. Drop all existing objects (tables, functions, policies, triggers)
-- 2. Create all tables with their relationships
-- 3. Set up RLS (Row Level Security) policies
-- 4. Add necessary indexes
-- 5. Create required functions
-- 6. Seed initial data

-- =======================================
-- PART 1: DROP ALL EXISTING OBJECTS
-- =======================================

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_tenant_created ON tenants;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.get_current_tenant_id();
DROP FUNCTION IF EXISTS public.has_completed_onboarding();
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.is_staff_or_admin();

-- Disable Row Level Security 
ALTER TABLE IF EXISTS public.tenants DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.settings DISABLE ROW LEVEL SECURITY;

-- Drop RLS policies
DROP POLICY IF EXISTS tenant_isolation_policy ON public.tenants;
DROP POLICY IF EXISTS profiles_tenant_isolation_policy ON public.profiles;
DROP POLICY IF EXISTS contacts_tenant_isolation_policy ON public.contacts;
DROP POLICY IF EXISTS leads_tenant_isolation_policy ON public.leads;
DROP POLICY IF EXISTS activities_tenant_isolation_policy ON public.activities;
DROP POLICY IF EXISTS settings_tenant_isolation_policy ON public.settings;

-- Drop tables (in correct order to avoid foreign key constraints)
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE; 
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.tenants CASCADE;

-- =======================================
-- PART 2: CREATE ALL TABLES
-- =======================================

-- Create tenants table
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  website VARCHAR(255),
  address TEXT,
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  avatar_key TEXT,
  avatar_url_s3 TEXT,
  email TEXT,
  phone VARCHAR(50),
  job_title VARCHAR(100),
  bio TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer',
  onboarding_complete BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'active',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create settings table
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL UNIQUE,
  theme VARCHAR(50) DEFAULT 'light',
  date_format VARCHAR(50) DEFAULT 'MM/DD/YYYY',
  timezone VARCHAR(100) DEFAULT 'UTC',
  language VARCHAR(50) DEFAULT 'en',
  email_notifications BOOLEAN DEFAULT TRUE,
  auto_save BOOLEAN DEFAULT TRUE,
  data_sharing BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contacts table
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(100),
  job_title VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  source VARCHAR(50),
  value DECIMAL(10, 2),
  notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create activities table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  related_to UUID NOT NULL,
  related_type VARCHAR(50) NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =======================================
-- PART 3: CREATE FUNCTIONS
-- =======================================

-- Function to get the current user's tenant ID
CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS UUID AS $$
DECLARE
  tenant_id UUID;
BEGIN
  SELECT p.tenant_id INTO tenant_id
  FROM public.profiles p
  WHERE p.id = auth.uid();
  
  RETURN tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has completed onboarding
CREATE OR REPLACE FUNCTION public.has_completed_onboarding()
RETURNS BOOLEAN AS $$
DECLARE
  onboarding_complete BOOLEAN;
BEGIN
  SELECT p.onboarding_complete INTO onboarding_complete
  FROM public.profiles p
  WHERE p.id = auth.uid();
  
  RETURN onboarding_complete;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT (p.role = 'admin') INTO is_admin
  FROM public.profiles p
  WHERE p.id = auth.uid();
  
  RETURN is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is staff or admin
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
DECLARE
  is_staff_or_admin BOOLEAN;
BEGIN
  SELECT (p.role IN ('admin', 'staff')) INTO is_staff_or_admin
  FROM public.profiles p
  WHERE p.id = auth.uid();
  
  RETURN is_staff_or_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be triggered when a new user signs up
  -- The actual profile creation will be handled by the application
  -- since we need to associate the user with a tenant first
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =======================================
-- PART 4: CREATE TRIGGERS
-- =======================================

-- Trigger for handling new user creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =======================================
-- PART 5: ENABLE RLS AND CREATE POLICIES
-- =======================================

-- Enable Row Level Security on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policy
CREATE POLICY tenant_isolation_policy ON public.tenants
USING (id = public.get_current_tenant_id());

-- Profiles tenant isolation policy
CREATE POLICY profiles_tenant_isolation_policy ON public.profiles
USING (tenant_id = public.get_current_tenant_id());

-- Contacts tenant isolation policy
CREATE POLICY contacts_tenant_isolation_policy ON public.contacts
USING (tenant_id = public.get_current_tenant_id());

-- Leads tenant isolation policy
CREATE POLICY leads_tenant_isolation_policy ON public.leads
USING (tenant_id = public.get_current_tenant_id());

-- Activities tenant isolation policy
CREATE POLICY activities_tenant_isolation_policy ON public.activities
USING (tenant_id = public.get_current_tenant_id());

-- Settings tenant isolation policy
CREATE POLICY settings_tenant_isolation_policy ON public.settings
USING (tenant_id = public.get_current_tenant_id());

-- =======================================
-- PART 6: CREATE INDEXES
-- =======================================

-- Tenant indexes
CREATE INDEX idx_tenant_name ON public.tenants(name);

-- Profile indexes
CREATE INDEX idx_profile_tenant ON public.profiles(tenant_id);
CREATE INDEX idx_profile_name ON public.profiles(first_name, last_name);
CREATE INDEX idx_profile_role ON public.profiles(role);

-- Contact indexes
CREATE INDEX idx_contact_tenant ON public.contacts(tenant_id);
CREATE INDEX idx_contact_name ON public.contacts(first_name, last_name);
CREATE INDEX idx_contact_email ON public.contacts(email);
CREATE INDEX idx_contact_company ON public.contacts(company);

-- Lead indexes
CREATE INDEX idx_lead_tenant ON public.leads(tenant_id);
CREATE INDEX idx_lead_name ON public.leads(name);
CREATE INDEX idx_lead_status ON public.leads(status);
CREATE INDEX idx_lead_assigned_to ON public.leads(assigned_to);

-- Activity indexes
CREATE INDEX idx_activity_tenant ON public.activities(tenant_id);
CREATE INDEX idx_activity_type ON public.activities(type);
CREATE INDEX idx_activity_related ON public.activities(related_to, related_type);
CREATE INDEX idx_activity_scheduled ON public.activities(scheduled_at);

-- Settings indexes
CREATE INDEX idx_settings_tenant ON public.settings(tenant_id);

-- =======================================
-- PART 7: SEED INITIAL DATA
-- =======================================

-- This part is left empty intentionally.
-- In a real application, you might want to seed some initial data here,
-- but for this migration, we're just setting up the schema.
-- The application will handle creating the initial tenant and admin user
-- during the registration process.
