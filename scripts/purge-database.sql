-- ==============================================================================
-- ACADENO EventLink - Database Purge Script (Clean Slate)
-- Removes all events, registrations, forms, themes, payments, documents, and non-admin users
-- Preserves ONLY the Default Organization and Super Admin
-- ==============================================================================

-- 1. Truncate / Delete all transactional and child tables
TRUNCATE TABLE "notifications_log" CASCADE;
TRUNCATE TABLE "registration_documents" CASCADE;
TRUNCATE TABLE "payments" CASCADE;
TRUNCATE TABLE "registrations" CASCADE;
TRUNCATE TABLE "event_themes" CASCADE;
TRUNCATE TABLE "event_forms" CASCADE;
TRUNCATE TABLE "audit_logs" CASCADE;
TRUNCATE TABLE "events" CASCADE;

-- 2. Remove all non-admin users (preserve only Super Admin)
DELETE FROM "users" 
WHERE "role" != 'super_admin' AND "email" != 'admin@acadeno.in';

-- 3. Ensure Default Organization exists
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

-- 4. Ensure Default Super Admin exists
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

-- 5. Verification Status
SELECT 'organizations' AS table_name, count(*) AS remaining_rows FROM "organizations"
UNION ALL
SELECT 'users' AS table_name, count(*) FROM "users"
UNION ALL
SELECT 'events' AS table_name, count(*) FROM "events"
UNION ALL
SELECT 'registrations' AS table_name, count(*) FROM "registrations";
