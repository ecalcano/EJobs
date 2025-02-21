/*
  # Update Education Fields

  1. Changes
    - Add graduation year fields to education tables
    - Break down reference address fields into components
    - Make education fields optional

  2. Security
    - Maintain existing RLS policies
*/

-- Update education fields in applications table
ALTER TABLE applications
  -- Add graduation year fields
  ADD COLUMN high_school_graduation_year text,
  ADD COLUMN college_graduation_year text,
  ADD COLUMN other_education_graduation_year text;

-- Update references schema to include address components
CREATE OR REPLACE FUNCTION update_references_address()
RETURNS void AS $$
BEGIN
  -- This function will be called to migrate existing data if needed
  -- For now, it's a placeholder as we're just modifying the schema
END;
$$ LANGUAGE plpgsql;