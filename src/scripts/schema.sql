-- NexHouz PostgreSQL DDL Schema Setup
-- Run this to create/initialize all database tables, indexes, and RLS policies.

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fast text searches

-- Drop existing tables if they exist (clean setup)
DROP TABLE IF EXISTS public.deal_timeline_events CASCADE;
DROP TABLE IF EXISTS public.property_deals CASCADE;
DROP TABLE IF EXISTS public.lead_assignment_history CASCADE;
DROP TABLE IF EXISTS public.nri_advisory_workflows CASCADE;
DROP TABLE IF EXISTS public.site_visits CASCADE;
DROP TABLE IF EXISTS public.ai_recommendations CASCADE;
DROP TABLE IF EXISTS public.user_activity_logs CASCADE;
DROP TABLE IF EXISTS public.user_preferences CASCADE;
DROP TABLE IF EXISTS public.saved_properties CASCADE;
DROP TABLE IF EXISTS public.saved_comparisons CASCADE;
DROP TABLE IF EXISTS public.location_intelligence CASCADE;
DROP TABLE IF EXISTS public.builder_audits CASCADE;
DROP TABLE IF EXISTS public.property_audits CASCADE;
DROP TABLE IF EXISTS public.property_recommendation_reports CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.floor_plans CASCADE;
DROP TABLE IF EXISTS public.property_amenities CASCADE;
DROP TABLE IF EXISTS public.amenities CASCADE;
DROP TABLE IF EXISTS public.property_images CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.locations CASCADE;
DROP TABLE IF EXISTS public.builders CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- =========================================================================
-- 1. USERS & ADMINS (Profiles)
-- =========================================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'agent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 2. BUILDERS
-- =========================================================================
CREATE TABLE public.builders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url VARCHAR(512),
    description TEXT,
    website_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 3. LOCATIONS
-- =========================================================================
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    city VARCHAR(100) DEFAULT 'Hyderabad' NOT NULL,
    state VARCHAR(100) DEFAULT 'Telangana' NOT NULL,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    aqi_score INTEGER CHECK (aqi_score >= 0),
    dominant_pollutant VARCHAR(10) DEFAULT 'PM2.5',
    pm25 DECIMAL(5, 2),
    pm10 DECIMAL(5, 2),
    o3 DECIMAL(5, 2),
    no2 DECIMAL(5, 2),
    so2 DECIMAL(5, 2),
    co DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 4. PROJECTS
