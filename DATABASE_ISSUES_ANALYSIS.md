# Database Storage Issues - Analysis & Solutions

## Summary
Data is NOT being persisted to the Supabase database. Instead, it's only being stored in **browser localStorage**, which means data is lost when the browser is closed or cleared.

---

## Root Causes

### 1. **Missing Database Seed Records** ⚠️ CRITICAL
**Issue:** The Supabase database requires default Organization and User records to exist as foreign key references.

**Evidence:**
- File: `src/utils/supabaseClient.ts` lines 34-48 shows a startup health check
- The app needs:
  - Organization ID: `f56b03a9-9097-4638-8c4a-6f68227b2789`
  - User ID: `d79ebd86-73b7-4f55-9108-cdda19919cf0`

**Problem:**
- If these records don't exist, **all inserts will fail** with foreign key violation error (PostgreSQL error 23503)
- The seed script has **NEVER been run** on the Supabase database

**Solution:**
```sql
-- Run this SQL in Supabase Query Editor:
-- File: scripts/seed-check.sql

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

### 2. **Foreign Key Constraints Not Met**
**Issue:** The database schema requires parent records to exist before child records can be inserted.

**Prisma Schema Dependencies:**
```
Organization (parent)
  ├── Event (requires org_id foreign key)
  │   ├── EventForm (requires event_id)
  │   ├── EventTheme (requires event_id)
  │   └── Registration (requires event_id)
  └── User (requires org_id)
      └── Event.created_by (requires user_id)
```

**Current Flow Problem:**
1. User creates an event in the wizard → Tries to insert with `org_id = f56b03a9-...`
2. If this Organization doesn't exist → **INSERT FAILS**
3. Error is logged but data is still saved locally
4. User sees no error (toast message says "Cloud save failed")

---

### 3. **Supabase Client Configuration Issues**
**Potential Problems:**

#### A) Missing or Invalid Environment Variables
- File: `.env` and `render.yaml` contain credentials
- Need to verify these are **correctly set** during deployment
- Check: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

#### B) Anon Key RLS Policies
- The Supabase anon key might not have permissions to INSERT/UPDATE on tables
- **Solution:** Check Supabase Dashboard → Authentication → Policies
- Ensure RLS (Row Level Security) policies allow:
  - `INSERT` on: organizations, users, events, event_forms, event_themes, registrations
  - `UPDATE` on: events, registrations
  - `DELETE` on: events, registrations

#### C) Network/Connectivity Issues
- Verify Supabase URL is reachable from Render deployment
- Check Supabase Dashboard → API → Status

---

### 4. **Error Handling Masks Failures**
**Problem:** The code catches sync errors but still shows success locally

**Evidence from `src/store/eventStore.tsx`:**
```typescript
// Line 587-591
const { error } = await syncEventToCloud(finalized);
if (error) {
  console.error('[Supabase Cloud Sync Error - Draft]:', error);
  showToast(`⚠️ Cloud save failed: ${error.message || 'Database error'}. Saved to local cache.`);
} else {
  showToast('Draft saved to Cloud successfully');
}
```

**Impact:**
- Data appears saved (in memory/localStorage)
- But it's **NOT in the actual database**
- When user refreshes or comes back later, data is lost

---

### 5. **Data Storage Architecture**
**Current Flow:**
```
User Action (Create Event/Registration)
    ↓
[Save to React State]
    ↓
[Save to localStorage] ← Data persists here
    ↓
[Try to sync to Supabase] ← Often fails silently
    ↓
Browser storage = single source of truth (WRONG!)
```

**What Should Happen:**
```
User Action
    ↓
[Try to sync to Supabase] ← Should be primary
    ↓
