
import React, { useState, useEffect } from 'react';
import { MoreHorizontal, FileText, Figma, FileImage, Layout, ArrowUpRight } from 'lucide-react';

const FileItem = ({ icon: Icon, name, color }: { icon: any, name: string, color: string }) => (
    <div className="flex items-center gap-4 bg-white/60 p-3 rounded-[20px] border border-white hover:bg-white transition-colors cursor-pointer">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={18} className="text-white" />
        </div>
        <span className="flex-1 text-[11px] font-bold text-gray-700 truncate">{name}</span>
        <MoreHorizontal size={14} className="text-gray-300" />
    </div>
);

const TeamColumn = ({ title, progress, members }: { title: string, progress: number, members: string[] }) => (
    <div className="flex-1 space-y-4">
        <div>
            <h4 className="text-sm font-bold text-white">{title}</h4>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">Design and creative</p>
        </div>
        <div className="flex -space-x-2">
            {members.map((m, i) => (
                <img key={i} src={m} className="w-8 h-8 rounded-xl border-2 border-black object-cover hover:scale-110 transition-transform cursor-pointer" alt="" />
            ))}
        </div>
        <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
            <span className="flex items-center gap-1 opacity-60">🕒 5</span>
            <span className="flex items-center gap-1 opacity-60">💬 3</span>
        </div>
    </div>
);

const TeamSection: React.FC = () => {
  // Live Data State
  const [totalUsers, setTotalUsers] = useState(1240);
  const [activeUsers, setActiveUsers] = useState(562);
  const [dynamics, setDynamics] = useState(25);
  const [progressData, setProgressData] = useState({ ux: 60, marketing: 30, development: 70 });

  useEffect(() => {
    const interval = setInterval(() => {
      // Small random changes to numbers for "live" feel
      setTotalUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      setActiveUsers(prev => prev + (Math.random() > 0.5 ? 2 : -2));
      setDynamics(prev => Math.min(100, Math.max(0, prev + (Math.random() > 0.5 ? 1 : -1))));
      
      // Jitter progress bars slightly
      setProgressData(prev => ({
        ux: Math.min(100, Math.max(0, prev.ux + (Math.random() * 2 - 1))),
        marketing: Math.min(100, Math.max(0, prev.marketing + (Math.random() * 2 - 1))),
        development: Math.min(100, Math.max(0, prev.development + (Math.random() * 2 - 1)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6 pb-4">
        {/* Files List */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white shadow-lg"><Layout size={14} /></div>
                    <span className="text-xs font-black text-black uppercase tracking-widest">All Files</span>
                </div>
                <MoreHorizontal size={16} className="text-gray-400" />
            </div>
            <div className="space-y-2">
                <FileItem icon={FileText} name="License on Figma templates.pdf" color="bg-purple-500" />
                <FileItem icon={Figma} name="Devspire_UI-Kit.fig" color="bg-orange-500" />
                <FileItem icon={FileText} name="Devspire redesign.word" color="bg-blue-500" />
                <FileItem icon={FileImage} name="National Bank.fig" color="bg-indigo-500" />
            </div>
        </div>

        {/* Team Dashboard */}
        <div className="col-span-12 lg:col-span-9 glass-dark rounded-[40px] p-8 flex flex-col justify-between overflow-hidden relative shadow-2xl border border-white/5">
            {/* Background Grain/Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Team</h2>
                    <button className="w-10 h-10 rounded-2xl border border-white/20 flex items-center justify-center text-white text-xs hover:bg-white/10 transition-colors shadow-lg">+</button>
                </div>
                <div className="flex flex-wrap items-center gap-6 md:gap-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/5"><FileText size={16} className="text-white" /></div>
                        <div>
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Total Users</p>
                            <p className="text-sm font-black text-white tabular-nums">{totalUsers.toLocaleString()} <span className="text-[10px] text-green-400 ml-1 font-bold">+124</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/5"><FileText size={16} className="text-white" /></div>
                        <div>
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Active Users</p>
                            <p className="text-sm font-black text-white tabular-nums">{activeUsers.toLocaleString()} <span className="text-[10px] text-green-400 ml-1 font-bold">+12</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/5"><FileText size={16} className="text-white" /></div>
                        <div>
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Dynamics</p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-white tabular-nums">{Math.round(dynamics)}%</span>
                                <div className="w-10 h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-green-400 transition-all duration-1000" style={{ width: `${dynamics}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-12 relative z-10">
                <TeamColumn 
                    title="UX UI Design" 
                    progress={progressData.ux} 
                    members={['https://picsum.photos/seed/u1/60/60', 'https://picsum.photos/seed/u2/60/60', 'https://picsum.photos/seed/u3/60/60']} 
                />
                <TeamColumn 
                    title="Marketing" 
                    progress={progressData.marketing} 
                    members={['https://picsum.photos/seed/m1/60/60', 'https://picsum.photos/seed/m2/60/60']} 
                />
                <TeamColumn 
                    title="Development" 
                    progress={progressData.development} 
                    members={['https://picsum.photos/seed/d1/60/60', 'https://picsum.photos/seed/d2/60/60', 'https://picsum.photos/seed/d3/60/60', 'https://picsum.photos/seed/d4/60/60']} 
                />
                
                {/* Visual Accent - Spiral/Abstract Lines */}
                <div className="absolute right-[-100px] bottom-[-100px] w-[400px] h-[400px] pointer-events-none overflow-hidden opacity-50">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white/5">
                        <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,89.9,-16.2,88.5,-0.8C87,14.6,81.6,29.3,73.1,42.1C64.6,54.9,53,65.8,39.6,73.4C26.1,80.9,10.8,85.2,-4.1,92.3C-19,99.4,-33.5,109.3,-47.5,106.3C-61.5,103.4,-75,87.6,-82.7,70.6C-90.4,53.6,-92.3,35.4,-91.1,18.2C-89.9,1,-85.7,-15.3,-78,-30.2C-70.3,-45.1,-59.2,-58.5,-45.8,-66.1C-32.4,-73.7,-16.2,-75.5,-0.3,-74.9C15.6,-74.3,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TeamSection;
