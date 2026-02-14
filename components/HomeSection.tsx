
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  Target, 
  Clock, 
  Coffee, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  MessageCircle, 
  Code2, 
  Cpu, 
  Activity,
  Layers,
  Star,
  ChevronRight,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  CloudRain,
  Snowflake,
  Leaf,
  Flower2,
  FolderKanban,
  ArrowRightLeft,
  Calendar,
  Settings
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { TabType } from '../App';

const velocityData = [
  { day: 'Mon', commits: 24, hours: 6 },
  { day: 'Tue', commits: 32, hours: 8 },
  { day: 'Wed', commits: 18, hours: 5 },
  { day: 'Thu', commits: 45, hours: 9 },
  { day: 'Fri', commits: 38, hours: 7 },
  { day: 'Sat', commits: 12, hours: 3 },
  { day: 'Sun', commits: 15, hours: 4 },
];

const initialActivityItems = [
  { id: 1, user: 'Jack Wilson', action: 'merged pull request', target: '#442 UI Refactor', time: '12m ago', avatar: 'https://picsum.photos/seed/p3/50/50' },
  { id: 2, user: 'Lily Chen', action: 'uploaded assets to', target: 'Marketing Q3', time: '1h ago', avatar: 'https://picsum.photos/seed/p4/50/50' },
  { id: 3, user: 'Tom Baker', action: 'commented on', target: 'Wireframes V2', time: '3h ago', avatar: 'https://picsum.photos/seed/p6/50/50' },
  { id: 4, user: 'Sarah Connor', action: 'updated priority for', target: 'Security Audit', time: '5h ago', avatar: 'https://picsum.photos/seed/p7/50/50' },
];

const teamMembers = [
  { name: 'Kalu Abasi', avatar: 'https://picsum.photos/seed/kalu/50/50' },
  { name: 'Ogechi Obi', avatar: 'https://picsum.photos/seed/oge/50/50' },
  { name: 'Emeka Nwosu', avatar: 'https://picsum.photos/seed/emeka/50/50' },
  { name: 'Aisha Bello', avatar: 'https://picsum.photos/seed/aisha/50/50' },
];

const possibleActions = [
  'deployed to production',
  'resolved critical bug in',
  'updated documentation for',
  'reviewed code for',
  'refactored module in',
  'requested access to',
];

const possibleTargets = [
  'Auth API v2',
  'Payment Gateway',
  'Mobile SDK',
  'Design Tokens',
  'Asset Library',
  'Analytics Dashboard',
];

type UpdateStatus = 'scheduled' | 'downloading' | 'installing' | 'completed';

