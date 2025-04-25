/*
  # Update bank table policies

  1. Changes
    - Update RLS policies for banks table to allow proper access
    - Add policy for authenticated users to manage banks
    - Keep public read access policy

  2. Security
    - Enable RLS on banks table
    - Add policy for full access to authenticated users
    - Add policy for public read access
*/

-- Enable RLS (if not already enabled)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'banks' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies to recreate them with correct permissions
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow full access to banks for authenticated users" ON banks;
  DROP POLICY IF EXISTS "Allow read access to banks for all users" ON banks;
END $$;

-- Create new policies with correct permissions
CREATE POLICY "Allow full access to banks for authenticated users"
ON banks
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow read access to banks for all users"
ON banks
FOR SELECT
TO public
USING (true);