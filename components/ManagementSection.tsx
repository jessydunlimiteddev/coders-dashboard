
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  ChevronRight, 
  Check, 
  X, 
  Clock, 
  Plus, 
  AlertCircle, 
  Lock, 
  ArrowUpRight, 
  Layout as LayoutIcon, 
  CheckCircle2, 
  Play, 
  Pause, 
  Zap,
  RefreshCw,
  MoreHorizontal,
  FileText,
  RotateCcw,
  Trash2,
  GripVertical,
  Edit,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Member {
  name: string;
  role: string;
  avatar: string;
}

interface Document {
  name: string;
  type: 'PDF' | 'Figma' | 'Link' | 'Doc' | 'Code';
  url: string;
}

interface Task {
  id: string;
  label: string;
  hours: string;
  estimatedHours: number;
  position: string;
  leftPercent: number;
  widthPercent: number;
  avatars: string[];
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  members: Member[];
  documents: Document[];
  progress: number;
  prerequisites: string[];
}

type StatusFilter = 'All' | 'Active' | 'Blocked' | 'Done';

interface TimelineBarProps {
  task: Task;
  completed: boolean;
  selected: boolean;
  isBlocked: boolean;
  onSelect: () => void;
  onToggleStatus: (id: string) => void;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
  isExecuting: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
}

const TimelineBar: React.FC<TimelineBarProps> = ({ 
  task, 
  completed, 
  selected,
  isBlocked,
  onSelect,
  onToggleStatus,
  onContextMenu,
  isExecuting,
  onDragStart,
  onDragOver,
  onDragEnd
}) => {
  const [isPopping, setIsPopping] = useState(false);

  useEffect(() => {
    if (completed) {
      setIsPopping(true);
      const timer = setTimeout(() => setIsPopping(false), 600);
      return () => clearTimeout(timer);
    }
  }, [completed]);

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragOver={(e) => onDragOver(e, task.id)}
      onDragEnd={onDragEnd}
      className={`relative h-14 w-full min-w-[800px] flex items-center group cursor-grab active:cursor-grabbing select-none transition-all duration-300 ${completed ? 'opacity-50' : 'opacity-100'}`} 
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onContextMenu={(e) => onContextMenu(e, task.id)}
    >
      <div className="w-10 shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical size={14} className="text-gray-300" />
      </div>

      <div className="w-40 shrink-0 relative flex items-center gap-2">
        {isBlocked && !completed ? (
          <Lock size={10} className="text-amber-500 animate-pulse" />
        ) : completed ? (
          <CheckCircle2 size={10} className="text-green-500" />
        ) : isExecuting ? (
          <Zap size={10} className="text-indigo-500 animate-bounce" />
        ) : null}
        <span className={`text-[11px] font-black transition-all duration-500 block truncate uppercase tracking-tighter ${completed ? 'text-green-600/50' : (selected ? 'text-black' : 'text-gray-400')}`}>
          {task.label}
        </span>
        <div className={`absolute top-1/2 left-0 h-[1.5px] bg-green-600 transition-all duration-700 ease-in-out pointer-events-none ${completed ? 'w-24 opacity-40' : 'w-0 opacity-0'}`}></div>
      </div>

      <div className="flex-1 relative h-full flex items-center">
          <div className={`absolute h-9 rounded-2xl px-4 flex items-center gap-3 text-white shadow-lg transition-all duration-500 ease-out ${task.position} 
            ${completed ? 'bg-green-600 ring-4 ring-green-100' : (selected ? 'bg-indigo-600 scale-[1.02] ring-4 ring-indigo-200' : (isBlocked ? 'bg-gray-800' : (isExecuting ? 'bg-black ring-4 ring-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-black')))}
            ${isPopping ? 'animate-complete-pop z-20' : 'z-10'}
            overflow-hidden`}
          >
              {!completed && (
                <div className="absolute inset-0 bg-white/5 pointer-events-none overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-linear ${isExecuting ? 'bg-indigo-400/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-white/10'}`} 
                    style={{ width: `${task.progress}%` }}
                  ></div>
                  {isExecuting && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite] translate-x-[-100%]"></div>
                  )}
                </div>
              )}
              
              <div className="relative z-20 flex items-center gap-3 w-full">
                {completed ? (
                    <Check size={12} strokeWidth={4} className="animate-scale-in" />
                ) : isBlocked ? (
                    <Lock size={10} className="text-white/40" />
                ) : isExecuting ? (
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_#818cf8]"></div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-white/20"></div>
                )}
                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  {completed ? 'DONE' : (isBlocked ? 'BLOCKED' : `${task.hours}`)}
                </span>
                
                <div className={`flex -space-x-2 transition-all duration-500 ml-auto ${completed ? 'grayscale opacity-30' : ''}`}>
                    {task.avatars.map((a, i) => (
                        <img key={i} src={a} className="w-5 h-5 rounded-full border border-black object-cover" alt="" />
                    ))}
                </div>
                <span className="text-[9px] font-black opacity-40 min-w-[24px] text-right">{Math.floor(task.progress)}%</span>
              </div>

              {/* Quick Action Button - Hover Only */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus(task.id);
                }}
                className={`absolute right-[-40px] opacity-0 group-hover:opacity-100 group-hover:right-[-48px] p-2 rounded-full transition-all duration-300 shadow-xl ${completed ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'} hover:scale-110 active:scale-95`}
                title={completed ? "Reset Status" : "Mark as Done"}
              >
                {completed ? <RotateCcw size={14} /> : <Check size={14} />}
              </button>
          </div>
      </div>
    </div>
  );
};

