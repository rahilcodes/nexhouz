-- Create hero_banners table for homepage banner slide management
-- Recommended banner image size: 1920 x 1080 px (16:9), JPG/PNG, under ~400 KB.
CREATE TABLE IF NOT EXISTS hero_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- Allow public reads (for homepage display)
CREATE POLICY "hero_banners_public_read" ON hero_banners
  FOR SELECT TO public USING (true);

-- Allow authenticated (admin) to write
CREATE POLICY "hero_banners_auth_write" ON hero_banners
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
