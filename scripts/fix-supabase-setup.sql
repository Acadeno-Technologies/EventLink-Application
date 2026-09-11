-- ==============================================================================
-- ACADENO EventLink - Supabase Full Setup & Fix Script
-- Run this script in the Supabase SQL Editor (dashboard.supabase.com -> SQL Editor)
-- ==============================================================================

-- 1. Insert Default Organization (Required for Foreign Key org_id)
INSERT INTO "organizations" ("id", "name", "slug", "logo_url", "plan", "created_at")
VALUES (
  'f56b03a9-9097-4638-8c4a-6f68227b2789',
  'ACADENO Technologies Pvt. Ltd. – CSEZ Unit',
  'acadeno',
  'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
  'enterprise',
  NOW()
)
ON CONFLICT ("id") DO UPDATE 
SET "name" = EXCLUDED."name";

-- 2. Insert Default Super Admin User (Required for Foreign Key created_by)
INSERT INTO "users" ("id", "org_id", "name", "email", "role", "status", "created_at")
VALUES (
  'd79ebd86-73b7-4f55-9108-cdda19919cf0',
  'f56b03a9-9097-4638-8c4a-6f68227b2789',
  'Super Admin',
  'admin@acadeno.in',
  'super_admin',
  'active',
  NOW()
)
ON CONFLICT ("id") DO UPDATE 
SET "email" = EXCLUDED."email";

-- 3. Fix Row Level Security (RLS) Permissions across all tables
-- This allows the web app (anon role) to create events, forms, themes & registrations
ALTER TABLE IF EXISTS "organizations" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "users" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "events" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "event_forms" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "event_themes" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "registrations" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "audit_logs" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "payments" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "registration_documents" DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "notifications_log" DISABLE ROW LEVEL SECURITY;

-- 4. Grant Full Access to anon and authenticated roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Verification Query: Check that seed data and tables are ready
SELECT 'organizations' AS table_name, count(*) AS total_rows FROM "organizations"
UNION ALL
SELECT 'users' AS table_name, count(*) FROM "users"
UNION ALL
SELECT 'events' AS table_name, count(*) FROM "events";
