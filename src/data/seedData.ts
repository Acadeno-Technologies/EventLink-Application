import { Organization, User, Event, Registration, AuditLog, ThemeTemplate } from '../types';

export const initialOrganization: Organization = {
  id: 'org-csez-001',
  name: 'ACADENO Technologies Pvt. Ltd. – CSEZ Unit',
  slug: 'acadeno',
  logo_url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
  plan: 'enterprise',
  created_at: '2026-01-15T09:00:00Z',
};

export const initialUsers: User[] = [
  {
    id: 'user-001',
    org_id: 'org-csez-001',
    name: 'Arathy',
    email: 'arathy@acadeno.in',
    password: 'Acadeno2026!',
    role: 'super_admin',
    status: 'active',
    department: 'Executive Administration',
    last_login_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'user-002',
    org_id: 'org-csez-001',
    name: 'Anu Varma',
    email: 'anu@acadeno.in',
    password: 'Acadeno2026!',
    role: 'event_manager',
    status: 'active',
    department: 'Event Operations',
    last_login_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'user-003',
    org_id: 'org-csez-001',
    name: 'Rahul K.',
    email: 'rahul@acadeno.in',
    password: 'Acadeno2026!',
    role: 'staff',
    status: 'active',
    department: 'Registration & Check-In Desk',
    last_login_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }
];

export const themePresets: Record<ThemeTemplate, any> = {
  workshop: {
    template: 'workshop',
    colors: {
      primary: '#2563EB', // Royal Blue
      secondary: '#4F46E5', // Indigo
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#0F172A',
      button: '#FF7A00', // ACADENO Brand Orange
      buttonText: '#FFFFFF',
      accent: '#06B6D4', // Cyan
    },
    typography: {
      fontFamily: 'Plus Jakarta Sans',
      headingSize: 'lg',
      bodySize: 'md',
    },
    layout: 'centered',
    buttonStyle: 'rounded',
  },
  corporate: {
    template: 'corporate',
    colors: {
      primary: '#0F172A',
      secondary: '#334155',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#0F172A',
      button: '#2563EB',
      buttonText: '#FFFFFF',
      accent: '#FF7A00',
    },
    typography: {
      fontFamily: 'Inter',
      headingSize: 'md',
      bodySize: 'md',
    },
    layout: 'centered',
    buttonStyle: 'rounded',
  },
  festival: {
    template: 'festival',
    colors: {
      primary: '#C026D3',
      secondary: '#E11D48',
      background: '#FFF1F2',
      surface: '#FFFFFF',
      text: '#4C0519',
      button: '#FF7A00',
      buttonText: '#FFFFFF',
      accent: '#F59E0B',
    },
    typography: {
      fontFamily: 'Outfit',
      headingSize: 'xl',
      bodySize: 'md',
    },
    layout: 'card',
    buttonStyle: 'pill',
  },
  minimal: {
    template: 'minimal',
    colors: {
      primary: '#18181B',
      secondary: '#52525B',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      text: '#09090B',
      button: '#18181B',
      buttonText: '#FFFFFF',
      accent: '#2563EB',
    },
    typography: {
      fontFamily: 'Plus Jakarta Sans',
      headingSize: 'md',
      bodySize: 'sm',
    },
    layout: 'minimal',
    buttonStyle: 'sharp',
  },
  conference: {
    template: 'conference',
    colors: {
      primary: '#4338CA',
      secondary: '#06B6D4',
      background: '#F1F5F9',
      surface: '#FFFFFF',
      text: '#0F172A',
      button: '#FF7A00',
      buttonText: '#FFFFFF',
      accent: '#2563EB',
    },
    typography: {
      fontFamily: 'Plus Jakarta Sans',
      headingSize: 'lg',
      bodySize: 'md',
    },
    layout: 'centered',
    buttonStyle: 'rounded',
  },
  education: {
    template: 'education',
    colors: {
      primary: '#047857',
      secondary: '#0284C7',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      text: '#064E3B',
      button: '#059669',
      buttonText: '#FFFFFF',
      accent: '#FF7A00',
    },
    typography: {
      fontFamily: 'Inter',
      headingSize: 'md',
      bodySize: 'md',
    },
    layout: 'centered',
    buttonStyle: 'rounded',
  },
  custom: {
    template: 'custom',
    colors: {
      primary: '#2563EB',
      secondary: '#FF7A00',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F8FAFC',
      button: '#FF7A00',
      buttonText: '#FFFFFF',
      accent: '#06B6D4',
    },
    typography: {
      fontFamily: 'Outfit',
      headingSize: 'lg',
      bodySize: 'md',
    },
    layout: 'card',
    buttonStyle: 'gradient',
  }
};

// Clean fresh database state with 0 initial events and 0 initial registrations
export const initialEvents: Event[] = [];

export const initialRegistrations: Registration[] = [];

export const initialAuditLogs: AuditLog[] = [];
