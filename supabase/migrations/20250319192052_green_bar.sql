/*
  # Create loan offers table

  1. New Table
    - `loan_offers` table with all bank and offer information combined
    - Includes approval rating enum type
    - Sets up indexes and RLS policies

  2. Structure
    - Single table containing all bank and offer information
    - No dependencies on existing tables
    - Full security with RLS enabled
    - Checks for existing policies before creating new ones
*/

-- Create enum type if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_rating_type') THEN
    CREATE TYPE approval_rating_type AS ENUM ('high', 'medium', 'low');
  END IF;
END $$;

-- Create the loan_offers table
CREATE TABLE IF NOT EXISTS loan_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  country text NOT NULL,
  logo_url text,
  min_amount integer NOT NULL,
  max_amount integer NOT NULL,
  rate text NOT NULL,
  term text NOT NULL,
  approval_time text NOT NULL,
  first_loan_free boolean DEFAULT false,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  max_term_days integer DEFAULT 30,
  approval_rating approval_rating_type DEFAULT 'medium',
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_loan_offers_country ON loan_offers (country);
CREATE INDEX IF NOT EXISTS idx_loan_offers_display_order ON loan_offers (display_order);

-- Enable RLS
ALTER TABLE loan_offers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'loan_offers' 
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
    WHERE tablename = 'loan_offers' 
    AND policyname = 'Allow read access to active loan_offers for all users'
  ) THEN
    CREATE POLICY "Allow read access to active loan_offers for all users"
    ON loan_offers
    FOR SELECT
    TO public
    USING (is_active = true);
  END IF;
END $$;