const ManagementSection: React.FC = () => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['5']));
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [isSimulating, setIsSimulating] = useState(true);
  const [executionSpeed, setExecutionSpeed] = useState(1);

  // Drag and Drop state
  const dragItem = useRef<string | null>(null);
  const dragOverItem = useRef<string | null>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, taskId: string } | null>(null);

  const initialTasks: Task[] = [
    { 
      id: '1', label: "Design System", hours: "2h", estimatedHours: 2,
      position: "left-[20%] w-[35%]", leftPercent: 20, widthPercent: 35,
      avatars: ['https://picsum.photos/seed/p1/50/50', 'https://picsum.photos/seed/p2/50/50'],
      description: "Finalizing the UI kit and color palette for the upcoming mobile release.",
      priority: 'High', progress: 0, prerequisites: ['4'],
      members: [{ name: "Ann Kowalski", role: "UX Lead", avatar: 'https://picsum.photos/seed/p1/50/50' }],
      documents: [{ name: "Mobile UI Kit v2.fig", type: "Figma", url: "#" }]
    },
    { 
      id: '2', label: "App Development", hours: "1h", estimatedHours: 1,
      position: "left-[60%] w-[25%]", leftPercent: 60, widthPercent: 25,
      avatars: ['https://picsum.photos/seed/p3/50/50'],
      description: "Bug fixes for the React Native implementation.",
      priority: 'Medium', progress: 0, prerequisites: ['1'],
      members: [{ name: "Jack Wilson", role: "App Dev", avatar: 'https://picsum.photos/seed/p3/50/50' }],
      documents: []
    },
    { 
      id: '3', label: "Infography", hours: "3h", estimatedHours: 3,
      position: "left-[45%] w-[45%]", leftPercent: 45, widthPercent: 45,
      avatars: ['https://picsum.photos/seed/p4/50/50'],
      description: "Creating social media assets for the Q3 report.",
      priority: 'Low', progress: 0, prerequisites: [],
      members: [{ name: "Lily Chen", role: "Content Specialist", avatar: 'https://picsum.photos/seed/p4/50/50' }],
      documents: []
    },
    { 
      id: '4', label: "Wireframes", hours: "2h", estimatedHours: 2,
      position: "left-[10%] w-[20%]", leftPercent: 10, widthPercent: 20,
      avatars: ['https://picsum.photos/seed/p6/50/50'],
      description: "Building low-fidelity wireframes for the dashboard.",
      priority: 'Medium', progress: 0, prerequisites: [],
      members: [{ name: "Tom Baker", role: "UX Designer", avatar: 'https://picsum.photos/seed/p6/50/50' }],
      documents: []
    },
    { 
      id: '5', label: "Strategy Sync", hours: "1h", estimatedHours: 1,
      position: "left-[0%] w-[15%]", leftPercent: 0, widthPercent: 15,
      avatars: ['https://picsum.photos/seed/p7/50/50'],
      description: "Weekly sync with the leads.",
      priority: 'High', progress: 100, prerequisites: [],
      members: [{ name: "Sarah Connor", role: "Project Manager", avatar: 'https://picsum.photos/seed/p7/50/50' }],
      documents: []
    }
  ];

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  useEffect(() => {
    const handleGlobalClick = () => setContextMenu(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setTasks(prevTasks => {
        let changed = false;
        const nextTasks = prevTasks.map(task => {
          if (completedTasks.has(task.id)) return task;
          const isBlocked = task.prerequisites.some(pid => !completedTasks.has(pid));
          if (isBlocked) return task;
          if (task.progress < 100) {
            changed = true;
            const newProgress = Math.min(100, task.progress + (Math.random() * 2 * executionSpeed));
            if (newProgress === 100) {
              setCompletedTasks(prev => new Set([...prev, task.id]));
            }
            return { ...task, progress: newProgress };
          }
          return task;
        });
        return changed ? nextTasks : prevTasks;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSimulating, completedTasks, executionSpeed]);

  const filteredAndSortedTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.label.toLowerCase().includes(searchQuery.toLowerCase());
      const isDone = completedTasks.has(t.id);
      const isBlocked = t.prerequisites.some(pid => !completedTasks.has(pid));
      let matchesStatus = true;
      if (statusFilter === 'Done') matchesStatus = isDone;
      else if (statusFilter === 'Active') matchesStatus = !isDone && !isBlocked;
      else if (statusFilter === 'Blocked') matchesStatus = !isDone && isBlocked;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter, completedTasks]);

  const toggleTaskCompletion = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    if (!completedTasks.has(id)) {
      const blockedBy = task.prerequisites.filter(pid => !completedTasks.has(pid));
      if (blockedBy.length > 0) {
        const names = blockedBy.map(pid => tasks.find(t => t.id === pid)?.label).join(', ');
        setErrorMsg(`Blocked by: ${names}`);
        setTimeout(() => setErrorMsg(null), 3000);
        return;
      }
    }
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setTasks(ts => ts.map(t => t.id === id ? { ...t, progress: 0 } : t));
      } else {
        next.add(id);
        setTasks(ts => ts.map(t => t.id === id ? { ...t, progress: 100 } : t));
      }
      return next;
    });
  };

  const updateTaskPriority = (id: string, priority: 'High' | 'Medium' | 'Low') => {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, priority } : t));
    setContextMenu(null);
  };

  const updateTaskEstimation = (id: string, hours: number) => {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, estimatedHours: hours, hours: `${hours}h` } : t));
  };

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, taskId: id });
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    dragItem.current = id;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    dragOverItem.current = id;
  };

  const handleDragEnd = () => {
    if (dragItem.current && dragOverItem.current && dragItem.current !== dragOverItem.current) {
      setTasks(prev => {
        const copy = [...prev];
        const dragIdx = copy.findIndex(t => t.id === dragItem.current);
        const hoverIdx = copy.findIndex(t => t.id === dragOverItem.current);
        
        const [movedItem] = copy.splice(dragIdx, 1);
        copy.splice(hoverIdx, 0, movedItem);
        
        return copy;
      });
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const selectedTask = selectedTaskId !== null ? tasks.find(t => t.id === selectedTaskId) : null;

  const renderDependencyLines = () => {
    const rowHeight = 56;
    const labelsWidth = 200; // Increased to accommodate drag handle
    return (
      <svg className="absolute inset-0 pointer-events-none w-full min-w-[800px] h-full z-0 overflow-visible opacity-30">
        {filteredAndSortedTasks.map((task, targetIdx) => {
          return task.prerequisites.map(prereqId => {
            const sourceIdx = filteredAndSortedTasks.findIndex(t => t.id === prereqId);
            if (sourceIdx === -1) return null;
            const startY = (sourceIdx * rowHeight) + (rowHeight / 2);
            const endY = (targetIdx * rowHeight) + (rowHeight / 2);
            const sourceTask = filteredAndSortedTasks[sourceIdx];
            return (
              <path 
                key={`${task.id}-${prereqId}`}
                d={`M ${labelsWidth + (sourceTask.leftPercent + sourceTask.widthPercent) * 6} ${startY} C ${labelsWidth + (sourceTask.leftPercent + sourceTask.widthPercent) * 7} ${startY}, ${labelsWidth + task.leftPercent * 5} ${endY}, ${labelsWidth + task.leftPercent * 6} ${endY}`}
                className={`transition-all duration-1000 fill-none ${completedTasks.has(prereqId) ? 'stroke-green-500' : 'stroke-indigo-400'}`}
                strokeWidth={1.5}
                strokeDasharray={completedTasks.has(prereqId) ? '0' : '4 4'}
              />
            );
          });
        })}
      </svg>
    );
  };

  return (
    <div className="w-full relative min-h-[600px] animate-in fade-in duration-1000 pb-10" onClick={() => setSelectedTaskId(null)}>
      {errorMsg && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] bg-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertCircle size={18} />
          <span className="text-sm font-bold">{errorMsg}</span>
        </div>
      )}

      {/* Custom Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-[300] bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl p-1.5 w-56 animate-in zoom-in duration-150"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-4 py-2 border-b border-gray-50 mb-1">Actions</div>
          
          <button 
            onClick={() => { toggleTaskCompletion(contextMenu.taskId); setContextMenu(null); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-black hover:text-white rounded-xl transition-all group"
          >
            {completedTasks.has(contextMenu.taskId) ? <RotateCcw size={14} className="text-amber-500" /> : <Check size={14} className="text-green-500" />}
            {completedTasks.has(contextMenu.taskId) ? "Reset Status" : "Mark as Done"}
          </button>

          <button 
            onClick={() => { setSelectedTaskId(contextMenu.taskId); setContextMenu(null); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-black hover:text-white rounded-xl transition-all"
          >
            <Edit size={14} className="text-indigo-500" />
            Edit Estimation
          </button>

          <div className="h-[1px] bg-gray-50 my-1 mx-2"></div>
          
          <div className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">Priority</div>
          <div className="flex gap-1 px-2 mb-1">
             <button onClick={() => updateTaskPriority(contextMenu.taskId, 'High')} className="flex-1 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all text-[10px] font-black uppercase"><ArrowUp size={12} className="mx-auto" /></button>
             <button onClick={() => updateTaskPriority(contextMenu.taskId, 'Medium')} className="flex-1 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-all text-[10px] font-black uppercase"><Minus size={12} className="mx-auto" /></button>
             <button onClick={() => updateTaskPriority(contextMenu.taskId, 'Low')} className="flex-1 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all text-[10px] font-black uppercase"><ArrowDown size={12} className="mx-auto" /></button>
          </div>

          <div className="h-[1px] bg-gray-50 my-1 mx-2"></div>
          
          <button 
            onClick={() => { setTasks(prev => prev.filter(t => t.id !== contextMenu.taskId)); setContextMenu(null); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
          >
            <Trash2 size={14} />
            Remove Task
          </button>
        </div>
      )}

      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight uppercase">Management</h1>
             <div className="flex items-center gap-1 bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                <Zap size={10} className="fill-indigo-600" /> Live
             </div>
          </div>
          <div className="flex items-center gap-3 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">
            <span>June Sprint Cycle</span>
            <div className="w-1 h-1 rounded-full bg-gray-200"></div>
            <span>v2.8.4</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="flex bg-white/60 p-1.5 rounded-3xl border border-white shadow-sm">
                <button 
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`p-2.5 rounded-2xl transition-all ${isSimulating ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}
                >
                  {isSimulating ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button 
                  onClick={() => setExecutionSpeed(prev => prev === 1 ? 4 : 1)}
                  className={`p-2.5 rounded-2xl transition-all font-black text-[10px] px-4 ${executionSpeed > 1 ? 'bg-black text-white' : 'text-gray-400'}`}
                >
                  {executionSpeed}X
                </button>
            </div>

            <div className="flex items-center bg-white/60 p-1.5 rounded-full shadow-sm border border-white overflow-x-auto no-scrollbar">
                {(['All', 'Active', 'Blocked', 'Done'] as StatusFilter[]).map((f) => (
                    <button 
                      key={f} 
                      onClick={() => setStatusFilter(f)}
                      className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-full whitespace-nowrap transition-all ${statusFilter === f ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {f}
                    </button>
                ))}
            </div>
            
            <div className="flex-1 lg:flex-none flex items-center bg-white/60 px-5 py-2.5 rounded-full border border-white gap-3 lg:min-w-[220px]">
                <Search size={16} className="text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Filter..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs outline-none w-full text-black font-black uppercase tracking-tighter" 
                />
            </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 lg:gap-10 relative">
        <div className="col-span-12 lg:col-span-8 space-y-0 relative overflow-x-auto custom-scrollbar pb-6 lg:pb-0">
          <div className="flex justify-between px-40 text-[10px] text-gray-400 font-black mb-6 uppercase tracking-widest opacity-40 min-w-[800px]">
            <span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span><span>18:00</span><span>20:00</span>
          </div>
          
          <div className="relative min-h-[400px]">
            {renderDependencyLines()}
            <div className="relative z-10 space-y-1">
              {filteredAndSortedTasks.map((task) => (
                <TimelineBar 
                  key={task.id} 
                  task={task}
                  completed={completedTasks.has(task.id)} 
                  selected={selectedTaskId === task.id}
                  isBlocked={task.prerequisites.some(pid => !completedTasks.has(pid))}
                  isExecuting={isSimulating && !completedTasks.has(task.id) && !task.prerequisites.some(pid => !completedTasks.has(pid))}
                  onSelect={() => setSelectedTaskId(task.id)}
                  onToggleStatus={toggleTaskCompletion}
                  onContextMenu={handleContextMenu}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 relative">
          {selectedTask ? (
            <div className="bg-white/95 backdrop-blur-3xl rounded-[40px] lg:rounded-[48px] p-6 lg:p-10 border border-white shadow-2xl flex flex-col mb-6 animate-in slide-in-from-right-4 duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full mb-3 inline-block ${
                         selectedTask?.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : 
                         selectedTask?.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                         'bg-green-50 text-green-600 border border-green-100'
                       }`}>
                         {selectedTask?.priority} Priority
                    </span>
                    <h2 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight leading-none uppercase">{selectedTask?.label}</h2>
                  </div>
                  <button onClick={() => setSelectedTaskId(null)} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Task Estimation (Hours)</label>
                    <div className="flex items-center gap-3">
                       <input 
                         type="number" 
                         value={selectedTask.estimatedHours}
                         onChange={(e) => updateTaskEstimation(selectedTask.id, parseInt(e.target.value) || 0)}
                         className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-black outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-black"
                         placeholder="e.g. 5"
                       />
                       <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase">hrs</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Progress</h4>
                      <span className="text-lg font-black text-indigo-600 tabular-nums">{Math.floor(selectedTask?.progress || 0)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden border border-gray-50 relative">
                      <div 
                        className={`h-full transition-all duration-1000 shadow-lg ${completedTasks.has(selectedTask?.id || '') ? 'bg-green-500' : 'bg-indigo-600'}`} 
                        style={{ width: `${selectedTask?.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Description</label>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium bg-gray-50 p-5 rounded-[24px] border border-gray-100 italic">
                      "{selectedTask?.description}"
                    </p>
                  </div>
                  
                  <div className="flex -space-x-3">
                    {selectedTask?.avatars.map((a, i) => (
                      <img key={i} src={a} className="w-10 h-10 rounded-xl border-4 border-white object-cover shadow-md" alt="" />
                    ))}
                  </div>

                  <button 
                    onClick={() => selectedTaskId !== null && toggleTaskCompletion(selectedTaskId)}
                    className={`w-full py-5 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg ${
                      selectedTaskId !== null && completedTasks.has(selectedTaskId) 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : (selectedTask?.prerequisites.some(pid => !completedTasks.has(pid)) ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-black text-white hover:bg-gray-900')
                    }`}
                  >
                    {selectedTaskId !== null && completedTasks.has(selectedTaskId) ? (
                      <>Done <Check size={16} /></>
                    ) : (selectedTask?.prerequisites.some(pid => !completedTasks.has(pid)) ? (
                      <>Blocked <Lock size={16} /></>
                    ) : (
                      <>Finish <Zap size={16} /></>
                    ))}
                  </button>
                </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
                <div className="bg-white/60 rounded-[40px] p-8 border border-white flex flex-col justify-between shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all"></div>
                    <div>
                        <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Efficiency</h3>
                        <span className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">
                          {Math.round((completedTasks.size / tasks.length) * 100)}%
                        </span>
                    </div>
                    <div className="h-20 w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={tasks.map((t, i) => ({ value: t.progress }))}>
                                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={5} dot={false} animationDuration={1000} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden group">
                   <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Workflow Tip</p>
                      <h4 className="text-lg font-black leading-tight">Drag and drop tasks to reorder priority in the timeline.</h4>
                   </div>
                   <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform">
                      <GripVertical size={120} />
                   </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagementSection;
