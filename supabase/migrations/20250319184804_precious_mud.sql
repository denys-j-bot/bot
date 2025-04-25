/*
  # Update RLS policies for loan_offers table

  1. Security
    - Enable RLS on loan_offers table (if not already enabled)
    - Add policies if they don't exist:
      - Authenticated users can perform all operations
      - Public users can only read active offers
*/

-- Enable RLS (if not already enabled)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'loan_offers' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE loan_offers ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Add policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'loan_offers' 
    AND policyname = 'Allow full access to loan_offers for authenticated users'
  ) THEN
    CREATE POLICY "Allow full access to loan_offers for authenticated users"
    ON loan_offers
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'loan_offers' 
    AND policyname = 'Allow read access to active loan_offers for all users'
  ) THEN
    CREATE POLICY "Allow read access to active loan_offers for all users"
    ON loan_offers
    FOR SELECT
    TO public
    USING (is_active = true);
  END IF;
END $$;