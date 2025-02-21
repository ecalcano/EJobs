/*
  # Create job applications table

  1. New Tables
    - `applications`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text)
      - `current_position` (text)
      - `company` (text)
      - `work_experience` (text)
      - `education` (text)
      - `institution` (text)
      - `graduation_year` (text)
      - `skills` (text)
      - `resume_url` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `applications` table
    - Add policy for authenticated users to read all applications
    - Add policy for public users to insert applications
*/

CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  current_position text NOT NULL,
  company text NOT NULL,
  work_experience text NOT NULL,
  education text NOT NULL,
  institution text NOT NULL,
  graduation_year text NOT NULL,
  skills text NOT NULL,
  resume_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to insert applications"
  ON applications
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);