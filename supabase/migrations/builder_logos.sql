-- Create builder_logos table for partner/builder logo management
CREATE TABLE IF NOT EXISTS builder_logos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL DEFAULT '',
  website_url TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add unique constraint on name
ALTER TABLE builder_logos ADD CONSTRAINT builder_logos_name_unique UNIQUE (name);

-- Enable RLS
ALTER TABLE builder_logos ENABLE ROW LEVEL SECURITY;

-- Allow public reads (for homepage display)
CREATE POLICY "builder_logos_public_read" ON builder_logos
  FOR SELECT TO public USING (true);

-- Allow authenticated (admin) to write
CREATE POLICY "builder_logos_auth_write" ON builder_logos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed default Hyderabad builders
INSERT INTO builder_logos (name, logo_url, website_url, display_order, active) VALUES
  ('Hallmark Developers',   '', 'https://www.hallmarkdevelopers.com',      1, true),
  ('Aparna Constructions',  '', 'https://www.aparnaone.com',               2, true),
  ('Prestige Group',        '', 'https://www.prestigeconstructions.com',   3, true),
  ('Ramky Estates',         '', 'https://www.ramky.com',                   4, true),
  ('My Home Constructions', '', 'https://www.myhomeconstructions.com',     5, true),
  ('INCOR Infrastructure',  '', 'https://www.incorinfrastructure.com',     6, true),
  ('Aliens Space Station',  '', 'https://www.aliensgroup.in',              7, true),
  ('Vertex Homes',          '', 'https://www.vertexhomeshyd.com',          8, true)
ON CONFLICT (name) DO NOTHING;
