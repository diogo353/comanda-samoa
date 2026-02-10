
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Plus, Minus, Trash2, ClipboardCheck, Timer, AlertCircle, ShoppingCart, User, Package, UserX, ReceiptText, Volume2, VolumeX, Loader2, X, Printer, Copy, Check } from 'lucide-react';
import { MENU_DATA, GUEST_DATA, safeStorage, SamoaLogo } from '../constants.tsx';
import { Product, OrderItem, Order } from '../types.ts';

interface POSProps {
  outlet: string;
}

const POS: React.FC<POSProps> = ({ outlet }) => {
  const [room, setRoom] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [orderTimer, setOrderTimer] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('samoa_master_sound');
    return saved !== 'false';
  });

  const roomInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('samoa_master_sound', String(isSoundEnabled));
  }, [isSoundEnabled]);

  useEffect(() => {
    if (search !== debouncedSearch) setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    let interval: any;
    if (cart.length > 0) {
      interval = setInterval(() => setOrderTimer(prev => prev + 1), 1000);
    } else {
      setOrderTimer(0);
    }
    return () => clearInterval(interval);
  }, [cart]);

  const products = MENU_DATA[outlet] || [];
  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, debouncedSearch, activeCategory]);

  const guestInfo = useMemo(() => GUEST_DATA.find(g => g.room === room), [room]);

  const playSound = (type: 'tick' | 'print') => {
    if (!isSoundEnabled) return;
    const url = type === 'tick' 
      ? 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'
      : 'https://assets.mixkit.co/active_storage/sfx/1475/1475-preview.mp3'; 
    const audio = new Audio(url);
    audio.volume = 0.1;
    audio.play().catch(() => {});
  };

  const addToCart = (product: Product) => {
    playSound('tick');
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setSearch('');
  };

  const updateQuantity = (productId: string, delta: number) => {
    playSound('tick');
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleLaunchOrder = () => {
    if (!room) {
      alert("Identifique o quarto primeiro.");
      roomInputRef.current?.focus();
      return;
    }
    if (cart.length === 0) return;

    playSound('print');

    const newOrder: Order = {
      id: `CMD-${Date.now()}`,
      room,
      guestName: guestInfo?.name || 'Consumidor Avulso',
      items: [...cart],
      timestamp: Date.now(),
      outlet,
      total
    };

    const history = safeStorage.get('samoa_history', []);
    history.push(newOrder);
    safeStorage.set('samoa_history', history.slice(-100));

    setLastOrder(newOrder);
    setShowReceipt(true);
    setCart([]);
    setRoom('');
  };

  const copyOrderToClipboard = () => {
    if (!lastOrder) return;
    const text = `SAMOA - ${lastOrder.outlet}\nQ: ${lastOrder.room} - ${lastOrder.guestName}\n` + 
      lastOrder.items.map(it => `${it.quantity}x ${it.product.name}`).join('\n') + 
      `\nTOTAL: R$ ${lastOrder.total.toFixed(2)}`;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const printReceipt = () => {
    window.print();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6 h-full relative">
      {/* Receipt Modal (Print Area Integrated) */}
      {showReceipt && lastOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-fade-in no-print">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowReceipt(false)}></div>
          
          <div className="relative w-full max-w-sm glass-dark rounded-[2.5rem] p-8 border border-white/10 shadow-2xl flex flex-col items-center">
            <button onClick={() => setShowReceipt(false)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full text-slate-400">
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-white rounded-2xl p-2 mb-6">
              <SamoaLogo />
            </div>

            {/* THE COMMAND - PRINTABLE AREA */}
            <div className="print-area w-full bg-white text-black p-8 font-mono text-[11px] leading-tight shadow-inner rounded-sm rotate-1 flex flex-col gap-1 mb-8 print:rotate-0 print:shadow-none print:m-0 print:w-full print:border-0">
               <div className="text-center font-bold mb-4 border-b border-black border-dashed pb-2">
                 LA FLEUR SAMOA RESORT<br/>
                 MASTER SYSTEM - {lastOrder.outlet}
               </div>
               <div className="flex justify-between mb-1">
                 <span>DATA:</span>
                 <span>{new Date(lastOrder.timestamp).toLocaleString()}</span>
               </div>
               <div className="flex justify-between font-bold text-sm border-b border-black border-dashed pb-2 mb-2">
                 <span>QUARTO:</span>
                 <span>{lastOrder.room}</span>
               </div>
               <div className="mb-2 italic uppercase font-bold">{lastOrder.guestName}</div>
               
               <div className="border-b border-black border-dashed mb-2"></div>
               
               <div className="flex flex-col gap-1 min-h-[100px]">
                 {lastOrder.items.map((it, idx) => (
                   <div key={idx} className="flex justify-between">
                     <span>{it.quantity}x {it.product.name}</span>
                     <span>R$ {(it.product.price * it.quantity).toFixed(2)}</span>
                   </div>
                 ))}
               </div>

               <div className="border-t border-black border-dashed mt-4 pt-2 flex justify-between font-bold text-sm">
                 <span>TOTAL:</span>
                 <span>R$ {lastOrder.total.toFixed(2)}</span>
               </div>
               
               <div className="mt-8 text-center text-[9px] border-t border-black pt-4">
                 COMANDA AUXILIAR MASTER<br/>
                 ** LANÇAR NO SISTEMA REAL **<br/>
                 Obrigado!
               </div>
            </div>

            <div className="grid grid-cols-1 w-full gap-3 no-print">
              <button onClick={copyOrderToClipboard} className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-[#c19a6b] text-white hover:bg-[#a67d54]'}`}>
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'COPIADO PARA SYNC!' : 'CÓPIA INTELIGENTE'}
              </button>
              
              <button onClick={printReceipt} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-white">
                <Printer size={18} /> IMPRIMIR REAL (FÍSICO)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main UI */}
      <div className="flex flex-col lg:flex-row gap-6 glass p-6 rounded-[2.5rem] no-print">
        <div className="w-full lg:w-1/3 space-y-2">
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Check-in Quarto</label>
           <input ref={roomInputRef} type="number" placeholder="000" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-2xl font-bold text-center focus:outline-none focus:border-[#c19a6b] transition-all" value={room} onChange={(e) => setRoom(e.target.value)} />
           {guestInfo && (
             <div className="bg-[#c19a6b]/10 border border-[#c19a6b]/20 p-3 rounded-xl animate-fade-in flex items-center justify-between">
               <span className="text-xs font-bold text-[#c19a6b]">{guestInfo.name}</span>
               <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
             </div>
           )}
        </div>
        <div className="flex-1 space-y-2">
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Busca Rápida</label>
           <div className="relative h-full">
             <input ref={searchInputRef} type="text" placeholder="Pesquisar item..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 focus:outline-none focus:border-[#c19a6b] transition-all" value={search} onChange={(e) => setSearch(e.target.value)} />
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
           </div>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
           <Timer className="text-[#c19a6b]" size={20} />
           <span className="text-2xl font-mono font-bold">{formatTime(orderTimer)}</span>
           <button onClick={() => setIsSoundEnabled(!isSoundEnabled)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
             {isSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 no-print">
        <div className="lg:w-2/3 space-y-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-[#c19a6b] text-white shadow-lg shadow-[#c19a6b]/20' : 'bg-white/5 text-slate-400'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <button key={product.id} onClick={() => addToCart(product)} className="glass p-5 rounded-3xl text-left hover:border-[#c19a6b] transition-all flex flex-col justify-between group h-36">
                <div>
                   <span className="text-[9px] text-slate-500 font-bold uppercase">{product.category}</span>
                   <h4 className="font-bold text-sm mt-1 leading-tight">{product.name}</h4>
                </div>
                <div className="mt-4 flex items-center justify-between">
                   <span className="font-mono font-bold text-[#c19a6b]">R$ {product.price.toFixed(2)}</span>
                   <div className="w-8 h-8 rounded-full bg-[#c19a6b]/10 flex items-center justify-center text-[#c19a6b] opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                      <Plus size={16} />
                   </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:w-1/3 glass-dark rounded-[2.5rem] p-6 flex flex-col border border-white/10 sticky top-24 h-[calc(100vh-160px)]">
           <h3 className="font-brand font-bold uppercase tracking-widest text-[10px] mb-6 flex items-center gap-3 text-slate-500">
              <ShoppingCart size={16} className="text-[#c19a6b]" /> Comanda Master
           </h3>
           
           <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pr-1">
             {cart.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-10 text-center px-4">
                  <ReceiptText size={64} className="mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">PDV Auxiliar Pronto</p>
               </div>
             ) : (
               cart.map(item => (
                 <div key={item.product.id} className="bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-white/5 animate-fade-in">
                   <div className="flex flex-col flex-1">
                     <span className="text-xs font-bold">{item.product.name}</span>
                     <span className="text-[9px] text-slate-500 font-mono">R$ {item.product.price.toFixed(2)}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><Minus size={14} /></button>
                     <span className="font-mono font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                     <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><Plus size={14} /></button>
                   </div>
                 </div>
               ))
             )}
           </div>

           <div className="mt-6 pt-6 border-t border-white/10">
             <div className="flex items-center justify-between mb-6">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">SUBTOTAL</span>
                <span className="text-2xl font-black text-[#c19a6b]">R$ {total.toFixed(2)}</span>
             </div>
             
             <button onClick={handleLaunchOrder} disabled={cart.length === 0} className="group w-full py-5 bg-gradient-to-r from-[#c19a6b] to-[#a67d54] disabled:opacity-20 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-[#c19a6b]/20 transition-all active:scale-95 flex items-center justify-center gap-3">
               <ClipboardCheck size={18} /> LANÇAR & IMPRIMIR
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
