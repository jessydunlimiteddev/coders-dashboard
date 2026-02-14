
import React from 'react';
import { Home, Calendar, LayoutGrid, ArrowRightLeft, MessageSquare, Settings, HelpCircle, User, LogOut, MoreHorizontal } from 'lucide-react';
import { TabType } from '../App';

const NavItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: TabType, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 px-6 py-3 w-full transition-all duration-300 group outline-none ${active ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
  >
    <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-black text-white shadow-lg' : 'bg-transparent group-hover:bg-white/50'}`}>
      <Icon size={20} />
    </div>
    <span className="text-sm font-medium hidden lg:block">{label}</span>
  </button>
);

const MobileNavItem = ({ icon: Icon, active = false, onClick }: { icon: any, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-1 py-3 transition-all ${active ? 'text-black' : 'text-gray-400'}`}
  >
    <div className={`p-2 rounded-xl transition-all ${active ? 'bg-black text-white shadow-md scale-110' : ''}`}>
      <Icon size={20} />
    </div>
  </button>
);

interface SidebarProps {
  activeTab: TabType;
  onNavigate: (tab: TabType) => void;
  userName: string;
  userRole: string;
  userAvatar: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onNavigate,
  userName,
  userRole,
  userAvatar,
  onLogout
}) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[240px] h-full flex-col items-center pt-10 pb-6 border-r border-white/20 bg-white/20 backdrop-blur-xl">
        <div className="mb-12 px-6 flex items-center gap-3 w-full">
          <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">C</div>
          <span className="text-xl font-bold tracking-tight text-black">CoderX</span>
        </div>

        <nav className="flex-1 w-full space-y-2">
          <NavItem icon={Home} label="Home" active={activeTab === 'Home'} onClick={() => onNavigate('Home')} />
          <NavItem icon={User} label="Profile" active={activeTab === 'Profile'} onClick={() => onNavigate('Profile')} />
          <NavItem icon={Calendar} label="Schedule" active={activeTab === 'Schedule'} onClick={() => onNavigate('Schedule')} />
          <NavItem icon={LayoutGrid} label="Projects" active={activeTab === 'Projects'} onClick={() => onNavigate('Projects')} />
          <NavItem icon={ArrowRightLeft} label="Transactions" active={activeTab === 'Transactions'} onClick={() => onNavigate('Transactions')} />
          <NavItem icon={MessageSquare} label="Messages" active={activeTab === 'Messages'} onClick={() => onNavigate('Messages')} />
          <NavItem icon={Settings} label="Settings" active={activeTab === 'Settings'} onClick={() => onNavigate('Settings')} />
          <NavItem icon={HelpCircle} label="Help" active={activeTab === 'Help'} onClick={() => onNavigate('Help')} />
        </nav>

        <div className="px-6 w-full mt-auto space-y-4">
          <div 
            onClick={() => onNavigate('Profile')}
            className="p-1.5 rounded-2xl bg-white/40 border border-white/60 flex items-center gap-3 hover:bg-white/60 transition-colors cursor-pointer"
          >
            <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-xl object-cover shadow-sm" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-gray-900 leading-tight truncate">{userName}</p>
              <p className="text-[10px] text-gray-500 truncate">{userRole}</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-4 px-6 py-3 w-full transition-all duration-300 group outline-none text-red-500 hover:text-red-700 hover:bg-red-50/50 rounded-2xl"
          >
            <div className="p-2 bg-red-100 text-red-500 rounded-xl transition-all group-hover:bg-red-500 group-hover:text-white shadow-sm">
              <LogOut size={20} />
            </div>
            <span className="text-sm font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden w-full flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">C</div>
          <span className="text-lg font-black tracking-tight text-black uppercase">CoderX</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('Settings')} className="p-2 bg-gray-50 rounded-xl text-gray-500">
            <Settings size={18} />
          </button>
          <img 
            src={userAvatar} 
            onClick={() => onNavigate('Profile')}
            className="w-8 h-8 rounded-xl object-cover border border-gray-100" 
            alt="User" 
          />
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-2xl border-t border-gray-100 flex items-center px-4 z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <MobileNavItem icon={Home} active={activeTab === 'Home'} onClick={() => onNavigate('Home')} />
        <MobileNavItem icon={LayoutGrid} active={activeTab === 'Projects'} onClick={() => onNavigate('Projects')} />
        <MobileNavItem icon={MessageSquare} active={activeTab === 'Messages'} onClick={() => onNavigate('Messages')} />
        <MobileNavItem icon={Calendar} active={activeTab === 'Schedule'} onClick={() => onNavigate('Schedule')} />
        <MobileNavItem icon={MoreHorizontal} active={['Transactions', 'Settings', 'Help', 'Profile'].includes(activeTab)} onClick={() => onNavigate('Profile')} />
      </nav>
    </>
  );
};

export default Sidebar;
