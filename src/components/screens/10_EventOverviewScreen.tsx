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
  XCircle
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
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100 shadow-2xs">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 font-display">No Event Selected</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Your database is ready. Choose an event from the events list or create a new event using the 5-step wizard.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setScreen('03_events_list')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Browse Events
            </button>
            <button
              onClick={startNewEventWizard}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
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
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
            evt.status === 'active' 
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
              : evt.status === 'closed'
              ? 'bg-rose-100 text-rose-700 border border-rose-200'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {evt.status === 'active' ? '● Live' : evt.status === 'closed' ? '● Closed' : '● Draft'}
          </span>

          {/* Close / Reopen Event Button */}
          <button
            onClick={handleToggleCloseEvent}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border cursor-pointer ${
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
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Registration Page</span>
          </button>
          
          <button
            onClick={() => setScreen('09_publish_confirm')}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-indigo-600" />
            <span>View QR</span>
          </button>
        </div>
      }
    >

      {/* Subnavigation Tabs */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-2 shadow-sm mb-6 flex items-center gap-1.5 overflow-x-auto">
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
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Headline Metric Cards (from spec) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Registrations</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-display">{total}</div>
          <p className="text-[11px] text-slate-400 mt-1">Real-time attendee submissions</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-display">{confirmed}</div>
          <p className="text-[11px] text-slate-400 mt-1">Verified with tickets issued</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-display">{pending}</div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting review or payment</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Capacity Fill</span>
            <PieChart className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-display">{capacityPct}%</div>
          <p className="text-[11px] text-slate-400 mt-1">{total} of {maxCap} seats claimed</p>
        </div>

      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Event Lifecycle & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Event Configuration & Details</h3>
              <button
                onClick={() => editExistingEventInWizard(evt.id, 1)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Event Wizard</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Public Event URL</span>
                <div className="font-mono text-indigo-600 font-bold break-all">
                  acadeno.com/e/{evt.slug}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Lifecycle Status</span>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 capitalize">
                    {evt.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Venue & Timing</span>
                <div className="font-semibold text-slate-800">
                  {evt.venue} • {evt.start_date} ({evt.start_time})
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Dynamic Questions</span>
                <div className="font-semibold text-slate-800">
                  {evt.form_schema?.length || 0} form fields active
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setScreen('11_registrations')}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>View All Registrations Table</span>
              </button>

              <button
                onClick={handleExportExcel}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export to Excel (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Quick Check-in Stats */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Check-in & Attendance Readiness</h3>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                style={{ width: `${capacityPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Capacity utilization: <strong>{total} of {maxCap}</strong></span>
              <span className="text-emerald-600 font-semibold">{maxCap - total} seats remaining</span>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Quick QR & Share Widget */}
        <div className="bg-slate-900 rounded-xl p-6 text-white shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
              <QrCode className="w-4 h-4" />
              Direct Entry Pass QR
            </div>
            <h4 className="text-base font-bold text-white mb-2">Participant QR Pass</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Display at the registration desk or print out posters to drive walk-in scans.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl text-center">
            <div className="text-xs text-slate-800 font-bold mb-2">Scan to Register</div>
            <div className="w-36 h-36 mx-auto bg-slate-100 rounded-lg flex items-center justify-center p-2 border border-slate-200">
              <QrCode className="w-32 h-32 text-slate-900" />
            </div>
            <div className="text-[10px] text-slate-500 mt-2 font-mono">acadeno.com/e/{evt.slug}</div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setScreen('09_publish_confirm')}
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors text-center"
            >
              Share & Download Assets
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
