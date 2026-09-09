import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { exportRegistrationsToExcel } from '../../utils/exportUtils';
import { 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Clock, 
  PieChart, 
  ExternalLink, 
  QrCode, 
  Edit3, 
  FileSpreadsheet, 
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Share2,
  XCircle,
  Sparkles
} from 'lucide-react';

export const EventOverviewScreen: React.FC = () => {
  const { 
    selectedEvent, 
    eventRegistrations, 
    setScreen, 
    startNewEventWizard,
    editExistingEventInWizard,
    updateEvent,
    showToast 
  } = useEventStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'form' | 'theme' | 'analytics'>('overview');

  if (!selectedEvent) {
    return (
      <AdminLayout
        activeNav="events"
        pageTitle="Event Overview"
        pageSubtitle="No event currently selected."
      >
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100 shadow-2xs">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 font-display">No Event Selected</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
            Your database is ready. Choose an event from the events list or create a new event using the 5-step wizard.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setScreen('03_events_list')}
              className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Browse Events
            </button>
            <button
              onClick={startNewEventWizard}
              className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              Create New Event
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const evt = selectedEvent;
  const total = eventRegistrations.length;
  const confirmed = eventRegistrations.filter(r => r.status === 'confirmed').length;
  const pending = eventRegistrations.filter(r => r.status === 'pending').length;
  const maxCap = evt.settings?.max_registrations || 100;
  const capacityPct = maxCap > 0 ? Math.min(100, Math.round((total / maxCap) * 100)) : 0;

  const handleToggleCloseEvent = () => {
    const newStatus = evt.status === 'closed' ? 'active' : 'closed';
    updateEvent(evt.id, { status: newStatus });
    showToast(newStatus === 'closed' ? `Registrations closed for "${evt.name}"` : `Registrations reopened for "${evt.name}"`);
  };

  const handleExportExcel = () => {
    if (selectedEvent) {
      exportRegistrationsToExcel(selectedEvent, eventRegistrations);
      showToast('Exported registrations to Excel (.xlsx)');
    }
  };

  return (
    <AdminLayout
      activeNav="events"
      pageTitle={evt.name}
      pageSubtitle={`${evt.venue || 'Virtual'} • ${evt.start_date} (${evt.start_time || '10:00 AM'})`}
      headerAction={
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Badge */}
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
            evt.status === 'active' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : evt.status === 'closed'
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}>
            {evt.status === 'active' ? '● Live' : evt.status === 'closed' ? '● Closed' : '● Draft'}
          </span>

          {/* Close / Reopen Event Button */}
          <button
            onClick={handleToggleCloseEvent}
            className={`h-9 px-3 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border cursor-pointer ${
              evt.status === 'closed'
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300'
            }`}
          >
            {evt.status === 'closed' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Reopen Event</span>
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Close Event</span>
              </>
            )}
          </button>

          <button
            onClick={() => setScreen('15_public_registration')}
            className="h-9 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Registration</span>
          </button>
          
          <button
            onClick={() => setScreen('09_publish_confirm')}
            className="h-9 px-3.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-600" />
            <span>View QR Pass</span>
          </button>
        </div>
      }
    >

      {/* Subnavigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-1.5 shadow-xs mb-6 flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', screen: '10_event_overview' as const },
          { id: 'registrations', label: `Registrations (${total})`, screen: '11_registrations' as const },
          { id: 'analytics', label: 'Analytics & Sources', screen: '13_analytics' as const },
          { id: 'form', label: 'Form Schema', action: () => editExistingEventInWizard(evt.id, 2) },
          { id: 'theme', label: 'Theme & Branding', action: () => editExistingEventInWizard(evt.id, 3) },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.action) {
                tab.action();
              } else if (tab.screen) {
                setScreen(tab.screen);
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Headline Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Registrations</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-display">{total}</div>
          <p className="text-[11px] text-slate-400 mt-1">Real-time attendee submissions</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Confirmed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-display">{confirmed}</div>
          <p className="text-[11px] text-slate-400 mt-1">Verified with tickets issued</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Pending</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-display">{pending}</div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting verification</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Capacity Fill</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-display">{capacityPct}%</div>
          <p className="text-[11px] text-slate-400 mt-1">{total} of {maxCap} seats claimed</p>
        </div>

      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Event Lifecycle & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Event Configuration & Details</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Core settings, form schema and public endpoint</p>
              </div>
              <button
                onClick={() => editExistingEventInWizard(evt.id, 1)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit in Wizard</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Public Event URL</span>
                <div className="font-mono text-blue-600 font-bold break-all">
                  acadeno.com/e/{evt.slug}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Lifecycle Status</span>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 capitalize text-[11px]">
                    {evt.status}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Venue & Timing</span>
                <div className="font-semibold text-slate-800">
                  {evt.venue} • {evt.start_date} ({evt.start_time || '10:00 AM'})
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Dynamic Form Fields</span>
                <div className="font-semibold text-slate-800">
                  {evt.form_schema?.length || 0} form questions configured
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setScreen('11_registrations')}
                className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>View Registrations Table</span>
              </button>

              <button
                onClick={handleExportExcel}
                className="h-10 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export to Excel (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Quick Check-in Stats */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Check-in & Capacity Utilization</h3>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                style={{ width: `${capacityPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Capacity claimed: <strong>{total} of {maxCap}</strong></span>
              <span className="text-emerald-600 font-bold">{Math.max(0, maxCap - total)} seats remaining</span>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Quick QR & Share Widget */}
        <div className="bg-gradient-to-br from-[#0B172B] to-[#1E293B] rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between space-y-4 border border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <QrCode className="w-4 h-4" />
              Direct Entry Pass QR
            </div>
            <h4 className="text-base font-bold text-white mb-1.5 font-display">Participant QR Pass</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Display at registration desk or print out posters to drive walk-in scans.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl text-center shadow-inner">
            <div className="text-xs text-slate-800 font-bold mb-2">Scan to Register</div>
            <div className="w-36 h-36 mx-auto bg-slate-50 rounded-xl flex items-center justify-center p-2 border border-slate-200">
              <QrCode className="w-32 h-32 text-slate-900" />
            </div>
            <div className="text-[10px] text-slate-500 mt-2 font-mono">acadeno.com/e/{evt.slug}</div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setScreen('09_publish_confirm')}
              className="w-full h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors text-center shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Share & Download Assets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

