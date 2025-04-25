/*
  # Merge banks and loan offers tables

  1. Changes
    - Create a new combined table `loan_offers` with all fields from both tables
    - Migrate existing data
    - Drop old tables
    - Set up RLS policies

  2. New Structure
    - Single table containing all bank and offer information
    - Simplified data model without foreign keys
    - Maintained all existing functionality
*/

-- Create enum type if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_rating_type') THEN
    CREATE TYPE approval_rating_type AS ENUM ('high', 'medium', 'low');
  END IF;
END $$;

-- Create new combined table
CREATE TABLE IF NOT EXISTS new_loan_offers (
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

-- Migrate existing data
INSERT INTO new_loan_offers (
  id,
  name,
  url,
  country,
  logo_url,
  min_amount,
  max_amount,
  rate,
  term,
  approval_time,
  first_loan_free,
  is_active,
  display_order,
  max_term_days,
  approval_rating,
  created_at
)
SELECT 
  lo.id,
  b.name,
  b.url,
  b.country,
  b.logo_url,
  lo.min_amount,
  lo.max_amount,
  lo.rate,
  lo.term,
  lo.approval_time,
  lo.first_loan_free,
  lo.is_active,
  lo.display_order,
  lo.max_term_days,
  lo.approval_rating,
  COALESCE(lo.created_at, now())
FROM loan_offers lo
JOIN banks b ON b.id = lo.bank_id;

-- Drop old tables
DROP TABLE IF EXISTS loan_offers;
DROP TABLE IF EXISTS banks;

-- Rename new table to loan_offers
ALTER TABLE new_loan_offers RENAME TO loan_offers;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_loan_offers_country ON loan_offers (country);
CREATE INDEX IF NOT EXISTS idx_loan_offers_display_order ON loan_offers (display_order);

-- Enable RLS
ALTER TABLE loan_offers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow full access to loan_offers for authenticated users"
ON loan_offers
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow read access to active loan_offers for all users"
ON loan_offers
FOR SELECT
TO public
USING (is_active = true);