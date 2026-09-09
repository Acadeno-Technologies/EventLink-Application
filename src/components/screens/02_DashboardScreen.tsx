import React from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { 
  LineChart, 
  Line, 
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
  Layers
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const { 
    events, 
    registrations, 
    currentUser, 
    setScreen, 
    startNewEventWizard
  } = useEventStore();

  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === 'active').length;
  const totalRegistrations = registrations.length;
  const thisMonthRegistrations = registrations.length;

  const chartData = [
    { day: 'Mon', registrations: 0, views: 0 },
    { day: 'Tue', registrations: 0, views: 0 },
    { day: 'Wed', registrations: 0, views: 0 },
    { day: 'Thu', registrations: 0, views: 0 },
    { day: 'Fri', registrations: 0, views: 0 },
    { day: 'Sat', registrations: 0, views: 0 },
    { day: 'Sun', registrations: 0, views: 0 },
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
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          
          {/* Left: Welcome & Title */}
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7183A3] mb-1 block">
              WELCOME BACK
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#14213D] font-sans tracking-tight leading-tight flex items-center gap-2">
              <span>Good morning, {currentUser?.name || 'Administrator'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#7183A3] font-medium mt-1">
              Here is the real-time activity and health overview across your ACADENO events.
            </p>
          </div>

          {/* Right: Date & Primary CTA */}
          <div className="flex flex-col items-start md:items-end gap-2.5 shrink-0">
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#14213D] justify-start md:justify-end">
                <Calendar className="w-3.5 h-3.5 text-[#14213D]" />
                <span>{currentDateFormatted}</span>
              </div>
              <div className="text-[11px] text-[#7183A3] font-medium mt-0.5">
                Have a productive day!
              </div>
            </div>

            <button
              onClick={startNewEventWizard}
              className="bg-[#1769FF] hover:bg-[#0055FF] text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-md shadow-blue-500/25 hover:shadow-blue-500/35 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* METRIC CARDS ROW (4 Equal-Width Cards)                                    */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Card 1: TOTAL EVENTS */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_25px_rgba(20,33,61,0.03)] border border-slate-100/90 flex items-start gap-4 transition-all hover:shadow-[0_8px_30px_rgba(20,33,61,0.06)]">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF5FF] text-[#1769FF] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7183A3]">
                TOTAL EVENTS
              </span>
              <span className="text-3xl sm:text-4xl font-black text-[#14213D] leading-tight my-0.5">
                {totalEvents}
              </span>
              <span className="text-xs text-[#7183A3] font-medium">
                Across all active programs
              </span>
            </div>
          </div>

          {/* Card 2: ACTIVE EVENTS */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_25px_rgba(20,33,61,0.03)] border border-slate-100/90 flex items-start gap-4 transition-all hover:shadow-[0_8px_30px_rgba(20,33,61,0.06)]">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F9F4] text-[#20C997] flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7183A3]">
                ACTIVE EVENTS
              </span>
              <span className="text-3xl sm:text-4xl font-black text-[#14213D] leading-tight my-0.5">
                {activeEvents}
              </span>
              <span className="text-xs text-[#7183A3] font-medium">
                Accepting registrations
              </span>
            </div>
          </div>

          {/* Card 3: REGISTRATIONS */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_25px_rgba(20,33,61,0.03)] border border-slate-100/90 flex items-start gap-4 transition-all hover:shadow-[0_8px_30px_rgba(20,33,61,0.06)]">
            <div className="w-12 h-12 rounded-2xl bg-[#F0EDFF] text-[#6C5CE7] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7183A3]">
                REGISTRATIONS
              </span>
              <span className="text-3xl sm:text-4xl font-black text-[#14213D] leading-tight my-0.5">
                {totalRegistrations}
              </span>
              <span className="text-xs text-[#7183A3] font-medium">
                Verified attendee passes
              </span>
            </div>
          </div>

          {/* Card 4: THIS MONTH */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_25px_rgba(20,33,61,0.03)] border border-slate-100/90 flex items-start gap-4 transition-all hover:shadow-[0_8px_30px_rgba(20,33,61,0.06)]">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5EB] text-[#FF9F43] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7183A3]">
                THIS MONTH
              </span>
              <span className="text-3xl sm:text-4xl font-black text-[#14213D] leading-tight my-0.5">
                {thisMonthRegistrations}
              </span>
              <span className="text-xs text-[#7183A3] font-medium">
                Current month activity
              </span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* ANALYTICS SECTION + RIGHT ACTION PANEL                                    */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left (8 Cols): 7-Day Registration Momentum Line Chart Card */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(20,33,61,0.03)] border border-slate-100/90 flex flex-col justify-between">
            
            {/* Title & Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-lg font-black text-[#14213D] font-sans">
                  7-Day Registration Momentum
                </h2>
                <p className="text-xs text-[#7183A3] font-medium mt-0.5">
                  Daily participant registrations across all active events
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#1769FF]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1769FF]" />
                  <span>Registrations</span>
                </span>
                <span className="flex items-center gap-1.5 text-[#00D2D3]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00D2D3]" />
                  <span>Page Views</span>
                </span>
              </div>
            </div>

            {/* Line Chart */}
            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#8E9EB8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: '#F1F5F9' }} 
                  />
                  <YAxis 
                    stroke="#8E9EB8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={[0, 4]} 
                    ticks={[0, 1, 2, 3, 4]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0B1B3A', 
                      borderRadius: '12px', 
                      border: 'none', 
                      color: '#ffffff', 
                      fontSize: '11px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="registrations" 
                    stroke="#1769FF" 
                    strokeWidth={3} 
                    dot={{ fill: '#1769FF', stroke: '#ffffff', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6, fill: '#1769FF', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Chart Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#7183A3] pt-4 border-t border-slate-100 gap-2 mt-4">
              <span>Aggregated query • Cached ~5 min ago</span>
              <span className="font-bold text-[#14213D]">
                Avg 32 daily registrations
              </span>
            </div>

          </div>

          {/* Right (4 Cols): Light Blue Action Panel (EventLink Wizard) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#EEF5FF] via-[#E8F1FC] to-[#DFECFB] border border-blue-100/90 rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(23,105,255,0.04)] flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Content */}
            <div>
              <div className="bg-white/80 border border-blue-200/60 text-[#1769FF] text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#1769FF]" />
                <span>EventLink Wizard</span>
              </div>

              <h3 className="text-xl font-black text-[#14213D] font-sans leading-tight">
                Create & Launch an Event
              </h3>

              <p className="text-xs text-[#526484] leading-relaxed mt-2 font-medium">
                Step-by-step wizard to set up your event with theme branding, operational settings, and scannable QR generation.
              </p>
            </div>

            {/* Middle Action Buttons */}
            <div className="space-y-2.5 my-6">
              <button
                onClick={startNewEventWizard}
                className="w-full bg-[#1769FF] hover:bg-[#0055FF] text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 text-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Launch 5-Step Wizard</span>
              </button>

              <button
                onClick={() => setScreen('03_events_list')}
                className="w-full bg-white/80 hover:bg-white text-[#14213D] border border-blue-200/80 font-bold py-2.5 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Layers className="w-4 h-4 text-[#1769FF]" />
                <span>Browse Events Catalogue</span>
              </button>
            </div>

            {/* Bottom Graphic & Handwritten Decorative Accent */}
            <div className="flex items-end justify-between pt-2">
              
              {/* Calendar Icon Graphic */}
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-blue-100 flex flex-col items-center justify-center p-2">
                  <div className="w-full h-1.5 bg-[#1769FF] rounded-full mb-1" />
                  <div className="grid grid-cols-3 gap-0.5 w-full">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-blue-100 rounded-2xs" />
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1769FF] text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs">
                  +
                </div>
              </div>

              {/* Handwritten "Events Made Simple" script */}
              <div className="text-right select-none transform -rotate-6">
                <div className="font-['Caveat'] text-2xl sm:text-3xl font-bold text-[#14213D]/80 leading-tight tracking-wide">
                  <div>Events</div>
                  <div className="pl-3">Made Simple</div>
                </div>
                <svg className="w-24 h-4 text-[#1769FF]/60 ml-auto mt-0.5" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 10 Q 50 18, 95 6" />
                </svg>
              </div>

            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
};
