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
app.use(express.json({ limit: '2mb' }));

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
    banner_url: row.banner_url || '',
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
  return {
    id: row.id,
    event_id: row.event_id,
    registration_code: row.registration_code,
    name: resp.name || resp.f_name || resp.fullName || 'Attendee',
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
    password: row.password_hash || 'Acadeno2026!',
    role: row.role || 'staff',
    status: row.status || 'active',
    department: row.role === 'super_admin' ? 'Executive Administration' : 'Operations',
    last_login_at: toIso(row.last_login_at),
    created_at: toIso(row.created_at),
  };
}

async function upsertEvent(event) {
  const eventUuid = isValidUUID(event.id) ? event.id : crypto.randomUUID();
  const orgUuid = isValidUUID(event.org_id) ? event.org_id : DEFAULT_ORG_ID;
  const userUuid = isValidUUID(event.created_by) ? event.created_by : DEFAULT_USER_ID;
  const rawSlug =
    event.slug ||
    (event.name ? String(event.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `event-${Date.now()}`);
  const slug = await uniqueEventSlug(orgUuid, rawSlug, eventUuid);
  const status = mapEventStatus(event.status);

  const saved = await prisma.event.upsert({
    where: { id: eventUuid },
    update: {
      org_id: orgUuid,
      name: event.name || 'Untitled Event',
      slug,
      short_description: event.short_description || '',
      banner_url: event.banner_url || null,
      venue: event.venue || 'Virtual / Online',
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
      banner_url: event.banner_url || null,
      venue: event.venue || 'Virtual / Online',
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

  if (event.theme) {
    await prisma.eventTheme.upsert({
      where: { event_id: eventUuid },
      update: {
        template: event.theme.template || 'workshop',
        colors: event.theme.colors || {},
        typography: event.theme.typography || {},
        layout: event.theme.layout || 'centered',
        logo_url: event.theme.logo_url || null,
        banner_url: event.theme.banner_url || null,
      },
      create: {
        event_id: eventUuid,
        template: event.theme.template || 'workshop',
        colors: event.theme.colors || {},
        typography: event.theme.typography || {},
        layout: event.theme.layout || 'centered',
        logo_url: event.theme.logo_url || null,
        banner_url: event.theme.banner_url || null,
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
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('/api/events', async (_req, res) => {
  try {
    const rows = await prisma.event.findMany({
      include: { form: true, theme: true },
      orderBy: { created_at: 'desc' },
    });
    res.json(rows.map(mapEvent));
  } catch (error) {
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
      orderBy: { submitted_at: 'desc' },
    });
    res.json(rows.map(mapRegistration));
  } catch (error) {
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

    const regUuid = isValidUUID(payload.id) ? payload.id : crypto.randomUUID();
    const registrationCode = payload.registration_code || `EVT-${Date.now()}`;
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
    const user = await prisma.user.findFirst({
      where: {
        email: { equals: cleanEmail, mode: 'insensitive' },
      },
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials. Access is restricted to authorized administrators and assigned staff.' 
      });
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

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    res.json({ ok: true, user: mapUser(updated) });
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
    res.status(500).json({ error: error.message });
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

async function start() {
  await prisma.$connect();
  await ensureNeonSeed(prisma);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Neon API listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start Neon API:', error);
  process.exit(1);
});
