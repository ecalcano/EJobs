/*
  # Fix storage and RLS policies

  1. Storage Policies
    - Enable public access to upload and read resumes
  
  2. Security Updates
    - Update RLS policies for applications table
    - Allow public to insert applications
    - Allow authenticated users to view and update applications
*/

-- Storage bucket policies
BEGIN;
  -- Create storage bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name)
  VALUES ('resumes', 'resumes')
  ON CONFLICT (id) DO NOTHING;

  -- Enable public access to upload resumes
  CREATE POLICY "Allow public to upload resumes"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'resumes');

  -- Enable public access to read resumes
  CREATE POLICY "Allow public to read resumes"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'resumes');
COMMIT;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Allow public to insert applications" ON applications;
  DROP POLICY IF EXISTS "Allow authenticated users to view applications" ON applications;
  DROP POLICY IF EXISTS "Allow authenticated users to update applications" ON applications;
END $$;

-- Create new policies
CREATE POLICY "Enable insert for public"
  ON applications
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users"
  ON applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable update for authenticated users"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);