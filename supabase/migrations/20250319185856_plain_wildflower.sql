/*
  # Add new fields to loan_offers table

  1. Changes
    - Add max_term_days column (integer) to store the maximum term in days
    - Add approval_rating column (enum) to store the approval probability level
    
  2. Notes
    - max_term_days defaults to 30 days
    - approval_rating can be 'high', 'medium', or 'low', defaults to 'medium'
*/

-- Create enum type for approval rating if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_rating_type') THEN
    CREATE TYPE approval_rating_type AS ENUM ('high', 'medium', 'low');
  END IF;
END $$;

-- Add new columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'loan_offers' AND column_name = 'max_term_days'
  ) THEN
    ALTER TABLE loan_offers ADD COLUMN max_term_days integer DEFAULT 30;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'loan_offers' AND column_name = 'approval_rating'
  ) THEN
    ALTER TABLE loan_offers ADD COLUMN approval_rating approval_rating_type DEFAULT 'medium';
  END IF;
END $$;