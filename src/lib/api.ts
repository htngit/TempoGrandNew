import { supabase } from "./supabase";
import {
  Tenant,
  User,
  Contact,
  Lead,
  Activity,
  Setting,
  TenantInsert,
  UserInsert,
  ContactInsert,
  LeadInsert,
  ActivityInsert,
  SettingInsert,
  TenantUpdate,
  UserUpdate,
  ContactUpdate,
  LeadUpdate,
  ActivityUpdate,
  SettingUpdate,
} from "./database.types";

// Tenant API
export const tenantApi = {
  // Get current tenant
  getCurrent: async (): Promise<Tenant | null> => {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) return null;

    const { data, error } = await supabase.from("tenants").select("*").single();

    if (error) return null;
    return data;
  },

  // Update tenant
  update: async (id: string, updates: TenantUpdate): Promise<Tenant | null> => {
    const { data, error } = await supabase
      .from("tenants")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  // Create tenant (during registration/onboarding)
  create: async (tenant: TenantInsert): Promise<Tenant | null> => {
    const { data, error } = await supabase
      .from("tenants")
      .insert(tenant)
      .select()
      .single();

    if (error) return null;
    return data;
  },
};

// User API
export const userApi = {
  // Get current user with profile
  getCurrent: async (): Promise<User | null> => {
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser.user) return null;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.user.id)
      .single();

    if (error) return null;
    return data;
  },

  // Get all users in tenant
  getAll: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("first_name", { ascending: true });

    if (error) return [];
    return data || [];
  },

  // Create user
  create: async (user: UserInsert): Promise<User | null> => {
    const { data, error } = await supabase
      .from("users")
      .insert(user)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  // Update user
  update: async (id: string, updates: UserUpdate): Promise<User | null> => {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return null;
    return data;
  },

  // Delete user
  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from("users").delete().eq("id", id);

    return !error;
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
