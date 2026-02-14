
import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Video, Phone, MoreVertical, Plus, Smile, Image as ImageIcon, Paperclip, CheckCheck, Circle, ChevronLeft } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: string;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
  isTyping?: boolean;
}

const initialChats: Chat[] = [
  {
    id: 'c1',
    name: 'Sophie B.',
    avatar: 'https://picsum.photos/seed/sophie/200/200',
    status: 'online',
    lastSeen: 'Now',
    unreadCount: 2,
    lastMessage: 'Hi! I need more information about the 2026 UI release.',
    messages: [
      { id: '1', senderId: 'c1', text: 'Hey there! How is the project coming along?', time: '10:00 AM', isMe: false },
      { id: '2', senderId: 'me', text: 'Going great, Sophie! We are finishing the glass components.', time: '10:05 AM', isMe: true },
      { id: '3', senderId: 'c1', text: 'Awesome! Can you send over the latest prototypes?', time: '10:10 AM', isMe: false },
    ]
  },
  {
    id: 'c2',
    name: 'Jack Wilson',
    avatar: 'https://picsum.photos/seed/p3/200/200',
    status: 'away',
    lastSeen: '10m ago',
    unreadCount: 0,
    lastMessage: 'The bug fix is deployed. Check the latest build.',
    messages: [
      { id: '1', senderId: 'c2', text: 'Found a small issue in the auth flow.', time: '09:00 AM', isMe: false },
      { id: '2', senderId: 'me', text: 'Is it the token refresh?', time: '09:15 AM', isMe: true },
      { id: '3', senderId: 'c2', text: 'Exactly. Deploying the fix now.', time: '09:30 AM', isMe: false },
    ]
  },
  {
    id: 'c3',
    name: 'Sarah Connor',
    avatar: 'https://picsum.photos/seed/p7/200/200',
    status: 'offline',
    lastSeen: '1h ago',
    unreadCount: 0,
    lastMessage: 'Can we sync at 2 PM today?',
    messages: []
  }
];

const automatedResponses = [
  "That sounds like a plan!",
  "Can we look at the metrics first?",
  "I'll have the assets ready by tonight.",
  "Did you see the new 2026 design tokens?",
  "The server sync was successful.",
  "I'm currently in a meeting, talk soon?",
  "Let's jump on a call at 3 PM.",
  "Check the latest commit on main."
];

