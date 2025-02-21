/*
  # Final fix for storage and RLS policies

  1. Storage Configuration
    - Set bucket level permissions
    - Update storage policies
  
  2. Security Updates
    - Simplify RLS policies for applications
*/

-- Enable storage extension
CREATE EXTENSION IF NOT EXISTS "storage" SCHEMA "extensions";

-- Configure storage bucket with proper permissions
DO $$
BEGIN
    -- Update bucket configuration
    UPDATE storage.buckets
    SET public = true,
        avif_autodetection = false,
        file_size_limit = 5242880, -- 5MB in bytes
        allowed_mime_types = ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    WHERE id = 'resumes';

    -- Ensure bucket exists
    INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
    VALUES (
        'resumes',
        'resumes',
        true,
        false,
        5242880,
        ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    )
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Reset and recreate storage policies
DO $$
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Allow public to upload resumes" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public to read resumes" ON storage.objects;
    
    -- Create new storage policies
    CREATE POLICY "Allow public to upload resumes"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (
        bucket_id = 'resumes'
        AND (CASE WHEN RIGHT(name, 4) = '.pdf' THEN mime_type = 'application/pdf'
             WHEN RIGHT(name, 4) = '.doc' THEN mime_type = 'application/msword'
             WHEN RIGHT(name, 5) = '.docx' THEN mime_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
             ELSE false
        END)
    );

    CREATE POLICY "Allow public to read resumes"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'resumes');
END $$;

-- Reset and recreate application policies
DO $$
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Enable insert for public" ON applications;
    DROP POLICY IF EXISTS "Enable select for all" ON applications;
    DROP POLICY IF EXISTS "Enable update for all" ON applications;

    -- Create simplified policies
    CREATE POLICY "Public can do everything"
    ON applications
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);
END $$;