/*
  # Add jobs table and policies

  1. New Tables
    - `jobs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `department` (text)
      - `location` (text)
      - `type` (text) - Full-time, Part-time, Contract
      - `description` (text)
      - `requirements` (text)
      - `salary_range` (text)
      - `active` (boolean) - Whether the job is currently accepting applications
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Public can view active jobs
    - Authenticated users can manage jobs
*/

CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL,
  location text NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  requirements text NOT NULL,
  salary_range text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Allow public to view active jobs
CREATE POLICY "Anyone can view active jobs"
  ON jobs
  FOR SELECT
  TO public
  USING (active = true);

-- Allow authenticated users full access
CREATE POLICY "Authenticated users can manage jobs"
  ON jobs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();