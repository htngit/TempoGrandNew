-- Create the Profile Pictures bucket if it doesn't exist
BEGIN;

-- Check if the bucket exists
DO $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'Profile Pictures'
  ) INTO bucket_exists;

  IF NOT bucket_exists THEN
    -- Create the bucket
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('Profile Pictures', 'Profile Pictures', true);
    
    -- Create policy to allow authenticated users to upload files
    INSERT INTO storage.policies (name, bucket_id, operation, definition)
    VALUES 
      ('Allow authenticated uploads', 'Profile Pictures', 'INSERT', 'auth.role() = ''authenticated'''),
      ('Allow authenticated updates', 'Profile Pictures', 'UPDATE', 'auth.role() = ''authenticated'''),
      ('Allow authenticated deletes', 'Profile Pictures', 'DELETE', 'auth.role() = ''authenticated'''),
      ('Allow public select', 'Profile Pictures', 'SELECT', 'true');
  END IF;
END
$$;

COMMIT;