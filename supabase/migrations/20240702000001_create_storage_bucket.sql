-- Create a storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profiles');

-- Set up storage policy to allow public access to read files
CREATE POLICY "Allow public access to profile images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'profiles');