-- =========================================================================
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    builder_id UUID REFERENCES public.builders(id) ON DELETE SET NULL,
    location_id UUID REFERENCES public.locations(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    rera_number VARCHAR(100) UNIQUE,
    possession_date VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 5. PROPERTIES
-- =========================================================================
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    location_id UUID REFERENCES public.locations(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    price NUMERIC(15, 2) NOT NULL CHECK (price > 0),
    property_type VARCHAR(20) NOT NULL CHECK (property_type IN ('Apartment', 'Villa', 'Plot', 'Commercial')),
    bhk INTEGER CHECK (bhk >= 0),
    area_sqft NUMERIC(10, 2) NOT NULL CHECK (area_sqft > 0),
    possession_status VARCHAR(30) NOT NULL CHECK (possession_status IN ('Ready', 'Under Construction')),
    investment_type VARCHAR(30) NOT NULL CHECK (investment_type IN ('Capital Appreciation', 'High-Yield Rental', 'Generational Estate')),
    description TEXT NOT NULL,
    architect VARCHAR(100),
    featured BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Luxury Audit Scores
    score_architectural INTEGER DEFAULT 90 CHECK (score_architectural BETWEEN 0 AND 100),
    score_yield DECIMAL(4, 2) DEFAULT 8.0 CHECK (score_yield >= 0),
    score_spatial INTEGER DEFAULT 90 CHECK (score_spatial BETWEEN 0 AND 100),
    score_automation VARCHAR(30) DEFAULT 'Tier 2 (Pro)' CHECK (score_automation IN ('Tier 1 (Integrated)', 'Tier 2 (Pro)', 'Tier 3 (Elite)')),
    
    -- Nearby amenities count
    nearby_hospitals INT DEFAULT 0,
    nearby_malls INT DEFAULT 0,
    nearby_schools INT DEFAULT 0,
    nearby_restaurants INT DEFAULT 0,
    nearby_metro_stations INT DEFAULT 0,
    nearby_railway_stations INT DEFAULT 0,
    nearby_it_parks INT DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 6. PROPERTY IMAGES
-- =========================================================================
CREATE TABLE public.property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url VARCHAR(512) NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 7. AMENITIES
-- =========================================================================
CREATE TABLE public.amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    icon_name VARCHAR(50),
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Join table Property <-> Amenity
CREATE TABLE public.property_amenities (
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, amenity_id)
);

-- =========================================================================
-- 8. FLOOR PLANS
-- =========================================================================
CREATE TABLE public.floor_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    unit_type VARCHAR(50) NOT NULL,
    size_sqft NUMERIC(8, 2) NOT NULL,
    facing VARCHAR(50),
    price NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 9. LEADS & ASSIGNMENTS
-- =========================================================================
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255), -- Nullable for quick callbacks/inquiries
    phone VARCHAR(30) NOT NULL,
    notes TEXT,
    lead_type VARCHAR(30) DEFAULT 'general' CHECK (lead_type IN ('general', 'callback', 'property_inquiry')),
    status VARCHAR(30) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed', 'junk')),
    assigned_advisor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 10. BLOG POSTS
-- =========================================================================
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image_url VARCHAR(512),
    published BOOLEAN DEFAULT FALSE NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 11. PROPTECH EXTENSIONS: NEXHOUZ RECOMMENDATION REPORTS
-- =========================================================================
CREATE TABLE public.property_recommendation_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID UNIQUE NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    investment_potential INTEGER CHECK (investment_potential BETWEEN 1 AND 10),
    family_friendliness INTEGER CHECK (family_friendliness BETWEEN 1 AND 10),
    commute_convenience INTEGER CHECK (commute_convenience BETWEEN 1 AND 10),
    school_access INTEGER CHECK (school_access BETWEEN 1 AND 10),
    hospital_access INTEGER CHECK (hospital_access BETWEEN 1 AND 10),
    future_appreciation INTEGER CHECK (future_appreciation BETWEEN 1 AND 10),
    builder_trust_rating INTEGER CHECK (builder_trust_rating BETWEEN 1 AND 10),
    why_recommended TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 12. PROPTECH EXTENSIONS: DETAILED PROPERTY AUDITS
-- =========================================================================
CREATE TABLE public.property_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID UNIQUE NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    audited_at DATE DEFAULT CURRENT_DATE NOT NULL,
    auditor_name VARCHAR(150) NOT NULL,
    legal_clearance_score INTEGER NOT NULL CHECK (legal_clearance_score BETWEEN 0 AND 100),
    structural_safety_score INTEGER NOT NULL CHECK (structural_safety_score BETWEEN 0 AND 100),
    layout_efficiency_score INTEGER NOT NULL CHECK (layout_efficiency_score BETWEEN 0 AND 100),
    materials_finishing_score INTEGER NOT NULL CHECK (materials_finishing_score BETWEEN 0 AND 100),
    smart_automation_score INTEGER NOT NULL CHECK (smart_automation_score BETWEEN 0 AND 100),
    materials_grade VARCHAR(50) DEFAULT 'Grade A' NOT NULL,
    hvac_system_type VARCHAR(100),
    audit_pdf_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 13. PROPTECH EXTENSIONS: BUILDER AUDITING & TRUST SCORES
