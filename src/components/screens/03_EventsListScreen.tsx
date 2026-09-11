import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { EventStatus, Event } from '../../types';
import { 
  Plus, 
  Search, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Users, 
  MoreVertical, 
  QrCode, 
  Edit3, 
  Trash2, 
  Archive, 
  ArrowRight,
  CheckCircle2, 
  XCircle,
  AlertTriangle, 
  X,
  Sparkles
} from 'lucide-react';

export const EventsListScreen: React.FC = () => {
  const { 
    events, 
    registrations, 
    setScreen, 
    setSelectedEventId, 
    startNewEventWizard, 
    editExistingEventInWizard,
    deleteEvent,
    updateEvent,
    showToast
  } = useEventStore();

  const [activeTab, setActiveTab] = useState<'all' | EventStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'name' | 'registrations'>('date_desc');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const filteredEvents = events.filter((evt) => {
    const matchesTab = activeTab === 'all' || evt.status === activeTab;
    const matchesSearch = evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (evt.venue && evt.venue.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          evt.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'date_asc') return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    if (sortBy === 'registrations') {
      const aCount = registrations.filter(r => r.event_id === a.id).length;
      const bCount = registrations.filter(r => r.event_id === b.id).length;
      return bCount - aCount;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleOpenLink = (evt: Event) => {
    setSelectedEventId(evt.id);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    window.open(`${origin}/?event=${encodeURIComponent(evt.slug)}`, '_blank');
  };

  const handleOpenRegistrations = (evt: Event) => {
    setSelectedEventId(evt.id);
    setScreen('11_registrations');
  };

  const handleOpenOverview = (evt: Event) => {
    setSelectedEventId(evt.id);
    setScreen('10_event_overview');
  };

  return (
    <AdminLayout
      activeNav="events"
      pageTitle="Events Directory"
      pageSubtitle="Organize, publish, and monitor active and upcoming events."
      headerAction={
        <button
          onClick={startNewEventWizard}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-xs transition-all text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      }
    >

      {/* Filter, Search & Sort Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {(['all', 'active', 'closed', 'draft', 'archived'] as const).map((tab) => {
            const count = tab === 'all' 
              ? events.length 
              : events.filter(e => e.status === tab).length;

            const label = tab === 'active' ? 'Live' : tab.charAt(0).toUpperCase() + tab.slice(1);

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <span>{label}</span>
                <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                  activeTab === tab ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events or venues..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 cursor-pointer"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="name">Event Name (A-Z)</option>
              <option value="registrations">Most Registrations</option>
            </select>
          </div>
        </div>

      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((evt) => {
          const regCount = registrations.filter(r => r.event_id === evt.id).length;
          const maxCap = evt.settings?.max_registrations || 150;
          const capPercent = Math.min(100, Math.round((regCount / maxCap) * 100));

          return (
            <div 
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Event Banner Image */}
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img 
                  src={evt.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} 
                  alt={evt.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                {/* Status Badges */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs ${
                    evt.status === 'active'
                      ? 'bg-emerald-600 text-white'
                      : evt.status === 'closed'
                      ? 'bg-rose-600 text-white'
                      : evt.status === 'draft'
                      ? 'bg-blue-900/90 text-blue-200 backdrop-blur-xs'
                      : 'bg-slate-700 text-slate-200'
                  }`}>
                    {evt.status === 'active' ? 'Live' : evt.status === 'closed' ? 'Closed' : evt.status === 'draft' ? 'Draft' : 'Archived'}
                  </span>
                </div>

                {/* More Action Menu */}
                <div className="absolute top-3 right-3">
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === evt.id ? null : evt.id)}
                      className="p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg backdrop-blur-xs transition-colors cursor-pointer"
                      aria-label="Event options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {menuOpenId === evt.id && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setMenuOpenId(null)} />
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-40 text-xs text-slate-700 animate-slide-down">
                          <button
                            onClick={() => {
                              setMenuOpenId(null);
                              editExistingEventInWizard(evt.id, 1);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Edit in Wizard</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setMenuOpenId(null);
                              setSelectedEventId(evt.id);
                              setScreen('09_publish_confirm');
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5 text-amber-500" />
                            <span>View QR & Share</span>
                          </button>

                          {/* Close / Reopen Event Option */}
                          <button
                            onClick={() => {
                              setMenuOpenId(null);
                              const newStatus = evt.status === 'closed' ? 'active' : 'closed';
                              updateEvent(evt.id, { status: newStatus });
                              showToast(newStatus === 'closed' ? `Closed registrations for "${evt.name}"` : `Reopened registrations for "${evt.name}"`);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                          >
                            {evt.status === 'closed' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-semibold">Reopen Event</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span className="text-amber-700 font-semibold">Close Event</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setMenuOpenId(null);
                              const newStatus = evt.status === 'archived' ? 'active' : 'archived';
                              updateEvent(evt.id, { status: newStatus });
                              showToast(newStatus === 'archived' ? `Archived "${evt.name}"` : `Unarchived "${evt.name}"`);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <Archive className="w-3.5 h-3.5 text-slate-500" />
                            <span>{evt.status === 'archived' ? 'Unarchive' : 'Archive Event'}</span>
                          </button>

                          <div className="my-1 border-t border-slate-100" />
                          <button
                            onClick={() => {
                              setMenuOpenId(null);
                              setEventToDelete(evt);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-semibold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Event</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Event Name in Banner */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 
                    onClick={() => handleOpenOverview(evt)}
                    className="font-bold text-base line-clamp-1 cursor-pointer hover:text-blue-300 transition-colors"
                  >
                    {evt.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-medium">{new Date(evt.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{regCount} {regCount === 1 ? 'Attendee' : 'Attendees'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 line-clamp-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{evt.venue || 'Online / Virtual'}</span>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Capacity: {regCount}/{maxCap}</span>
                    <span>{capPercent}% filled</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        capPercent >= 90 ? 'bg-rose-500' : capPercent >= 60 ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${capPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => handleOpenOverview(evt)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenLink(evt)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Open public registration page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleOpenRegistrations(evt)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    title="View registrations list"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No events found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Your database is ready. Create your first event using the 5-step wizard to start managing registrations.
          </p>
          <button
            onClick={startNewEventWizard}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Event</span>
          </button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No events match filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No events match your current filter or search criteria.
          </p>
          <button
            onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* CUSTOM DELETE EVENT POPUP MODAL                                           */}
      {/* ========================================================================= */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden relative p-6 space-y-5 animate-in zoom-in-95">
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Delete Event?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to permanently delete <span className="font-semibold text-slate-800">"{eventToDelete.name}"</span> and all associated registrations?
                </p>
              </div>
            </div>

            {/* Warning Notice */}
            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>This action cannot be undone.</span>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteEvent(eventToDelete.id);
                  setEventToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Event</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </AdminLayout>
  );
};

