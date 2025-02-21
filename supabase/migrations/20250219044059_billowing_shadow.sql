/*
  # Final comprehensive fix for RLS and storage policies

  1. Storage Configuration
    - Reset and reconfigure storage bucket
    - Set proper permissions and constraints
  
  2. Security Updates
    - Clean up and simplify all policies
    - Ensure proper public access
*/

-- Enable storage extension
CREATE EXTENSION IF NOT EXISTS "storage" SCHEMA "extensions";

-- Reset and reconfigure storage bucket
DO $$
BEGIN
    -- Drop existing bucket to start fresh
    DELETE FROM storage.buckets WHERE id = 'resumes';
    
    -- Create bucket with proper configuration
    INSERT INTO storage.buckets (
        id,
        name,
        public,
        avif_autodetection,
        file_size_limit,
        allowed_mime_types,
        owner
    ) VALUES (
        'resumes',
        'resumes',
        true,
        false,
        5242880,
        ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        NULL
    );
END $$;

-- Reset and recreate storage policies
DO $$
BEGIN
    -- Drop all existing policies
    DROP POLICY IF EXISTS "Allow public to upload resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public to read resumes" ON storage.objects;
    
    -- Create new storage policies
    CREATE POLICY "Public can upload resumes"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'resumes');

    CREATE POLICY "Public can read resumes"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'resumes');
END $$;

-- Reset applications table policies
DO $$
BEGIN
    -- Disable RLS temporarily
    ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
    
    -- Drop all existing policies
    DROP POLICY IF EXISTS "Public can do everything" ON applications;
    DROP POLICY IF EXISTS "Enable insert for public" ON applications;
    DROP POLICY IF EXISTS "Enable select for all" ON applications;
    DROP POLICY IF EXISTS "Enable update for all" ON applications;
    
    -- Re-enable RLS
    ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
    
    -- Create single, simple policy for all operations
    CREATE POLICY "Public access policy"
    ON applications
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);
END $$;