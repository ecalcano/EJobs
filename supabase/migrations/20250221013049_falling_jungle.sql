/*
  # Update applications table schema

  1. Changes
    - Convert boolean fields from text to boolean type
    - Update education fields to use JSONB
    - Add missing fields for employment eligibility
    - Remove unused fields

  2. Security
    - Maintain existing RLS policies
*/

-- Convert text fields to boolean
ALTER TABLE applications
  ALTER COLUMN is_under_18 TYPE boolean USING CASE WHEN is_under_18 = 'yes' THEN true ELSE false END,
  ALTER COLUMN has_work_permit TYPE boolean USING CASE WHEN has_work_permit = 'yes' THEN true ELSE false END,
  ALTER COLUMN is_eligible_to_work TYPE boolean USING CASE WHEN is_eligible_to_work = 'yes' THEN true ELSE false END,
  ALTER COLUMN can_provide_proof TYPE boolean USING CASE WHEN can_provide_proof = 'yes' THEN true ELSE false END,
  ALTER COLUMN has_felony TYPE boolean USING CASE WHEN has_felony = 'yes' THEN true ELSE false END,
  ALTER COLUMN previously_employed TYPE boolean USING CASE WHEN previously_employed = 'yes' THEN true ELSE false END;

-- Update education fields
DO $$ 
BEGIN
  -- Drop columns if they exist
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'education') THEN
    ALTER TABLE applications DROP COLUMN education;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'institution') THEN
    ALTER TABLE applications DROP COLUMN institution;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'graduation_year') THEN
    ALTER TABLE applications DROP COLUMN graduation_year;
  END IF;

  -- Add new columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'high_school') THEN
    ALTER TABLE applications ADD COLUMN high_school JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'college') THEN
    ALTER TABLE applications ADD COLUMN college JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'other_education') THEN
    ALTER TABLE applications ADD COLUMN other_education JSONB;
  END IF;
END $$;