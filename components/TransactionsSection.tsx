
import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, Download, MoreHorizontal, ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, ShoppingBag, Send, RefreshCw, ChevronRight, Layout, Calendar as CalendarIcon, CloudSun, Bell, Video, X, ShieldCheck, Copy, Printer, Share2, Landmark, CalendarDays, DollarSign, ChevronUp, ChevronDown, Repeat, ArrowUp, Zap, Hash } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface Transaction {
  id: string;
  type: 'Inbound' | 'Outbound' | 'Subscription' | 'Transfer' | 'Withdrawal';
  amount: number;
  category: 'Software' | 'Service' | 'Payout' | 'Marketing' | 'Refund' | 'Investment' | 'Personal' | 'Savings';
  description: string;
  date: string; // Format: "Feb 12, 2026"
  isoDate: string; // Format: "2026-02-12" for filtering
  time: string;
  status: 'Completed' | 'Pending' | 'Failed';
  avatar?: string;
  recipientName: string;
  paymentMethod: string;
  referenceNumber: string;
}

type SortField = 'date' | 'amount' | 'status' | 'description' | 'none';
type SortDirection = 'asc' | 'desc';

const balanceHistory = [
  { name: 'Jan 1', value: 28000 },
  { name: 'Jan 15', value: 31500 },
  { name: 'Feb 1', value: 36000 },
  { name: 'Feb 8', value: 41000 },
  { name: 'Feb 12', value: 48300 },
];

const TransactionsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const currentFullDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  
  // Advanced Filter State
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Sorting State
  const [sortField, setSortField] = useState<SortField>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // New Transaction Form State
  const [newTxType, setNewTxType] = useState<Transaction['type']>('Outbound');

  const initialTransactions: Transaction[] = [
    { 
      id: 'tx1', 
      type: 'Outbound', 
      amount: 1200, 
      category: 'Software', 
      description: 'Adobe Creative Cloud', 
      date: 'Feb 12, 2026', 
      isoDate: '2026-02-12',
      time: '10:45 AM',
      status: 'Completed', 
      avatar: 'https://picsum.photos/seed/adobe/40/40',
      recipientName: 'Adobe Systems Inc.',
      paymentMethod: 'Visa ending in 4242',
      referenceNumber: 'REF-8829102-AD'
    },
    { 
      id: 'tx2', 
      type: 'Inbound', 
      amount: 8500, 
      category: 'Payout', 
      description: 'Web Redesign - Client Payout', 
      date: 'Feb 10, 2026', 
      isoDate: '2026-02-10',
      time: '02:15 PM',
      status: 'Completed', 
      avatar: 'https://picsum.photos/seed/client1/40/40',
      recipientName: 'Vortex Global',
      paymentMethod: 'Direct Deposit',
      referenceNumber: 'REF-1102933-VX'
    },
    { 
      id: 'tx7', 
      type: 'Transfer', 
      amount: 5000, 
      category: 'Investment', 
      description: 'Transfer to Savings Vault', 
      date: 'Feb 5, 2026', 
      isoDate: '2026-02-05',
      time: '11:20 AM',
      status: 'Completed', 
      avatar: 'https://picsum.photos/seed/vault/40/40',
      recipientName: 'Main Savings Account',
      paymentMethod: 'Internal Transfer',
      referenceNumber: 'XFER-229102-SV'
    },
    { 
      id: 'tx3', 
      type: 'Subscription', 
      amount: 299, 
      category: 'Service', 
      description: 'Figma Professional Plan', 
      date: 'Jan 28, 2026', 
      isoDate: '2026-01-28',
      time: '09:00 AM',
      status: 'Completed', 
      avatar: 'https://picsum.photos/seed/figma/40/40',
      recipientName: 'Figma Inc.',
      paymentMethod: 'Mastercard ending in 1002',
      referenceNumber: 'REF-9921021-FG'
    },
    { 
      id: 'tx8', 
      type: 'Withdrawal', 
      amount: 400, 
      category: 'Personal', 
      description: 'ATM Cash Withdrawal', 
      date: 'Jan 15, 2026', 
      isoDate: '2026-01-15',
      time: '05:30 PM',
      status: 'Completed', 
      avatar: 'https://picsum.photos/seed/atm/40/40',
      recipientName: 'Self',
      paymentMethod: 'ATM Withdrawal',
      referenceNumber: 'WTH-772911-ATM'
    },
    { 
      id: 'tx4', 
      type: 'Outbound', 
      amount: 4500, 
      category: 'Marketing', 
      description: 'Facebook Ads - Q2 Campaign', 
      date: 'Jan 12, 2026', 
      isoDate: '2026-01-12',
      time: '04:30 PM',
      status: 'Pending', 
      avatar: 'https://picsum.photos/seed/meta/40/40',
      recipientName: 'Meta Platforms Inc.',
      paymentMethod: 'Business Credit Line',
      referenceNumber: 'REF-7721033-FB'
    },
    { 
      id: 'tx5', 
      type: 'Inbound', 
      amount: 12500, 
      category: 'Payout', 
      description: 'SaaS Platform Development', 
      date: 'Jan 05, 2026', 
      isoDate: '2026-01-05',
      time: '11:10 AM',
      status: 'Completed', 
      avatar: 'https://picsum.photos/seed/client2/40/40',
      recipientName: 'Stellar Solutions',
      paymentMethod: 'Direct Deposit',
      referenceNumber: 'REF-2291039-SS'
    }
  ];

  const processedTransactions = useMemo(() => {
    let result = [...initialTransactions].filter(tx => {
      const matchesText = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStartDate = !startDate || tx.isoDate >= startDate;
      const matchesEndDate = !endDate || tx.isoDate <= endDate;
      const matchesMinAmount = !minAmount || tx.amount >= parseFloat(minAmount);
      const matchesMaxAmount = !maxAmount || tx.amount <= parseFloat(maxAmount);

      return matchesText && matchesStartDate && matchesEndDate && matchesMinAmount && matchesMaxAmount;
    });

    if (sortField !== 'none') {
      result.sort((a, b) => {
        let valA: any = '';
        let valB: any = '';

        switch (sortField) {
          case 'date': valA = a.isoDate; valB = b.isoDate; break;
          case 'amount': valA = a.amount; valB = b.amount; break;
          case 'status': valA = a.status; valB = b.status; break;
          case 'description': valA = a.description.toLowerCase(); valB = b.description.toLowerCase(); break;
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [searchQuery, startDate, endDate, minAmount, maxAmount, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <div className="w-3" />;
    return sortDirection === 'asc' ? <ChevronUp size={12} className="ml-1 text-white" /> : <ChevronDown size={12} className="ml-1 text-white" />;
  };

  const clearFilters = () => {
    setStartDate('2026-01-01');
    setEndDate(new Date().toISOString().split('T')[0]);
    setMinAmount('');
    setMaxAmount('');
    setSearchQuery('');
    setSortField('none');
  };

  const getPaymentIcon = (method: string, size = 14) => {
    const lower = method.toLowerCase();
    if (lower.includes('visa')) return <CreditCard size={size} className="text-indigo-400" />;
    if (lower.includes('mastercard')) return <CreditCard size={size} className="text-orange-400" />;
    if (lower.includes('deposit')) return <Landmark size={size} className="text-emerald-400" />;
    if (lower.includes('transfer')) return <Repeat size={size} className="text-indigo-400" />;
    if (lower.includes('withdrawal')) return <ArrowUp size={size} className="text-amber-400" />;
    if (lower.includes('credit line')) return <Wallet size={size} className="text-amber-400" />;
    return <CreditCard size={size} className="text-gray-400" />;
  };

  const getTypeIcon = (type: Transaction['type'], size = 10) => {
    switch (type) {
      case 'Inbound': return <ArrowDownLeft size={size} className="text-white" />;
      case 'Outbound': return <ArrowUpRight size={size} className="text-white" />;
      case 'Subscription': return <RefreshCw size={size} className="text-white" />;
      case 'Transfer': return <Repeat size={size} className="text-white" />;
      case 'Withdrawal': return <ArrowUp size={size} className="text-white" />;
      default: return <Zap size={size} className="text-white" />;
    }
  };

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'Inbound': return 'bg-green-500';
      case 'Outbound': return 'bg-black';
      case 'Subscription': return 'bg-purple-600';
      case 'Transfer': return 'bg-indigo-600';
      case 'Withdrawal': return 'bg-amber-600';
      default: return 'bg-gray-500';
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="flex-1 min-w-[240px] bg-white/60 rounded-[32px] p-6 border border-white shadow-sm flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-default group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} shadow-lg transition-transform group-hover:-translate-y-1`}>
          <Icon size={20} className="text-white" />
        </div>
        <span className={`text-[10px] font-black ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'} bg-white/80 px-2 py-1 rounded-lg border border-white`}>
          {change}
        </span>
      </div>
      <div>
        <h4 className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">{title}</h4>
        <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Transactions</h1>
          <div className="flex items-center gap-2 mt-2 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">
            <CalendarIcon size={14} className="text-indigo-500" />
            <span>JAN 1, 2026 — {currentFullDate} REPORT</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsNewTransactionModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            <Plus size={16} /> Add Entry
          </button>

          <div className="hidden md:flex items-center gap-4 bg-white/60 px-5 py-2.5 rounded-full border border-white text-[10px] font-black uppercase tracking-widest">
            <CloudSun size={18} className="text-amber-500" />
            <span className="text-black">14:30</span>
          </div>

          <div className="flex items-center bg-white/60 px-5 py-2.5 rounded-full border border-white gap-3 min-w-[200px] focus-within:ring-4 focus-within:ring-black/5 transition-all">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search history..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase outline-none w-full tracking-widest text-black" 
            />
          </div>
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div className="flex gap-6 flex-wrap">
        <StatCard title="Total Balance" value="$48,300.50" change="+12.5%" icon={Wallet} color="bg-indigo-600" />
        <StatCard title="Total Income" value="$21,000.00" change="+8.2%" icon={ArrowDownLeft} color="bg-green-600" />
        <StatCard title="Total Expenses" value="$5,999.50" change="-2.4%" icon={ArrowUpRight} color="bg-rose-500" />
        
        {/* Balance Trend Area Chart */}
        <div className="flex-[2] min-w-[400px] bg-black rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>
          
          <div className="relative z-10 flex justify-between items-center mb-6">
            <div>
              <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Fiscal Year 2026 Trend</h4>
              <p className="text-xl font-black tracking-tight">Growth Matrix</p>
            </div>
            <div className="flex items-center gap-2">
               <button className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"><RefreshCw size={16} /></button>
            </div>
          </div>
          
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceHistory}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions List Area */}
      <div className="glass-dark rounded-[48px] p-10 border border-white/10 relative overflow-hidden min-h-[600px] shadow-2xl">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black text-white tracking-tight">Ledger Matrix</h2>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`p-3 rounded-2xl transition-all border ${showAdvancedFilters ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
              >
                <Filter size={20} />
              </button>
              <button className="p-3 bg-white/5 rounded-2xl text-white border border-white/10 hover:bg-white/10 transition-colors shadow-lg"><Download size={20} /></button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-12 px-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 select-none">
               <div className="col-span-4 flex items-center cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('description')}>
                 Description <SortIndicator field="description" />
               </div>
               <div className="col-span-2 flex items-center gap-2">Reference</div>
               <div className="col-span-2 flex items-center cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('date')}>
                 Timestamp <SortIndicator field="date" />
               </div>
               <div className="col-span-2 flex items-center cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('amount')}>
                 Value <SortIndicator field="amount" />
               </div>
               <div className="col-span-2 flex items-center justify-end cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('status')}>
                 State <SortIndicator field="status" />
               </div>
            </div>

            <div className="space-y-3">
              {processedTransactions.map((tx) => (
                <div 
                  key={tx.id} 
                  onClick={() => setSelectedTransaction(tx)}
                  className="grid grid-cols-12 items-center bg-white/5 hover:bg-white/10 border border-white/5 rounded-[32px] p-5 transition-all group cursor-pointer active:scale-[0.99]"
                >
                  <div className="col-span-4 flex items-center gap-5">
                    <div className="relative">
                      <img src={tx.avatar} className="w-12 h-12 rounded-2xl object-cover border border-white/10 group-hover:scale-110 transition-transform" alt="" />
                      <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-lg ${getTypeColor(tx.type)} border-2 border-[#0a0a0a] shadow-xl`}>
                        {getTypeIcon(tx.type, 10)}
                      </div>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors truncate tracking-tight">{tx.description}</p>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">{tx.category}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-[10px] font-black font-mono text-gray-500 tracking-widest">
                    {tx.referenceNumber}
                  </div>
                  <div className="col-span-2 text-[11px] font-black text-gray-400 uppercase">
                    {tx.date}
                  </div>
                  <div className={`col-span-2 text-base font-black tabular-nums ${tx.type === 'Inbound' ? 'text-green-400' : 'text-white'}`}>
                    {tx.type === 'Inbound' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg ${
                      tx.status === 'Completed' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 
                      'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={() => setSelectedTransaction(null)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden animate-scale-in border border-white">
            <div className={`h-32 w-full relative ${
              selectedTransaction.status === 'Completed' ? 'bg-green-600' : 'bg-amber-500'
            }`}>
              <button onClick={() => setSelectedTransaction(null)} className="absolute top-8 right-8 p-2 bg-white/20 rounded-full text-white"><X size={20} /></button>
              <div className="absolute -bottom-10 left-10">
                <img src={selectedTransaction.avatar} className="w-24 h-24 rounded-[36px] border-4 border-white shadow-2xl object-cover" alt="" />
              </div>
            </div>
            <div className="p-10 pt-16">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">{selectedTransaction.description}</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{selectedTransaction.category} Division</p>
              
              <div className="my-8 flex justify-between items-baseline">
                <p className={`text-4xl font-black tabular-nums ${selectedTransaction.type === 'Inbound' ? 'text-green-600' : 'text-gray-900'}`}>
                  {selectedTransaction.type === 'Inbound' ? '+' : '-'}${selectedTransaction.amount.toLocaleString()}
                </p>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedTransaction.status}</span>
              </div>

              <div className="bg-gray-50 rounded-[32px] p-6 space-y-4">
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-400 uppercase tracking-widest text-[9px]">Reference</span>
                    <span className="text-gray-900 font-mono tracking-widest">{selectedTransaction.referenceNumber}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-400 uppercase tracking-widest text-[9px]">Timestamp</span>
                    <span className="text-gray-900">{selectedTransaction.date} • {selectedTransaction.time}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-400 uppercase tracking-widest text-[9px]">Method</span>
                    <span className="text-gray-900">{selectedTransaction.paymentMethod}</span>
                 </div>
              </div>

              <button className="w-full mt-8 py-5 bg-black text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                 <Printer size={18} /> Print Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsSection;
