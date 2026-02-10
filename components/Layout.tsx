
import React, { useState } from 'react';
import { NAVIGATION, SamoaLogo } from '../constants.tsx';
import { Menu, X, ShieldAlert, MonitorCheck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#050a0f] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="h-20 glass fixed top-0 w-full z-40 px-4 md:px-8 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-95"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-14 h-14 bg-white/95 p-1 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.08)] group-hover:scale-105 transition-transform duration-500">
              <SamoaLogo />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-brand font-bold tracking-[0.2em] text-[#c19a6b] leading-none mb-1 uppercase">SAMOA</h1>
              <span className="text-[10px] tracking-[0.4em] uppercase text-slate-400 font-bold opacity-70">Master System</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden lg:flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Master Active</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
             <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <MonitorCheck size={16} className="text-[#c19a6b]" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Admin</span>
             </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-20">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} glass-dark border-r border-white/5 fixed left-0 h-[calc(100vh-80px)] z-30 transition-all duration-300 overflow-hidden hidden md:block shadow-2xl`}>
          <div className="flex flex-col h-full py-6">
            <nav className="flex-1 px-3 space-y-2">
              {NAVIGATION.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 group relative ${
                    activeTab === item.id 
                      ? 'bg-gradient-to-r from-[#c19a6b] to-[#a67d54] text-white shadow-xl shadow-[#c19a6b]/20' 
                      : 'hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </div>
                  {isSidebarOpen && (
                    <span className="font-semibold text-sm whitespace-nowrap tracking-wide">{item.label}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} transition-all duration-500 p-6 md:p-10 relative overflow-x-hidden`}>
          <div className="max-w-7xl mx-auto min-h-[calc(100vh-280px)]">
             {children}
          </div>
          
          {/* Global Footer */}
          <footer className="mt-24 pt-10 pb-12 border-t border-white/5 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-all duration-700 cursor-default">
               <div className="w-10 h-10 bg-white p-1 rounded-xl shadow-lg">
                  <SamoaLogo />
               </div>
               <span className="text-sm font-brand font-bold tracking-widest text-slate-300">LA FLEUR SAMOA</span>
            </div>
            <p className="text-[11px] text-[#c19a6b] tracking-[0.5em] uppercase font-black animate-pulse">
              Sistema desenvolvido por Diogo Silva
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;
