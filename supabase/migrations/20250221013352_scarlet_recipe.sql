/*
  # Fix boolean fields in applications table

  1. Changes
    - Update boolean fields to handle 'yes'/'no' values correctly
    - Add default values for boolean fields
    - Remove NOT NULL constraints from optional fields

  2. Security
    - Maintain existing RLS policies
*/

-- Update boolean fields to handle 'yes'/'no' values
ALTER TABLE applications
  ALTER COLUMN is_under_18 TYPE boolean USING CASE WHEN is_under_18::text = 'yes' THEN true ELSE false END,
  ALTER COLUMN has_work_permit TYPE boolean USING CASE WHEN has_work_permit::text = 'yes' THEN true ELSE false END,
  ALTER COLUMN is_eligible_to_work TYPE boolean USING CASE WHEN is_eligible_to_work::text = 'yes' THEN true ELSE false END,
  ALTER COLUMN can_provide_proof TYPE boolean USING CASE WHEN can_provide_proof::text = 'yes' THEN true ELSE false END,
  ALTER COLUMN has_felony TYPE boolean USING CASE WHEN has_felony::text = 'yes' THEN true ELSE false END,
  ALTER COLUMN previously_employed TYPE boolean USING CASE WHEN previously_employed::text = 'yes' THEN true ELSE false END;

-- Set default values for boolean fields
ALTER TABLE applications
  ALTER COLUMN is_under_18 SET DEFAULT false,
  ALTER COLUMN has_work_permit SET DEFAULT false,
  ALTER COLUMN is_eligible_to_work SET DEFAULT false,
  ALTER COLUMN can_provide_proof SET DEFAULT false,
  ALTER COLUMN has_felony SET DEFAULT false,
  ALTER COLUMN previously_employed SET DEFAULT false;

-- Remove NOT NULL constraints from optional fields
ALTER TABLE applications
  ALTER COLUMN current_position DROP NOT NULL,
  ALTER COLUMN company DROP NOT NULL,
  ALTER COLUMN work_experience DROP NOT NULL,
  ALTER COLUMN education DROP NOT NULL,
  ALTER COLUMN institution DROP NOT NULL,
  ALTER COLUMN graduation_year DROP NOT NULL,
  ALTER COLUMN skills DROP NOT NULL;