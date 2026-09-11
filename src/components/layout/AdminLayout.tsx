import React, { ReactNode, useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import acadenoLogoPng from '../../assets/acadeno-logo.png';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  BarChart3, 
  UserCog, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck
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
    currentUser,
    selectedEvent
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-900 antialiased font-sans">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0B172B] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xs border-b border-slate-800">
        <div 
          onClick={() => setScreen('02_dashboard')}
          className="bg-white rounded-xl px-2.5 py-1 flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <img 
            src={acadenoLogoPng} 
            alt="ACADENO" 
            className="h-5 w-auto object-contain" 
          />
          <div className="w-px h-3.5 bg-slate-200" />
          <span className="text-[11px] font-bold text-slate-900 tracking-wider">EVENTLINK</span>
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] min-w-[240px] bg-[#0B172B] text-white flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 shadow-lg border-r border-slate-800/80 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>

        {/* Top & Navigation Section */}
        <div className="p-4 relative z-10">
          
          {/* ACADENO EventLink Logo Card */}
          <div 
            onClick={() => { setScreen('02_dashboard'); setIsMobileMenuOpen(false); }}
            className="bg-white rounded-2xl p-3 shadow-xs border border-slate-100 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all select-none mb-6 group"
          >
            <img 
              src={acadenoLogoPng} 
              alt="ACADENO Logo" 
              className="h-9 w-auto object-contain group-hover:scale-105 transition-transform" 
              loading="eager"
            />
            <div className="text-[11px] font-extrabold text-slate-900 tracking-wider uppercase mt-1">
              ACADENO
            </div>
            <div className="text-[9px] font-bold text-blue-600 tracking-widest uppercase -mt-0.5">
              EVENTLINK
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom User Profile & Logout Section */}
        <div className="p-4 relative z-10 space-y-3 border-t border-slate-800/80">
          
          {/* User Profile Info */}
          <div className="flex items-center gap-2.5 px-1.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/40 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate">
                {currentUser?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-slate-400 capitalize truncate">
                {currentUser?.role?.replace('_', ' ') || 'Super Admin'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white py-2 px-3 rounded-xl flex items-center justify-center gap-2 border border-white/10 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span>Sign Out</span>
          </button>

          <div className="text-[10px] text-slate-400 px-1 text-center font-medium">
            ACADENO Technologies
          </div>

        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-5 sm:p-7 lg:p-8 max-w-[1400px] w-full mx-auto animate-fade-in">
          {(pageTitle || headerAction) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80">
              <div>
                {pageTitle && <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{pageTitle}</h1>}
                {pageSubtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{pageSubtitle}</p>}
              </div>
              {headerAction && <div className="shrink-0">{headerAction}</div>}
            </div>
          )}

          {children}
        </main>

        {/* Global Admin Footer */}
        <footer className="px-6 py-4 border-t border-slate-200/80 bg-white/50 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1400px] w-full mx-auto">
          <span>Powered by <strong>ACADENO Technologies</strong> • EventLink Platform</span>
          <span className="text-slate-400 text-[11px]">Enterprise SaaS & Registration Management</span>
        </footer>
      </div>

    </div>
  );
};

