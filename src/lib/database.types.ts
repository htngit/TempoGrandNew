import { Database } from "@/types/supabase";

// Define types for easier use throughout the application
export type Tenant = Database["public"]["Tables"]["tenants"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Contact = Database["public"]["Tables"]["contacts"]["Row"];
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type Activity = Database["public"]["Tables"]["activities"]["Row"];
export type Setting = Database["public"]["Tables"]["settings"]["Row"];

// Define insert types
export type TenantInsert = Database["public"]["Tables"]["tenants"]["Insert"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"];
export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];
export type ActivityInsert =
  Database["public"]["Tables"]["activities"]["Insert"];
export type SettingInsert = Database["public"]["Tables"]["settings"]["Insert"];

// Define update types
export type TenantUpdate = Database["public"]["Tables"]["tenants"]["Update"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];
export type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"];
export type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"];
export type ActivityUpdate =
  Database["public"]["Tables"]["activities"]["Update"];
export type SettingUpdate = Database["public"]["Tables"]["settings"]["Update"];
