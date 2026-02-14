
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ManagementSection from './components/ManagementSection';
import MessagesSection from './components/MessagesSection';
import TeamSection from './components/TeamSection';
import TransactionsSection from './components/TransactionsSection';
import ScheduleSection from './components/ScheduleSection';
import SettingsSection from './components/SettingsSection';
import HelpSection from './components/HelpSection';
import HomeSection from './components/HomeSection';
import ProfileSection from './components/ProfileSection';
import Auth from './components/Auth';

export type TabType = 'Home' | 'Schedule' | 'Projects' | 'Transactions' | 'Messages' | 'Settings' | 'Help' | 'Profile';

const STORAGE_KEY_USER = 'coders_dashboard_user_profile_v2';
const STORAGE_KEY_AUTH = 'coders_dashboard_authenticated';
const STORAGE_KEY_PAST_USERS = 'coders_dashboard_past_users';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  });

  const [activeTab, setActiveTab] = useState<TabType>('Home');
  
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) return JSON.parse(saved);
    return {
      name: 'Temi Lawal',
      role: 'CEO / Co-Founder',
      avatar: 'https://picsum.photos/seed/richard/200/200',
      banner: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
      bio: "Hi, I'm Temi Lawal. Decisions: If you can't decide, the answer is no. Working towards the future of 2026 and beyond.",
      email: 'temi@coders.io',
      mobile: '(234) 704 3222 590',
      location: 'Nigeria',
      plan: 'Pro',
      notifications: {
        push: true,
        email: true,
        sms: false
      }
    };
  });

  const [pastUsers, setPastUsers] = useState<any[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PAST_USERS);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userProfile));
  }, [userProfile]);

  const handleProfileUpdate = (updates: Partial<typeof userProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const handleAuthSuccess = (userData: { name: string; email: string }) => {
    const newProfile = { 
      ...userProfile, 
      name: userData.name !== 'User' ? userData.name : userProfile.name, 
      email: userData.email 
    };
    
    if (!pastUsers.find(u => u.email === userData.email)) {
      const updatedHistory = [...pastUsers, { name: newProfile.name, email: newProfile.email, avatar: newProfile.avatar }];
      setPastUsers(updatedHistory);
      localStorage.setItem(STORAGE_KEY_PAST_USERS, JSON.stringify(updatedHistory));
    }

    setUserProfile(newProfile);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY_AUTH, 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem(STORAGE_KEY_AUTH, 'false');
    setActiveTab('Home');
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    
    let lastKey = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const key = e.key.toLowerCase();

      if (lastKey === 'g') {
        if (key === 'h') setActiveTab('Home');
        if (key === 'p') setActiveTab('Projects');
        if (key === 't') setActiveTab('Transactions');
        if (key === 's') setActiveTab('Settings');
        if (key === 'l') setActiveTab('Help'); 
        if (key === 'm') setActiveTab('Messages');
        if (key === 'r') setActiveTab('Profile');
        lastKey = '';
        return;
      }

      if (key === 'g') {
        lastKey = 'g';
        setTimeout(() => { if (lastKey === 'g') lastKey = ''; }, 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-0 lg:p-8 animate-in fade-in duration-500 overflow-x-hidden">
      <div className="fixed top-[-10%] right-[-5%] w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-white rounded-full blur-[80px] lg:blur-[120px] opacity-60 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[250px] lg:w-[500px] h-[250px] lg:h-[500px] bg-gray-200 rounded-full blur-[60px] lg:blur-[100px] opacity-40 pointer-events-none"></div>
      
      <div className="relative w-full h-screen lg:h-auto lg:max-w-[1440px] lg:min-h-[900px] bg-white lg:glass rounded-none lg:rounded-[48px] shadow-2xl flex flex-col lg:flex-row overflow-hidden lg:border lg:border-white/40">
        <Sidebar 
          activeTab={activeTab} 
          onNavigate={setActiveTab} 
          userName={userProfile.name}
          userRole={userProfile.role}
          userAvatar={userProfile.avatar}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 flex flex-col h-full overflow-hidden pb-20 lg:pb-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-10 space-y-6 lg:space-y-8">
            {activeTab === 'Home' ? (
              <HomeSection 
                userName={userProfile.name} 
                onNavigate={setActiveTab} 
                notificationsEnabled={userProfile.notifications.push}
              />
            ) : activeTab === 'Projects' ? (
              <>
                <ManagementSection />
                <TeamSection />
              </>
            ) : activeTab === 'Transactions' ? (
              <TransactionsSection />
            ) : activeTab === 'Schedule' ? (
              <ScheduleSection />
            ) : activeTab === 'Settings' ? (
              <SettingsSection 
                userProfile={userProfile}
                onUpdateProfile={handleProfileUpdate}
              />
            ) : activeTab === 'Help' ? (
              <HelpSection />
            ) : activeTab === 'Profile' ? (
              <ProfileSection userProfile={userProfile} onNavigate={setActiveTab} />
            ) : activeTab === 'Messages' ? (
              <MessagesSection />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
                   <span className="text-2xl font-bold">{activeTab[0]}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{activeTab} Section</h2>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
