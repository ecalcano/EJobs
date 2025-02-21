/*
  # Add job reference fields to applications table

  1. Changes
    - Add job_title and job_location fields to applications table
    - Make resume_url optional since it was marked as required but is optional in the form
*/

ALTER TABLE applications
ADD COLUMN job_title text,
ADD COLUMN job_location text,
ALTER COLUMN resume_url DROP NOT NULL;