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
            className="h-9 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export to Excel</span>
          </button>
        </div>
      }
    >

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, code (AAW-2026)..."
            className="w-full h-10 pl-10 pr-4 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <span className="text-slate-400 px-2 text-[10px] font-bold uppercase tracking-wider">Status:</span>
            {(['all', 'confirmed', 'pending', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg capitalize font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <span className="text-slate-400 px-2 text-[10px] font-bold uppercase tracking-wider">Door:</span>
            {(['all', 'present', 'absent'] as const).map((att) => (
              <button
                key={att}
                onClick={() => setAttendanceFilter(att as any)}
                className={`px-2.5 py-1 rounded-lg capitalize font-bold transition-all cursor-pointer ${
                  attendanceFilter === att
                    ? 'bg-white text-emerald-700 shadow-xs'
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
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Ticket ID</th>
                <th className="py-3.5 px-4 font-bold">Participant Name</th>
                <th className="py-3.5 px-4 font-bold">Contact Info</th>
                <th className="py-3.5 px-4 font-bold">Submission Date</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Check-In / Door</th>
                <th className="py-3.5 px-4 font-bold">Source</th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
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
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                      {reg.registration_code}
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {reg.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {reg.responses?.f_track || reg.responses?.f_dept || 'General Attendee'}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-medium">{reg.email}</div>
                      <div className="text-[11px] text-slate-400 font-mono font-medium">{getPhoneDisplay(reg)}</div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-medium">
                      {new Date(reg.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
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
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          reg.attendance_status === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                        title="Click to toggle check-in at entrance desk"
                      >
                        {reg.attendance_status === 'present' ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-3.5 h-3.5 text-slate-400" />
                            <span>Mark In</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Source Channel */}
                    <td className="py-3.5 px-4 text-slate-500 uppercase text-[10px] font-bold whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80">
                        {reg.source || 'direct'}
                      </span>
                    </td>

                    {/* Action Arrow */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 text-slate-400 group-hover:text-blue-600 transition-colors">
                        <span className="text-[11px] font-bold">Details</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400 text-xs">
              <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-700 text-sm">No registrations found in database</p>
              <p className="text-slate-400 mt-1 max-w-sm mx-auto">
                {eventRegistrations.length === 0 
                  ? 'No attendees have registered yet. Share your event link or QR code to collect responses.' 
                  : 'No entries match your search query or filter selection.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

