/*
  # Complete security reset and simplification

  1. Storage Reset
    - Drop and recreate storage bucket with clean configuration
    - Set up minimal, permissive policies
  
  2. Applications Table Reset
    - Complete RLS reset
    - Single, permissive policy
*/

-- Reset storage configuration
DROP EXTENSION IF EXISTS "storage" CASCADE;
CREATE EXTENSION "storage" SCHEMA "extensions";

-- Reset storage bucket
DELETE FROM storage.buckets WHERE id = 'resumes';
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true);

-- Reset storage policies
DROP POLICY IF EXISTS "Public can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Public can read resumes" ON storage.objects;

CREATE POLICY "Storage public access"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'resumes')
WITH CHECK (bucket_id = 'resumes');

-- Reset applications table security
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access policy" ON applications;
DROP POLICY IF EXISTS "Public can do everything" ON applications;

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applications public access"
ON applications
FOR ALL
TO public
USING (true)
WITH CHECK (true);