/*
  # Fix RLS policies for jobs table

  1. Changes
    - Drop existing policies
    - Create new, simplified policies for jobs table
    - Ensure public read access for active jobs
    - Allow authenticated users full access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can manage jobs" ON jobs;

-- Create new policies
CREATE POLICY "Enable read access for active jobs"
  ON jobs
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Enable all access for authenticated users"
  ON jobs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);