
import React from 'react';
import { Home, MessageSquare, Settings, Facebook, Twitter, Instagram, Mail, Phone, MapPin, Bell, Globe, Shield, CreditCard, User as UserIcon } from 'lucide-react';
import { TabType } from '../App';

interface UserProfile {
  name: string;
  role: string;
  avatar: string;
  banner: string;
  bio: string;
  email: string;
  mobile: string;
  location: string;
  notifications: { push: boolean };
}

const ProfileSection: React.FC<{ userProfile: UserProfile, onNavigate: (tab: TabType) => void }> = ({ userProfile, onNavigate }) => {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-1000 pb-10">
      {/* Header Card */}
      <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-white/40 group">
        <div className="h-64 w-full overflow-hidden">
          <img src={userProfile.banner} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Banner" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 border-t border-white/40 mx-4 -mt-16 mb-4 rounded-[24px] shadow-xl">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img src={userProfile.avatar} alt="Avatar" className="w-24 h-24 rounded-[20px] object-cover shadow-2xl border-4 border-white" />
              {userProfile.notifications.push && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-black rounded-full border-2 border-white flex items-center justify-center animate-bounce shadow-lg">
                  <Bell size={12} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{userProfile.name}</h1>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{userProfile.role}</p>
            </div>
          </div>
          
          <div className="flex bg-white/50 p-1.5 rounded-2xl border border-white shadow-inner">
            <button 
              onClick={() => onNavigate('Home')} 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black hover:bg-white transition-all"
            >
              <Home size={14} /> Overview
            </button>
            <button 
              onClick={() => onNavigate('Messages')} 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-white shadow-sm scale-105"
            >
              <MessageSquare size={14} /> Messages
            </button>
            <button 
              onClick={() => onNavigate('Settings')} 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black hover:bg-white transition-all"
            >
              <Settings size={14} /> Settings
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Platform Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/70 backdrop-blur-md rounded-[32px] p-8 border border-white shadow-sm space-y-8">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Platform Settings</h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Account</p>
                <div className="space-y-4">
                  {[
                    { label: 'Email me when someone follows me', active: true },
                    { label: 'Email me when someone answers', active: false },
                    { label: 'Email me when someone mentions me', active: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{item.label}</span>
                      <div className={`w-10 h-6 rounded-full relative transition-all duration-300 ${item.active ? 'bg-black' : 'bg-gray-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${item.active ? 'left-5' : 'left-1'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Application</p>
                <div className="space-y-4">
                  {[
                    { label: 'New launches and projects', active: false },
                    { label: 'Monthly product updates', active: true },
                    { label: 'Subscribe to newsletter', active: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{item.label}</span>
                      <div className={`w-10 h-6 rounded-full relative transition-all duration-300 ${item.active ? 'bg-black' : 'bg-gray-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${item.active ? 'left-5' : 'left-1'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Profile Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/70 backdrop-blur-md rounded-[32px] p-8 border border-white shadow-sm space-y-8 h-full">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center justify-between">
              Profile Information
              <button onClick={() => onNavigate('Settings')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                 <Settings size={14} className="text-gray-400" />
              </button>
            </h3>
            
            <p className="text-sm text-gray-500 leading-relaxed font-medium italic">
              "{userProfile.bio}"
            </p>
            
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-[80px]">Full Name:</span>
                <span className="text-sm text-gray-900 font-bold">{userProfile.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-[80px]">Mobile:</span>
                <span className="text-sm text-gray-900 font-bold">{userProfile.mobile}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-[80px]">Email:</span>
                <span className="text-sm text-gray-900 font-bold">{userProfile.email}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-[80px]">Location:</span>
                <span className="text-sm text-gray-900 font-bold">{userProfile.location}</span>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-[80px]">Social:</span>
                <div className="flex gap-3">
                  <Facebook size={18} className="text-indigo-600 cursor-pointer hover:scale-110 transition-transform" />
                  <Twitter size={18} className="text-sky-400 cursor-pointer hover:scale-110 transition-transform" />
                  <Instagram size={18} className="text-rose-500 cursor-pointer hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Conversations Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/70 backdrop-blur-md rounded-[32px] p-8 border border-white shadow-sm space-y-6 h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Conversations</h3>
              <button 
                onClick={() => onNavigate('Messages')}
                className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
              >
                Open Inbox
              </button>
            </div>
            
            <div className="space-y-6">
              {[
                { name: 'Sophie B.', msg: 'Hi! I need more information...', avatar: 'https://picsum.photos/seed/sophie/200/200' },
                { name: 'Anne', msg: 'Awesome work, can you...', avatar: 'https://picsum.photos/seed/p3/200/200' },
                { name: 'Ivan', msg: 'About files I can...', avatar: 'https://picsum.photos/seed/p4/200/200' },
                { name: 'Peterson', msg: 'Have a great afternoon...', avatar: 'https://picsum.photos/seed/p6/200/200' },
                { name: 'Nick ', msg: 'Hi! I need more information...', avatar: 'https://picsum.photos/seed/p7/200/200' },
              ].map((conv, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer" onClick={() => onNavigate('Messages')}>
                  <div className="flex items-center gap-4">
                    <img src={conv.avatar} alt="" className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-110 transition-transform" />
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-gray-900 leading-tight">{conv.name}</p>
                      <p className="text-[11px] text-gray-500 font-medium truncate">{conv.msg}</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest group-hover:translate-x-1 transition-transform">Reply</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
