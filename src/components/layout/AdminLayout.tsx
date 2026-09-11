import React, { ReactNode, useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  BarChart3, 
  UserCog, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  activeNav?: 'dashboard' | 'events' | 'registrations' | 'analytics' | 'staff';
  pageTitle?: string;
  pageSubtitle?: string;
  headerAction?: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeNav = 'dashboard',
  pageTitle,
  pageSubtitle,
  headerAction
}) => {
  const { 
    setScreen, 
    logout,
    currentUser
  } = useEventStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, screen: '02_dashboard' as const },
    { id: 'events', label: 'Events', icon: CalendarDays, screen: '03_events_list' as const },
    { id: 'registrations', label: 'Registrations', icon: Users, screen: '11_registrations' as const },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, screen: '13_analytics' as const },
    { id: 'staff', label: 'Staff & Users', icon: UserCog, screen: '14_staff_management' as const },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col md:flex-row text-slate-900 antialiased font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#071A33] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm border-b border-[#102A4E]">
        <div 
          onClick={() => setScreen('02_dashboard')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          {/* Logo Mark */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1463FF] via-[#2563EB] to-[#38BDF8] flex items-center justify-center text-white font-extrabold shadow-xs">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M12 2L2 22h4.5l2-4.5h7l2 4.5H22L12 2zm0 6.5l2.4 5.5h-4.8L12 8.5z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-white tracking-wider leading-none">ACADENO</span>
            <span className="text-[8px] font-extrabold text-[#1463FF] tracking-widest leading-tight">EVENTLINK</span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Compact Fixed Sidebar Navigation (195-200px) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[195px] min-w-[195px] max-w-[195px] bg-[#071A33] text-white flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 border-r border-[#102A4E] shadow-xl md:shadow-none select-none ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>

        {/* Top: Logo & Navigation Links */}
        <div className="p-3.5 pt-4 relative z-10">
          
          {/* Compact White Rounded Logo Card */}
          <div 
            onClick={() => { setScreen('02_dashboard'); setIsMobileMenuOpen(false); }}
            className="bg-white rounded-xl p-2.5 mb-4 flex items-center justify-center gap-2 cursor-pointer group shadow-2xs border border-slate-100/10 hover:shadow-xs transition-all"
          >
            {/* Custom Vibrant Modern 'A' Glyph */}
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#1463FF] via-[#2B7FFF] to-[#38BDF8] flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform shrink-0">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M12 2.5L3.5 21.5h4.2l1.9-4.2h5.8l1.9 4.2h4.2L12 2.5zm-1.1 11.2l2.1-4.8 2.1 4.8h-4.2z" />
              </svg>
            </div>
            
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-black text-[#071A33] tracking-wider leading-tight uppercase font-sans">
                ACADENO
              </span>
              <span className="text-[8px] font-extrabold text-[#1463FF] tracking-widest uppercase leading-none">
                EVENTLINK
              </span>
            </div>
          </div>

          {/* Navigation Menu Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setScreen(item.screen);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#1463FF] text-white shadow-[0_3px_10px_rgba(20,99,255,0.35)] font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom Section: Compact User Profile Card, Sign Out & Company Name */}
        <div className="p-3 relative z-10 space-y-2.5 border-t border-[#102A4E]">
          
          {/* User Profile Info */}
          <div className="flex items-center gap-2.5 px-0.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs ring-1 ring-white/10">
              {currentUser?.name?.charAt(0) || 'S'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-slate-100 truncate">
                {currentUser?.name || 'Super Admin'}
              </span>
              <span className="text-[9.5px] text-slate-400 capitalize truncate font-medium">
                {currentUser?.role?.replace('_', ' ') || 'Super Admin'}
              </span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={logout}
            className="w-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5 border border-slate-700/60 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3 h-3 text-slate-400" />
            <span>Sign Out</span>
          </button>

          {/* Footer Company Subtext */}
          <div className="text-[9px] text-slate-500 px-1 text-center font-medium select-none">
            ACADENO Technologies
          </div>

        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1060px] w-full mx-auto animate-fade-in">
          {(pageTitle || headerAction) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-200/80">
              <div>
                {pageTitle && <h1 className="text-xl sm:text-2xl font-extrabold text-[#071A33] tracking-tight">{pageTitle}</h1>}
                {pageSubtitle && <p className="text-xs text-slate-500 mt-0.5 font-medium">{pageSubtitle}</p>}
              </div>
              {headerAction && <div className="shrink-0">{headerAction}</div>}
            </div>
          )}

          {children}
        </main>
      </div>

    </div>
  );
};
