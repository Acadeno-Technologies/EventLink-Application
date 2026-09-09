import * as XLSX from 'xlsx';
import { Registration, Event } from '../types';

function getPhone(reg: Registration, event?: Event) {
  if (reg.phone && reg.phone !== '+91 9846000000' && reg.phone !== '+91 98460 00000' && reg.phone !== '—' && reg.phone !== '-') {
    return reg.phone;
  }
  if (reg.responses) {
    if (event?.form_schema) {
      for (const field of event.form_schema) {
        if (field.type === 'phone' || /(phone|mobile|contact|whatsapp)/i.test(field.label || '')) {
          const val = reg.responses[field.id];
          if (val) {
            const clean = String(val).replace(/[^\d+]/g, '');
            if (clean.length >= 5) {
              return clean.startsWith('+') ? clean : `+91 ${clean}`;
            }
          }
        }
      }
    }
    for (const [key, val] of Object.entries(reg.responses)) {
      if (/(phone|mobile|contact|whatsapp|tel|cell)/i.test(key) && val) {
        const clean = String(val).replace(/[^\d+]/g, '');
        if (clean.length >= 5) {
          return clean.startsWith('+') ? clean : `+91 ${clean}`;
        }
      }
    }
    for (const [, val] of Object.entries(reg.responses)) {
      if (typeof val === 'string' || typeof val === 'number') {
        const clean = String(val).replace(/\D/g, '');
        if (clean.length >= 7 && clean.length <= 15) {
          return `+91 ${clean}`;
        }
      }
    }
  }
  return (reg.phone && reg.phone !== '+91 9846000000' && reg.phone !== '+91 98460 00000') ? reg.phone : '—';
}

export function exportRegistrationsToExcel(event: Event, registrations: Registration[], filenamePrefix?: string) {
  // Flatten dynamic responses for each registration
  const data = registrations.map((reg, index) => {
    const row: Record<string, any> = {
      'Sl No': index + 1,
      'Registration Code': reg.registration_code,
      'Full Name': reg.name,
      'Email Address': reg.email,
      'Phone Number': getPhone(reg, event),
      'Status': reg.status.toUpperCase(),
      'Attendance': reg.attendance_status.replace('_', ' ').toUpperCase(),
      'Payment Status': reg.payment_status.replace('_', ' ').toUpperCase(),
      'Source Channel': reg.source,
      'Submission Timestamp': new Date(reg.submitted_at).toLocaleString(),
      'IP Address': reg.ip_address || 'N/A',
    };

    // Add dynamic form field values
    if (event.form_schema) {
      event.form_schema.forEach(field => {
        const val = reg.responses ? reg.responses[field.id] : undefined;
        row[`Form: ${field.label}`] = Array.isArray(val) ? val.join(', ') : (val !== undefined ? val : '');
      });
    }

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

  // Auto-size columns based on header length
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(key.length, 14) + 2
  }));
  worksheet['!cols'] = colWidths;

  const fname = `${filenamePrefix || event.slug}-registrations-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fname);
}

export function exportRegistrationsToCsv(event: Event, registrations: Registration[]) {
  const data = registrations.map((reg, index) => {
    const row: Record<string, any> = {
      'Sl No': index + 1,
      'Registration Code': reg.registration_code,
      'Full Name': reg.name,
      'Email': reg.email,
      'Phone': getPhone(reg, event),
      'Status': reg.status,
      'Attendance': reg.attendance_status,
      'Source': reg.source,
      'Submitted At': reg.submitted_at,
    };

    if (event.form_schema) {
      event.form_schema.forEach(field => {
        const val = reg.responses ? reg.responses[field.id] : '';
        row[field.label] = Array.isArray(val) ? val.join('; ') : val;
      });
    }

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${event.slug}-registrations.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
