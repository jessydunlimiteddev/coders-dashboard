
import React, { useState, useRef } from 'react';
import { User, Bell, Shield, CreditCard, Globe, Sliders, Camera, Check, ChevronRight, Mail, Lock, Smartphone, Laptop, Zap, Trash2, ArrowRight, UserCog, Edit3, Eye, Upload, UserPlus, X, Pencil, Plus, Layout, Key, LogOut, ShieldAlert } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  permission: 'Admin' | 'Editor' | 'Viewer';
}

interface UserProfile {
  name: string;
  role: string;
  avatar: string;
  banner: string;
}

interface SettingsSectionProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ userProfile, onUpdateProfile }) => {
  const [activeSubTab, setActiveSubTab] = useState<'General' | 'Security' | 'Billing' | 'Notifications'>('General');
  const [isSaved, setIsSaved] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Admin');
  
  // Security State
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // State for Team Members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'Ann Kowalski', role: 'UX Lead', avatar: 'https://picsum.photos/seed/ann/200/200', permission: 'Admin' },
    { id: '2', name: 'Jack Wilson', role: 'App Dev', avatar: 'https://picsum.photos/seed/p3/200/200', permission: 'Editor' },
    { id: '3', name: 'Lily Chen', role: 'Content Specialist', avatar: 'https://picsum.photos/seed/p4/200/200', permission: 'Viewer' },
    { id: '4', name: 'Tom Baker', role: 'UX Designer', avatar: 'https://picsum.photos/seed/p6/200/200', permission: 'Editor' },
  ]);

  // Modal State for Adding/Editing Member
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberForm, setMemberForm] = useState<Omit<TeamMember, 'id'>>({ 
    name: '', 
    role: '', 
    avatar: 'https://picsum.photos/seed/placeholder/200/200',
    permission: 'Editor'
  });

  // File Input Refs
  const mainAvatarInputRef = useRef<HTMLInputElement>(null);
  const mainBannerInputRef = useRef<HTMLInputElement>(null);
  const memberAvatarInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner' | 'member') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'avatar') onUpdateProfile({ avatar: url });
      else if (type === 'banner') onUpdateProfile({ banner: url });
      else if (type === 'member') setMemberForm(prev => ({ ...prev, avatar: url }));
    }
  };

  const openAddMember = () => {
    setEditingMember(null);
    setMemberForm({ 
      name: '', 
      role: '', 
      avatar: 'https://picsum.photos/seed/new/200/200', 
      permission: 'Editor' 
    });
    setIsMemberModalOpen(true);
  };

  const openEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setMemberForm({ 
      name: member.name, 
      role: member.role, 
      avatar: member.avatar,
      permission: member.permission
    });
    setIsMemberModalOpen(true);
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdatePermission = (id: string, permission: TeamMember['permission']) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, permission } : m));
  };

  const submitMemberForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setTeamMembers(prev => prev.map(m => m.id === editingMember.id ? { ...m, ...memberForm } : m));
    } else {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        ...memberForm
      };
      setTeamMembers(prev => [...prev, newMember]);
    }
    setIsMemberModalOpen(false);
  };

  const Toggle = ({ active, onToggle }: { active: boolean, onToggle?: () => void }) => (
    <div 
      onClick={onToggle}
      className={`w-12 h-7 rounded-full transition-all duration-300 relative cursor-pointer ${active ? 'bg-indigo-600' : 'bg-gray-700/50'}`}
    >
      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-lg ${active ? 'left-6' : 'left-1'}`} />
    </div>
  );

  const roles = [
    { id: 'Admin', icon: UserCog, label: 'Admin', desc: 'Full access to all settings and team management.' },
    { id: 'Editor', icon: Edit3, label: 'Editor', desc: 'Can edit content and projects but cannot manage users.' },
    { id: 'Viewer', icon: Eye, label: 'Viewer', desc: 'Read-only access to projects and reports.' },
  ];

  const activeSessions = [
    { device: 'MacBook Pro 16"', location: 'San Francisco, US', active: 'Now', icon: Laptop },
    { device: 'iPhone 14 Pro', location: 'Lagos, NG', active: '2 hours ago', icon: Smartphone },
    { device: 'Chrome on Windows', location: 'London, UK', active: 'May 12, 2024', icon: Globe },
  ];

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Manage your account and workspace preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-xl ${
            isSaved ? 'bg-green-500 text-white' : 'bg-black text-white hover:scale-105 active:scale-95'
          }`}
        >
          {isSaved ? <><Check size={16} /> Preferences Saved</> : 'Save Changes'}
        </button>
      </header>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-2">
          {[
            { id: 'General', icon: User, label: 'Profile & Account' },
            { id: 'Security', icon: Shield, label: 'Security & Access' },
            { id: 'Notifications', icon: Bell, label: 'Notifications' },
            { id: 'Billing', icon: CreditCard, label: 'Billing & Plans' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all border ${
                activeSubTab === tab.id 
                ? 'bg-black text-white border-black shadow-lg scale-[1.02]' 
                : 'bg-white/40 text-gray-500 border-white hover:bg-white/60'
              }`}
            >
              <tab.icon size={18} />
              <span className="text-sm font-bold">{tab.label}</span>
              {activeSubTab === tab.id && <ArrowRight size={14} className="ml-auto opacity-40" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="col-span-12 lg:col-span-9 glass-dark rounded-[48px] p-10 border border-white/10 relative overflow-hidden min-h-[600px]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10 space-y-10">
            {activeSubTab === 'General' && (
              <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-10">
                {/* Personal Profile Section */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-6">Personal Profile</h3>
                  
                  {/* Banner & Avatar Wrapper */}
                  <div className="mb-8 group relative">
                    <div className="h-40 w-full rounded-[32px] overflow-hidden relative border border-white/10 bg-gray-900 group-hover:opacity-90 transition-all cursor-pointer" onClick={() => mainBannerInputRef.current?.click()}>
                       <img src={userProfile.banner} className="w-full h-full object-cover" alt="Banner" />
                       <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest"><Camera size={18} /> Change Banner</div>
                       </div>
                    </div>
                    <input type="file" hidden ref={mainBannerInputRef} accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} />
                    
                    <div className="absolute -bottom-10 left-10">
                       <div className="relative group/avatar">
                          <img 
                            src={userProfile.avatar} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-[32px] border-4 border-black object-cover shadow-2xl group-hover/avatar:opacity-80 transition-all cursor-pointer" 
                            onClick={(e) => { e.stopPropagation(); mainAvatarInputRef.current?.click(); }}
                          />
                          <button 
                            onClick={(e) => { e.stopPropagation(); mainAvatarInputRef.current?.click(); }}
                            className="absolute bottom-[-4px] right-[-4px] p-2 bg-white rounded-xl shadow-xl text-black hover:scale-110 transition-transform"
                          >
                            <Camera size={14} />
                          </button>
                          <input type="file" hidden ref={mainAvatarInputRef} accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                       </div>
                    </div>
                  </div>

                  <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                      <input 
                        type="text" 
                        value={userProfile.name}
                        onChange={(e) => onUpdateProfile({ name: e.target.value })}
                        className="w-full bg-white border border-white rounded-[24px] p-4 text-sm font-bold outline-none text-black focus:ring-4 focus:ring-white/10 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Global Title</label>
                      <input 
                        type="text" 
                        value={userProfile.role}
                        onChange={(e) => onUpdateProfile({ role: e.target.value })}
                        className="w-full bg-white border border-white rounded-[24px] p-4 text-sm font-bold outline-none text-black focus:ring-4 focus:ring-white/10 transition-all" 
                      />
                    </div>
                  </div>
                </section>

                {/* Team Management Section */}
                <section className="pt-8 border-t border-white/5">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">Team Management</h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Add, Remove, and Edit members from your workspace</p>
                    </div>
                    <button 
                      onClick={openAddMember}
                      className="p-3 bg-white text-black rounded-2xl hover:bg-white/90 transition-all shadow-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-95"
                    >
                      <UserPlus size={16} /> New Member
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="bg-white/5 border border-white/5 p-5 rounded-[32px] flex flex-col items-center group relative hover:bg-white/10 transition-all">
                        <div className="relative mb-4">
                          <img 
                            src={member.avatar} 
                            alt={member.name} 
                            className="w-20 h-20 rounded-[28px] object-cover shadow-xl border border-white/10 transition-all group-hover:scale-105" 
                          />
                          <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-lg border-2 border-black ${member.permission === 'Admin' ? 'bg-indigo-600' : member.permission === 'Editor' ? 'bg-amber-600' : 'bg-slate-600'}`}>
                             {member.permission === 'Admin' ? <UserCog size={10} className="text-white" /> : member.permission === 'Editor' ? <Edit3 size={10} className="text-white" /> : <Eye size={10} className="text-white" />}
                          </div>
                        </div>
                        <div className="text-center w-full overflow-hidden">
                          <p className="text-sm font-bold text-white truncate">{member.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">{member.role}</p>
                        </div>
                        
                        {/* Inline Permission Selector */}
                        <div className="flex bg-black/20 p-1 rounded-xl w-full mt-4 border border-white/5">
                          {(['Admin', 'Editor', 'Viewer'] as const).map((role) => (
                            <button
                              key={role}
                              onClick={() => handleUpdatePermission(member.id, role)}
                              className={`flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${
                                member.permission === role 
                                ? (role === 'Admin' ? 'bg-indigo-600 text-white shadow-lg' : role === 'Editor' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-600 text-white shadow-lg') 
                                : 'text-gray-500 hover:text-gray-300'
                              }`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                        
                        <div className="flex gap-2 mt-4 w-full">
                          <button 
                            onClick={() => openEditMember(member)}
                            className="flex-1 py-2 bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button 
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-2 bg-red-400/10 text-red-400 rounded-xl hover:bg-red-400 hover:text-white transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={openAddMember}
                      className="border-2 border-dashed border-white/10 p-6 rounded-[32px] flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-white/30 transition-all min-h-[180px]"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:scale-110 transition-all">
                        <Plus size={24} />
                      </div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white">Add Member</p>
                    </button>
                  </div>
                </section>
              </div>
            )}

            {activeSubTab === 'Security' && (
              <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-10">
                {/* Password Management */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Key className="text-indigo-400" size={24} />
                    <h3 className="text-xl font-bold text-white">Password Management</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-8 rounded-[40px] border border-white/5 relative overflow-hidden">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Current Password</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••"
                            className="w-full bg-black/40 border border-white/10 rounded-[24px] p-4 text-sm font-bold outline-none text-white focus:ring-4 focus:ring-white/5 transition-all" 
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">New Password</label>
                        <input 
                          type="password" 
                          placeholder="At least 8 characters"
                          className="w-full bg-black/40 border border-white/10 rounded-[24px] p-4 text-sm font-bold outline-none text-white focus:ring-4 focus:ring-white/5 transition-all" 
                        />
                      </div>
                      <button className="px-8 py-4 bg-white text-black rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95">
                        Update Password
                      </button>
                    </div>
                    
                    <div className="flex flex-col justify-center p-6 bg-indigo-600/10 rounded-[32px] border border-indigo-500/10">
                       <ShieldAlert className="text-indigo-400 mb-4" size={32} />
                       <h4 className="text-white font-black text-sm mb-2 uppercase tracking-widest">Security Tip</h4>
                       <p className="text-gray-400 text-xs font-medium leading-relaxed">
                         Avoid using passwords from other sites or something easy to guess like your birthday. Use a mix of letters, numbers, and symbols.
                       </p>
                    </div>
                  </div>
                </section>

                {/* Two-Factor Authentication */}
                <section className="pt-8 border-t border-white/5">
                   <div className="flex items-center justify-between p-8 bg-white/5 rounded-[40px] border border-white/5">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400">
                          <Smartphone size={28} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Two-Factor Authentication</h3>
                          <p className="text-xs text-gray-500 font-medium mt-1">Verify your identity via mobile app or SMS during login.</p>
                        </div>
                      </div>
                      <Toggle active={is2FAEnabled} onToggle={() => setIs2FAEnabled(!is2FAEnabled)} />
                   </div>
                </section>

                {/* Active Sessions */}
                <section className="pt-8 border-t border-white/5">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Active Sessions</h3>
                      <button className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors">Terminate All</button>
                   </div>
                   <div className="space-y-3">
                      {activeSessions.map((session, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-[32px] hover:bg-white/10 transition-all group">
                           <div className="flex items-center gap-5">
                              <div className="p-3 bg-white/10 rounded-2xl text-white group-hover:scale-110 transition-transform">
                                <session.icon size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">{session.device}</p>
                                <p className="text-[10px] text-gray-500 font-medium">{session.location} • <span className={session.active === 'Now' ? 'text-green-500' : ''}>{session.active}</span></p>
                              </div>
                           </div>
                           <button className="p-2 text-gray-500 hover:text-white transition-colors">
                              <LogOut size={16} />
                           </button>
                        </div>
                      ))}
                   </div>
                </section>

                {/* Danger Zone */}
                <section className="pt-8 border-t border-white/5">
                   <div className="p-8 bg-red-500/5 rounded-[40px] border border-red-500/10 space-y-6">
                      <div className="flex items-center gap-3 text-red-400">
                        <Trash2 size={24} />
                        <h3 className="text-xl font-bold">Danger Zone</h3>
                      </div>
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                         <div className="max-w-md">
                           <p className="text-sm font-bold text-white">Delete Workspace & Account</p>
                           <p className="text-xs text-gray-500 font-medium mt-1">Once you delete your account, there is no going back. Please be certain.</p>
                         </div>
                         <button className="px-8 py-4 border border-red-500/20 text-red-500 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-95">
                           Delete Account
                         </button>
                      </div>
                   </div>
                </section>
              </div>
            )}

            {(activeSubTab === 'Notifications' || activeSubTab === 'Billing') && (
              <div className="py-24 flex flex-col items-center justify-center opacity-40">
                <div className="p-10 rounded-full border-2 border-dashed border-white/20 mb-6">
                   <Sliders size={64} className="text-white" />
                </div>
                <h3 className="text-white text-xl font-bold">{activeSubTab} Configuration</h3>
                <p className="text-gray-500 mt-2 text-sm font-medium">This panel is ready for integration.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Member Edit/Add Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsMemberModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[48px] shadow-2xl p-10 border border-white animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {editingMember ? 'Edit Profile' : 'New Member'}
              </h2>
              <button 
                onClick={() => setIsMemberModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submitMemberForm} className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="relative group">
                  <img 
                    src={memberForm.avatar} 
                    alt="Preview" 
                    className="w-24 h-24 rounded-[32px] border-4 border-gray-100 object-cover shadow-lg"
                  />
                  <button 
                    type="button"
                    onClick={() => memberAvatarInputRef.current?.click()}
                    className="absolute bottom-[-8px] right-[-8px] p-3 bg-black text-white rounded-2xl shadow-xl hover:scale-110 transition-transform"
                  >
                    <Upload size={16} />
                  </button>
                  <input type="file" hidden ref={memberAvatarInputRef} accept="image/*" onChange={(e) => handleFileUpload(e, 'member')} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Name</label>
                  <input 
                    type="text" required
                    value={memberForm.name}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Member full name"
                    className="w-full bg-gray-50 border border-gray-100 rounded-[24px] p-4 text-sm font-bold outline-none text-black focus:ring-4 focus:ring-indigo-100 transition-all" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Role / Position</label>
                  <input 
                    type="text" required
                    value={memberForm.role}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="E.g. Senior Designer"
                    className="w-full bg-gray-50 border border-gray-100 rounded-[24px] p-4 text-sm font-bold outline-none text-black focus:ring-4 focus:ring-indigo-100 transition-all" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Access Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Admin', 'Editor', 'Viewer'].map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setMemberForm(prev => ({ ...prev, permission: p as any }))}
                        className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${
                          memberForm.permission === p 
                          ? 'bg-black text-white shadow-lg' 
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-5 bg-black text-white rounded-3xl font-black text-sm shadow-xl transition-all hover:bg-gray-900 active:scale-95"
              >
                {editingMember ? 'Update Profile' : 'Invite Member'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsSection;
