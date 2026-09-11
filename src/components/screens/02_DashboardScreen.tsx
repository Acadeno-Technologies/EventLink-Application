import React from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { 
  Calendar, 
  Activity, 
  Users, 
  TrendingUp, 
  Plus, 
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  QrCode
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const { 
    events, 
    registrations, 
    currentUser, 
    setScreen, 
    setSelectedEventId,
    startNewEventWizard
  } = useEventStore();

  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === 'active').length;
  const totalRegistrations = registrations.length;
  const thisMonthRegistrations = registrations.length;

  const chartData = [
    { day: 'Mon', registrations: Math.min(totalRegistrations, 2), views: 12 },
    { day: 'Tue', registrations: Math.min(totalRegistrations, 5), views: 24 },
    { day: 'Wed', registrations: Math.min(totalRegistrations, 3), views: 18 },
    { day: 'Thu', registrations: Math.min(totalRegistrations, 8), views: 35 },
    { day: 'Fri', registrations: Math.min(totalRegistrations, 6), views: 28 },
    { day: 'Sat', registrations: Math.min(totalRegistrations, 12), views: 45 },
    { day: 'Sun', registrations: Math.max(1, totalRegistrations), views: 50 },
  ];

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <AdminLayout activeNav="dashboard">
      <div className="space-y-6 sm:space-y-8">
        
        {/* ========================================================================= */}
        {/* HEADER SECTION                                                            */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
              PLATFORM OVERVIEW
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Good morning, {currentUser?.name || 'Administrator'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Real-time activity and health overview across your ACADENO events.
            </p>
          </div>

          {/* Right: Date & Primary CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex flex-col items-end text-right pr-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentDateFormatted}</span>
              </div>
              <span className="text-[11px] text-slate-400">All systems active</span>
            </div>

            <button
              onClick={startNewEventWizard}
              className="bg-[#1463FF] hover:bg-[#0E4ED8] text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-[0_4px_14px_rgba(20,99,255,0.3)] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* METRIC CARDS ROW (4 Equal-Width Cards)                                    */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: TOTAL EVENTS */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(7,26,51,0.04)] border border-[#DCE5F0] flex items-start gap-3.5 hover:border-blue-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1463FF] flex items-center justify-center shrink-0 border border-blue-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
                Total Events
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#071A33] leading-tight my-0.5">
                {totalEvents}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Published & drafts
              </span>
            </div>
          </div>

          {/* Card 2: ACTIVE EVENTS */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(7,26,51,0.04)] border border-[#DCE5F0] flex items-start gap-3.5 hover:border-emerald-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
                Active Events
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#071A33] leading-tight my-0.5">
                {activeEvents}
              </span>
              <span className="text-xs text-emerald-600 font-bold">
                Accepting registrations
              </span>
            </div>
          </div>

          {/* Card 3: REGISTRATIONS */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(7,26,51,0.04)] border border-[#DCE5F0] flex items-start gap-3.5 hover:border-indigo-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
                Total Attendees
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#071A33] leading-tight my-0.5">
                {totalRegistrations}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Issued QR ticket passes
              </span>
            </div>
          </div>

          {/* Card 4: THIS MONTH */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(7,26,51,0.04)] border border-[#DCE5F0] flex items-start gap-3.5 hover:border-amber-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
                Conversion Rate
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#071A33] leading-tight my-0.5">
                {totalRegistrations > 0 ? '94%' : '0%'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                View to register ratio
              </span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* ANALYTICS SECTION + RIGHT ACTION PANEL                                    */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left (8 Cols): 7-Day Registration Momentum Line Chart Card */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(7,26,51,0.04)] border border-[#DCE5F0] flex flex-col justify-between">
            
            {/* Title & Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#071A33] tracking-tight">
                  7-Day Registration Velocity
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Daily attendee registrations across all active events
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#1463FF]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1463FF]" />
                  <span>Registrations</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span>Page Views</span>
                </span>
              </div>
            </div>

            {/* Area / Line Chart */}
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1463FF" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1463FF" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#94A3B8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: '#F1F5F9' }} 
                  />
                  <YAxis 
                    stroke="#94A3B8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#071A33', 
                      borderRadius: '12px', 
                      border: '1px solid #102A4E', 
                      color: '#ffffff', 
                      fontSize: '11px',
                      boxShadow: '0 8px 24px rgba(7,26,51,0.2)' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="registrations" 
                    stroke="#1463FF" 
                    strokeWidth={2.5} 
                    fillOpacity={1}
                    fill="url(#regGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Chart Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100 gap-2 mt-4">
              <span>Aggregated across organization • Updated live</span>
              <button 
                onClick={() => setScreen('13_analytics')}
                className="font-bold text-[#1463FF] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View In-Depth Analytics</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

          {/* Right (4 Cols): Action Card */}
          <div className="lg:col-span-4 bg-[#071A33] text-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(7,26,51,0.15)] border border-[#102A4E] flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Content */}
            <div>
              <div className="bg-white/10 text-blue-300 text-[11px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 mb-3 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Actions</span>
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Launch a New Event
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mt-2 font-medium">
                Use our 5-step wizard to create custom registration forms, brand theme styling, and generate scannable QR ticket passes.
              </p>
            </div>

            {/* Middle Action Buttons */}
            <div className="space-y-2.5 my-6">
              <button
                onClick={startNewEventWizard}
                className="w-full bg-[#1463FF] hover:bg-[#0E4ED8] text-white font-bold py-2.5 px-4 rounded-xl shadow-[0_4px_14px_rgba(20,99,255,0.35)] flex items-center justify-center gap-2 text-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Launch 5-Step Wizard</span>
              </button>

              <button
                onClick={() => setScreen('03_events_list')}
                className="w-full bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 font-bold py-2.5 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#1463FF]" />
                <span>Browse Events Catalogue</span>
              </button>
            </div>

            {/* Recent Event Quick Link */}
            {events.length > 0 && (
              <div className="pt-3 border-t border-[#102A4E] flex items-center justify-between text-xs">
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Latest Event</span>
                  <span className="text-xs font-semibold text-slate-200 truncate">{events[0].name}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedEventId(events[0].id);
                    setScreen('10_event_overview');
                  }}
                  className="text-[#1463FF] hover:underline font-bold shrink-0 cursor-pointer"
                >
                  Manage
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

