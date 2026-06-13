-- Create lead_profiles table
CREATE TABLE IF NOT EXISTS lead_profiles (
  lead_id UUID PRIMARY KEY REFERENCES leads(id) ON DELETE CASCADE,
  budget NUMERIC,
  purpose VARCHAR(50),
  office_location VARCHAR(255),
  family_size INT,
  property_type VARCHAR(100),
  priority VARCHAR(255),
  lead_score INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create ai_conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  conversation JSONB,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create lead_recommendations table
CREATE TABLE IF NOT EXISTS lead_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  match_score INT,
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create site_visits table
CREATE TABLE IF NOT EXISTS site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'Scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for the tables
ALTER TABLE lead_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

-- Create public read/write access policies (align with other anon policies)
CREATE POLICY "Allow public inserts on lead_profiles" ON lead_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on lead_profiles" ON lead_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public update on lead_profiles" ON lead_profiles FOR UPDATE USING (true);

CREATE POLICY "Allow public inserts on ai_conversations" ON ai_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on ai_conversations" ON ai_conversations FOR SELECT USING (true);

CREATE POLICY "Allow public inserts on lead_recommendations" ON lead_recommendations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on lead_recommendations" ON lead_recommendations FOR SELECT USING (true);

CREATE POLICY "Allow public inserts on site_visits" ON site_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on site_visits" ON site_visits FOR SELECT USING (true);
CREATE POLICY "Allow public update on site_visits" ON site_visits FOR UPDATE USING (true);