-- =========================================================================
CREATE TABLE public.builder_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    builder_id UUID UNIQUE NOT NULL REFERENCES public.builders(id) ON DELETE CASCADE,
    audited_at DATE DEFAULT CURRENT_DATE NOT NULL,
    rera_compliance_rate DECIMAL(5, 2) NOT NULL DEFAULT 100.00 CHECK (rera_compliance_rate BETWEEN 0 AND 100),
    on_time_delivery_rate DECIMAL(5, 2) NOT NULL DEFAULT 100.00 CHECK (on_time_delivery_rate BETWEEN 0 AND 100),
    average_delay_months DECIMAL(3, 1) DEFAULT 0.0 CHECK (average_delay_months >= 0),
    financial_stability_grade VARCHAR(10) DEFAULT 'A+' CHECK (financial_stability_grade IN ('AAA', 'AA', 'A', 'BBB', 'BB', 'B')),
    completed_projects_count INTEGER DEFAULT 0 CHECK (completed_projects_count >= 0),
    litigation_count INTEGER DEFAULT 0 CHECK (litigation_count >= 0),
    trust_index_score INTEGER DEFAULT 90 CHECK (trust_index_score BETWEEN 0 AND 100),
    auditor_comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 14. PROPTECH EXTENSIONS: LOCATION INTELLIGENCE
-- =========================================================================
CREATE TABLE public.location_intelligence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID UNIQUE NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    connectivity_rating INTEGER NOT NULL CHECK (connectivity_rating BETWEEN 0 AND 100),
    noise_level_decibels INTEGER NOT NULL CHECK (noise_level_decibels >= 0),
    water_reliability_rating INTEGER NOT NULL CHECK (water_reliability_rating BETWEEN 0 AND 100),
    power_backup_grid_rating INTEGER NOT NULL CHECK (power_backup_grid_rating BETWEEN 0 AND 100),
    green_cover_index INTEGER NOT NULL CHECK (green_cover_index BETWEEN 0 AND 100),
    safety_index_rating INTEGER NOT NULL CHECK (safety_index_rating BETWEEN 0 AND 100),
    price_appreciation_annual_percent DECIMAL(4, 2) NOT NULL CHECK (price_appreciation_annual_percent >= 0),
    avg_price_per_sqft NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 15. PROPTECH EXTENSIONS: COMPARISONS & RECENT SELECTIONS
