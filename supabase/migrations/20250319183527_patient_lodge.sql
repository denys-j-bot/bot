/*
  # Create loan offers tables

  1. New Tables
    - `banks`
      - `id` (uuid, primary key)
      - `name` (text)
      - `url` (text)
      - `country` (text)
      - `created_at` (timestamp)
    
    - `loan_offers`
      - `id` (uuid, primary key)
      - `bank_id` (uuid, foreign key)
      - `min_amount` (integer)
      - `max_amount` (integer)
      - `rate` (text)
      - `term` (text)
      - `approval_time` (text)
      - `first_loan_free` (boolean)
      - `is_active` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage data
*/

-- Create banks table
CREATE TABLE IF NOT EXISTS banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  country text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create loan_offers table
CREATE TABLE IF NOT EXISTS loan_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_id uuid REFERENCES banks(id) ON DELETE CASCADE,
  min_amount integer NOT NULL,
  max_amount integer NOT NULL,
  rate text NOT NULL,
  term text NOT NULL,
  approval_time text NOT NULL,
  first_loan_free boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_offers ENABLE ROW LEVEL SECURITY;

-- Create policies for banks
CREATE POLICY "Allow read access to banks for all users"
  ON banks
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow full access to banks for authenticated users"
  ON banks
  USING (auth.role() = 'authenticated');

-- Create policies for loan_offers
CREATE POLICY "Allow read access to loan_offers for all users"
  ON loan_offers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow full access to loan_offers for authenticated users"
  ON loan_offers
  USING (auth.role() = 'authenticated');

-- Insert initial data
INSERT INTO banks (name, url, country) VALUES
  ('Приват Банк', 'https://privatbank.ua/kredity/credit-calculator', 'ua'),
  ('Моно Банк', 'https://www.monobank.ua/credit', 'ua'),
  ('ПУМБ', 'https://pumb.ua/credit', 'ua'),
  ('Халык Банк', 'https://halykbank.kz/credit', 'kz'),
  ('Kaspi Bank', 'https://kaspi.kz/credit', 'kz'),
  ('ForteBank', 'https://forte.bank/credit', 'kz'),
  ('СберБанк', 'https://www.sber.ru/credit', 'ru'),
  ('Тинькофф', 'https://www.tinkoff.ru/credit', 'ru'),
  ('Альфа-Банк', 'https://alfabank.ru/credit', 'ru')
ON CONFLICT DO NOTHING;