[If successful: save to state + localStorage]
[If failed: show error, don't proceed]
    ↓
Database = single source of truth
```

---

## Specific Code Issues Found

### Issue 1: `syncEventToCloud()` Can Fail Silently
**File:** `src/utils/supabaseClient.ts:228-330`

```typescript
// Creates events with hardcoded UUIDs
const eventUuid = isValidUUID(event.id) ? event.id : generateUUID();
const orgUuid = isValidUUID(event.org_id) ? event.org_id : DEFAULT_ORG_ID;
const userUuid = isValidUUID(event.created_by) ? event.created_by : DEFAULT_USER_ID;

// If org/user don't exist in DB → INSERT FAILS
await client.from('events').upsert({
  id: eventUuid,
  org_id: orgUuid,  // ← FOREIGN KEY must exist!
  created_by: userUuid,  // ← FOREIGN KEY must exist!
  ...
});
```

### Issue 2: Registrations Sync After Events
**File:** `src/components/screens/15_PublicRegistrationScreen.tsx:310-320`

```typescript
submitRegistration(evt.id, {
  name: finalName,
  email: finalEmail,
  phone: formattedPhone,
  responses: formData,
  source: 'direct',
}).then(newReg => {
  // Syncs AFTER local storage update
  // If sync fails, user never knows
});
```

### Issue 3: No Retry Logic for Failed Syncs
- When cloud sync fails, data is orphaned
- No automatic retry mechanism
- No queue for failed syncs

---

## Verification Steps

### Step 1: Check Browser Console for Errors
Open DevTools (F12) → Console → Look for:
```
[Supabase Startup Warning] Default organization/user row not found
[Supabase Cloud Sync Error - Draft]
[Supabase syncEventToCloud Error]
```

### Step 2: Check Supabase Database
1. Go to https://supabase.com → Your Project
2. SQL Editor → Run:
```sql
SELECT COUNT(*) FROM organizations;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM events;
```

Expected:
- organizations: ≥ 1
- users: ≥ 1
- events: Should show your created events

### Step 3: Check Supabase RLS Policies
1. Go to Authentication → Policies
2. Verify policies allow anon key to INSERT/UPDATE/DELETE

### Step 4: Check Network Requests
DevTools → Network → Look for failed requests to:
- `pvsnehkntsbljgqagkbi.supabase.co/rest/v1/events`
- `pvsnehkntsbljgqagkbi.supabase.co/rest/v1/registrations`

---

## Required Fixes (Priority Order)

### ✅ Priority 1: Run Database Seed
**Action:** Execute `scripts/seed-check.sql` in Supabase Query Editor
**Expected Time:** < 2 minutes
**Impact:** CRITICAL - unblocks all database operations

### ✅ Priority 2: Verify RLS Policies
**Action:** Check Supabase Dashboard → Authentication → Policies
**Ensure:** Anon key can INSERT/UPDATE/DELETE on all tables
**Impact:** HIGH - determines if writes are allowed

### ✅ Priority 3: Add Sync Status Indicator
**Action:** Show users when data is syncing vs. synced
**Impact:** MEDIUM - improves transparency

### ✅ Priority 4: Implement Sync Retry Queue
**Action:** Store failed syncs and retry periodically
**Impact:** HIGH - improves reliability

### ✅ Priority 5: Add Sync Validation
**Action:** After sync succeeds, fetch from DB to verify
**Impact:** MEDIUM - prevents false positives

---

## Testing Checklist

- [ ] Run seed script → Check organizations/users exist
- [ ] Create an event → Check browser console for errors
- [ ] Verify event appears in Supabase Dashboard
- [ ] Refresh page → Event should still be visible (not just in localStorage)
- [ ] Submit a registration → Verify in Supabase
- [ ] Check Network tab → All requests return 200/201

---

## Files to Review

1. [Database Schema](prisma/schema.prisma) - Table structure & constraints
2. [Supabase Client](src/utils/supabaseClient.ts) - Sync logic
3. [Event Store](src/store/eventStore.tsx) - State & sync orchestration
4. [Seed Script](scripts/seed-check.sql) - Initial data setup
5. [Environment Config](.env & render.yaml) - Credentials

---

## Key Takeaway

**The application successfully stores data locally (in browser storage), but the actual database syncs are failing due to:**

1. **Missing seed records** (Organization/User foreign keys don't exist)
2. **Possible RLS policy issues** (Anon key lacks permissions)
3. **Silent failure handling** (Errors logged but flow continues)

**Once the seed script is run, most issues should resolve automatically.**