-- =========================================================================
CREATE TABLE public.saved_comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    comparison_name VARCHAR(150) DEFAULT 'My Comparison' NOT NULL,
    property_ids UUID[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 16. PROPTECH EXTENSIONS: SAVED PROPERTIES & USER PREFERENCES
-- =========================================================================
CREATE TABLE public.saved_properties (
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    PRIMARY KEY (profile_id, property_id)
);

CREATE TABLE public.user_preferences (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    min_budget NUMERIC(15, 2),
    max_budget NUMERIC(15, 2),
    preferred_locations UUID[],
    preferred_property_types VARCHAR(30)[] CHECK (preferred_property_types <@ ARRAY['Apartment', 'Villa', 'Plot', 'Commercial']::VARCHAR[]),
    min_bhk INTEGER,
    nri_status_verified BOOLEAN DEFAULT FALSE NOT NULL,
    notification_frequency VARCHAR(20) DEFAULT 'weekly' CHECK (notification_frequency IN ('instant', 'daily', 'weekly', 'none')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 17. PROPTECH EXTENSIONS: USER ACTIVITIES & AI RECOMMENDATIONS
-- =========================================================================
CREATE TABLE public.user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    search_query TEXT,
    dwell_time_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE public.ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    match_percentage DECIMAL(5, 2) NOT NULL CHECK (match_percentage BETWEEN 0 AND 100),
    matching_criteria_explanation TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'delivered' CHECK (status IN ('delivered', 'viewed', 'clicked', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 18. PROPTECH EXTENSIONS: SITE VISIT SCHEDULER
-- =========================================================================
CREATE TABLE public.site_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    assigned_advisor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
    feedback_score INTEGER CHECK (feedback_score BETWEEN 1 AND 5),
    feedback_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 19. PROPTECH EXTENSIONS: NRI ADVISORY WORKFLOWS
-- =========================================================================
CREATE TABLE public.nri_advisory_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID UNIQUE NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    country_of_residence VARCHAR(150) NOT NULL,
    preferred_callback_timezone VARCHAR(100) NOT NULL,
    preferred_currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    poa_status VARCHAR(50) DEFAULT 'not_applicable' NOT NULL CHECK (poa_status IN ('not_applicable', 'pending_draft', 'poa_assigned', 'poa_verified')),
    repatriation_compliance_needed BOOLEAN DEFAULT FALSE NOT NULL,
    tax_tds_status VARCHAR(50) DEFAULT 'pending' NOT NULL CHECK (tax_tds_status IN ('pending', 'consult_completed', 'setup')),
    nri_stage VARCHAR(50) DEFAULT 'consultation' CHECK (nri_stage IN ('consultation', 'portfolio_review', 'legal_clearance', 'repatriation_check', 'deal_signing')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- 20. PROPTECH EXTENSIONS: LEAD ROUTING & ASSIGNMENTS HISTORY
-- =========================================================================
CREATE TABLE public.lead_assignment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    previous_advisor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    new_advisor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    transfer_reason TEXT
);

-- =========================================================================
-- 21. PROPTECH EXTENSIONS: PROPERTY DEALS & LIFECYCLE TRANSACTION
-- =========================================================================
CREATE TABLE public.property_deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE RESTRICT,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
    deal_stage VARCHAR(50) DEFAULT 'reservation' NOT NULL CHECK (deal_stage IN (
        'reservation',
        'agreement_signed',
        'loan_processing',
        'legal_clearance',
        'registration_scheduled',
        'registered',
        'possession_handover',
        'closed_lost'
    )),
    agreed_price NUMERIC(15, 2) NOT NULL CHECK (agreed_price > 0),
    booking_token_amount NUMERIC(15, 2) CHECK (booking_token_amount >= 0),
    estimated_closure_date DATE,
    actual_closure_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE public.deal_timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES public.property_deals(id) ON DELETE CASCADE,
    previous_stage VARCHAR(50),
    new_stage VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- =========================================================================
-- ⚡ Indexing Strategy
-- =========================================================================
CREATE INDEX idx_properties_filtering ON public.properties(property_type, possession_status, price);
CREATE INDEX idx_property_images_prop_id ON public.property_images(property_id, display_order);
CREATE INDEX idx_properties_featured ON public.properties(featured) WHERE featured = TRUE;
CREATE INDEX idx_properties_slug ON public.properties(slug);
CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_saved_properties_profile ON public.saved_properties(profile_id);
CREATE INDEX idx_leads_advisor_id ON public.leads(assigned_advisor_id);
CREATE INDEX idx_site_visits_advisor ON public.site_visits(assigned_advisor_id, scheduled_at);
CREATE INDEX idx_site_visits_scheduled ON public.site_visits(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX idx_user_activity_profile_id ON public.user_activity_logs(profile_id, created_at DESC);
CREATE INDEX idx_ai_recs_profile ON public.ai_recommendations(profile_id, match_percentage DESC);
CREATE INDEX idx_deals_stage ON public.property_deals(deal_stage);
CREATE INDEX idx_deals_lead ON public.property_deals(lead_id);

-- =========================================================================
-- 🔒 Row-Level Security (RLS) Rules & Policies
-- =========================================================================

-- Enable RLS on ALL tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.builders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.floor_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_recommendation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.builder_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nri_advisory_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_assignment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_timeline_events ENABLE ROW LEVEL SECURITY;

-- 1. Public Read (SELECT) Policies for all listing metadata tables
CREATE POLICY "Allow public select on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public select on builders" ON public.builders FOR SELECT USING (true);
CREATE POLICY "Allow public select on locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Allow public select on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public select on properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Allow public select on property_images" ON public.property_images FOR SELECT USING (true);
CREATE POLICY "Allow public select on amenities" ON public.amenities FOR SELECT USING (true);
CREATE POLICY "Allow public select on property_amenities" ON public.property_amenities FOR SELECT USING (true);
CREATE POLICY "Allow public select on floor_plans" ON public.floor_plans FOR SELECT USING (true);
CREATE POLICY "Allow public select on property_recommendation_reports" ON public.property_recommendation_reports FOR SELECT USING (true);
CREATE POLICY "Allow public select on blog_posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public select on property_audits" ON public.property_audits FOR SELECT USING (true);
CREATE POLICY "Allow public select on builder_audits" ON public.builder_audits FOR SELECT USING (true);
CREATE POLICY "Allow public select on location_intelligence" ON public.location_intelligence FOR SELECT USING (true);

-- 2. Authenticated Admin / Agent Write (ALL) Policies
-- This enables admin panel operations to succeed for authenticated users mapped in profiles
CREATE POLICY "Allow admin insert on profiles" ON public.profiles FOR INSERT TO authenticated 
WITH CHECK (role = 'admin' OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'agent'));

CREATE POLICY "Allow admin update on profiles" ON public.profiles FOR UPDATE TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'agent'));

CREATE POLICY "Allow admin delete on profiles" ON public.profiles FOR DELETE TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'agent'));

CREATE POLICY "Allow admin write on builders" ON public.builders FOR ALL TO authenticated 
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "Allow admin write on locations" ON public.locations FOR ALL TO authenticated 
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "Allow admin write on projects" ON public.projects FOR ALL TO authenticated 
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "Allow admin write on properties" ON public.properties FOR ALL TO authenticated 
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "Allow admin write on property_images" ON public.property_images FOR ALL TO authenticated 
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "Allow admin write on amenities" ON public.amenities FOR ALL TO authenticated 
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "Allow admin write on property_amenities" ON public.property_amenities FOR ALL TO authenticated 
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "Allow admin write on floor_plans" ON public.floor_plans FOR ALL TO authenticated 
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "Allow admin write on property_recommendation_reports" ON public.property_recommendation_reports FOR ALL TO authenticated 
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "Allow admin write on blog_posts" ON public.blog_posts FOR ALL TO authenticated 
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "Allow admin write on property_audits" ON public.property_audits FOR ALL TO authenticated 
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "Allow admin write on builder_audits" ON public.builder_audits FOR ALL TO authenticated 
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "Allow admin write on location_intelligence" ON public.location_intelligence FOR ALL TO authenticated 
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

-- 3. Lead Submissions & Advisory Workflow Policies
-- Anyone can insert leads (submit callback request / site visit request)
CREATE POLICY "Allow public insert on leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin write on leads" ON public.leads FOR ALL TO authenticated 
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

-- User specific profile access (for Phase 2-4 saved state and preferences)
CREATE POLICY "Allow users select/write own preferences" ON public.user_preferences FOR ALL
USING (profile_id = auth.uid());

CREATE POLICY "Allow users select/write own saved_properties" ON public.saved_properties FOR ALL
USING (profile_id = auth.uid());

CREATE POLICY "Allow users select/write own saved_comparisons" ON public.saved_comparisons FOR ALL
USING (profile_id = auth.uid());

CREATE POLICY "Allow users select/write own activity logs" ON public.user_activity_logs FOR ALL
USING (profile_id = auth.uid());

CREATE POLICY "Allow users select own ai recommendations" ON public.ai_recommendations FOR SELECT
USING (profile_id = auth.uid());

-- Site visits
CREATE POLICY "Allow users select/insert own site visits" ON public.site_visits FOR SELECT
USING (profile_id = auth.uid() OR exists(
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')
));
CREATE POLICY "Allow admin write on site_visits" ON public.site_visits FOR ALL TO authenticated
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

-- Deals & transaction tracking (locked to admin/agent only)
CREATE POLICY "Allow admin write on property_deals" ON public.property_deals FOR ALL TO authenticated
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "Allow admin write on deal_timeline_events" ON public.deal_timeline_events FOR ALL TO authenticated
USING (exists(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));
