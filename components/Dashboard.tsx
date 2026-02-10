
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { ShoppingBag, Users, Monitor, Activity, TrendingUp, Zap, Wallet, FileText, ChevronRight, AlertCircle } from 'lucide-react';
import { OutletType, Order } from '../types.ts';
import { GUEST_DATA, safeStorage } from '../constants.tsx';

const chartData = [
  { name: '08:00', sales: 400 },
  { name: '10:00', sales: 700 },
  { name: '12:00', sales: 1200 },
  { name: '14:00', sales: 1100 },
  { name: '16:00', sales: 1500 },
  { name: '18:00', sales: 1800 },
  { name: '20:00', sales: 2400 },
];

interface DashboardProps {
  onNavigate: (tab: OutletType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [systemSpeed, setSystemSpeed] = useState('0.4ms');
  const [isSyncing, setIsSyncing] = useState(false);

  const history: Order[] = useMemo(() => safeStorage.get('samoa_history', []), []);
  const todayTotal = useMemo(() => history.reduce((acc, o) => acc + o.total, 0), [history]);
  
  const stats = [
    { label: 'Faturamento Turno', value: `R$ ${todayTotal.toFixed(2)}`, icon: <Wallet />, color: 'text-emerald-400' },
    { label: 'Quartos Ativos', value: GUEST_DATA.length.toString(), icon: <Users />, color: 'text-[#c19a6b]', action: () => onNavigate('ROOMS') },
    { label: 'Latência Master', value: systemSpeed, icon: <Zap />, color: 'text-blue-400' },
    { label: 'Status Servidor', value: '100%', icon: <Activity />, color: 'text-purple-400' },
  ];

  const handleSpeedTest = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setSystemSpeed(`${(Math.random() * 0.5 + 0.1).toFixed(2)}ms`);
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-brand font-bold">Resumo Master</h2>
          <p className="text-slate-400 text-sm">Controle total de operações auxiliares e auditoria.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSpeedTest}
            className="flex items-center gap-2 bg-[#c19a6b]/10 hover:bg-[#c19a6b]/20 border border-[#c19a6b]/20 px-4 py-2 rounded-xl transition-all"
          >
            {isSyncing ? <Activity size={16} className="animate-spin text-[#c19a6b]" /> : <Zap size={16} className="text-[#c19a6b]" />}
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c19a6b]">Link Speed Test</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            onClick={stat.action}
            className={`glass p-6 rounded-3xl transition-all group relative overflow-hidden ${stat.action ? 'cursor-pointer hover:border-[#c19a6b]/50' : ''}`}
          >
            <div className={`mb-4 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</h3>
            {stat.action && <ChevronRight size={16} className="absolute bottom-6 right-6 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2">Fluxo de Lançamentos</h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Atualizado agora</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c19a6b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c19a6b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050a0f', border: '1px solid #ffffff10', borderRadius: '16px' }}
                  itemStyle={{ color: '#c19a6b' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#c19a6b" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
           {/* Quick Operations Box */}
           <div className="glass-dark p-8 rounded-[2.5rem] border border-[#c19a6b]/10">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Operações Master</h3>
              <div className="grid grid-cols-1 gap-3">
                 <button className="flex items-center justify-between p-4 bg-white/5 hover:bg-[#c19a6b]/20 rounded-2xl transition-all border border-white/5 group">
                    <div className="flex items-center gap-3">
                       <FileText size={18} className="text-[#c19a6b]" />
                       <span className="text-xs font-bold uppercase tracking-widest">Fechar Turno</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-white" />
                 </button>
                 <button className="flex items-center justify-between p-4 bg-white/5 hover:bg-[#c19a6b]/20 rounded-2xl transition-all border border-white/5 group">
                    <div className="flex items-center gap-3">
                       <Wallet size={18} className="text-emerald-400" />
                       <span className="text-xs font-bold uppercase tracking-widest">Sangria Caixa</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-white" />
                 </button>
                 <button className="flex items-center justify-between p-4 bg-white/5 hover:bg-[#c19a6b]/20 rounded-2xl transition-all border border-white/5 group">
                    <div className="flex items-center gap-3">
                       <AlertCircle size={18} className="text-red-400" />
                       <span className="text-xs font-bold uppercase tracking-widest">Log de Erros</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-white" />
                 </button>
              </div>
           </div>

           {/* Active Rooms Quick View */}
           <div className="glass p-8 rounded-[2.5rem] flex flex-col h-64 overflow-hidden">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Quartos Ativos</h3>
                <button onClick={() => onNavigate('ROOMS')} className="text-[10px] text-[#c19a6b] font-bold uppercase tracking-tighter">Ver Todos</button>
             </div>
             <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
               {GUEST_DATA.slice(0, 5).map((guest) => (
                 <div key={guest.room} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-[#c19a6b]/20 text-[#c19a6b] flex items-center justify-center text-[10px] font-bold">
                       {guest.room}
                     </div>
                     <span className="text-[11px] font-medium truncate max-w-[100px]">{guest.name}</span>
                   </div>
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
