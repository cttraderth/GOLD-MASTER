
import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, CheckCircle, MailCheck, ShieldCheck } from 'lucide-react';
import { Language, AuthMode, User } from '../types';
import { translations } from '../translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLoginSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, language, onLoginSuccess }) => {
  const t = translations[language].auth;
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSocialLogin = (provider: User['provider']) => {
    const mockUser: User = {
      id: Math.random().toString(36).substring(7),
      name: provider === 'line' ? 'LINE User' : provider.charAt(0).toUpperCase() + provider.slice(1) + ' Trader',
      email: `${provider}_user@example.com`,
      provider: provider,
      isVip: false,
      role: 'user',
      balance: 0,
    };
    onLoginSuccess(mockUser);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin Credential Check
    if (email === 'admin@goldmaster.com' && password === 'GoldMasterOwner2024') {
      const adminUser: User = {
        id: 'admin_001',
        name: 'Gold Master Owner',
        email: email,
        provider: 'email',
        isVip: true,
        role: 'admin',
        balance: 1000000,
      };
      onLoginSuccess(adminUser);
      onClose();
      return;
    }

    if (mode === 'register') {
      setMode('email_sent');
    } else {
      const mockUser: User = {
        id: 'user_' + Math.random().toString(36).substring(7),
        name: name || 'GM Member',
        email: email || 'trader@goldmaster.com',
        provider: 'email',
        isVip: false,
        role: 'user',
        balance: 0,
      };
      onLoginSuccess(mockUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md glass-card rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="p-8">
          {mode === 'email_sent' ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <MailCheck size={40} className="animate-bounce" />
              </div>
              <h2 className="text-2xl font-black mb-3 italic tracking-tight uppercase">{t.emailSentTitle}</h2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                {t.emailSentDesc}
              </p>
              <button 
                onClick={() => setMode('login')}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 rounded-xl transition-all"
              >
                {t.backToLogin}
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center font-black text-black text-2xl mb-4 italic">GM</div>
                <h2 className="text-2xl font-black mb-1 italic tracking-tight uppercase">
                  {mode === 'login' ? t.loginTitle : t.registerTitle}
                </h2>
                <p className="text-neutral-500 text-sm">
                  {mode === 'login' ? t.loginSubtitle : t.registerSubtitle}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                {mode === 'register' && (
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input 
                      type="text" 
                      placeholder={t.nameLabel}
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input 
                    type="email" 
                    placeholder={t.emailLabel}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input 
                    type="password" 
                    placeholder={t.passwordLabel}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full gold-gradient hover:scale-[1.02] active:scale-[0.98] text-black font-black py-4 rounded-xl transition-all uppercase tracking-widest text-sm shadow-xl shadow-yellow-500/10"
                >
                  {mode === 'login' ? t.signInBtn : t.signUpBtn}
                </button>
              </form>

              <div className="relative mb-8 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-800"></div></div>
                <span className="relative bg-[#0d0d0d] px-4 text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{t.orContinueWith}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <button 
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-neutral-100 text-black py-2.5 rounded-xl transition-all font-bold text-xs"
                >
                  <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-4 h-4" alt="Google" />
                  <span>{t.google}</span>
                </button>
                <button 
                  onClick={() => handleSocialLogin('line')}
                  className="flex items-center justify-center space-x-2 bg-[#00B900] hover:bg-[#00a300] text-white py-2.5 rounded-xl transition-all font-bold text-xs"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" className="w-4 h-4 invert" alt="LINE" />
                  <span>{t.line}</span>
                </button>
              </div>

              <div className="text-center">
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-xs text-neutral-400 hover:text-yellow-500 font-bold transition-colors"
                >
                  {mode === 'login' ? t.noAccount : t.hasAccount} <span className="text-yellow-500 underline ml-1 uppercase">{mode === 'login' ? t.signUpBtn : t.signInBtn}</span>
                </button>
              </div>

              {/* Security Badge */}
              <div className="mt-8 flex items-center justify-center space-x-2 text-neutral-600">
                <ShieldCheck size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Secured by Gold Master Cloud</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