const MessagesSection: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(initialChats[0].id);
  const [inputText, setInputText] = useState('');
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const selectedChat = chats.find(c => c.id === selectedChatId) || chats[0];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [selectedChat.messages, selectedChat.isTyping]);

  const handleSelectChat = (id: string) => {
    setSelectedChatId(id);
    setIsMobileListVisible(false);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setChats(prev => prev.map(c => 
      c.id === selectedChatId 
        ? { ...c, messages: [...c.messages, newMessage], lastMessage: inputText } 
        : c
    ));
    setInputText('');
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4 lg:space-y-8 animate-in fade-in duration-700 pb-4">
      <header className={`flex flex-wrap items-center justify-between gap-4 ${!isMobileListVisible ? 'hidden lg:flex' : 'flex'}`}>
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight uppercase">Messages</h1>
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">2026 CLOUD SYNC</p>
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="flex-1 lg:flex-none flex items-center bg-white/60 px-5 py-2.5 rounded-full border border-white gap-3 lg:min-w-[240px]">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter..." 
              className="bg-transparent text-xs outline-none w-full font-bold text-black uppercase tracking-tighter" 
            />
          </div>
          <button className="p-3 bg-black text-white rounded-full shadow-lg">
             <Plus size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 grid grid-cols-12 gap-0 lg:gap-8 items-stretch overflow-hidden">
        {/* Chat List */}
        <div className={`col-span-12 lg:col-span-4 glass lg:rounded-[48px] p-6 border-0 lg:border border-white/60 shadow-none lg:shadow-sm flex flex-col space-y-4 overflow-hidden ${!isMobileListVisible ? 'hidden lg:flex' : 'flex'}`}>
          <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest px-4">Active Matrix</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-[28px] transition-all relative group ${
                  selectedChatId === chat.id ? 'bg-black text-white shadow-xl scale-[1.02]' : 'hover:bg-white/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img src={chat.avatar} className="w-12 h-12 rounded-2xl object-cover border border-white/10" alt={chat.name} />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    chat.status === 'online' ? 'bg-green-500' : chat.status === 'away' ? 'bg-amber-500' : 'bg-gray-400'
                  }`} />
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="text-sm font-black truncate uppercase tracking-tight">{chat.name}</p>
                    <span className="text-[8px] font-black uppercase text-gray-400">
                      {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].time : ''}
                    </span>
                  </div>
                  <p className={`text-[10px] font-medium truncate ${selectedChatId === chat.id ? 'text-gray-400' : 'text-gray-500'}`}>
                    {chat.isTyping ? 'Typing...' : chat.lastMessage}
                  </p>
                </div>
                {chat.unreadCount > 0 && selectedChatId !== chat.id && (
                  <div className="absolute top-4 right-4 w-5 h-5 bg-indigo-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                    {chat.unreadCount}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`col-span-12 lg:col-span-8 glass-dark lg:rounded-[48px] border-0 lg:border border-white/10 shadow-none lg:shadow-2xl overflow-hidden flex flex-col relative ${isMobileListVisible ? 'hidden lg:flex' : 'flex'}`}>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          {/* Chat Header */}
          <div className="p-6 lg:p-8 border-b border-white/5 flex items-center justify-between relative z-10 bg-black/20 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileListVisible(true)}
                className="lg:hidden p-2 text-white/60 hover:text-white"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="relative shrink-0">
                <img src={selectedChat.avatar} className="w-10 lg:w-12 h-10 lg:h-12 rounded-2xl object-cover shadow-lg" alt={selectedChat.name} />
                <div className={`absolute -bottom-1 -right-1 w-3 lg:w-4 h-3 lg:h-4 rounded-full border-2 border-black ${
                  selectedChat.status === 'online' ? 'bg-green-500' : selectedChat.status === 'away' ? 'bg-amber-500' : 'bg-gray-400'
                }`} />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-lg lg:text-xl font-black text-white uppercase tracking-tight truncate">{selectedChat.name}</h3>
                <p className="text-[8px] lg:text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  {selectedChat.status === 'online' ? 'Active Now' : `Last seen ${selectedChat.lastSeen}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <button className="p-2 lg:p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all"><Phone size={16} /></button>
              <button className="p-2 lg:p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all"><Video size={16} /></button>
            </div>
          </div>

          <div ref={chatContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-4 lg:space-y-6 relative z-10">
            {selectedChat.messages.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center"><Send size={24} className="opacity-20" /></div>
                  <p className="text-sm font-medium">Initialize conversation...</p>
               </div>
            ) : (
              selectedChat.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[85%] lg:max-w-[70%] space-y-1 ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`p-3 lg:p-4 rounded-[20px] lg:rounded-[28px] text-xs lg:text-sm font-medium ${
                      msg.isMe 
                      ? 'bg-indigo-600 text-white rounded-tr-lg shadow-xl' 
                      : 'bg-white/10 text-white rounded-tl-lg border border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-2 px-2">
                       <span className="text-[8px] font-black text-gray-500 uppercase">{msg.time}</span>
                       {msg.isMe && <CheckCheck size={10} className="text-indigo-400" />}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 lg:p-8 relative z-10">
            <form onSubmit={handleSendMessage} className="bg-white/5 border border-white/10 rounded-[28px] lg:rounded-[32px] p-1.5 flex items-center gap-1 focus-within:ring-4 focus-within:ring-white/5 transition-all">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Secure message..." 
                className="flex-1 bg-transparent text-xs lg:text-sm font-bold text-white outline-none px-4"
              />
              <div className="flex items-center">
                <button type="button" className="p-2 text-gray-500 hover:text-white transition-colors"><Smile size={18} /></button>
                <button type="button" className="p-2 text-gray-500 hover:text-white transition-colors hidden sm:block"><Paperclip size={18} /></button>
              </div>
              <button type="submit" className="bg-white text-black p-3 lg:p-4 rounded-2xl lg:rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesSection;
