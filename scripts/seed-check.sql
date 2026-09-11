-- scripts/seed-check.sql
-- Idempotent seed script for default organization and user required by EventLink

-- 1. Insert Default Organization
INSERT INTO "organizations" ("id", "name", "slug", "logo_url", "plan", "created_at")
VALUES (
  'f56b03a9-9097-4638-8c4a-6f68227b2789',
  'ACADENO Technologies Pvt. Ltd. – CSEZ Unit',
  'acadeno',
  'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
  'enterprise',
  NOW()
)
ON CONFLICT ("id") DO NOTHING;

-- 2. Insert Default Super Admin User
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
ON CONFLICT ("id") DO NOTHING;
