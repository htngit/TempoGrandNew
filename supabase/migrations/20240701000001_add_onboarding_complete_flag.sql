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
