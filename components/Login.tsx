
import React, { useState } from 'react';
import { Lock, User, CheckCircle2 } from 'lucide-react';
import { SamoaLogo } from '../constants.tsx';

interface LoginProps {
  onLogin: (status: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.volume = 0.1;
    audio.play().catch(() => {});

    if (username.toLowerCase() === 'admin' && password.toLowerCase() === 'admin') {
      setIsLoggingIn(true);
      setTimeout(() => onLogin(true), 1200);
    } else {
      setError('Credenciais Master inválidas.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050a0f] flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-md relative animate-fade-in">
        <div className="glass-dark p-10 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c19a6b] to-transparent"></div>
          
          <div className="text-center mb-10 flex flex-col items-center">
            <div className="w-28 h-28 bg-white/95 p-2 rounded-[2rem] shadow-2xl mb-6 flex items-center justify-center animate-fade-in">
              <SamoaLogo />
            </div>
            <div className="space-y-1 mb-2">
              <p className="text-[10px] tracking-[0.5em] uppercase text-slate-500 font-bold">LA FLEUR</p>
              <h1 className="text-4xl font-brand font-bold text-[#c19a6b] tracking-[0.15em]">SAMOA</h1>
              <p className="text-[10px] tracking-[0.6em] uppercase text-[#7d8c6d] font-black">RESORT</p>
            </div>
            <div className="h-px w-12 bg-[#c19a6b]/30 my-4"></div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-slate-400 font-bold">Master System Access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Usuário Master"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#c19a6b] transition-all text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                placeholder="Senha de Acesso"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#c19a6b] transition-all text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-400 text-xs text-center font-medium animate-bounce">{error}</p>}

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className={`w-full py-4 rounded-xl font-bold tracking-widest text-sm transition-all flex items-center justify-center gap-2 ${
                isLoggingIn ? 'bg-emerald-500 text-white' : 'bg-[#c19a6b] hover:bg-[#a67d54] text-white'
              }`}
            >
              {isLoggingIn ? (
                <>
                  <CheckCircle2 size={18} />
                  ESTABELECENDO SESSÃO...
                </>
              ) : (
                'ACESSAR MASTER SYSTEM'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
