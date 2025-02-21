/*
  # Fix storage and RLS policies

  1. Storage Configuration
    - Enable storage bucket with proper configuration
    - Set public access policies
  
  2. Security Updates
    - Ensure proper RLS policies for applications table
*/

-- Enable storage extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "storage" SCHEMA "extensions";

-- Create and configure storage bucket
DO $$
BEGIN
    -- Create the bucket if it doesn't exist
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('resumes', 'resumes', true)
    ON CONFLICT (id) DO UPDATE
    SET public = true;

    -- Drop existing storage policies to avoid conflicts
    DROP POLICY IF EXISTS "Allow public to upload resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public to read resumes" ON storage.objects;
    
    -- Create new storage policies
    CREATE POLICY "Allow public to upload resumes"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'resumes');

    CREATE POLICY "Allow public to read resumes"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'resumes');
END $$;

-- Reset applications table policies
DO $$
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Enable insert for public" ON applications;
    DROP POLICY IF EXISTS "Enable select for authenticated users" ON applications;
    DROP POLICY IF EXISTS "Enable update for authenticated users" ON applications;

    -- Create new policies
    CREATE POLICY "Enable insert for public"
    ON applications FOR INSERT
    TO public
    WITH CHECK (true);

    CREATE POLICY "Enable select for all"
    ON applications FOR SELECT
    TO public
    USING (true);

    CREATE POLICY "Enable update for all"
    ON applications FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);
END $$;