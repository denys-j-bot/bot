/*
  # Add bank logo and offer ordering

  1. Changes
    - Add `logo_url` column to `banks` table
    - Add `display_order` column to `loan_offers` table for controlling offer display order
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add logo_url to banks table
ALTER TABLE banks 
ADD COLUMN IF NOT EXISTS logo_url text;

-- Add display_order to loan_offers table
ALTER TABLE loan_offers 
ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Create index for faster ordering
CREATE INDEX IF NOT EXISTS idx_loan_offers_display_order 
ON loan_offers(display_order);