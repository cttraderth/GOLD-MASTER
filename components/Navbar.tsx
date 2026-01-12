
import React from 'react';
import { getNavigationItems } from '../constants';
import { AppView, Language, User } from '../types';
import { Globe, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { translations } from '../translations';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  user: User | null;
  onAuthClick: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, language, setLanguage, user, onAuthClick, onLogout }) => {
  const items = getNavigationItems(language);
  const common = translations[language].common;
  const navT = translations[language].nav;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-4 md:relative md:top-0 md:border-t-0 md:border-b md:h-20 md:flex md:items-center md:px-8 z-50">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView(AppView.DASHBOARD)}>
            <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center font-bold text-black text-xl">GM</div>
            <span className="text-xl font-bold gold-text">GOLD MASTER</span>
          </div>
          
          <div className="flex items-center bg-neutral-800 rounded-lg p-1">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${language === 'en' ? 'bg-yellow-500 text-black' : 'text-neutral-500 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('th')}
              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${language === 'th' ? 'bg-yellow-500 text-black' : 'text-neutral-500 hover:text-white'}`}
            >
              TH
            </button>
          </div>
        </div>
        
        <div className="flex justify-around items-center w-full md:w-auto md:space-x-8">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 transition-colors ${
                currentView === item.id ? 'text-yellow-500' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {item.icon}
              <span className="text-[10px] md:text-sm font-medium">{item.label}</span>
            </button>
          ))}

          {/* Admin Link if authorized */}
          {user?.role === 'admin' && (
            <button
              onClick={() => setView(AppView.ADMIN)}
              className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 transition-colors ${
                currentView === AppView.ADMIN ? 'text-yellow-500' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Settings size={20} />
              <span className="text-[10px] md:text-sm font-medium">{navT.admin}</span>
            </button>
          )}
          
          <div className="hidden md:flex items-center ml-4 space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-700">
                <div className={`w-8 h-8 rounded-full ${user.role === 'admin' ? 'bg-yellow-500' : 'bg-yellow-500/20'} flex items-center justify-center text-black font-bold overflow-hidden shadow-lg`}>
                  {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : user.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold leading-tight line-clamp-1">{user.name}</p>
                  <button onClick={onLogout} className="text-[8px] text-neutral-500 hover:text-red-500 font-bold flex items-center uppercase">
                    <LogOut size={8} className="mr-1" /> {common.signOut}
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={onAuthClick}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                {common.signIn}
              </button>
            )}
          </div>

          <div className="md:hidden flex flex-col items-center space-y-1">
             {user ? (
               <button onClick={onLogout} className="text-red-500">
                 <LogOut size={20} />
                 <span className="text-[8px] font-bold uppercase">{common.signOut}</span>
               </button>
             ) : (
               <button onClick={onAuthClick} className="text-yellow-500">
                 <UserIcon size={20} />
                 <span className="text-[10px] font-medium uppercase">{common.signIn}</span>
               </button>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
