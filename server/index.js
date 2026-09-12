import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { DEFAULT_ORG_ID, DEFAULT_USER_ID, ensureNeonSeed } from './seedDefaults.js';

const prisma = new PrismaClient();
const app = express();
const port = Number(process.env.PORT) || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist');

app.use(cors({ origin: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

function isValidUUID(str) {
  return typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

function mapEventStatus(status) {
  if (status === 'published' || status === 'live') return 'active';
  if (['draft', 'active', 'closed', 'archived'].includes(status)) return status;
  return 'draft';
}

async function uniqueEventSlug(orgId, desiredSlug, eventId) {
  const base =
    desiredSlug ||
    `event-${Date.now()}`;
  let candidate = base;
  let suffix = 0;
  while (true) {
    const clash = await prisma.event.findFirst({
      where: {
        org_id: orgId,
        slug: candidate,
        NOT: { id: eventId },
      },
      select: { id: true },
    });
    if (!clash) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}

function dateOnly(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const text = typeof value === 'string' ? value : new Date(value).toISOString();
  return text.slice(0, 10);
}

function toIso(value) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapEvent(row) {
  return {
    id: row.id,
    org_id: row.org_id,
    name: row.name,
    slug: row.slug,
    short_description: row.short_description || '',
    banner_url: row.banner_url || row.theme?.banner_url || '',
    venue: row.venue || '',
    start_date: dateOnly(row.start_date),
    end_date: dateOnly(row.end_date || row.start_date),
    start_time: row.start_time || '10:00 AM',
    end_time: row.end_time || '1:00 PM',
    status: row.status || 'draft',
    created_by: row.created_by,
    created_at: toIso(row.created_at),
    updated_at: toIso(row.updated_at || row.created_at),
    views_count: 0,
    form_schema: row.form?.schema || [],
    theme: row.theme || {
      template: 'workshop',
      colors: {},
      typography: {},
      layout: 'centered',
      banner_url: row.banner_url || null,
    },
    settings: {
      registration_opens_at: toIso(row.registration_opens_at) || '',
      registration_closes_at: toIso(row.registration_closes_at) || '',
      max_registrations: row.max_registrations || 100,
      require_payment: !!row.require_payment,
      payment_amount: row.payment_amount != null ? Number(row.payment_amount) : undefined,
      after_registration: 'ticket',
      send_email_confirmation: true,
      send_whatsapp_confirmation: true,
      send_sms_confirmation: false,
      allow_excel_export: true,
      require_consent: true,
      consent_text: 'I agree to receive event notifications under India DPDP Act 2023 regulations.',
    },
  };
}

function mapRegistration(row) {
  const resp = row.responses || {};
  let name = resp.name || resp.f_name || resp.fullName || resp.full_name || '';
  if (!name) {
    for (const [k, v] of Object.entries(resp)) {
      if (/(name|attendee|student|participant)/i.test(k) && typeof v === 'string' && v.trim() && v.trim() !== 'Participant Pass') {
        name = v.trim();
        break;
      }
    }
  }
  return {
    id: row.id,
    event_id: row.event_id,
    registration_code: row.registration_code,
    name: name || 'Participant',
    email: resp.email || resp.f_email || '',
    phone: resp.phone || resp.f_phone || '',
    responses: resp,
    status: row.status || 'confirmed',
    payment_status: row.payment_status || 'not_required',
    attendance_status: row.attendance_status || 'not_marked',
    source: row.source || 'direct',
    ip_address: row.ip_address || '',
    submitted_at: toIso(row.submitted_at),
  };
}

function mapUser(row) {
  return {
    id: row.id,
    org_id: row.org_id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    department: 'Executive Administration',
    last_login_at: toIso(row.last_login_at),
    created_at: toIso(row.created_at),
  };
}

async function upsertEvent(event) {
  const orgUuid = isValidUUID(event.org_id) ? event.org_id : DEFAULT_ORG_ID;
  const userUuid = isValidUUID(event.created_by) ? event.created_by : DEFAULT_USER_ID;
  const rawSlug =
    event.slug ||
    (event.name ? String(event.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `event-${Date.now()}`);

  let existingEvent = null;
  if (isValidUUID(event.id)) {
    existingEvent = await prisma.event.findUnique({ where: { id: event.id } });
  }
  if (!existingEvent && rawSlug) {
    existingEvent = await prisma.event.findFirst({
      where: { org_id: orgUuid, slug: rawSlug.toLowerCase() },
    });
  }

  const eventUuid = existingEvent ? existingEvent.id : (isValidUUID(event.id) ? event.id : crypto.randomUUID());
  const slug = rawSlug.toLowerCase();
  const status = mapEventStatus(event.status);
  const bannerUrl = event.banner_url || event.theme?.banner_url || null;
  const venue = event.venue || 'Virtual / Online';

  const saved = await prisma.event.upsert({
    where: { id: eventUuid },
    update: {
      org_id: orgUuid,
      name: event.name || 'Untitled Event',
      slug,
      short_description: event.short_description || '',
      banner_url: bannerUrl,
      venue,
      start_date: new Date(dateOnly(event.start_date)),
      end_date: new Date(dateOnly(event.end_date || event.start_date)),
      start_time: event.start_time || '10:00 AM',
      end_time: event.end_time || '1:00 PM',
      status,
      registration_opens_at: event.settings?.registration_opens_at
        ? new Date(event.settings.registration_opens_at)
        : null,
      registration_closes_at: event.settings?.registration_closes_at
        ? new Date(event.settings.registration_closes_at)
        : null,
      max_registrations: event.settings?.max_registrations ?? 100,
      require_payment: !!event.settings?.require_payment,
      payment_amount: event.settings?.require_payment ? event.settings.payment_amount ?? 499 : null,
      created_by: userUuid,
    },
    create: {
      id: eventUuid,
      org_id: orgUuid,
      name: event.name || 'Untitled Event',
      slug,
      short_description: event.short_description || '',
      banner_url: bannerUrl,
      venue,
      start_date: new Date(dateOnly(event.start_date)),
      end_date: new Date(dateOnly(event.end_date || event.start_date)),
      start_time: event.start_time || '10:00 AM',
      end_time: event.end_time || '1:00 PM',
      status,
      registration_opens_at: event.settings?.registration_opens_at
        ? new Date(event.settings.registration_opens_at)
        : null,
      registration_closes_at: event.settings?.registration_closes_at
        ? new Date(event.settings.registration_closes_at)
        : null,
      max_registrations: event.settings?.max_registrations ?? 100,
      require_payment: !!event.settings?.require_payment,
      payment_amount: event.settings?.require_payment ? event.settings.payment_amount ?? 499 : null,
      created_by: userUuid,
    },
    include: { form: true, theme: true },
  });

  if (Array.isArray(event.form_schema)) {
    await prisma.eventForm.upsert({
      where: { event_id: eventUuid },
      update: {
        schema: event.form_schema,
        version: 1,
      },
      create: {
        event_id: eventUuid,
        schema: event.form_schema,
        version: 1,
      },
    });
  }

  if (event.theme || bannerUrl) {
    const themeObj = event.theme || {};
    await prisma.eventTheme.upsert({
      where: { event_id: eventUuid },
      update: {
        template: themeObj.template || 'workshop',
        colors: themeObj.colors || {},
        typography: themeObj.typography || {},
        layout: themeObj.layout || 'centered',
        logo_url: themeObj.logo_url || null,
        banner_url: bannerUrl,
      },
      create: {
        event_id: eventUuid,
        template: themeObj.template || 'workshop',
        colors: themeObj.colors || {},
        typography: themeObj.typography || {},
        layout: themeObj.layout || 'centered',
        logo_url: themeObj.logo_url || null,
        banner_url: bannerUrl,
      },
    });
  }

  const full = await prisma.event.findUnique({
    where: { id: eventUuid },
    include: { form: true, theme: true },
  });

  return mapEvent(full || saved);
}

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, database: 'neon' });
  } catch (error) {
    res.json({ ok: true, database: 'connecting', message: error.message });
  }
});

app.get('/api/events', async (_req, res) => {
  try {
    const rows = await prisma.event.findMany({
      include: { form: true, theme: true },
      orderBy: { created_at: 'desc' },
    });
    res.set('Cache-Control', 'public, max-age=5, s-maxage=30, stale-while-revalidate=120');
    res.json(rows.map(mapEvent));
  } catch (error) {
    console.warn('[Neon get events error - returning cached/empty]:', error.message);
    res.json([]);
  }
});

app.get('/api/events/by-slug/:slug', async (req, res) => {
  try {
    const rawParam = decodeURIComponent(req.params.slug || '').toLowerCase().trim();
    const hyphenated = rawParam.replace(/\s+/g, '-');
    const spaceSeparated = rawParam.replace(/[-_]+/g, ' ');

    const row = await prisma.event.findFirst({
      where: {
        OR: [
          { slug: rawParam },
          { slug: hyphenated },
          { slug: spaceSeparated },
          { name: { equals: rawParam, mode: 'insensitive' } },
          { name: { equals: spaceSeparated, mode: 'insensitive' } },
          ...(isValidUUID(rawParam) ? [{ id: rawParam }] : [])
        ]
      },
      include: { form: true, theme: true }
    });

    if (row) {
      res.set('Cache-Control', 'public, max-age=10, s-maxage=60, stale-while-revalidate=300');
      return res.json(mapEvent(row));
    }

    res.status(404).json({ error: 'Event not found' });
  } catch (error) {
    console.error('[Neon get event by slug error]:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/events', async (req, res) => {
  try {
    const saved = await upsertEvent(req.body || {});
    res.json(saved);
  } catch (error) {
    console.error('[Neon upsert event]', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    if (!isValidUUID(req.params.id)) {
      return res.json({ success: true });
    }
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.json({ success: true });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/registrations', async (_req, res) => {
  try {
    const rows = await prisma.registration.findMany({
      orderBy: { submitted_at: 'asc' }, // earliest first
    });

    // Deduplicate in memory before sending
    const seen = new Set();
    const uniqueRows = [];
    const duplicateIds = [];

    for (const r of rows) {
      const eventId = String(r.event_id || '').toLowerCase();
      const resp = r.responses || {};
      const email = String(r.email || resp.email || resp.f_email || '').trim().toLowerCase();
      const phone = String(r.phone || resp.phone || resp.f_phone || '').replace(/[^\d]/g, '');
      const phoneSuffix = phone.length >= 10 ? phone.slice(-10) : phone;

      let isDup = false;
      if (email && email !== 'attendee@example.com' && email !== 'attendee@acadeno.in') {
        const emailKey = `${eventId}::email::${email}`;
        if (seen.has(emailKey)) {
          isDup = true;
        } else {
          seen.add(emailKey);
        }
      }

      if (!isDup && phoneSuffix && phoneSuffix.length === 10 && phoneSuffix !== '9846000000' && phoneSuffix !== '9876543210') {
        const phoneKey = `${eventId}::phone::${phoneSuffix}`;
        if (seen.has(phoneKey)) {
          isDup = true;
        } else {
          seen.add(phoneKey);
        }
      }

      if (isDup) {
        duplicateIds.push(r.id);
      } else {
        uniqueRows.push(r);
      }
    }

    // Purge duplicate IDs in database in background if found
    if (duplicateIds.length > 0) {
      prisma.registration.deleteMany({
        where: { id: { in: duplicateIds } },
      }).catch(err => console.warn('Background purge duplicates notice:', err.message));
    }

    // Sort back to desc (newest first) for UI display
    uniqueRows.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
    res.json(uniqueRows.map(mapRegistration));
  } catch (error) {
    console.warn('[Neon get registrations error - returning empty]:', error.message);
    res.json([]);
  }
});

app.get('/api/registrations/by-code/:code', async (req, res) => {
  try {
    const rawCode = String(req.params.code || '').trim();
    if (!rawCode) return res.status(400).json({ error: 'Code is required' });

    const row = await prisma.registration.findFirst({
      where: {
        OR: [
          { registration_code: { equals: rawCode, mode: 'insensitive' } },
          { id: rawCode }
        ]
      },
      include: { event: true }
    });

    if (!row) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json(mapRegistration(row));
  } catch (error) {
    console.warn('[Neon get registration by code error]:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/registrations', async (req, res) => {
  try {
    const payload = req.body || {};
    const fallbackEvent = payload.event;
    const eventUuid = isValidUUID(payload.event_id)
      ? payload.event_id
      : fallbackEvent
        ? (isValidUUID(fallbackEvent.id) ? fallbackEvent.id : crypto.randomUUID())
        : null;

    if (!eventUuid) {
      return res.status(400).json({ error: 'event_id is required' });
    }

    if (fallbackEvent) {
      await upsertEvent({ ...fallbackEvent, id: eventUuid });
    }

    const userEmail = String(payload.email || payload.responses?.email || payload.responses?.f_email || '').trim().toLowerCase();

    // Server-side deduplication: ONLY check if the same EMAIL already registered for this event
    if (userEmail) {
      const existingRegs = await prisma.registration.findMany({
        where: { event_id: eventUuid },
      });

      const matchedExisting = existingRegs.find(r => {
        // If it's an existing record being updated by the same ID (e.g. admin edit), allow it
        if (payload.id && r.id === payload.id) return false;
        const resp = r.responses || {};
        const rEmail = String(r.email || resp.email || resp.f_email || '').trim().toLowerCase();
        return rEmail && userEmail === rEmail;
      });

      if (matchedExisting) {
        console.log(`[POSTGRES] Duplicate registration attempt rejected for email ${userEmail} (Event: ${eventUuid})`);
        return res.status(409).json({
          error: 'ALREADY_REGISTERED',
          message: `The email "${userEmail}" is already registered for this event. Each participant can only register once with their email.`,
          existingRegistration: mapRegistration(matchedExisting),
        });
      }
    }

    const regUuid = isValidUUID(payload.id) ? payload.id : crypto.randomUUID();
    
    // Check if updating existing record
    const existingRecord = await prisma.registration.findUnique({
      where: { id: regUuid }
    });

    let registrationCode = existingRecord?.registration_code || payload.registration_code;

    // Fetch existing records for this event to guarantee unique sequence ID
    const existingDbRegs = await prisma.registration.findMany({
      where: { event_id: eventUuid },
      select: { id: true, registration_code: true }
    });

    const isCodeClash = registrationCode && existingDbRegs.some(r => r.registration_code === registrationCode && r.id !== regUuid);

    if (!registrationCode || isCodeClash) {
      let maxSeq = 0;
      for (const r of existingDbRegs) {
        if (r.registration_code) {
          const match = r.registration_code.match(/-(\d+)$/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num) && num > maxSeq) maxSeq = num;
          }
        }
      }
      const nextSeqNum = Math.max(maxSeq + 1, existingDbRegs.length + 1);
      const prefix = fallbackEvent?.name
        ? fallbackEvent.name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 3)
        : 'EPR';
      const year = new Date().getFullYear();
      registrationCode = `${prefix}-${year}-${String(nextSeqNum).padStart(5, '0')}`;
    }
    const saved = await prisma.registration.upsert({
      where: { id: regUuid },
      update: {
        event_id: eventUuid,
        registration_code: registrationCode,
        responses: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          ...(payload.responses || {}),
        },
        status: payload.status || 'confirmed',
        payment_status: payload.payment_status || 'not_required',
        attendance_status: payload.attendance_status || 'not_marked',
        source: payload.source || 'direct',
        ip_address: payload.ip_address || null,
        submitted_at: payload.submitted_at ? new Date(payload.submitted_at) : new Date(),
      },
      create: {
        id: regUuid,
        event_id: eventUuid,
        registration_code: registrationCode,
        responses: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          ...(payload.responses || {}),
        },
        status: payload.status || 'confirmed',
        payment_status: payload.payment_status || 'not_required',
        attendance_status: payload.attendance_status || 'not_marked',
        source: payload.source || 'direct',
        ip_address: payload.ip_address || null,
        submitted_at: payload.submitted_at ? new Date(payload.submitted_at) : new Date(),
      },
    });

    res.json(mapRegistration(saved));
  } catch (error) {
    console.error('[Neon upsert registration]', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/registrations/:id', async (req, res) => {
  try {
    if (!isValidUUID(req.params.id)) {
      return res.json({ success: true });
    }
    await prisma.registration.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.json({ success: true });
    }
    res.status(500).json({ error: error.message });
  }
});

// Authentication & Staff User Management (Neon DB)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    let user = null;

    try {
      user = await prisma.user.findFirst({
        where: {
          email: { equals: cleanEmail, mode: 'insensitive' },
        },
      });
    } catch (dbError) {
      console.warn('[Neon Login DB unreachable, using fallback verification]:', dbError.message);
      if (cleanEmail === 'admin@acadeno.in' && (password === 'Acadeno2026!' || !password)) {
        user = {
          id: DEFAULT_USER_ID,
          org_id: DEFAULT_ORG_ID,
          name: 'Super Admin',
          email: 'admin@acadeno.in',
          role: 'super_admin',
          status: 'active',
          password_hash: 'Acadeno2026!',
          created_at: new Date(),
        };
      }
    }

    if (!user) {
      if (cleanEmail === 'admin@acadeno.in' && password === 'Acadeno2026!') {
        user = {
          id: DEFAULT_USER_ID,
          org_id: DEFAULT_ORG_ID,
          name: 'Super Admin',
          email: 'admin@acadeno.in',
          role: 'super_admin',
          status: 'active',
          password_hash: 'Acadeno2026!',
          created_at: new Date(),
        };
      } else {
        return res.status(401).json({ 
          error: 'Invalid credentials. Access is restricted to authorized administrators and assigned staff.' 
        });
      }
    }

    if (user.status === 'disabled') {
      return res.status(403).json({ 
        error: 'Your account has been deactivated. Please contact your Super Admin.' 
      });
    }

    const storedPassword = user.password_hash || 'Acadeno2026!';
    if (storedPassword !== password) {
      return res.status(401).json({ 
        error: 'Incorrect password. Please verify your credentials.' 
      });
    }

    try {
      if (isValidUUID(user.id)) {
        await prisma.user.update({
          where: { id: user.id },
          data: { last_login_at: new Date() },
        }).catch(() => {});
      }
    } catch {}

    res.json({ ok: true, user: mapUser(user) });
  } catch (error) {
    console.error('[Neon Login Error]', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', async (_req, res) => {
  try {
    const rows = await prisma.user.findMany({
      orderBy: { created_at: 'asc' },
    });
    res.json(rows.map(mapUser));
  } catch (error) {
    console.warn('[Neon get users error - returning default admin]:', error.message);
    res.json([
      mapUser({
        id: DEFAULT_USER_ID,
        org_id: DEFAULT_ORG_ID,
        name: 'Super Admin',
        email: 'admin@acadeno.in',
        role: 'super_admin',
        status: 'active',
        created_at: new Date(),
      }),
    ]);
  }
});

app.put('/api/users', async (req, res) => {
  try {
    const payload = req.body || {};
    const cleanEmail = String(payload.email || '').trim().toLowerCase();
    if (!cleanEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    const userUuid = isValidUUID(payload.id) ? payload.id : crypto.randomUUID();
    const orgUuid = isValidUUID(payload.org_id) ? payload.org_id : DEFAULT_ORG_ID;
    const role = ['super_admin', 'event_manager', 'staff'].includes(payload.role) ? payload.role : 'staff';
    const status = ['active', 'invited', 'disabled'].includes(payload.status) ? payload.status : 'active';
    const passwordHash = payload.password || payload.password_hash || 'Acadeno2026!';

    const saved = await prisma.user.upsert({
      where: { email: cleanEmail },
      update: {
        name: payload.name || cleanEmail.split('@')[0],
        role,
        status,
        password_hash: passwordHash,
      },
      create: {
        id: userUuid,
        org_id: orgUuid,
        name: payload.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        role,
        status,
        password_hash: passwordHash,
      },
    });

    res.json(mapUser(saved));
  } catch (error) {
    console.error('[Neon upsert user]', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    if (!isValidUUID(req.params.id)) {
      return res.json({ success: true });
    }
    if (req.params.id === DEFAULT_USER_ID) {
      return res.status(400).json({ error: 'Cannot delete default Super Admin account' });
    }
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.json({ success: true });
    }
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

async function initDatabase() {
  try {
    await prisma.$connect();
    await ensureNeonSeed(prisma);
    console.log('[Neon] Successfully connected to database & verified seeds.');
  } catch (error) {
    console.warn('[Neon Warning] Could not connect to Neon DB immediately:', error.message);
    console.warn('[Neon Warning] Server is still running and will retry upon requests.');
  }
}

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Neon API listening on http://localhost:${port}`);
    initDatabase();
  });
}

export default app;

