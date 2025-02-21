/*
  # Add skills columns to applications table

  1. Changes
    - Add array columns for various skills
    - Add text column for other skills
    - Add references column as JSONB

  2. Security
    - Maintain existing RLS policies
*/

-- Add skills columns if they don't exist
DO $$ 
BEGIN
  -- Computer skills
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'computer_skills') THEN
    ALTER TABLE applications ADD COLUMN computer_skills text[];
  END IF;

  -- Equipment skills
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'equipment_skills') THEN
    ALTER TABLE applications ADD COLUMN equipment_skills text[];
  END IF;

  -- Position preferences
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'position_preferences') THEN
    ALTER TABLE applications ADD COLUMN position_preferences text[];
  END IF;

  -- Department preferences
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'department_preferences') THEN
    ALTER TABLE applications ADD COLUMN department_preferences text[];
  END IF;

  -- Other skills
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'other_skills') THEN
    ALTER TABLE applications ADD COLUMN other_skills text;
  END IF;

  -- References
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'references') THEN
    ALTER TABLE applications ADD COLUMN "references" JSONB;
  END IF;
END $$;