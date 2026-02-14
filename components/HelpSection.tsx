
import React, { useState, useRef, useEffect } from 'react';
import { Search, HelpCircle, BookOpen, MessageSquare, Zap, ChevronDown, ChevronRight, Layout, Calendar, ArrowRightLeft, Settings, LifeBuoy, ExternalLink, Lightbulb, Keyboard, Info, CheckCircle2, X, Send, Mic, MicOff, Loader2, Headphones, Save } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

interface HelpTip {
  id: string;
  category: 'Basics' | 'Advanced' | 'Security';
  title: string;
  summary: string;
  detail: string;
  icon: any;
}

// Audio Utilities for Live API
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const HelpSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Modal states
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [isTicketSubmitted, setIsTicketSubmitted] = useState(false);

  // Ticket Form States
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [draftSavedStatus, setDraftSavedStatus] = useState(false);

  // Live Chat State
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [chatLog, setChatLog] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  // Hotkeys for HelpSection
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setIsTicketModalOpen(true);
      }
      if (e.key === 'Escape') {
        setIsTicketModalOpen(false);
        closeLiveChat();
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, []);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedSubject = localStorage.getItem('coders_ticket_draft_subject');
    const savedMessage = localStorage.getItem('coders_ticket_draft_message');
    if (savedSubject) setTicketSubject(savedSubject);
    if (savedMessage) setTicketMessage(savedMessage);
  }, []);

  const handleSaveDraft = () => {
    localStorage.setItem('coders_ticket_draft_subject', ticketSubject);
    localStorage.setItem('coders_ticket_draft_message', ticketMessage);
    setDraftSavedStatus(true);
    setTimeout(() => setDraftSavedStatus(false), 2000);
  };

  const clearDraft = () => {
    localStorage.removeItem('coders_ticket_draft_subject');
    localStorage.removeItem('coders_ticket_draft_message');
    setTicketSubject('');
    setTicketMessage('');
  };

  const tips: HelpTip[] = [
    {
      id: '1',
      category: 'Basics',
      title: 'Managing Your Task Timeline',
      summary: 'Learn how to track progress and handle task dependencies.',
      detail: 'The Management section uses a GANTT-style timeline. Tasks with prerequisites will appear with a lock icon until their dependencies are marked as "Done". Click any task bar for detailed progress and assigned members.',
      icon: Layout
    },
    {
      id: '2',
      category: 'Advanced',
      title: 'Advanced Financial Filtering',
      summary: 'Power user tips for the Transactions dashboard.',
      detail: 'Click the "Filter" icon in Transactions to open the Advanced Panel. Filter by custom date ranges, amounts, and transaction types. Sorting is available via column headers.',
      icon: ArrowRightLeft
    },
    {
      id: '3',
      category: 'Security',
      title: 'Understanding Team Permissions',
      summary: 'The difference between Admin, Editor, and Viewer roles.',
      detail: 'Admins have full workspace control. Editors can modify content and projects but cannot manage users. Viewers have read-only access to all dashboards.',
      icon: Settings
    },
    {
      id: '4',
      category: 'Basics',
      title: 'Scheduling Deep Work',
      summary: 'Boost productivity with focused time blocks.',
      detail: 'Deep Work events in the Schedule section block off time for focused development. They are automatically styled with high contrast to stand out from meetings.',
      icon: Calendar
    }
  ];

  const startLiveChat = async () => {
    setIsConnecting(true);
    setIsLiveChatOpen(true);
    setChatLog(["Connecting to support specialist..."]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsMicOn(true);
            setChatLog(prev => [...prev, "Connected! You can start speaking now."]);

            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              if (!isMicOn) return;
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };

              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64EncodedAudioString) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64EncodedAudioString), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            setChatLog(prev => [...prev, "Critical error. Restarting session..."]);
          },
          onclose: () => {
            setIsLiveChatOpen(false);
            setIsMicOn(false);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are a friendly dashboard support agent for Coders. Help the user with navigation, tasks, and settings. Keep answers concise and spoken.',
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setChatLog(prev => [...prev, "Connection failed. Please check microphone permissions."]);
      setIsConnecting(false);
    }
  };

  const closeLiveChat = () => {
    if (sessionRef.current) {
        try { sessionRef.current.close(); } catch (e) {}
    }
    if (audioContextRef.current) audioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    setIsLiveChatOpen(false);
    setIsMicOn(false);
    setIsConnecting(false);
    sessionRef.current = null;
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTicketSubmitted(true);
    // Simulation: in real app, we'd send data to a backend here
    setTimeout(() => {
      setIsTicketSubmitted(false);
      setIsTicketModalOpen(false);
      clearDraft();
    }, 2500);
  };

  const filteredTips = tips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tip.detail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tip.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const shortcuts = [
    { keys: ['G', 'P'], action: 'Go to Projects' },
    { keys: ['G', 'T'], action: 'Go to Transactions' },
    { keys: ['G', 'S'], action: 'Go to Settings' },
    { keys: ['G', 'H'], action: 'Go to Help' },
    { keys: ['Alt', 'C'], action: 'Direct Ticket' },
    { keys: ['Esc'], action: 'Close Support' },
  ];

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Help Center</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Get the most out of the Coders Dashboard.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/60 px-5 py-2.5 rounded-full border border-white gap-3 min-w-[280px] focus-within:ring-4 focus-within:ring-black/5 transition-all">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search help topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs outline-none w-full font-bold text-black" 
            />
          </div>
          <button 
            onClick={() => setIsTicketModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
             <MessageSquare size={16} /> Contact Support
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Basics', 'Advanced', 'Security'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                  activeCategory === cat 
                  ? 'bg-black text-white border-black shadow-lg' 
                  : 'bg-white/60 text-gray-400 border-white hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredTips.map((tip, index) => (
              <div 
                key={tip.id}
                className={`glass rounded-[32px] overflow-hidden transition-all duration-500 border border-white/40 ${
                  expandedTip === tip.id ? 'shadow-2xl scale-[1.01]' : 'hover:bg-white/60'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button 
                  onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                  className="w-full flex items-center gap-6 p-6 text-left outline-none group"
                >
                  <div className={`p-4 rounded-2xl transition-all duration-500 ${
                    expandedTip === tip.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 group-hover:text-black'
                  }`}>
                    <tip.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500">{tip.category}</span>
                      <div className="h-1 w-1 rounded-full bg-gray-200"></div>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight mt-1">{tip.title}</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">{tip.summary}</p>
                  </div>
                  <div className={`transition-transform duration-500 ${expandedTip === tip.id ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} className="text-gray-300" />
                  </div>
                </button>
                
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  expandedTip === tip.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="p-10 pt-0 ml-[76px] border-l-2 border-gray-50">
                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                      <div className="flex items-center gap-3 mb-4 text-indigo-600">
                         <Info size={18} />
                         <span className="text-xs font-black uppercase tracking-widest">Detailed Note</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        {tip.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-600 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
               <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center shrink-0 animate-pulse">
                  <LifeBuoy size={32} />
               </div>
               <div className="flex-1 text-center md:text-left space-y-2">
                 <h2 className="text-2xl font-black tracking-tight leading-none">Need direct help?</h2>
                 <p className="text-indigo-100 font-medium text-sm max-w-lg">Our specialized support team is available 24/7 via voice for Enterprise customers.</p>
               </div>
               <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                 <button 
                   onClick={startLiveChat}
                   className="bg-white text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
                 >
                   <Headphones size={16} /> Live Voice
                 </button>
                 <button 
                   onClick={() => setIsTicketModalOpen(true)}
                   className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all text-center"
                 >
                   Submit Ticket
                 </button>
               </div>
            </div>
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="glass rounded-[40px] p-8 border border-white/40 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
              <Zap size={18} className="text-yellow-500 fill-yellow-500" /> Quick Resources
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Video Tutorials', icon: BookOpen },
                { label: 'API Reference', icon: Zap },
                { label: 'Release Notes', icon: Lightbulb },
              ].map((link, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/40 hover:bg-white transition-all group border border-transparent hover:border-white shadow-sm hover:shadow-md">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                         <link.icon size={14} />
                      </div>
                      <span className="text-xs font-bold text-gray-600 group-hover:text-black">{link.label}</span>
                   </div>
                   <ExternalLink size={12} className="text-gray-300 group-hover:text-black" />
                </button>
              ))}
            </div>
          </div>

          <div className="glass-dark rounded-[40px] p-8 border border-white/10 shadow-xl space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
              <Keyboard size={18} className="text-indigo-400" /> Hotkeys
            </h3>
            <div className="space-y-4">
              {shortcuts.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-400">{s.action}</span>
                  <div className="flex gap-1">
                    {s.keys.map((k, j) => (
                      <kbd key={j} className="min-w-[24px] px-1.5 py-1 bg-white/10 rounded-lg border border-white/10 text-[10px] font-black text-white text-center shadow-sm">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/40 rounded-[40px] p-8 border border-white shadow-sm space-y-6 relative overflow-hidden group">
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">System Status</h3>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Online</span>
              </div>
            </div>
            <div className="space-y-4 relative z-10">
               {[
                 { label: 'Cloud Sync', status: 'Healthy' },
                 { label: 'Real-time API', status: 'Healthy' },
                 { label: 'Payments', status: 'Healthy' }
               ].map((sys, i) => (
                 <div key={i} className="flex justify-between items-center text-[11px]">
                   <span className="font-bold text-gray-500">{sys.label}</span>
                   <CheckCircle2 size={14} className="text-green-500" />
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => !isTicketSubmitted && setIsTicketModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[48px] shadow-2xl p-10 border border-white animate-scale-in">
            {isTicketSubmitted ? (
              <div className="py-20 text-center space-y-4 animate-in fade-in zoom-in">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-green-200">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Ticket Received!</h2>
                <p className="text-gray-500 font-medium">Our agents are analyzing your request. Check your email for updates.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                     <h2 className="text-3xl font-black text-gray-900 tracking-tight">Submit Ticket</h2>
                     <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-indigo-100">Direct Support</span>
                  </div>
                  <button onClick={() => setIsTicketModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                </div>
                <form onSubmit={handleTicketSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Subject</label>
                    <input 
                      type="text" 
                      required 
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="Brief summary of issue" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-[24px] p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-black" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Message</label>
                    <textarea 
                      required 
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Detailed description..." 
                      className="w-full bg-gray-50 border border-gray-100 rounded-[24px] p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-black h-32 resize-none" 
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={handleSaveDraft}
                      className={`flex-1 py-5 border rounded-3xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 ${
                        draftSavedStatus ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {draftSavedStatus ? <><CheckCircle2 size={18} /> Saved</> : <><Save size={18} /> Save Draft</>}
                    </button>
                    <button 
                      type="submit" 
                      className="flex-[2] py-5 bg-black text-white rounded-3xl font-black text-sm shadow-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                      Submit Request <Send size={18} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Live Voice Chat Overlay */}
      {isLiveChatOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={closeLiveChat}></div>
          <div className="relative w-full max-w-2xl text-center space-y-10 animate-in zoom-in fade-in duration-500">
            <div className="relative inline-block">
               <div className={`w-40 h-40 rounded-full border-4 border-indigo-500 flex items-center justify-center transition-all duration-1000 ${isConnecting ? 'animate-pulse' : 'shadow-[0_0_50px_rgba(99,102,241,0.4)]'}`}>
                  {isConnecting ? (
                    <Loader2 size={64} className="text-indigo-400 animate-spin" />
                  ) : (
                    <Mic size={64} className={`${isMicOn ? 'text-indigo-400' : 'text-gray-600'} transition-colors`} />
                  )}
               </div>
               {!isConnecting && isMicOn && (
                 <div className="absolute inset-0 animate-ping rounded-full border-2 border-indigo-400/30 -z-10"></div>
               )}
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white tracking-tight">
                {isConnecting ? "Establishing Connection..." : "Voice Chat Active"}
              </h2>
              <div className="max-h-32 overflow-y-auto space-y-2 px-10 no-scrollbar">
                {chatLog.map((msg, i) => (
                  <p key={i} className={`text-sm font-medium ${i === chatLog.length - 1 ? 'text-indigo-400' : 'text-gray-500'}`}>{msg}</p>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-6 pt-10">
              <button 
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all border ${isMicOn ? 'bg-white/10 text-white border-white/20' : 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/20'}`}
              >
                {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
              <button 
                onClick={closeLiveChat}
                className="w-16 h-16 rounded-full bg-red-600 text-white border border-red-400 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-red-600/20"
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Press Esc to disconnect instantly</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSection;
