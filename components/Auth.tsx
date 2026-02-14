
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, Github, Chrome, CheckCircle2, ShieldCheck, MailWarning, Loader2, X, Bell } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (userData: { name: string; email: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState<{ show: boolean; address: string; type: 'login' | 'signup' }>({ show: false, address: '', type: 'login' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (mode === 'signup' && !formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    
    // Simulate API request and Email dispatch
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent({ show: true, address: formData.email, type: mode });
      
      // Auto-transition to dashboard after simulated email dispatch
      setTimeout(() => {
        onAuthSuccess({ name: formData.name || 'User', email: formData.email });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-black selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[100px]"></div>

      {/* Simulated Email Toast */}
      {emailSent.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4">
          <div className="glass-dark border border-white/20 p-6 rounded-[32px] shadow-2xl animate-in slide-in-from-top-10 duration-500 flex items-center gap-5">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shrink-0">
               <Bell className="animate-bounce" size={24} />
            </div>
            <div>
               <h4 className="text-white font-black text-sm uppercase tracking-widest">Email Dispatched!</h4>
               <p className="text-gray-400 text-xs mt-1 font-medium leading-relaxed">
                 A {emailSent.type === 'signup' ? 'verification' : 'security alert'} email has been sent to <span className="text-indigo-400 font-black">{emailSent.address}</span>.
               </p>
            </div>
          </div>
        </div>
      )}

      {/* Auth Card */}
      <div className="relative w-full max-w-[460px] glass-dark rounded-[48px] border border-white/10 p-10 lg:p-14 shadow-2xl animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-black font-black text-3xl mb-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">C</div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-3">
            {mode === 'login' ? 'Welcome Back.' : 'Join the Elite.'}
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            {mode === 'login' ? 'Access your high-performance workspace.' : 'Create your secure development profile today.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 group-focus-within:text-indigo-400 transition-colors">Full Name</label>
              <div className={`flex items-center gap-4 bg-white/5 border rounded-[24px] px-5 py-4 transition-all focus-within:bg-white/10 ${errors.name ? 'border-red-500/50' : 'border-white/10'}`}>
                <User size={18} className="text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Ann Kowalski"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="bg-transparent w-full text-white text-sm font-bold outline-none placeholder:text-gray-700"
                />
              </div>
              {errors.name && <p className="text-[10px] text-red-500 font-black uppercase tracking-wider px-1">{errors.name}</p>}
            </div>
          )}

          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 group-focus-within:text-indigo-400 transition-colors">Email Address</label>
            <div className={`flex items-center gap-4 bg-white/5 border rounded-[24px] px-5 py-4 transition-all focus-within:bg-white/10 ${errors.email ? 'border-red-500/50' : 'border-white/10'}`}>
              <Mail size={18} className="text-gray-500" />
              <input 
                type="email" 
                placeholder="ann@coders.io"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="bg-transparent w-full text-white text-sm font-bold outline-none placeholder:text-gray-700"
              />
            </div>
            {errors.email && <p className="text-[10px] text-red-500 font-black uppercase tracking-wider px-1">{errors.email}</p>}
          </div>

          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 group-focus-within:text-indigo-400 transition-colors">Password</label>
            <div className={`flex items-center gap-4 bg-white/5 border rounded-[24px] px-5 py-4 transition-all focus-within:bg-white/10 ${errors.password ? 'border-red-500/50' : 'border-white/10'}`}>
              <Lock size={18} className="text-gray-500" />
              <input 
                type="password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="bg-transparent w-full text-white text-sm font-bold outline-none placeholder:text-gray-700"
              />
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-black uppercase tracking-wider px-1">{errors.password}</p>}
          </div>

          {mode === 'signup' && (
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 group-focus-within:text-indigo-400 transition-colors">Confirm Password</label>
              <div className={`flex items-center gap-4 bg-white/5 border rounded-[24px] px-5 py-4 transition-all focus-within:bg-white/10 ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'}`}>
                <ShieldCheck size={18} className="text-gray-500" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  className="bg-transparent w-full text-white text-sm font-bold outline-none placeholder:text-gray-700"
                />
              </div>
              {errors.confirmPassword && <p className="text-[10px] text-red-500 font-black uppercase tracking-wider px-1">{errors.confirmPassword}</p>}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-5 bg-white text-black rounded-[28px] font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                {mode === 'login' ? 'Identify Me' : 'Initialize Account'} 
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8">
           <div className="relative flex items-center justify-center mb-8">
              <div className="absolute w-full h-[1px] bg-white/10"></div>
              <span className="relative bg-[#0a0a0a] px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">or bypass with</span>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors group">
                 <Github size={18} className="text-white group-hover:scale-110 transition-transform" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Github</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors group">
                 <Chrome size={18} className="text-white group-hover:scale-110 transition-transform" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Google</span>
              </button>
           </div>
        </div>

        <div className="mt-10 text-center">
           <button 
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setErrors({});
            }}
            className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-indigo-400 transition-colors"
           >
             {mode === 'login' ? "New around here? Create Workspace" : "Already elite? Sign In instead"}
           </button>
        </div>
      </div>
      
      {/* Policy Footer */}
      <p className="absolute bottom-10 text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">
        Coders OS v4.0 • Secured with TLS 1.3 Encryption
      </p>
    </div>
  );
};

export default Auth;
