import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { ScreenId, UserRole } from '../../types';
import { 
  Layers, 
  Shield, 
  RotateCcw, 
  ExternalLink, 
  ChevronDown, 
  Sparkles,
  Smartphone,
  Monitor
} from 'lucide-react';

export const ScreenNavigatorBar: React.FC = () => {
  const { 
    currentScreen, 
    setScreen, 
    currentRole, 
    setCurrentRole, 
    resetToDefaults, 
    selectedEvent,
    currentUser 
  } = useEventStore();

  const [isOpen, setIsOpen] = useState(false);

  const screens: { id: ScreenId; label: string; group: 'Admin Dashboard' | 'Wizard' | 'Event Operations' | 'Public Flow' }[] = [
    // Admin
    { id: '01_login', label: '01. Login (Auth & 2FA)', group: 'Admin Dashboard' },
    { id: '02_dashboard', label: '02. Dashboard & KPIs', group: 'Admin Dashboard' },
    { id: '03_events_list', label: '03. Events Catalogue', group: 'Admin Dashboard' },
    
    // Wizard
    { id: '04_create_basic', label: '04. Create Event: Basic Info', group: 'Wizard' },
    { id: '05_create_form', label: '05. Create Event: Form Builder', group: 'Wizard' },
    { id: '06_create_theme', label: '06. Create Event: Theme Builder', group: 'Wizard' },
    { id: '07_create_settings', label: '07. Create Event: Settings', group: 'Wizard' },
    { id: '08_create_preview', label: '08. Create Event: Preview & Publish', group: 'Wizard' },
    { id: '09_publish_confirm', label: '09. Publish Confirmation & QR', group: 'Wizard' },

    // Event Operations
    { id: '10_event_overview', label: '10. Event Details: Overview', group: 'Event Operations' },
    { id: '11_registrations', label: '11. Registrations List & Excel Export', group: 'Event Operations' },
    { id: '12_registration_detail', label: '12. Registration Detail & PDF Badge', group: 'Event Operations' },
    { id: '13_analytics', label: '13. Event Analytics & Sources', group: 'Event Operations' },
    { id: '14_staff_management', label: '14. Staff & RBAC Management', group: 'Event Operations' },

    // Public Participant Flow
    { id: '15_public_registration', label: '15. Public Registration Page (Ticket)', group: 'Public Flow' },
    { id: '16_registration_success', label: '16. Registration Success & QR Pass', group: 'Public Flow' },
    { id: '17_registration_closed', label: '17. Registration Closed State', group: 'Public Flow' },
  ];

  const currentScreenObj = screens.find(s => s.id === currentScreen);
  const isPublicScreen = ['15_public_registration', '16_registration_success', '17_registration_closed'].includes(currentScreen);

  return (
    <aside aria-label="Developer Toolbar" className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white text-xs px-3 py-2 shadow-lg select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        {/* Left: Spec Handoff Badge & Screen Switcher */}
        <div className="flex items-center gap-2 relative">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/30 text-indigo-300 font-semibold tracking-wide uppercase text-[10px]">
            <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>ACADENO EventLink</span>
          </div>

          {/* Quick Dropdown for all 17 screens */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-100 px-3 py-1.5 rounded-md font-medium transition-all shadow-sm"
              title="Click to jump directly to any of the 17 handoff screens"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-slate-200">
                Screen: <span className="text-white font-bold">{currentScreenObj?.label || currentScreen}</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                <div className="absolute left-0 top-full mt-1.5 w-80 max-h-[80vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 p-2 text-slate-300 animate-slide-down">
                  <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider border-b border-slate-800 mb-1">
                    Select Screen (17 Total)
                  </div>
                  
                  {(['Admin Dashboard', 'Wizard', 'Event Operations', 'Public Flow'] as const).map(groupName => {
                    const groupScreens = screens.filter(s => s.group === groupName);
                    return (
                      <div key={groupName} className="mb-2">
                        <div className="text-[10px] font-semibold text-indigo-400 px-2 pt-1.5 pb-0.5">
                          {groupName}
                        </div>
                        {groupScreens.map(s => (
                          <button
                            key={s.id}
                            onClick={() => {
                              setScreen(s.id);
                              setIsOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                              currentScreen === s.id
                                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                                : 'hover:bg-slate-800 text-slate-300'
                            }`}
                          >
                            <span>{s.label}</span>
                            {currentScreen === s.id && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            )}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Middle: Fast Mode Switches & Roles */}
        <div className="flex items-center gap-3">
          {/* RBAC Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-md border border-slate-700/60">
            <span className="text-slate-400 text-[11px] flex items-center gap-1 pl-1">
              <Shield className="w-3 h-3 text-amber-400" />
              Role:
            </span>
            {(['super_admin', 'event_manager', 'staff'] as UserRole[]).map(role => (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-all ${
                  currentRole === role
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {role.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Quick Toggle: Admin vs Public View */}
          <button
            onClick={() => {
              if (isPublicScreen) {
                setScreen('02_dashboard');
              } else {
                setScreen('15_public_registration');
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-[11px]"
            title="Toggle between Public Participant View and Admin Dashboard"
          >
            {isPublicScreen ? (
              <>
                <Monitor className="w-3 h-3 text-emerald-400" />
                <span>Switch to Admin</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3 text-cyan-400" />
                <span>View Public Page</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Demo Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Reset demo state back to default ACADENO data?')) {
                resetToDefaults();
              }
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 px-2 py-1 rounded border border-transparent hover:border-slate-700 transition-colors text-[11px]"
            title="Reset localStorage data to clean initial ACADENO state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
