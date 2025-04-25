/*
  # Create storage bucket for logos

  1. Storage
    - Creates a new public bucket for storing bank logos
    - Sets up appropriate security policies for public access and authenticated operations
*/

-- Create the logos bucket if it doesn't exist
BEGIN;

-- Insert the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Create bucket policies
DO $$
BEGIN
  -- Public read access policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Public Access'
  ) THEN
    CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'logos');
  END IF;

  -- Authenticated users upload policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Allow authenticated uploads'
  ) THEN
    CREATE POLICY "Allow authenticated uploads"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'logos');
  END IF;

  -- Authenticated users update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Allow authenticated updates'
  ) THEN
    CREATE POLICY "Allow authenticated updates"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'logos');
  END IF;

  -- Authenticated users delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Allow authenticated deletes'
  ) THEN
    CREATE POLICY "Allow authenticated deletes"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'logos');
  END IF;
END $$;

COMMIT;