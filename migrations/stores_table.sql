-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view stores
CREATE POLICY "Authenticated users can view stores" 
  ON stores FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Policy for authenticated users to insert stores
CREATE POLICY "Authenticated users can insert stores" 
  ON stores FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Policy for authenticated users to update stores
CREATE POLICY "Authenticated users can update stores" 
  ON stores FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Policy for authenticated users to delete stores
CREATE POLICY "Authenticated users can delete stores" 
  ON stores FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER update_stores_updated_at
BEFORE UPDATE ON stores
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_stores_city ON stores(city);
CREATE INDEX idx_stores_state ON stores(state);
CREATE INDEX idx_stores_active ON stores(active); 