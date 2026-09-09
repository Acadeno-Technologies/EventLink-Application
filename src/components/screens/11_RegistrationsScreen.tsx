import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { Registration, RegistrationStatus, AttendanceStatus } from '../../types';
import { exportRegistrationsToExcel, exportRegistrationsToCsv } from '../../utils/exportUtils';
import { 
  Search, 
  Filter, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  Trash2, 
  UserCheck, 
  UserX, 
  Plus, 
  ArrowUpDown,
  Smartphone,
  Mail,
  ChevronRight
} from 'lucide-react';

export const RegistrationsScreen: React.FC = () => {
  const { 
    selectedEvent, 
    eventRegistrations, 
    setSelectedRegistrationId, 
    setScreen, 
    updateRegistration, 
    deleteRegistration,
    showToast 
  } = useEventStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RegistrationStatus>('all');
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | AttendanceStatus>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = eventRegistrations.filter((reg) => {
    const matchesSearch = 
      reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.phone.includes(searchQuery) ||
      reg.registration_code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    const matchesAttendance = attendanceFilter === 'all' || reg.attendance_status === attendanceFilter;

    return matchesSearch && matchesStatus && matchesAttendance;
  });

  const getPhoneDisplay = (reg: Registration) => {
    if (reg.phone && reg.phone !== '+91 9846000000' && reg.phone !== '+91 98460 00000' && reg.phone !== '—' && reg.phone !== '-') {
      return reg.phone;
    }
    if (reg.responses) {
      // 1. Check form schema fields by type or label
      if (selectedEvent?.form_schema) {
        for (const field of selectedEvent.form_schema) {
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

      // 2. Check response keys containing phone keywords
      for (const [key, val] of Object.entries(reg.responses)) {
        if (/(phone|mobile|contact|whatsapp|tel|cell)/i.test(key) && val) {
          const clean = String(val).replace(/[^\d+]/g, '');
          if (clean.length >= 5) {
            return clean.startsWith('+') ? clean : `+91 ${clean}`;
          }
        }
      }

      // 3. Fallback: Any response value with 7 to 15 digits
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
  };

  const handleRowClick = (reg: Registration) => {
    setSelectedRegistrationId(reg.id);
    setScreen('12_registration_detail');
  };

  const handleToggleAttendance = (reg: Registration, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus: AttendanceStatus = reg.attendance_status === 'present' ? 'absent' : 'present';
    updateRegistration(reg.id, { attendance_status: newStatus });
  };

  const handleExportExcel = () => {
    if (selectedEvent) {
      exportRegistrationsToExcel(selectedEvent, filtered);
      showToast(`Exported ${filtered.length} registrations to Excel (.xlsx)`);
    }
  };

  const handleExportCsv = () => {
    if (selectedEvent) {
      exportRegistrationsToCsv(selectedEvent, filtered);
      showToast(`Exported ${filtered.length} registrations to CSV`);
    }
  };

  return (
    <AdminLayout
      activeNav="registrations"
      pageTitle={`Registrations — ${selectedEvent?.name || 'Event'}`}
      pageSubtitle={`Total ${eventRegistrations.length} submissions • Manage check-ins, verify tickets, and export records.`}
      headerAction={
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export to Excel</span>
          </button>
        </div>
      }
    >

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, code (AAW-2026)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <span className="text-slate-400 px-1 text-[11px] font-semibold">Status:</span>
            {(['all', 'confirmed', 'pending', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded capitalize font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <span className="text-slate-400 px-1 text-[11px] font-semibold">Door:</span>
            {(['all', 'present', 'absent'] as const).map((att) => (
              <button
                key={att}
                onClick={() => setAttendanceFilter(att as any)}
                className={`px-2 py-0.5 rounded capitalize font-medium transition-all ${
                  attendanceFilter === att
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {att}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Participant Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Check-In / Door</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((reg) => {
                return (
                  <tr 
                    key={reg.id}
                    onClick={() => handleRowClick(reg)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Ticket ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 whitespace-nowrap">
                      {reg.registration_code}
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {reg.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {reg.responses?.f_track || reg.responses?.f_dept || 'General Attendee'}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{reg.email}</div>
                      <div className="text-[11px] text-slate-400 font-mono font-medium">{getPhoneDisplay(reg)}</div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(reg.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                        reg.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : reg.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {reg.status === 'confirmed' && <CheckCircle2 className="w-3 h-3" />}
                        {reg.status === 'pending' && <Clock className="w-3 h-3" />}
                        {reg.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                        <span>{reg.status}</span>
                      </span>
                    </td>

                    {/* Attendance Check-in Toggle */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => handleToggleAttendance(reg, e)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                          reg.attendance_status === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                        title="Click to toggle check-in at the entrance"
                      >
                        {reg.attendance_status === 'present' ? (
                          <>
                            <UserCheck className="w-3 h-3" />
                            <span>Present</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3 text-slate-400" />
                            <span>Mark In</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Source Channel */}
                    <td className="py-3.5 px-4 text-slate-500 uppercase text-[10px] font-semibold whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {reg.source || 'direct'}
                      </span>
                    </td>

                    {/* Action Arrow */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 text-slate-400 group-hover:text-indigo-600">
                        <span className="text-[11px] font-semibold">View</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-700">No registrations found in database</p>
              <p className="text-slate-400 mt-1">
                {eventRegistrations.length === 0 
                  ? 'No attendees have registered yet. Share your event link to collect responses.' 
                  : 'Try adjusting your search terms or filters'}
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
