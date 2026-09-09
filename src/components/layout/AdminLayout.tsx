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
    logout
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
    <div className="min-h-screen bg-[#F4F8FD] flex flex-col md:flex-row text-[#14213D] antialiased font-sans">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0B1B3A] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="bg-white rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-xs">
          <img 
            src={acadenoLogoPng} 
            alt="ACADENO" 
            className="h-6 w-auto object-contain" 
          />
          <div className="w-px h-4 bg-slate-200" />
          <span className="text-xs font-black text-[#0B1B3A] tracking-wider">EVENTLINK</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] min-w-[240px] bg-gradient-to-b from-[#0B1B3A] via-[#0E224A] to-[#08152D] text-white flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 shadow-xl border-r border-blue-950/40 relative overflow-hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Subtle background ambient curves */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        {/* Top & Navigation Section */}
        <div className="p-4 relative z-10">
          
          {/* ACADENO EventLink Logo Card */}
          <div 
            onClick={() => { setScreen('02_dashboard'); setIsMobileMenuOpen(false); }}
            className="bg-white rounded-2xl p-3 shadow-md border border-white/20 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow select-none mb-6"
          >
            <img 
              src={acadenoLogoPng} 
              alt="ACADENO Logo" 
              className="h-10 w-auto object-contain" 
              loading="eager"
            />
            <div className="text-[11px] font-black text-[#0B1B3A] tracking-wider uppercase mt-1">
              ACADENO
            </div>
            <div className="text-[9px] font-bold text-[#1769FF] tracking-widest uppercase -mt-0.5">
              EVENTLINK
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
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#1769FF] text-white shadow-md shadow-blue-600/35 font-bold'
                      : 'text-[#8E9EB8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#8E9EB8]'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom Status & Logout Section */}
        <div className="p-4 relative z-10 space-y-4">
          
          {/* Platform info with green dot indicator */}
          <div className="flex items-start gap-2.5 px-2">
            <span className="w-2 h-2 rounded-full bg-[#20C997] shadow-xs shadow-emerald-400 mt-1 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-200 leading-tight">
                Event Management Platform
              </span>
              <span className="text-[10px] text-[#7183A3] font-medium leading-normal mt-0.5">
                ACADENO Technologies Pvt. Ltd.
              </span>
            </div>
          </div>

          {/* Prominent Rounded Logout Button */}
          <button
            onClick={logout}
            className="w-full bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-white/10 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-4 h-4 text-slate-300" />
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-[1400px] w-full mx-auto animate-fade-in">
          {(pageTitle || headerAction) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80">
              <div>
                {pageTitle && <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] tracking-tight font-sans">{pageTitle}</h1>}
                {pageSubtitle && <p className="text-xs sm:text-sm text-[#7183A3] mt-1 font-medium">{pageSubtitle}</p>}
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
