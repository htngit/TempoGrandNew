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
DROP TRIGGER IF EXISTS on_tenant_created ON public.tenants;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.get_current_tenant_id();
DROP FUNCTION IF EXISTS public.has_completed_onboarding();
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.is_staff_or_admin();
DROP FUNCTION IF EXISTS public.is_owner();
DROP FUNCTION IF EXISTS public.has_team_permission(TEXT, TEXT);

-- Disable Row Level Security 
ALTER TABLE IF EXISTS public.tenants DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.invitations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.team_permissions DISABLE ROW LEVEL SECURITY;

-- Drop RLS policies
DROP POLICY IF EXISTS tenant_isolation_policy ON public.tenants;
DROP POLICY IF EXISTS profiles_tenant_isolation_policy ON public.profiles;
DROP POLICY IF EXISTS contacts_tenant_isolation_policy ON public.contacts;
DROP POLICY IF EXISTS leads_tenant_isolation_policy ON public.leads;
DROP POLICY IF EXISTS activities_tenant_isolation_policy ON public.activities;
DROP POLICY IF EXISTS settings_tenant_isolation_policy ON public.settings;
DROP POLICY IF EXISTS invitations_tenant_isolation_policy ON public.invitations;
DROP POLICY IF EXISTS teams_tenant_isolation_policy ON public.teams;
DROP POLICY IF EXISTS team_members_isolation_policy ON public.team_members;
DROP POLICY IF EXISTS team_permissions_isolation_policy ON public.team_permissions;

-- Drop tables (in correct order to avoid foreign key constraints)
DROP TABLE IF EXISTS public.team_permissions CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.invitations CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE; 
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.tenants CASCADE;

-- =======================================
-- PART 2: CREATE ALL TABLES (With IF NOT EXISTS to avoid duplicates)
-- =======================================

-- Create tenants table
CREATE TABLE IF NOT EXISTS public.tenants (
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
CREATE TABLE IF NOT EXISTS public.profiles (
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
  role VARCHAR(50) NOT NULL DEFAULT 'owner',
  onboarding_complete BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'active',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create settings table (appears only once)
CREATE TABLE IF NOT EXISTS public.settings (
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
CREATE TABLE IF NOT EXISTS public.contacts (
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
CREATE TABLE IF NOT EXISTS public.leads (
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
CREATE TABLE IF NOT EXISTS public.activities (
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

-- Create invitations table
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  accepted BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Create team_permissions table
CREATE TABLE IF NOT EXISTS public.team_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  permission VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(team_id, resource_type, permission)
);

-- =======================================
-- PART 3: CREATE FUNCTIONS
-- =======================================
-- (Functions remain unchanged, but ensure they don’t already exist or use CREATE OR REPLACE)

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

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN AS $$
DECLARE
  is_owner BOOLEAN;
BEGIN
  SELECT (p.role = 'owner') INTO is_owner
  FROM public.profiles p
  WHERE p.id = auth.uid();
  RETURN is_owner;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_team_permission(resource_type TEXT, permission TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  has_permission BOOLEAN;
BEGIN
  IF public.is_owner() THEN
    RETURN TRUE;
  END IF;
  SELECT EXISTS (
    SELECT 1
    FROM public.team_members tm
    JOIN public.team_permissions tp ON tm.team_id = tp.team_id
    WHERE tm.user_id = auth.uid()
    AND tp.resource_type = resource_type
    AND tp.permission = permission
  ) INTO has_permission;
  RETURN has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =======================================
-- PART 4: CREATE TRIGGERS
-- =======================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END;
$$;

-- =======================================
-- PART 5: ENABLE RLS AND CREATE POLICIES
-- =======================================

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_permissions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_isolation_policy' AND tablename = 'tenants') THEN
    CREATE POLICY tenant_isolation_policy ON public.tenants
    USING (id = public.get_current_tenant_id());
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_tenant_isolation_policy' AND tablename = 'profiles') THEN
    CREATE POLICY profiles_tenant_isolation_policy ON public.profiles
    USING (tenant_id = public.get_current_tenant_id());
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'contacts_tenant_isolation_policy' AND tablename = 'contacts') THEN
    CREATE POLICY contacts_tenant_isolation_policy ON public.contacts
    USING (tenant_id = public.get_current_tenant_id());
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'leads_tenant_isolation_policy' AND tablename = 'leads') THEN
    CREATE POLICY leads_tenant_isolation_policy ON public.leads
    USING (tenant_id = public.get_current_tenant_id());
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'activities_tenant_isolation_policy' AND tablename = 'activities') THEN
    CREATE POLICY activities_tenant_isolation_policy ON public.activities
    USING (tenant_id = public.get_current_tenant_id());
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'settings_tenant_isolation_policy' AND tablename = 'settings') THEN
    CREATE POLICY settings_tenant_isolation_policy ON public.settings
    USING (tenant_id = public.get_current_tenant_id());
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'invitations_tenant_isolation_policy' AND tablename = 'invitations') THEN
    CREATE POLICY invitations_tenant_isolation_policy ON public.invitations
    USING (tenant_id = public.get_current_tenant_id());
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'teams_tenant_isolation_policy' AND tablename = 'teams') THEN
    CREATE POLICY teams_tenant_isolation_policy ON public.teams
    USING (tenant_id = public.get_current_tenant_id());
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'team_members_isolation_policy' AND tablename = 'team_members') THEN
    CREATE POLICY team_members_isolation_policy ON public.team_members
    USING (team_id IN (SELECT id FROM public.teams WHERE tenant_id = public.get_current_tenant_id()));
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'team_permissions_isolation_policy' AND tablename = 'team_permissions') THEN
    CREATE POLICY team_permissions_isolation_policy ON public.team_permissions
    USING (team_id IN (SELECT id FROM public.teams WHERE tenant_id = public.get_current_tenant_id()));
  END IF;
END;
$$;

-- =======================================
-- PART 6: CREATE INDEXES
-- =======================================

CREATE INDEX IF NOT EXISTS idx_tenant_name ON public.tenants(name);
CREATE INDEX IF NOT EXISTS idx_profile_tenant ON public.profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profile_name ON public.profiles(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_profile_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_contact_tenant ON public.contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contact_name ON public.contacts(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_contact_email ON public.contacts(email);
CREATE INDEX IF NOT EXISTS idx_contact_company ON public.contacts(company);
CREATE INDEX IF NOT EXISTS idx_lead_tenant ON public.leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lead_name ON public.leads(name);
CREATE INDEX IF NOT EXISTS idx_lead_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_lead_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_activity_tenant ON public.activities(tenant_id);
CREATE INDEX IF NOT EXISTS idx_activity_type ON public.activities(type);
CREATE INDEX IF NOT EXISTS idx_activity_related ON public.activities(related_to, related_type);
CREATE INDEX IF NOT EXISTS idx_activity_scheduled ON public.activities(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_settings_tenant ON public.settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invitation_tenant ON public.invitations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invitation_email ON public.invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitation_token ON public.invitations(token);
CREATE INDEX IF NOT EXISTS idx_team_tenant ON public.teams(tenant_id);
CREATE INDEX IF NOT EXISTS idx_team_name ON public.teams(name);
CREATE INDEX IF NOT EXISTS idx_team_member_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_member_user ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_permission_team ON public.team_permissions(team_id);
CREATE INDEX IF NOT EXISTS idx_team_permission_type ON public.team_permissions(resource_type, permission);