// Added notificationsEnabled to the props interface to resolve the TypeScript error in App.tsx
const HomeSection: React.FC<{ 
  userName: string; 
  onNavigate: (tab: TabType) => void; 
  notificationsEnabled?: boolean;
}> = ({ userName, onNavigate, notificationsEnabled }) => {
  const [now, setNow] = useState(new Date());
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('scheduled');
  const [updateProgress, setUpdateProgress] = useState(0);
  const [lastCheckTime, setLastCheckTime] = useState(new Date().toLocaleTimeString());
  const [activities, setActivities] = useState(initialActivityItems);
  const [sprintProgress, setSprintProgress] = useState(92);
  
  const [healthMetrics, setHealthMetrics] = useState({
    api: 99.9,
    db: 12,
    auth: 'Online',
    cicd: 'Ready'
  });

  // Keep time updated
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Automated Activity Feed (Team Pulse)
  useEffect(() => {
    const activityTimer = setInterval(() => {
      const randomMember = teamMembers[Math.floor(Math.random() * teamMembers.length)];
      const randomAction = possibleActions[Math.floor(Math.random() * possibleActions.length)];
      const randomTarget = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
      
      const newItem = {
        id: Date.now(),
        user: randomMember.name,
        action: randomAction,
        target: randomTarget,
        time: 'Just now',
        avatar: randomMember.avatar
      };
      
      setActivities(prev => [newItem, ...prev.slice(0, 3)]);
    }, 12000);
    return () => clearInterval(activityTimer);
  }, []);

  // Automated Sprint Progress
  useEffect(() => {
    const sprintTimer = setInterval(() => {
      setSprintProgress(prev => {
        if (prev >= 99.9) return 92; // Reset for simulation
        return prev + 0.02;
      });
    }, 1000);
    return () => clearInterval(sprintTimer);
  }, []);

  // Update Simulation Logic
  useEffect(() => {
    let timer: any;
    const triggerUpdate = () => {
      setUpdateStatus('downloading');
      setUpdateProgress(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          setUpdateProgress(100);
          clearInterval(interval);
          setUpdateStatus('installing');
          setTimeout(() => {
            setUpdateStatus('completed');
            setLastCheckTime(new Date().toLocaleTimeString());
            setTimeout(() => setUpdateStatus('scheduled'), 5000);
          }, 3000);
        } else {
          setUpdateProgress(progress);
        }
      }, 400);
    };
    timer = setTimeout(triggerUpdate, 20000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const jitter = setInterval(() => {
      setHealthMetrics(prev => ({
        ...prev,
        api: +(99.8 + Math.random() * 0.2).toFixed(1),
        db: Math.floor(10 + Math.random() * 5)
      }));
    }, 3000);
    return () => clearInterval(jitter);
  }, []);

  const timeInfo = useMemo(() => {
    // Nigeria is UTC+1 (West Africa Time)
    const options: Intl.DateTimeFormatOptions = { 
      timeZone: 'Africa/Lagos', 
      hour: 'numeric', 
      hour12: false 
    };
    const hour = parseInt(new Intl.DateTimeFormat('en-GB', options).format(now));
    const month = now.getMonth();
    
    let greeting = 'Good Evening';
    let themeColor = 'text-indigo-600';
    let bgGlow = 'bg-indigo-500/10';
    let Icon = Moon;
    let sub = "System optimization recommended.";

    if (hour >= 5 && hour < 12) {
      greeting = 'Good Morning';
      themeColor = 'text-amber-500';
      bgGlow = 'bg-amber-500/10';
      Icon = Sunrise;
      sub = "Waking up in Nigeria. Productive session ahead?";
    } else if (hour >= 12 && hour < 17) {
      greeting = 'Good Afternoon';
      themeColor = 'text-sky-500';
      bgGlow = 'bg-sky-500/10';
      Icon = Sun;
      sub = "Mid-day momentum in Lagos. Keep it up!";
    } else if (hour >= 17 && hour < 21) {
      greeting = 'Good Evening';
      themeColor = 'text-indigo-600';
      bgGlow = 'bg-indigo-500/10';
      Icon = Sunset;
      sub = "Winding down or shifting gears?";
    } else {
      greeting = 'Good Night';
      themeColor = 'text-violet-400';
      bgGlow = 'bg-violet-500/10';
      Icon = Moon;
      sub = "Quiet time for deep architecture.";
    }

    let SeasonIcon = Flower2;
    if (month >= 2 && month <= 4) SeasonIcon = Flower2;
    else if (month >= 5 && month <= 7) SeasonIcon = Sun;
    else if (month >= 8 && month <= 10) SeasonIcon = Leaf;
    else SeasonIcon = Snowflake;

    return { greeting, themeColor, bgGlow, Icon, sub, SeasonIcon };
  }, [now]);

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className={`absolute -top-10 -left-10 w-64 h-64 ${timeInfo.bgGlow} rounded-full blur-[100px] pointer-events-none transition-colors duration-1000`}></div>
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 ${timeInfo.themeColor} font-black text-[10px] uppercase tracking-[0.3em] transition-colors duration-1000`}>
              <timeInfo.Icon size={14} className="animate-pulse" /> WAT STANDBY (Lagos)
            </div>
            <div className="h-1 w-1 rounded-full bg-gray-300"></div>
            <div className="flex items-center gap-1.5 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em]">
               <timeInfo.SeasonIcon size={12} /> Seasonal Mode
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
            {timeInfo.greeting}, <span className={`${timeInfo.themeColor} transition-colors duration-1000`}>{userName.split(' ')[0]}</span>.
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
             <span className="flex items-center gap-2 font-black text-gray-900"><Clock size={16} className="text-indigo-600" /> {now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
             <span className="h-4 w-[1px] bg-gray-200"></span>
             <span>{timeInfo.sub}</span>
          </div>
        </div>
        
        <div className="flex gap-4 relative z-10">
          <div className="glass px-6 py-4 rounded-[32px] flex items-center gap-5 border border-white/60 shadow-sm group hover:scale-105 transition-all cursor-default">
            <div className={`w-12 h-12 ${timeInfo.bgGlow} ${timeInfo.themeColor} rounded-2xl flex items-center justify-center transition-all duration-1000 group-hover:rotate-12`}>
               <Activity size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Personal Pulse</p>
               <div className="flex items-baseline gap-2">
                 <p className="text-xl font-black text-gray-900 tabular-nums">82<span className="text-xs ml-0.5">%</span></p>
                 <span className="text-[9px] font-bold text-green-500 uppercase tracking-tighter">Optimal</span>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tasks Finished', val: '24/30', sub: '+4 from yesterday', icon: CheckCircle2, color: 'bg-green-500' },
          { label: 'Hours Logged', val: '38.5h', sub: 'Weekly Goal: 40h', icon: Clock, color: 'bg-indigo-600' },
          { label: 'Sprint Goal', val: '92%', sub: 'Deadline in 2 days', icon: Target, color: 'bg-rose-500' },
          { label: 'Global Rank', val: '#12', sub: 'Top 5% of Team', icon: Zap, color: 'bg-black' },
        ].map((stat, i) => (
          <div key={i} className="glass group hover:scale-[1.02] transition-all duration-300 p-6 rounded-[32px] border border-white/60 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${stat.color} text-white shadow-lg`}>
                <stat.icon size={20} />
              </div>
              <TrendingUp size={16} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-3xl font-black text-gray-900">{stat.val}</h4>
              <p className="text-[10px] font-bold text-gray-400 mt-1">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 glass-dark rounded-[48px] p-10 border border-white/10 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-4 rounded-3xl text-indigo-400">
                   <Activity size={24} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-white tracking-tight">Project Velocity</h3>
                   <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Commit Activity vs Focus Hours</p>
                </div>
              </div>
              <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                <button className="px-4 py-2 text-[10px] font-black text-white bg-white/10 rounded-xl">Weekly</button>
                <button className="px-4 py-2 text-[10px] font-black text-gray-500 hover:text-white transition-colors">Monthly</button>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityData}>
                  <defs>
                    <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10, fontWeight: 700}} dy={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '16px', color: '#fff' }}
                    itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="commits" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorCommits)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-white/5">
               <div>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Commits</p>
                 <p className="text-xl font-black text-white">199 <span className="text-[10px] text-green-500 ml-1">+12%</span></p>
               </div>
               <div>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Productive Hours</p>
                 <p className="text-xl font-black text-white">42.2h <span className="text-[10px] text-indigo-500 ml-1">Steady</span></p>
               </div>
               <div>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Efficiency Score</p>
                 <p className="text-xl font-black text-white">A+ <span className="text-[10px] text-gray-500 ml-1">Excellent</span></p>
               </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="glass rounded-[40px] p-8 border border-white/60 shadow-sm space-y-6">
             <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
                <Layers size={18} className="text-indigo-600" /> Dashboard Links
             </h3>
             <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Management', icon: FolderKanban, tab: 'Management' },
                  { label: 'Transactions', icon: ArrowRightLeft, tab: 'Transactions' },
                  { label: 'Schedule', icon: Calendar, tab: 'Schedule' },
                  { label: 'Settings', icon: Settings, tab: 'Settings' }
                ].map((link, i) => (
                  <button 
                    key={i} 
                    onClick={() => onNavigate(link.tab as TabType)}
                    className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-white/40 border border-white/40 hover:bg-black hover:text-white transition-all duration-300 group"
                  >
                    <link.icon size={20} className="text-indigo-600 group-hover:text-white transition-colors" />
                    <span className="text-[10px] font-black uppercase">{link.label}</span>
                  </button>
                ))}
             </div>
          </div>

          <div className="glass-dark rounded-[40px] p-8 border border-white/10 shadow-xl overflow-hidden relative">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Team Pulse</h3>
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
             </div>
             <div className="space-y-6">
                {activities.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 group animate-in slide-in-from-left-4 duration-500">
                    <img src={item.avatar} className="w-8 h-8 rounded-xl object-cover border border-white/10 group-hover:scale-110 transition-transform" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[11px] text-white font-bold leading-tight">
                        {item.user} <span className="text-gray-500 font-medium">{item.action}</span>
                      </p>
                      <p className="text-[10px] text-indigo-400 font-black truncate mt-0.5 uppercase tracking-wider">{item.target}</p>
                      <p className="text-[9px] text-gray-600 font-bold mt-1 uppercase">{item.time}</p>
                    </div>
                  </div>
                ))}
             </div>
             <button className="w-full mt-8 py-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                Show All Activity <ArrowRight size={12} />
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 glass rounded-[40px] p-8 border border-white/60 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Active Sprint</h3>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-[9px] font-black uppercase">v2.4.0</span>
           </div>
           
           <div className="flex flex-col items-center py-4">
              <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="58" className="stroke-gray-100 fill-none stroke-[12]" />
                    <circle 
                        cx="64" cy="64" r="58" 
                        className="stroke-indigo-600 fill-none stroke-[12] transition-all duration-1000" 
                        style={{ strokeDasharray: '364', strokeDashoffset: `${364 - (364 * sprintProgress / 100)}` }} 
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-gray-900 tabular-nums">{Math.floor(sprintProgress)}%</span>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Done</span>
                 </div>
              </div>
              <p className="text-center text-xs font-bold text-gray-600 max-w-[200px]">You are ahead of schedule for this sprint cycle. Great job!</p>
           </div>
        </div>

        <div className="col-span-12 lg:col-span-8 glass rounded-[40px] p-8 border border-white/60 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Service Health</h3>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[9px] font-black text-green-600 uppercase">Live Monitoring Active</span>
              </div>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'API Server', val: `${healthMetrics.api}%`, status: 'Stable' },
                { label: 'Database', val: `${healthMetrics.db}ms`, status: 'Optimal' },
                { label: 'Auth Service', val: healthMetrics.auth, status: 'Healthy' },
                { label: 'CI/CD Pipeline', val: healthMetrics.cicd, status: 'Ready' }
              ].map((service, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 rounded-3xl p-5 hover:shadow-md transition-all group overflow-hidden relative">
                   <p className="text-[9px] font-black text-gray-400 uppercase mb-2">{service.label}</p>
                   <p className="text-lg font-black text-gray-900 mb-0.5 tabular-nums transition-all">{service.val}</p>
                   <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{service.status}</p>
                   <div className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-100 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </div>
              ))}
           </div>

           <div className={`mt-auto pt-8 transition-all duration-500`}>
              <div className={`p-5 rounded-3xl border transition-all duration-500 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 ${
                updateStatus === 'scheduled' ? 'bg-indigo-50 border-indigo-100' : 
                updateStatus === 'completed' ? 'bg-green-50 border-green-100' : 'bg-black text-white border-black shadow-xl'
              }`}>
                {(updateStatus === 'downloading' || updateStatus === 'installing') && (
                  <div className="absolute top-0 left-0 h-full bg-indigo-600/20 transition-all duration-500" style={{ width: `${updateProgress}%` }}></div>
                )}

                <div className="flex items-center gap-4 relative z-10">
                   <div className={`p-3 rounded-2xl transition-colors ${updateStatus === 'scheduled' || updateStatus === 'completed' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white'}`}>
                      {updateStatus === 'downloading' ? <RefreshCw className="animate-spin" size={18} /> : 
                       updateStatus === 'installing' ? <Cpu className="animate-pulse" size={18} /> : 
                       updateStatus === 'completed' ? <ShieldCheck size={18} /> : <Cpu size={18} />}
                   </div>
                   <div className="space-y-1">
                      <p className={`text-xs font-black uppercase tracking-widest ${updateStatus === 'scheduled' || updateStatus === 'completed' ? 'text-indigo-900' : 'text-white'}`}>
                        {updateStatus === 'scheduled' ? 'System Maintenance' : 
                         updateStatus === 'downloading' ? `Downloading Updates... ${Math.round(updateProgress)}%` : 
                         updateStatus === 'installing' ? 'Applying Updates' : 'System is Up to Date'}
                      </p>
                      <p className={`text-[10px] font-medium ${updateStatus === 'scheduled' || updateStatus === 'completed' ? 'text-indigo-600' : 'text-gray-400'}`}>
                        {updateStatus === 'scheduled' ? 'Automatic updates will be applied tonight at 02:00 AM.' : 
                         updateStatus === 'downloading' ? 'Fetching new packages from global CDN...' : 
                         updateStatus === 'installing' ? 'Optimizing system binaries and flushing cache...' : 
                         `Last checked for updates: ${lastCheckTime}`}
                      </p>
                   </div>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                  {updateStatus === 'scheduled' && (
                    <button 
                      onClick={() => setUpdateStatus('downloading')}
                      className="px-5 py-2.5 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase hover:shadow-lg transition-all border border-indigo-100 active:scale-95"
                    >
                      Check Now
                    </button>
                  )}
                  {updateStatus === 'completed' && (
                    <div className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest">
                       <CheckCircle2 size={14} /> Ready
                    </div>
                  )}
                  <button className={`p-2 rounded-xl transition-colors ${updateStatus === 'scheduled' || updateStatus === 'completed' ? 'hover:bg-indigo-100 text-indigo-400' : 'hover:bg-white/10 text-white/40'}`}>
                     <ChevronRight size={18} />
                  </button>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
