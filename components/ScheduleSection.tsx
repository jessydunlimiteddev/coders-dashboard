
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Video, Users, MoreHorizontal, Bell, X, Check, MapPin, Tag, Flag } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  type: 'Meeting' | 'Deep Work' | 'Deadline' | 'Personal';
  startTime: string; // e.g., "09:00"
  duration: number; // in minutes
  participants: string[];
  description: string;
  location?: string;
  priority: 'High' | 'Medium' | 'Low';
  date: Date; // Actual Date object for automation and filtering
}

type ViewMode = 'Day' | 'Week' | 'Month';

const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ScheduleSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('Day');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  
  // Set default starting date to February 14, 2026
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 1, 14));
  const [currentTime, setCurrentTime] = useState(new Date());

  const [events, setEvents] = useState<Event[]>([
    {
      id: 'e1',
      title: 'UX Sync - 2026 Core',
      type: 'Meeting',
      startTime: '09:30',
      duration: 60,
      participants: ['https://picsum.photos/seed/u1/40/40', 'https://picsum.photos/seed/u2/40/40'],
      description: 'Discussing the Valentine 2026 special release UI components.',
      location: 'Hologram Room 4',
      priority: 'High',
      date: new Date(2026, 1, 14)
    },
    {
      id: 'e2',
      title: 'Deep Work: Neural Engine',
      type: 'Deep Work',
      startTime: '11:00',
      duration: 120,
      participants: ['https://picsum.photos/seed/u1/40/40'],
      description: 'Optimizing high-frequency trading algorithms for Q1.',
      priority: 'Medium',
      date: new Date(2026, 1, 14)
    },
    {
      id: 'e3',
      title: 'Global Marketing Q1',
      type: 'Meeting',
      startTime: '14:00',
      duration: 45,
      participants: ['https://picsum.photos/seed/m1/40/40', 'https://picsum.photos/seed/m2/40/40'],
      description: 'Reviewing performance metrics for the autonomous agents campaign.',
      location: 'Virtual Hub B',
      priority: 'Medium',
      date: new Date(2026, 1, 15)
    },
    {
      id: 'e4',
      title: 'Security Patch Release',
      type: 'Deadline',
      startTime: '17:00',
      duration: 30,
      participants: ['https://picsum.photos/seed/d1/40/40'],
      description: 'Final hand-off of the kernel-level encryption update.',
      priority: 'High',
      date: new Date(2026, 1, 16)
    }
  ]);

  // Live Time Update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Automated Event Ingestion Simulation
  useEffect(() => {
    const automatedResponses = [
      { title: 'Emergency Bug Bash', type: 'Deadline', desc: 'Critical patch needed for the login system.' },
      { title: 'Team Coffee Chat', type: 'Personal', desc: 'Informal sync with the creative department.' },
      { title: 'System Architecture Review', type: 'Deep Work', desc: 'Auditing the 2026 cloud infrastructure.' },
      { title: 'Client Feedback Session', type: 'Meeting', desc: 'Reviewing the latest prototype with stakeholders.' }
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const template = automatedResponses[Math.floor(Math.random() * automatedResponses.length)];
        const randomHour = Math.floor(Math.random() * 10) + 8;
        const newEvent: Event = {
          id: `auto-${Date.now()}`,
          title: template.title,
          type: template.type as any,
          startTime: `${randomHour < 10 ? '0' + randomHour : randomHour}:00`,
          duration: 60,
          participants: [`https://picsum.photos/seed/${Math.random()}/40/40`],
          description: template.desc,
          priority: Math.random() > 0.5 ? 'High' : 'Medium',
          date: new Date(2026, 1, 14 + Math.floor(Math.random() * 5))
        };
        setEvents(prev => [...prev, newEvent]);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Filter and Search Logic
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (viewMode === 'Day') {
        return e.date.toDateString() === selectedDate.toDateString();
      } else if (viewMode === 'Week') {
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return e.date >= startOfWeek && e.date <= endOfWeek;
      }
      // Month view shows all for Feb 2026
      return e.date.getMonth() === 1 && e.date.getFullYear() === 2026;
    });
  }, [events, searchQuery, viewMode, selectedDate]);

  const getTimePosition = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const totalMinutes = (h - 8) * 60 + m;
    return (totalMinutes / (12 * 60)) * 100; // Percentage of the timeline height (12 hours)
  };

  const getEventHeight = (duration: number) => {
    return (duration / (12 * 60)) * 100;
  };

  const getTypeStyles = (type: Event['type']) => {
    switch (type) {
      case 'Meeting': return 'bg-indigo-600 border-indigo-400';
      case 'Deep Work': return 'bg-slate-900 border-slate-700';
      case 'Deadline': return 'bg-rose-600 border-rose-400';
      case 'Personal': return 'bg-emerald-600 border-emerald-400';
      default: return 'bg-gray-600 border-gray-400';
    }
  };

  const changeDate = (offset: number) => {
    const next = new Date(selectedDate);
    next.setDate(selectedDate.getDate() + offset);
    setSelectedDate(next);
  };

  const renderDayView = () => (
    <div className="flex-1 relative flex gap-8 animate-in slide-in-from-right-4 duration-500 min-h-[600px]">
      <div className="flex flex-col justify-between py-2 w-16 border-r border-white/5">
        {hours.map(h => (
          <div key={h} className="text-[10px] font-black text-gray-500 h-16 flex items-start">
            {h === 12 ? '12 PM' : h > 12 ? `${h-12} PM` : `${h} AM`}
          </div>
        ))}
      </div>

      <div className="flex-1 relative">
        {hours.map(h => (
          <div key={h} className="absolute w-full border-t border-white/5" style={{ top: `${((h - 8) / 12) * 100}%` }}></div>
        ))}

        {filteredEvents.map(event => (
          <div 
            key={event.id}
            className={`absolute left-0 right-4 p-4 rounded-[24px] border shadow-2xl transition-all hover:scale-[1.01] hover:z-20 group cursor-pointer ${getTypeStyles(event.type)}`}
            style={{ 
              top: `${getTimePosition(event.startTime)}%`, 
              height: `${getEventHeight(event.duration)}%`,
              marginTop: '2px'
            }}
          >
            <div className="flex justify-between items-start h-full overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] font-black uppercase bg-white/20 text-white px-2 py-0.5 rounded-lg tracking-wider">
                    {event.type}
                  </span>
                  {event.priority === 'High' && <Flag size={10} className="text-red-300 fill-red-300" />}
                </div>
                <h3 className="text-sm font-black text-white leading-tight truncate">{event.title}</h3>
                <p className="text-[10px] text-white/50 font-bold mt-1 line-clamp-1">{event.description}</p>
                <div className="mt-auto flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[10px] text-white font-bold opacity-60">
                    <Clock size={12} /> {event.startTime}
                  </div>
                </div>
              </div>
              <div className="flex -space-x-2 shrink-0">
                {event.participants.map((p, i) => (
                  <img key={i} src={p} className="w-8 h-8 rounded-xl border-2 border-white/10" alt="" />
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Live Indicator if viewing Feb 14 2026 and current hour is within bounds */}
        {selectedDate.toDateString() === new Date(2026, 1, 14).toDateString() && (
          <div className="absolute w-full border-t-2 border-indigo-400 z-30 flex items-center" style={{ top: '45%' }}>
             <div className="w-2 h-2 rounded-full bg-indigo-400 -ml-1"></div>
             <span className="ml-2 text-[8px] font-black text-indigo-400 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-md">LIVE</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderWeekView = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    return (
      <div className="flex-1 flex gap-2 overflow-x-auto pb-4 custom-scrollbar animate-in slide-in-from-right-4 duration-500">
        {Array.from({ length: 7 }, (_, i) => {
          const day = new Date(startOfWeek);
          day.setDate(startOfWeek.getDate() + i);
          const dayEvents = events.filter(e => e.date.toDateString() === day.toDateString());
          
          return (
            <div key={i} className={`flex-1 min-w-[160px] bg-white/5 rounded-3xl border border-white/5 p-4 flex flex-col gap-3 ${day.toDateString() === selectedDate.toDateString() ? 'ring-2 ring-indigo-500/40 bg-indigo-500/5' : ''}`}>
              <div className="text-center pb-2 border-b border-white/5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{weekDays[i]}</p>
                <p className={`text-sm font-black mt-1 ${day.toDateString() === selectedDate.toDateString() ? 'text-indigo-400' : 'text-white'}`}>{day.getDate()}</p>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto max-h-[500px] no-scrollbar">
                {dayEvents.map(event => (
                  <div key={event.id} className={`p-3 rounded-2xl border ${getTypeStyles(event.type)} shadow-lg cursor-pointer hover:scale-[1.03] transition-transform`}>
                    <p className="text-[10px] font-black text-white leading-tight truncate">{event.title}</p>
                    <div className="flex items-center justify-between mt-2">
                       <span className="text-[8px] text-white/60 font-bold">{event.startTime}</span>
                       <div className="flex -space-x-1">
                          {event.participants.slice(0, 2).map((p, i) => (
                            <img key={i} src={p} className="w-4 h-4 rounded-md border border-black/20" alt="" />
                          ))}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => (
    <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-2 animate-in slide-in-from-right-4 duration-500">
      {Array.from({ length: 28 }, (_, i) => i + 1).map((dayNum) => {
        const checkDate = new Date(2026, 1, dayNum);
        const dayEvents = events.filter(e => e.date.toDateString() === checkDate.toDateString());
        const isToday = checkDate.toDateString() === selectedDate.toDateString();
        
        return (
          <div 
            key={dayNum} 
            onClick={() => { setSelectedDate(checkDate); setViewMode('Day'); }}
            className={`bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col min-h-[120px] hover:bg-white/10 transition-colors cursor-pointer group ${isToday ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-500/10 shadow-indigo-500/20 shadow-lg' : ''}`}
          >
            <span className={`text-xs font-black ${isToday ? 'text-indigo-400' : 'text-gray-500'} group-hover:text-white`}>{dayNum}</span>
            <div className="mt-2 space-y-1.5 overflow-hidden">
              {dayEvents.slice(0, 3).map(event => (
                <div key={event.id} className="flex items-center gap-1.5">
                   <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${getTypeStyles(event.type).split(' ')[0]}`} />
                   <p className="text-[8px] font-bold text-gray-400 truncate max-w-[80%]">{event.title}</p>
                </div>
              ))}
              {dayEvents.length > 3 && (
                <span className="text-[7px] font-black text-indigo-400 uppercase">+{dayEvents.length - 3} MORE</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Schedule</h1>
          <div className="flex items-center gap-3 mt-2 text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">
            <button onClick={() => changeDate(-1)} className="p-1 hover:text-black transition-colors"><ChevronLeft size={16} /></button>
            <span className="text-black">February 2026</span>
            <button onClick={() => changeDate(1)} className="p-1 hover:text-black transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsNewEventModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            <Plus size={16} /> New Event
          </button>

          <div className="flex items-center bg-white/60 p-1.5 rounded-full shadow-sm border border-white">
            {(['Day', 'Week', 'Month'] as ViewMode[]).map((v) => (
              <button 
                key={v} 
                onClick={() => setViewMode(v)}
                className={`px-5 py-2 text-[10px] font-black uppercase rounded-full transition-all ${viewMode === v ? 'bg-black shadow-lg text-white' : 'text-gray-400 hover:text-black'}`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-white/60 px-5 py-2.5 rounded-full border border-white gap-3 min-w-[240px] focus-within:ring-4 focus-within:ring-black/5 transition-all">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter timeline..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase outline-none w-full tracking-widest" 
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-8 glass-dark rounded-[48px] p-10 border border-white/10 relative overflow-hidden min-h-[750px] flex flex-col">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col h-full flex-1">
            <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-4 rounded-3xl text-indigo-400 shadow-xl border border-white/10">
                   <CalendarIcon size={24} />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-white tracking-tight">{viewMode} Timeline</h2>
                   <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                     {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                   </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex flex-col items-end">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Global Status</p>
                    <p className="text-xs font-bold text-white">Automated Sync v4.2</p>
                 </div>
                 <button className="p-3 bg-white/5 rounded-2xl text-white hover:bg-white/10 transition-colors"><MoreHorizontal size={20} /></button>
              </div>
            </div>

            <div className="flex-1">
              {viewMode === 'Day' && renderDayView()}
              {viewMode === 'Week' && renderWeekView()}
              {viewMode === 'Month' && renderMonthView()}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-8 border border-white shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">February 2026</h3>
                <div className="flex gap-2">
                   <button onClick={() => changeDate(-30)} className="p-2 hover:bg-white rounded-xl transition-colors"><ChevronLeft size={16} /></button>
                   <button onClick={() => changeDate(30)} className="p-2 hover:bg-white rounded-xl transition-colors"><ChevronRight size={16} /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center mb-6">
                 {weekDays.map(d => (
                   <span key={d} className="text-[10px] font-black text-gray-400">{d[0]}</span>
                 ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                 {Array.from({ length: 28 }, (_, i) => i + 1).map(day => {
                   const checkDate = new Date(2026, 1, day);
                   const isSelected = checkDate.toDateString() === selectedDate.toDateString();
                   const hasEvents = events.some(e => e.date.toDateString() === checkDate.toDateString());
                   
                   return (
                     <button 
                      key={day} 
                      onClick={() => setSelectedDate(checkDate)}
                      className={`h-11 w-full flex flex-col items-center justify-center rounded-2xl text-xs font-black transition-all relative ${isSelected ? 'bg-black text-white shadow-2xl scale-110' : 'hover:bg-white text-gray-800'}`}
                     >
                       {day}
                       {hasEvents && !isSelected && (
                         <div className="absolute bottom-1.5 w-1 h-1 bg-indigo-500 rounded-full"></div>
                       )}
                     </button>
                   );
                 })}
              </div>
           </div>

           <div className="glass-dark rounded-[40px] p-8 border border-white/10 flex flex-col justify-between overflow-hidden relative shadow-2xl">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest opacity-80 flex items-center gap-2">
                    <Bell size={16} className="text-indigo-400" /> Notifications
                  </h3>
                  <span className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full border border-indigo-400/20">LIVE</span>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
                   {events.slice(-4).map((item, i) => (
                     <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-[24px] border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                        <div className={`p-3 rounded-xl bg-white/10 ${getTypeStyles(item.type).split(' ')[0]} transition-all group-hover:scale-110`}>
                           <Tag size={16} className="text-white" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                           <p className="text-[11px] font-black text-white truncate">{item.title}</p>
                           <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Starting {item.startTime}</p>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                     </div>
                   ))}
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSection;
