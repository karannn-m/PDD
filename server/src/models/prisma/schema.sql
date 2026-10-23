-- =====================================================================
-- FloraScan - PostgreSQL + PostGIS Native DDL Script
-- Optimized for high-throughput spatial telemetry and 15km radar queries
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255),
    firebase_uid VARCHAR(128) UNIQUE,
    role VARCHAR(20) DEFAULT 'FARMER' CHECK (role IN ('FARMER', 'AGRI_EXPERT', 'ADMIN')),
    tier VARCHAR(20) DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PRO', 'ENTERPRISE')),
    preferred_lang VARCHAR(10) DEFAULT 'hi',
    crop_focus TEXT[] DEFAULT '{}',
    fcm_push_token TEXT,
    daily_scan_count INT DEFAULT 0,
    last_scan_reset TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Farmer Fields Table (with PostGIS Geometry Point)
CREATE TABLE IF NOT EXISTS fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    acreage DOUBLE PRECISION NOT NULL,
    soil_type VARCHAR(100),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location GEOMETRY(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fields_location ON fields USING GIST(location);

-- 3. Disease Taxonomy Catalog
CREATE TABLE IF NOT EXISTS diseases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    common_name VARCHAR(150) NOT NULL,
    scientific_name VARCHAR(150) NOT NULL,
    pathogen_type VARCHAR(50) NOT NULL CHECK (pathogen_type IN ('FUNGAL', 'BACTERIAL', 'VIRAL', 'PEST', 'DEFICIENCY', 'HEALTHY')),
    host_crops TEXT[] NOT NULL,
    symptoms_summary TEXT NOT NULL,
    environmental_triggers TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Treatments Catalog (Organic & Chemical with Dosage Rates)
CREATE TABLE IF NOT EXISTS treatments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disease_id UUID NOT NULL REFERENCES diseases(id) ON DELETE CASCADE,
    remedy_type VARCHAR(20) NOT NULL CHECK (remedy_type IN ('ORGANIC', 'CHEMICAL')),
    brand_name VARCHAR(150),
    active_ingredient VARCHAR(150) NOT NULL,
    recommended_dosage_grams_or_ml DOUBLE PRECISION NOT NULL,
    water_dilution_liters DOUBLE PRECISION NOT NULL,
    dilution_ratio_ml_per_l DOUBLE PRECISION NOT NULL,
    stage VARCHAR(50) NOT NULL,
    application_interval_days INT NOT NULL DEFAULT 7,
    pre_harvest_interval_days INT NOT NULL DEFAULT 0,
    safety_instructions TEXT[] DEFAULT '{}',
    affiliate_store_links JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Scan Logs Table (High-volume spatial leaf inspection telemetry)
CREATE TABLE IF NOT EXISTS scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    field_id UUID REFERENCES fields(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    original_filename VARCHAR(255),
    crop_identified VARCHAR(100) NOT NULL,
    disease_id UUID REFERENCES diseases(id),
    confidence_score DOUBLE PRECISION NOT NULL,
    severity_percentage DOUBLE PRECISION,
    status VARCHAR(20) DEFAULT 'COMPLETED',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location GEOMETRY(Point, 4326),
    district VARCHAR(100),
    state VARCHAR(100),
    source_platform VARCHAR(50) DEFAULT 'WEB',
    model_engine VARCHAR(100) DEFAULT 'ONNX_TFLITE_V2_QUANT',
    inference_time_ms INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial GIST index on Scan locations for fast sub-50ms radius queries
CREATE INDEX IF NOT EXISTS idx_scans_location ON scans USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_disease ON scans(disease_id);

-- 6. Outbreak Alerts Table (Geospatial Alert Radar)
CREATE TABLE IF NOT EXISTS outbreak_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    disease_id UUID NOT NULL REFERENCES diseases(id),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    center_point GEOMETRY(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
    affected_radius_km DOUBLE PRECISION DEFAULT 15.0,
    active_cases_count INT NOT NULL,
    density_index DOUBLE PRECISION NOT NULL,
    risk_level VARCHAR(30) DEFAULT 'MODERATE_WATCH' CHECK (risk_level IN ('LOW_WATCH', 'MODERATE_WATCH', 'HIGH_ALERT', 'CRITICAL_OUTBREAK')),
    alert_headline TEXT NOT NULL,
    advisory_text TEXT NOT NULL,
    is_broadcasted BOOLEAN DEFAULT FALSE,
    broadcasted_at TIMESTAMPTZ,
    created_by_expert_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_alerts_center_point ON outbreak_alerts USING GIST(center_point);
