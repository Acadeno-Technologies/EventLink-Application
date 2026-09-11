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
      <div className="md:hidden bg-[#071A33] text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-sm border-b border-[#102A4E]">
        <div 
          onClick={() => setScreen('02_dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          {/* Logo Mark */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1463FF] via-[#2563EB] to-[#38BDF8] flex items-center justify-center text-white font-extrabold shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
              <path d="M12 2L2 22h4.5l2-4.5h7l2 4.5H22L12 2zm0 6.5l2.4 5.5h-4.8L12 8.5z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-white tracking-wider leading-none">ACADENO</span>
            <span className="text-[9px] font-extrabold text-[#1463FF] tracking-widest leading-tight">EVENTLINK</span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[210px] sm:w-[220px] min-w-[210px] sm:min-w-[220px] bg-[#071A33] text-white flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 border-r border-[#102A4E] shadow-xl md:shadow-none ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>

        {/* Top: Logo & Navigation Links */}
        <div className="p-4 sm:p-5 relative z-10">
          
          {/* ACADENO EVENTLINK Brand Logo in White Rounded Container Box */}
          <div 
            onClick={() => { setScreen('02_dashboard'); setIsMobileMenuOpen(false); }}
            className="bg-white rounded-2xl p-3 mb-6 flex items-center justify-center gap-2.5 cursor-pointer group shadow-sm select-none border border-slate-100/10 hover:shadow-md transition-all"
          >
            {/* Custom Vibrant Modern 'A' Glyph */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1463FF] via-[#2B7FFF] to-[#38BDF8] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current">
                <path d="M12 2.5L3.5 21.5h4.2l1.9-4.2h5.8l1.9 4.2h4.2L12 2.5zm-1.1 11.2l2.1-4.8 2.1 4.8h-4.2z" />
              </svg>
            </div>
            
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-[#071A33] tracking-wider leading-tight uppercase font-sans">
                ACADENO
              </span>
              <span className="text-[9px] font-extrabold text-[#1463FF] tracking-widest uppercase leading-none">
                EVENTLINK
              </span>
            </div>
          </div>

          {/* Navigation Menu Items */}
          <nav className="space-y-1.5">
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#1463FF] text-white shadow-[0_4px_12px_rgba(20,99,255,0.35)] font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom Section: User Profile Card, Sign Out & Company Name */}
        <div className="p-4 relative z-10 space-y-3.5 border-t border-[#102A4E]">
          
          {/* User Profile Info */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ring-2 ring-white/10">
              {currentUser?.name?.charAt(0) || 'S'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-100 truncate">
                {currentUser?.name || 'Super Admin'}
              </span>
              <span className="text-[11px] text-slate-400 capitalize truncate font-medium">
                {currentUser?.role?.replace('_', ' ') || 'Super Admin'}
              </span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={logout}
            className="w-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white py-2 px-3 rounded-xl flex items-center justify-center gap-2 border border-slate-700/60 text-xs font-semibold transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span>Sign Out</span>
          </button>

          {/* Footer Company Subtext */}
          <div className="text-[10px] text-slate-400 px-1 text-center font-medium select-none">
            ACADENO Technologies
          </div>

        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-[1340px] w-full mx-auto animate-fade-in">
          {(pageTitle || headerAction) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80">
              <div>
                {pageTitle && <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight">{pageTitle}</h1>}
                {pageSubtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{pageSubtitle}</p>}
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
