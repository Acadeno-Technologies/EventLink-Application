export type UserRole = 'super_admin' | 'event_manager' | 'staff';
export type UserStatus = 'active' | 'invited' | 'disabled';
export type EventStatus = 'draft' | 'active' | 'closed' | 'archived';
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'not_required' | 'pending' | 'paid' | 'failed';
export type AttendanceStatus = 'not_marked' | 'present' | 'absent';
export type ThemeTemplate = 'corporate' | 'minimal' | 'festival' | 'workshop' | 'conference' | 'education' | 'custom';
export type ThemeLayout = 'centered' | 'full_width' | 'card' | 'minimal';

export type ScreenId =
  | '01_login'
  | '02_dashboard'
  | '03_events_list'
  | '04_create_basic'
  | '05_create_form'
  | '06_create_theme'
  | '07_create_settings'
  | '08_create_preview'
  | '09_publish_confirm'
  | '10_event_overview'
  | '11_registrations'
  | '12_registration_detail'
  | '13_analytics'
  | '14_staff_management'
  | '15_public_registration'
  | '16_registration_success'
  | '17_registration_closed';

export interface User {
  id: string;
  org_id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  password?: string;
  avatar_url?: string;
  department?: string;
  last_login_at?: string;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  custom_domain?: string;
  plan: 'trial' | 'standard' | 'enterprise';
  created_at: string;
}

export interface FormFieldValidation {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  accept?: string;
}

export interface FormField {
  id: string;
  type:
    | 'text'
    | 'email'
    | 'phone'
    | 'number'
    | 'date'
    | 'time'
    | 'dropdown'
    | 'radio'
    | 'checkbox'
    | 'textarea'
    | 'file'
    | 'image'
    | 'address'
    | 'country'
    | 'state'
    | 'hidden';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: FormFieldValidation;
  options?: string[];
  allowOther?: boolean;
  section?: string;
  helpText?: string;
  order: number;
}

export interface EventThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  button: string;
  buttonText: string;
  accent: string;
}

export interface EventThemeTypography {
  fontFamily: string;
  headingSize: 'sm' | 'md' | 'lg' | 'xl';
  bodySize: 'sm' | 'md' | 'lg';
}

export interface EventTheme {
  template: ThemeTemplate;
  colors: EventThemeColors;
  typography: EventThemeTypography;
  layout: ThemeLayout;
  buttonStyle: 'rounded' | 'pill' | 'sharp' | 'gradient';
  logo_url?: string;
  banner_url?: string;
  favicon_url?: string;
}

export interface EventSettings {
  registration_opens_at?: string;
  registration_closes_at?: string;
  max_registrations?: number | null;
  require_payment: boolean;
  payment_amount?: number;
  after_registration: 'ticket' | 'redirect';
  redirect_url?: string;
  send_email_confirmation: boolean;
  send_whatsapp_confirmation: boolean;
  send_sms_confirmation: boolean;
  allow_excel_export: boolean;
  require_consent: boolean;
  consent_text: string;
}

export interface Event {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  short_description: string;
  banner_url?: string;
  venue?: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  status: EventStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  form_schema: FormField[];
  theme: EventTheme;
  settings: EventSettings;
  views_count: number;
}

export interface Registration {
  id: string;
  event_id: string;
  registration_code: string;
  name: string;
  email: string;
  phone: string;
  responses: Record<string, any>;
  status: RegistrationStatus;
  payment_status: PaymentStatus;
  attendance_status: AttendanceStatus;
  source: string; // e.g. 'whatsapp', 'direct', 'qr_scan', 'social'
  ip_address?: string;
  submitted_at: string;
}

export interface AuditLog {
  id: string;
  org_id: string;
  user_id: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata?: Record<string, any>;
  created_at: string;
}
