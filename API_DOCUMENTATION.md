# Xalesin CRM API Documentation

## Overview

This document outlines the API structure for the Xalesin CRM application. The API is built on top of Supabase and provides endpoints for authentication, tenant management, contacts, leads, activities, and settings.

## API Client Setup

The application uses a Supabase client initialized in `src/lib/supabase.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Authentication API

The authentication API is defined in `src/lib/api.ts` under the `authApi` object:

### Sign Up

```typescript
signUp: async (email: string, password: string): Promise<{ user: any; error: any }> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { user: data.user, error };
}
```

### Sign In

```typescript
signIn: async (email: string, password: string): Promise<{ user: any; profile: Profile | null; error: any }> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  let profile = null;
  if (data.user) {
    // Fetch the user's profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    profile = profileData;
  }

  return { user: data.user, profile, error };
}
```

### Sign Out

```typescript
signOut: async (): Promise<{ error: any }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
}
```

### Get Current User

```typescript
getCurrentUser: async (): Promise<{ user: any; error: any }> => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
}
```

### Reset Password

```typescript
resetPassword: async (email: string): Promise<{ error: any }> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error };
}
```

### Update Password

```typescript
updatePassword: async (password: string): Promise<{ error: any }> => {
  const { error } = await supabase.auth.updateUser({
    password,
  });
  return { error };
}
```

## Tenant API

The tenant API is defined in `src/lib/api.ts` under the `tenantApi` object:

### Get Current Tenant

```typescript
getCurrent: async (): Promise<Tenant | null> => {
  const { user, error: userError } = await authApi.getCurrentUser();
  if (userError || !user) return null;

  // Get the profile to find the tenant_id
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) return null;

  // Get the tenant
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", profile.tenant_id)
    .single();

  if (tenantError) return null;
  return tenant;
}
```

### Create Tenant

```typescript
create: async (tenant: TenantInsert): Promise<{ tenant: Tenant | null; error: any }> => {
  const { data, error } = await supabase
    .from("tenants")
    .insert(tenant)
    .select()
    .single();

  return { tenant: data, error };
}
```

### Update Tenant

```typescript
update: async (id: string, updates: TenantUpdate): Promise<{ tenant: Tenant | null; error: any }> => {
  const { data, error } = await supabase
    .from("tenants")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  return { tenant: data, error };
}
```

## Profile API

The profile API is defined in `src/lib/api.ts` under the `profileApi` object:

### Get Current Profile

```typescript
getCurrent: async (): Promise<Profile | null> => {
  const { user, error } = await authApi.getCurrentUser();
  if (error || !user) return null;

  const { data, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) return null;
  return data;
}
```

### Get All Profiles

```typescript
getAll: async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}
```

### Update Profile

```typescript
update: async (id: string, updates: ProfileUpdate): Promise<{ profile: Profile | null; error: any }> => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  return { profile: data, error };
}
```

### Invite User

```typescript
invite: async (email: string, role: string): Promise<{ error: any }> => {
  // This would typically involve a custom API endpoint or serverless function
  // For demo purposes, we'll just show the structure
  const { error } = await supabase.functions.invoke("invite-user", {
    body: { email, role },
  });

  return { error };
}
```

## Contact API

The contact API is defined in `src/lib/api.ts` under the `contactApi` object:

### Get All Contacts

```typescript
getAll: async (filters = {}): Promise<Contact[]> => {
  let query = supabase.from("contacts").select("*");

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query = query.eq(key, value);
    }
  });

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}
```

### Get Contact by ID

```typescript
getById: async (id: string): Promise<Contact | null> => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}
```

### Create Contact

```typescript
create: async (contact: ContactInsert): Promise<{ contact: Contact | null; error: any }> => {
  const { user, error: userError } = await authApi.getCurrentUser();
  if (userError || !user) return { contact: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("contacts")
    .insert({ ...contact, created_by: user.id })
    .select()
    .single();

  return { contact: data, error };
}
```

### Update Contact

```typescript
update: async (id: string, updates: ContactUpdate): Promise<{ contact: Contact | null; error: any }> => {
  const { data, error } = await supabase
    .from("contacts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  return { contact: data, error };
}
```

### Delete Contact

```typescript
delete: async (id: string): Promise<{ error: any }> => {
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  return { error };
}
```

## Lead API

The lead API is defined in `src/lib/api.ts` under the `leadApi` object with similar patterns to the Contact API:

- `getAll(filters)` - Get all leads with optional filtering
- `getById(id)` - Get a specific lead by ID
- `getRecent()` - Get recent leads
- `create(lead)` - Create a new lead
- `update(id, updates)` - Update an existing lead
- `delete(id)` - Delete a lead
- `updateStatus(id, status)` - Update just the status of a lead

## Activity API

The activity API is defined in `src/lib/api.ts` under the `activityApi` object:

- `getAll(filters)` - Get all activities with optional filtering
- `getById(id)` - Get a specific activity by ID
- `getRecent()` - Get recent activities
- `getByRelated(relatedId, relatedType)` - Get activities for a specific contact or lead
- `create(activity)` - Create a new activity
- `update(id, updates)` - Update an existing activity
- `delete(id)` - Delete an activity
- `complete(id)` - Mark an activity as completed

## Settings API

The settings API is defined in `src/lib/api.ts` under the `settingsApi` object:

- `getCurrent()` - Get settings for the current tenant
- `update(updates)` - Update settings for the current tenant

## Error Handling

All API functions follow a consistent error handling pattern:

1. Return the data and error from Supabase
2. Let the calling component handle the error
3. Return null or empty arrays for data when errors occur

## TypeScript Integration

The API uses TypeScript types defined in `src/lib/database.types.ts` for type safety:

```typescript
export type Tenant = Database["public"]["Tables"]["tenants"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Contact = Database["public"]["Tables"]["contacts"]["Row"];
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type Activity = Database["public"]["Tables"]["activities"]["Row"];
export type Setting = Database["public"]["Tables"]["settings"]["Row"];

// Insert types
export type TenantInsert = Database["public"]["Tables"]["tenants"]["Insert"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
// ... and so on

// Update types
export type TenantUpdate = Database["public"]["Tables"]["tenants"]["Update"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
// ... and so on
```

## Security Considerations

- All API calls respect Row Level Security (RLS) policies defined in the database
- Tenant isolation is enforced at the database level
- Role-based access control is implemented for certain operations
- Authentication state is managed through Supabase Auth