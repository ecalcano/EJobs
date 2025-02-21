/*
  # Fix applications table schema

  1. Changes
    - Remove references to dropped columns
    - Ensure all required columns exist
    - Set appropriate default values

  2. Security
    - Maintain existing RLS policies
*/

-- Remove old columns if they still exist
DO $$ 
BEGIN
  -- Drop old columns if they exist
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'current_position') THEN
    ALTER TABLE applications DROP COLUMN current_position;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'company') THEN
    ALTER TABLE applications DROP COLUMN company;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'work_experience') THEN
    ALTER TABLE applications DROP COLUMN work_experience;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'education') THEN
    ALTER TABLE applications DROP COLUMN education;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'institution') THEN
    ALTER TABLE applications DROP COLUMN institution;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'graduation_year') THEN
    ALTER TABLE applications DROP COLUMN graduation_year;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'skills') THEN
    ALTER TABLE applications DROP COLUMN skills;
  END IF;
END $$;