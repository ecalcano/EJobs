/*
  # Add status tracking columns
  
  1. New Columns
    - status_date: Timestamp when status was last updated
    - status_by: Username of admin who updated the status
  
  2. Changes
    - Add default values for new columns
    - Add trigger to automatically update status_date
*/

-- Add new columns for status tracking
ALTER TABLE applications
ADD COLUMN status_date timestamptz DEFAULT now(),
ADD COLUMN status_by text;

-- Create trigger function to update status_date
CREATE OR REPLACE FUNCTION update_status_date()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.status_date = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_application_status_date
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_status_date();