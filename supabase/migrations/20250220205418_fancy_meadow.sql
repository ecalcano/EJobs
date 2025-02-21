/*
  # Update applications table with additional personal information fields

  1. Changes
    - Add address fields (address, city, state, zip)
    - Add employment eligibility fields
    - Add previous employment fields
    - Add employment type field
    - Remove current position and company fields
*/

ALTER TABLE applications
  -- Remove old fields
  DROP COLUMN current_position,
  DROP COLUMN company,
  
  -- Add address fields
  ADD COLUMN address text,
  ADD COLUMN city text,
  ADD COLUMN state text,
  ADD COLUMN zip_code text,
  
  -- Add employment eligibility fields
  ADD COLUMN is_under_18 boolean,
  ADD COLUMN has_work_permit boolean,
  ADD COLUMN is_eligible_to_work boolean,
  ADD COLUMN can_provide_proof boolean,
  ADD COLUMN has_felony boolean,
  
  -- Add previous employment fields
  ADD COLUMN previously_employed boolean,
  ADD COLUMN previous_employment jsonb,
  
  -- Add employment type
  ADD COLUMN employment_type text;