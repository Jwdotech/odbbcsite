-- 002_create_missionaries_table.sql
BEGIN;

CREATE TABLE IF NOT EXISTS missionaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  location text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE missionaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for now" ON missionaries
  FOR ALL USING (true) WITH CHECK (true);

COMMIT;
