/*
  # Add education and technical skills fields

  1. New Fields
    - Education fields:
      - high_school: JSON (name, address, graduated)
      - college: JSON (name, address, degree, graduated)
      - other_education: JSON (name, address, degree, graduated)
      - references: JSONB array (name, address, phone, email)
    
    - Technical skills:
      - computer_skills: text[]
      - equipment_skills: text[]
      - position_preferences: text[]
      - department_preferences: text[]
      - other_skills: text

  2. Changes
    - Add new columns to applications table
    - Maintain existing RLS policies
*/

ALTER TABLE applications
ADD COLUMN high_school jsonb,
ADD COLUMN college jsonb,
ADD COLUMN other_education jsonb,
ADD COLUMN references jsonb,
ADD COLUMN computer_skills text[],
ADD COLUMN equipment_skills text[],
ADD COLUMN position_preferences text[],
ADD COLUMN department_preferences text[],
ADD COLUMN other_skills text;