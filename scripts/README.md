# Database Seed & Deployment Prerequisites

Before deploying or running ACADENO EventLink against a new Supabase project, you **must run the database seed once** to initialize the required default organization and super admin user rows.

## ⚠️ Why is this required?

The `events` table has strict PostgreSQL `FOREIGN KEY` constraints:
- `events.org_id` references `organizations.id`
- `events.created_by` references `users.id`

If the `organizations` and `users` tables are empty in a new Supabase project, all event creation, theme synchronization, form builder publishing, and attendee registrations will fail due to foreign-key violations (`error code 23503`).

---

## 🚀 How to Run the Seed

Choose either Option 1 (SQL Editor) or Option 2 (Node / Prisma):

### Option 1: Run SQL in Supabase Dashboard (Recommended)
1. Open your **[Supabase Dashboard](https://supabase.com/dashboard)** and select your project.
2. Go to the **SQL Editor** in the left sidebar.
3. Paste and run the contents of [`scripts/seed-check.sql`](./seed-check.sql):

```sql
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
```

---

### Option 2: Run Prisma Seed Script via Node.js
From the root of this project:

```bash
# Set your Supabase connection string and run:
DATABASE_URL="your-supabase-postgres-connection-string" node prisma/seed.js
```

---

## 🔑 Default Seed Records

| Table | ID | Key Details |
| :--- | :--- | :--- |
| `organizations` | `f56b03a9-9097-4638-8c4a-6f68227b2789` | `ACADENO Technologies Pvt. Ltd. – CSEZ Unit` (`acadeno`) |
| `users` | `d79ebd86-73b7-4f55-9108-cdda19919cf0` | `Super Admin` (`admin@acadeno.in`) |
