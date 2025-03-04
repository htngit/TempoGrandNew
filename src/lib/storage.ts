import { supabase } from "./supabase";

// S3 storage configuration
const S3_BUCKET_URL = "https://wvncqkxjfbtonfniybjg.supabase.co/storage/v1/s3";
const REGION = "ap-southeast-1";
const PROFILE_PICTURES_BUCKET = "profile-pictures";

export const storageApi = {
  // Upload profile picture to Supabase Storage
  uploadProfilePicture: async (
    userId: string,
    file: File,
  ): Promise<{ url: string | null; key: string | null; error: any }> => {
    try {
      // Create a unique file path with user ID as folder
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(PROFILE_PICTURES_BUCKET)
        .upload(filePath, file, {
          upsert: true,
          cacheControl: "3600",
        });

      if (error) {
        console.error("Error uploading file:", error);
        return { url: null, key: null, error };
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(PROFILE_PICTURES_BUCKET).getPublicUrl(filePath);

      return { url: publicUrl, key: filePath, error: null };
    } catch (error) {
      console.error("Unexpected error during upload:", error);
      return { url: null, key: null, error };
    }
  },

  // Delete profile picture from Supabase Storage
  deleteProfilePicture: async (filePath: string): Promise<{ error: any }> => {
    try {
      const { error } = await supabase.storage
        .from(PROFILE_PICTURES_BUCKET)
        .remove([filePath]);

      return { error };
    } catch (error) {
      console.error("Error deleting file:", error);
      return { error };
    }
  },

  // Get public URL for a file
  getPublicUrl: (filePath: string): string => {
    const { data } = supabase.storage
      .from(PROFILE_PICTURES_BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  },
};
