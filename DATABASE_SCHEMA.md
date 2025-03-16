# Xalesin CRM Database Schema

## Overview

This document details the database schema for the Xalesin CRM application, including tables, relationships, security policies, and migrations.

## Database Tables

### Tenants

```sql
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Purpose**: Stores organization information in the multi-tenant system.

**Key Fields**:
- `id` - Unique identifier for the tenant
- `name` - Organization name
- `industry` - Business industry category

### Profiles

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff', 'viewer')),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  avatar_url TEXT,
  job_title TEXT,
  phone TEXT,
  onboarding_complete BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Purpose**: Links Supabase auth users to tenant organizations and stores user profile information.

**Key Fields**:
- `id` - References auth.users(id)
- `role` - User permission level (admin, staff, viewer)
- `tenant_id` - Organization the user belongs to
- `onboarding_complete` - Flag indicating if user has completed onboarding

### Contacts

```sql
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Purpose**: Stores customer and client contact information.

**Key Fields**:
- `id` - Unique identifier for the contact
- `status` - Contact status (active, inactive, etc.)
- `tenant_id` - Organization the contact belongs to
- `created_by` - User who created the contact

### Leads

```sql
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'lost')),
  source TEXT,
  value DECIMAL(10, 2),
  notes TEXT,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Purpose**: Tracks sales leads and opportunities.

**Key Fields**:
- `id` - Unique identifier for the lead
- `status` - Lead status (new, contacted, qualified, lost)
- `value` - Potential monetary value of the lead
- `assigned_to` - User responsible for the lead
- `tenant_id` - Organization the lead belongs to

### Activities

```sql
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note', 'task')),
  description TEXT NOT NULL,
  related_to UUID NOT NULL,
  related_type TEXT NOT NULL CHECK (related_type IN ('contact', 'lead')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Purpose**: Records interactions with contacts and leads.

**Key Fields**:
- `id` - Unique identifier for the activity
- `type` - Activity type (call, email, meeting, note, task)
- `related_to` - ID of the related contact or lead
- `related_type` - Type of the related entity (contact, lead)
- `scheduled_at` - When the activity is scheduled
- `completed_at` - When the activity was completed
- `tenant_id` - Organization the activity belongs to

### Settings

```sql
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  date_format TEXT DEFAULT 'YYYY-MM-DD',
  email_notifications BOOLEAN DEFAULT TRUE,
  data_sharing BOOLEAN DEFAULT FALSE,
  auto_save BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Purpose**: Stores tenant-specific application settings.

**Key Fields**:
- `id` - Unique identifier for the settings record
- `tenant_id` - Organization the settings belong to (one-to-one relationship)
- `theme` - UI theme preference
- `language` - Language preference

## Database Relationships

```
Tenants 1──┐
           │
           ├──* Profiles
           │
           ├──* Contacts
           │
           ├──* Leads
           │
           ├──* Activities
           │
           └──1 Settings

Profiles 1──┐
            ├──* Leads (assigned_to)
            │
            └──* Activities (created_by)

Contacts 1──┐
            └──* Activities (related_to)

Leads 1─────┐
            └──* Activities (related_to)
```

## Row Level Security (RLS) Policies

The database uses Row Level Security to enforce tenant isolation and role-based access control:

### Tenant Isolation

All tables have policies that restrict access to records belonging to the user's tenant:

```sql
-- Example for contacts table
CREATE POLICY contacts_tenant_isolation_policy ON public.contacts
  USING (tenant_id = public.get_current_tenant_id());
```

### Role-Based Access

Certain operations are restricted based on user roles:

```sql
-- Example for profiles table (admin only)
CREATE POLICY profiles_insert_policy ON public.profiles
  FOR INSERT WITH CHECK (
    tenant_id = public.get_current_tenant_id() AND public.is_admin()
  );
```

## Security Functions

The database includes several helper functions for security checks:

```sql
-- Get current user's tenant ID
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

-- Check if current user has admin role
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

-- Check if current user has staff or admin role
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
```

## Indexes

The database includes indexes for performance optimization:

```sql
CREATE INDEX idx_profiles_tenant_id ON public.profiles(tenant_id);
CREATE INDEX idx_contacts_tenant_id ON public.contacts(tenant_id);
CREATE INDEX idx_leads_tenant_id ON public.leads(tenant_id);
CREATE INDEX idx_activities_tenant_id ON public.activities(tenant_id);
CREATE INDEX idx_activities_related_to ON public.activities(related_to);
```

## Database Migrations

### Initial Schema (01_create_tables.sql)

Creates the base tables, relationships, and indexes.

### Security Policies (02_create_rls_policies.sql)

Sets up Row Level Security policies and security functions.

### Seed Data (03_seed_data.sql)

Populates the database with initial demo data for testing.

### Onboarding Flag (20240701000001_add_onboarding_complete_flag.sql)

```sql
-- Add onboarding_complete column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT false;

-- Create function to check if user has completed onboarding
CREATE OR REPLACE FUNCTION has_completed_onboarding()
RETURNS BOOLEAN AS $$
DECLARE
  has_completed BOOLEAN;
BEGIN
  SELECT onboarding_complete INTO has_completed
  FROM profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(has_completed, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Storage Buckets (20240702000001_create_storage_bucket.sql, 20240703000001_create_profile_pictures_bucket.sql)

Sets up Supabase Storage buckets for file storage, particularly for profile pictures and other assets.

## TypeScript Type Definitions

The database schema is reflected in TypeScript types for type safety in the frontend:

```typescript
// From src/lib/database.types.ts
export type Tenant = Database["public"]["Tables"]["tenants"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Contact = Database["public"]["Tables"]["contacts"]["Row"];
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type Activity = Database["public"]["Tables"]["activities"]["Row"];
export type Setting = Database["public"]["Tables"]["settings"]["Row"];
```