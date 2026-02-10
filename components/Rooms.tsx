
import React, { useState } from 'react';
import { GUEST_DATA } from '../constants';
import { Search, MapPin, UserCheck, ShieldCheck, Star } from 'lucide-react';

const Rooms: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredGuests = GUEST_DATA.filter(g => 
    g.room.includes(search) || g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass p-8 rounded-[2.5rem] border-b-4 border-[#c19a6b]/20">
        <h2 className="text-3xl font-brand font-bold mb-2">Diretório de Hóspedes</h2>
        <p className="text-slate-400 text-sm mb-6">Consulte informações de quartos e status de estadia em tempo real.</p>
        
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#c19a6b]" size={24} />
          <input 
            type="text" 
            placeholder="Buscar por número do quarto ou nome do hóspede..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-lg focus:outline-none focus:border-[#c19a6b] transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGuests.map((guest, i) => (
          <div key={i} className="glass p-8 rounded-[2rem] hover:border-[#c19a6b]/40 transition-all group relative overflow-hidden">
            {guest.status === 'VIP' && (
              <div className="absolute top-0 right-0 bg-[#c19a6b] text-white px-6 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                VIP Member
              </div>
            )}
            
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover:bg-[#c19a6b]/10 transition-colors">
                <span className="text-[10px] font-bold text-slate-500 uppercase leading-none">Nº</span>
                <span className="text-2xl font-bold text-[#c19a6b] leading-none mt-1">{guest.room}</span>
              </div>
              <div>
                <h4 className="text-lg font-bold group-hover:text-[#c19a6b] transition-colors">{guest.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${
                    guest.status === 'VIP' ? 'bg-[#c19a6b]/20 text-[#c19a6b]' : 
                    guest.status === 'Check-out Today' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {guest.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-white/5 pt-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-2"><MapPin size={14}/> Localização</span>
                <span className="font-bold">Ala Norte, Piso 2</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-2"><UserCheck size={14}/> Check-in</span>
                <span className="font-bold">Ontem, 14:20</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-2"><ShieldCheck size={14}/> Segurança</span>
                <span className="font-bold text-emerald-400">Verificado</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
