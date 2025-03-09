import { supabase } from "./supabase";
import {
  Tenant,
  Profile,
  Contact,
  Lead,
  Activity,
  Setting,
  TenantInsert,
  ProfileInsert,
  ContactInsert,
  LeadInsert,
  ActivityInsert,
  SettingInsert,
  TenantUpdate,
  ProfileUpdate,
  ContactUpdate,
  LeadUpdate,
  ActivityUpdate,
  SettingUpdate,
} from "./database.types";

// Auth API
export const authApi = {
  // Sign up a new user
  signUp: async (
    email: string,
    password: string,
  ): Promise<{ user: any; error: any }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    return { user: data.user, error };
  },

  // Sign in a user
  signIn: async (
    email: string,
    password: string,
  ): Promise<{ user: any; profile: Profile | null; error: any }> => {
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
  },

  // Sign out the current user
  signOut: async (): Promise<{ error: any }> => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get the current user
  getCurrentUser: async (): Promise<{ user: any; error: any }> => {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  },

  // Reset password
  resetPassword: async (email: string): Promise<{ error: any }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  },

  // Update password
  updatePassword: async (password: string): Promise<{ error: any }> => {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    return { error };
  },
};

// Tenant API
export const tenantApi = {
  // Get current tenant
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
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", profile.tenant_id)
      .single();

    if (error) return null;
    return data;
  },

  // Update tenant
  update: async (id: string, updates: TenantUpdate): Promise<Tenant | null> => {
    try {
      console.log("Updating tenant with ID:", id, "Updates:", updates);
      const { data, error } = await supabase
        .from("tenants")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating tenant:", error);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Exception updating tenant:", err);
      return null;
    }
  },

  // Create tenant (during registration/onboarding)
  create: async (tenant: TenantInsert): Promise<Tenant | null> => {
    try {
      console.log("Creating tenant:", tenant);
      const { data, error } = await supabase
        .from("tenants")
        .insert(tenant)
        .select()
        .single();

      if (error) {
        console.error("Error creating tenant:", error);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Exception creating tenant:", err);
      return null;
    }
  },
};

// Profile API
export const profileApi = {
  // Get current user profile
  getCurrent: async (): Promise<Profile | null> => {
    const { user, error: authError } = await authApi.getCurrentUser();
    if (authError || !user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) return null;
    return data;
  },

  // Get all profiles in tenant
  getAll: async (): Promise<Profile[]> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("first_name", { ascending: true });

    if (error) return [];
    return data || [];
  },

  // Update profile
  update: async (
    id: string,
    updates: ProfileUpdate,
  ): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  // Get profile by user ID
  getById: async (id: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  },
};

// Contact API
export const contactApi = {
  // Get all contacts
  getAll: async (): Promise<Contact[]> => {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("last_name", { ascending: true });

    if (error) return [];
    return data || [];
  },

  // Get contact by ID
  getById: async (id: string): Promise<Contact | null> => {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  },

  // Create contact
  create: async (contact: ContactInsert): Promise<Contact | null> => {
    const { data, error } = await supabase
      .from("contacts")
      .insert(contact)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  // Update contact
  update: async (
    id: string,
    updates: ContactUpdate,
  ): Promise<Contact | null> => {
    const { data, error } = await supabase
      .from("contacts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  // Delete contact
  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from("contacts").delete().eq("id", id);

    return !error;
  },
};

// Lead API
export const leadApi = {
  // Get all leads
  getAll: async (): Promise<Lead[]> => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return [];
    return data || [];
  },

  // Get lead by ID
  getById: async (id: string): Promise<Lead | null> => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  },

  // Create lead
  create: async (lead: LeadInsert): Promise<Lead | null> => {
    const { data, error } = await supabase
      .from("leads")
      .insert(lead)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  // Update lead
  update: async (id: string, updates: LeadUpdate): Promise<Lead | null> => {
    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  // Delete lead
  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from("leads").delete().eq("id", id);

    return !error;
  },
};

// Activity API
export const activityApi = {
  // Get activities for a specific entity
  getForEntity: async (
    entityId: string,
    entityType: "lead" | "contact",
  ): Promise<Activity[]> => {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("related_to", entityId)
      .eq("related_type", entityType)
      .order("created_at", { ascending: false });

    if (error) return [];
    return data || [];
  },

  // Create activity
  create: async (activity: ActivityInsert): Promise<Activity | null> => {
    const { data, error } = await supabase
      .from("activities")
      .insert(activity)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  // Update activity
  update: async (
    id: string,
    updates: ActivityUpdate,
  ): Promise<Activity | null> => {
    const { data, error } = await supabase
      .from("activities")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  // Delete activity
  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from("activities").delete().eq("id", id);

    return !error;
  },
};

// Settings API
export const settingsApi = {
  // Get tenant settings
  get: async (): Promise<Setting | null> => {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .single();

    if (error) return null;
    return data;
  },

  // Update settings
  update: async (
    id: string,
    updates: SettingUpdate,
  ): Promise<Setting | null> => {
    const { data, error } = await supabase
      .from("settings")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  // Create settings (during tenant setup)
  create: async (settings: SettingInsert): Promise<Setting | null> => {
    const { data, error } = await supabase
      .from("settings")
      .insert(settings)
      .select()
      .single();

    if (error) return null;
    return data;
  },
};
