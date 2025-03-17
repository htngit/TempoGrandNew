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
    try {
      const { user, error: authError } = await authApi.getCurrentUser();
      if (authError || !user) {
        console.error("Auth error or no user found:", authError);
        return null;
      }

      console.log("Current user ID:", user.id);

      // Make sure we're using the UUID from auth.user
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      console.log("Profile data fetched:", data);
      return data;
    } catch (err) {
      console.error("Exception in getCurrent:", err);
      return null;
    }
  },

  // Get all profiles in tenant
  getAll: async (): Promise<Profile[]> => {
    try {
      // Get the current user's tenant ID
      const currentProfile = await profileApi.getCurrent();
      if (!currentProfile || !currentProfile.tenant_id) return [];

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("tenant_id", currentProfile.tenant_id)
        .order("first_name", { ascending: true });

      if (error) {
        console.error("Error fetching profiles:", error);
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error("Exception in getAll:", err);
      return [];
    }
  },

  // Check if the current user is the tenant owner
  isOwner: async (): Promise<boolean> => {
    try {
      const currentProfile = await profileApi.getCurrent();
      if (!currentProfile) return false;

      // The owner is the first user who registered with this tenant
      // We check if the user has the admin role and the lowest creation timestamp
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("tenant_id", currentProfile.tenant_id)
        .eq("role", "admin")
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (error || !data) return false;
      
      // Check if the current user is the first admin (owner)
      return data.id === currentProfile.id;
    } catch (err) {
      console.error("Exception in isOwner:", err);
      return false;
    }
  },

  // Invite a user to join the tenant
  inviteUser: async (email: string, role: string): Promise<{ success: boolean; message: string }> => {
    try {
      // First check if the current user is the owner
      const isOwner = await profileApi.isOwner();
      if (!isOwner) {
        return { 
          success: false, 
          message: "Only the tenant owner can invite users" 
        };
      }

      // Get the current user's tenant ID
      const currentProfile = await profileApi.getCurrent();
      if (!currentProfile || !currentProfile.tenant_id) {
        return { 
          success: false, 
          message: "Could not determine your tenant ID" 
        };
      }

      // Check if the user is already in the system
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .eq("tenant_id", currentProfile.tenant_id)
        .maybeSingle();

      if (existingUser) {
        return { 
          success: false, 
          message: "This user is already a member of your team" 
        };
      }

      // In a real implementation, this would send an email invitation
      // and then add the user to the profiles table with a status of "invited"
      // For now, we'll simulate this by creating a placeholder record
      
      // Create a temporary user ID (in a real app, you'd use a proper invite system)
      const tempUserId = `invite_${Date.now()}`;
      
      // Insert a placeholder profile record
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: tempUserId,
          email: email,
          role: role,
          tenant_id: currentProfile.tenant_id,
          status: "invited"
        });

      if (insertError) {
        console.error("Error inviting user:", insertError);
        return { 
          success: false, 
          message: `Failed to invite user: ${insertError.message}` 
        };
      }

      return { 
        success: true, 
        message: `Invitation sent to ${email}` 
      };
    } catch (err) {
      console.error("Exception in inviteUser:", err);
      return { 
        success: false, 
        message: "An unexpected error occurred" 
      };
    }
  },

  // Update profile
  update: async (
    id: string,
    updates: ProfileUpdate,
  ): Promise<Profile | null> => {
    try {
      console.log("Updating profile with ID:", id, "Updates:", updates);
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Exception updating profile:", err);
      return null;
    }
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
