
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Education from './pages/Education';
import Tools from './pages/Tools';
import Signals from './pages/Signals';
import Community from './pages/Community';
import LiveRoom from './pages/LiveRoom';
import AdminDashboard from './pages/AdminDashboard';
import AuthModal from './components/AuthModal';
import { AppView, Language, User, TradeSignal } from './types';
import { dbService } from './services/dbService';
import { aiService } from './services/aiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [signals, setSignals] = useState<TradeSignal[]>([]);

  useEffect(() => {
    const db = dbService.init();
    setUser(db.user);
    setSignals(db.signals);

    const signalInterval = setInterval(async () => {
      if (db.user?.isVip) {
        setIsSyncing(true);
        const newSignal = await aiService.generateSmartSignal(2024.50);
        if (newSignal) {
          dbService.addSignal(newSignal as TradeSignal);
          setSignals(dbService.getSignals());
        }
        setIsSyncing(false);
      }
    }, 300000); 

    return () => clearInterval(signalInterval);
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    dbService.updateUser(newUser);
    if (newUser.role === 'admin') {
      setCurrentView(AppView.ADMIN);
    }
  };

  const handleLogout = () => {
    setUser(null);
    dbService.updateUser(null);
    setCurrentView(AppView.DASHBOARD);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard language={language} />;
      case AppView.EDUCATION: return <Education language={language} />;
      case AppView.TOOLS: return <Tools language={language} />;
      case AppView.SIGNALS: return <Signals language={language} />;
      case AppView.COMMUNITY: return <Community language={language} />;
      case AppView.LIVE_ROOM: return <LiveRoom language={language} />;
      case AppView.ADMIN: return <AdminDashboard language={language} />;
      default: return <Dashboard language={language} />;
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 flex flex-col bg-[#050505]">
      <Navbar 
        currentView={currentView} 
        setView={setCurrentView} 
        language={language} 
        setLanguage={setLanguage}
        user={user}
        onAuthClick={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 pt-6 md:pt-10">
        <div key={`${currentView}-${language}`} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {renderContent()}
        </div>
      </main>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        language={language}
        onLoginSuccess={handleLogin}
      />

      <div className="fixed bottom-24 right-6 md:bottom-8 z-40 hidden md:block">
        <div className={`flex items-center space-x-2 bg-neutral-900/90 backdrop-blur-md border px-4 py-2 rounded-full shadow-2xl transition-all ${isSyncing ? 'border-yellow-500 animate-pulse' : 'border-white/10'}`}>
          <div className="relative">
            <div className={`w-2 h-2 rounded-full absolute ${isSyncing ? 'bg-yellow-500 animate-ping' : 'bg-green-500'}`}></div>
            <div className={`w-2 h-2 rounded-full relative ${isSyncing ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
          </div>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isSyncing ? 'text-yellow-500' : 'text-neutral-500'}`}>
            {isSyncing 
              ? (language === 'en' ? 'Syncing Backend...' : 'กำลังประมวลผล...') 
              : (language === 'en' ? 'Engine Ready' : 'ระบบพร้อมทำงาน')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;
