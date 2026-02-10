
import React, { useState, useEffect } from 'react';
import { NAVIGATION, safeStorage } from './constants.tsx';
import { OutletType } from './types.ts';
import Login from './components/Login.tsx';
import Dashboard from './components/Dashboard.tsx';
import POS from './components/POS.tsx';
import History from './components/History.tsx';
import Rooms from './components/Rooms.tsx';
import Layout from './components/Layout.tsx';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<OutletType>('DASHBOARD');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem('samoa_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (status: boolean) => {
    setLoading(true);
    setTimeout(() => {
      setIsAuthenticated(status);
      localStorage.setItem('samoa_auth', String(status));
      setLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      setIsAuthenticated(false);
      localStorage.removeItem('samoa_auth');
      setActiveTab('DASHBOARD');
      setLoading(false);
    }, 500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'HISTORY':
        return <History />;
      case 'ROOMS':
        return <Rooms />;
      default:
        return <POS outlet={activeTab} />;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#050a0f] flex flex-col items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-[#c19a6b] border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-[#c19a6b] font-brand tracking-[0.2em] animate-pulse font-bold uppercase text-[10px]">Estabelecendo Master Link...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onNavigate={(id) => id === 'LOGOUT' ? handleLogout() : setActiveTab(id as OutletType)}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
