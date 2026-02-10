
import React, { useState, useEffect, useMemo } from 'react';
import { Order } from '../types';
import { Trash2, ExternalLink, Calendar, User, Search, Filter, Hash, DollarSign, Printer, Copy, Check, ReceiptText, FilterX } from 'lucide-react';
import { SamoaLogo } from '../constants.tsx';

const History: React.FC = () => {
  const [history, setHistory] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Filter States
  const [filterDate, setFilterDate] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [filterMinTotal, setFilterMinTotal] = useState('');
  const [filterMaxTotal, setFilterMaxTotal] = useState('');

  useEffect(() => {
    const savedHistory = localStorage.getItem('samoa_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter(order => {
      if (filterDate) {
        const orderDate = new Date(order.timestamp).toISOString().split('T')[0];
        if (orderDate !== filterDate) return false;
      }
      if (filterRoom && !order.room.includes(filterRoom)) return false;
      if (filterMinTotal && order.total < parseFloat(filterMinTotal)) return false;
      if (filterMaxTotal && order.total > parseFloat(filterMaxTotal)) return false;
      return true;
    }).reverse();
  }, [history, filterDate, filterRoom, filterMinTotal, filterMaxTotal]);

  const handleClearFilters = () => {
    setFilterDate('');
    setFilterRoom('');
    setFilterMinTotal('');
    setFilterMaxTotal('');
  };

  const copyToSync = (order: Order) => {
    const text = `SAMOA - ${order.outlet}\nQ: ${order.room} - ${order.guestName}\n` + 
      order.items.map(it => `${it.quantity}x ${it.product.name}`).join('\n') + 
      `\nTOTAL: R$ ${order.total.toFixed(2)}`;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(order.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const clearHistory = () => {
    if (confirm("Deseja realmente limpar todo o histórico?")) {
      localStorage.removeItem('samoa_history');
      setHistory([]);
    }
  };

  const hasActiveFilters = filterDate || filterRoom || filterMinTotal || filterMaxTotal;

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      {/* Receipt Preview Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative w-full max-w-sm glass-dark rounded-[2.5rem] p-8 border border-white/10 flex flex-col items-center">
            <div className="w-full bg-white text-black p-8 font-mono text-[11px] leading-tight mb-6 rounded-sm">
               <div className="text-center font-bold mb-2 border-b border-black border-dashed pb-2 uppercase">REIMPRESSÃO MASTER</div>
               <div className="flex justify-between"><span>DATA:</span><span>{new Date(selectedOrder.timestamp).toLocaleString()}</span></div>
               <div className="flex justify-between font-bold border-b border-black border-dashed pb-2 mb-2"><span>QUARTO:</span><span>{selectedOrder.room}</span></div>
               <div className="mb-2 uppercase">{selectedOrder.guestName}</div>
               {selectedOrder.items.map((it, idx) => (
                 <div key={idx} className="flex justify-between"><span>{it.quantity}x {it.product.name}</span><span>R$ {(it.product.price * it.quantity).toFixed(2)}</span></div>
               ))}
               <div className="border-t border-black border-dashed mt-4 pt-2 flex justify-between font-bold"><span>TOTAL:</span><span>R$ {selectedOrder.total.toFixed(2)}</span></div>
            </div>
            <button onClick={() => window.print()} className="w-full py-4 bg-[#c19a6b] text-white rounded-xl font-bold mb-3">IMPRIMIR</button>
            <button onClick={() => setSelectedOrder(null)} className="w-full py-4 bg-white/5 text-white rounded-xl font-bold">FECHAR</button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between glass p-8 rounded-[2.5rem] gap-6">
        <div>
          <h2 className="text-3xl font-brand font-bold">Auditoria & Lançamentos</h2>
          <p className="text-slate-400 text-sm mt-1">Gerencie comandos pendentes de lançamento no sistema oficial.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={clearHistory} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-4 rounded-2xl border border-red-500/20 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
            <Trash2 size={18} /> LIMPAR BANCO
          </button>
        </div>
      </div>

      <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Filter size={14} className="text-[#c19a6b]" /> Filtros de Auditoria
          </h3>
          {hasActiveFilters && (
            <button 
              onClick={handleClearFilters}
              className="text-[10px] font-black text-[#c19a6b] uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              <FilterX size={14} /> Limpar Filtros
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1"><Calendar size={12} /> Data</label>
            <input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-[#c19a6b] outline-none transition-colors" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1"><Hash size={12} /> Quarto</label>
            <input type="text" placeholder="Ex: 204" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-[#c19a6b] outline-none transition-colors" value={filterRoom} onChange={(e) => setFilterRoom(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1"><DollarSign size={12} /> Mínimo</label>
            <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-[#c19a6b] outline-none transition-colors" value={filterMinTotal} onChange={(e) => setFilterMinTotal(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1"><DollarSign size={12} /> Máximo</label>
            <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-[#c19a6b] outline-none transition-colors" value={filterMaxTotal} onChange={(e) => setFilterMaxTotal(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredHistory.length === 0 ? (
          <div className="glass p-24 rounded-[3rem] text-center opacity-30 border border-dashed border-white/10">
            <ReceiptText size={64} className="mx-auto mb-6 text-[#c19a6b]" />
            <p className="text-xl font-bold uppercase tracking-[0.3em]">Sem registros para sincronizar</p>
            {hasActiveFilters && (
              <button 
                onClick={handleClearFilters}
                className="mt-4 text-[10px] font-black text-[#c19a6b] underline tracking-widest uppercase"
              >
                Limpar filtros aplicados
              </button>
            )}
          </div>
        ) : (
          filteredHistory.map((order) => (
            <div key={order.id} className="glass p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5 hover:border-[#c19a6b]/30 transition-all group">
              <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                <div className="bg-white/5 border border-white/10 text-white p-5 rounded-2xl flex flex-col items-center justify-center min-w-[100px]">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Q</span>
                  <span className="text-2xl font-black text-[#c19a6b]">{order.room}</span>
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="flex gap-3 mb-2 justify-center md:justify-start">
                    <span className="bg-[#c19a6b]/10 text-[#c19a6b] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{order.outlet}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{new Date(order.timestamp).toLocaleString()}</span>
                  </div>
                  <h4 className="font-bold text-xl mb-1">{order.guestName}</h4>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {order.items.map((it, idx) => (
                      <span key={idx} className="text-[10px] bg-white/5 px-2 py-1 rounded-lg text-slate-400 border border-white/5">
                        {it.quantity}x {it.product.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center md:items-end min-w-[200px] gap-3">
                <span className="text-2xl font-mono font-black text-[#c19a6b]">R$ {order.total.toFixed(2)}</span>
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={() => copyToSync(order)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black flex items-center justify-center gap-2 border transition-all ${
                      copiedId === order.id ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {copiedId === order.id ? <Check size={14} /> : <Copy size={14} />}
                    {copiedId === order.id ? 'SYNC OK' : 'SYNC DADOS'}
                  </button>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 transition-all"
                  >
                    <Printer size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
