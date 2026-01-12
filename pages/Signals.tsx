
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { TradeSignal, Language } from '../types';
import { TrendingUp, TrendingDown, Clock, Shield, Target, Zap, Lock, Copy, Sparkles, RefreshCw } from 'lucide-react';
import { translations } from '../translations';

interface SignalsProps {
  language: Language;
}

const Signals: React.FC<SignalsProps> = ({ language }) => {
  const t = translations[language].signals;
  const common = translations[language].common;
  const [signals, setSignals] = useState<TradeSignal[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setSignals(dbService.getSignals());
  }, []);

  const refreshSignals = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSignals(dbService.getSignals());
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight italic text-yellow-500 uppercase">{t.title}</h1>
          <p className="text-neutral-500">{t.subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={refreshSignals}
            className="p-2 text-neutral-500 hover:text-white transition-colors"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">{common.marketOpen}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {signals.length === 0 ? (
          <div className="glass-card p-20 rounded-3xl text-center border-dashed border-white/10">
            <Zap size={48} className="mx-auto text-neutral-800 mb-4" />
            <p className="text-neutral-600 font-bold uppercase tracking-widest">Scanning market for institutional flows...</p>
          </div>
        ) : (
          signals.map((signal) => (
            <div key={signal.id} className="group relative">
              <div className={`glass-card rounded-2xl overflow-hidden border-l-4 ${signal.isVip ? 'border-l-yellow-500 bg-yellow-500/5' : signal.type === 'BUY' ? 'border-l-green-500' : 'border-l-red-500'} transition-all`}>
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${signal.type === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {signal.type === 'BUY' ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-2xl font-black">{signal.pair}</h3>
                          <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase ${signal.isVip ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-neutral-800 text-neutral-500'}`}>
                            {signal.isVip ? t.vipLabel : t.standardLabel}
                          </span>
                        </div>
                        <p className={`text-xs font-bold uppercase tracking-widest ${signal.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                          {signal.type === 'BUY' ? (language === 'en' ? 'Long Position' : 'สถานะซื้อ') : (language === 'en' ? 'Short Position' : 'สถานะขาย')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <div className="bg-neutral-800/50 px-5 py-2 rounded-xl border border-neutral-700">
                        <p className="text-[10px] text-neutral-500 uppercase font-black mb-0.5 tracking-tighter">{t.entry}</p>
                        <p className="text-xl font-mono font-bold">${signal.entry.toFixed(2)}</p>
                      </div>
                      <div className="bg-red-500/5 px-5 py-2 rounded-xl border border-red-500/20">
                        <p className="text-[10px] text-red-400 uppercase font-black mb-0.5 tracking-tighter">{t.sl}</p>
                        <p className="text-xl font-mono font-bold text-red-400">${signal.sl.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      {[
                        { label: t.tp1, value: signal.tp1 },
                        { label: t.tp2, value: signal.tp2 }
                      ].map((tp, i) => (
                        <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${signal.isVip ? 'bg-yellow-500/5 border-yellow-500/20 shadow-inner' : 'bg-neutral-800/30 border-neutral-700/50'}`}>
                          <div className="flex items-center space-x-3 text-neutral-400">
                            <Target size={16} className={signal.isVip ? 'text-yellow-500' : ''} />
                            <span className="text-xs font-bold uppercase">{tp.label}</span>
                          </div>
                          <span className={`font-mono font-bold ${signal.isVip ? 'text-yellow-500' : 'text-neutral-200'}`}>
                            ${tp.value.toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between px-1 pt-2">
                         <span className="flex items-center text-[10px] text-neutral-500 uppercase font-bold tracking-tighter">
                           <Clock size={12} className="mr-1" /> {common.posted}: {new Date(signal.timestamp).toLocaleTimeString()}
                         </span>
                         {signal.probability && (
                           <span className="flex items-center text-[10px] text-green-500 uppercase font-black">
                             <Sparkles size={12} className="mr-1" /> Prob: {signal.probability}%
                           </span>
                         )}
                      </div>
                    </div>

                    <div className={`rounded-2xl p-4 border flex flex-col justify-between ${signal.isVip ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-neutral-800/20 border-neutral-700/50'}`}>
                      <div>
                        <h4 className="text-[10px] font-black text-yellow-500 mb-2 uppercase tracking-[0.2em] flex items-center">
                          <Zap size={14} className="mr-2" /> {t.aiEdge}
                        </h4>
                        <p className="text-xs md:text-sm text-neutral-300 leading-relaxed italic">
                          "{signal.aiAnalysis}"
                        </p>
                      </div>
                      <div className="mt-4 flex items-center text-[10px] text-neutral-500">
                        <Shield size={12} className="mr-1" /> Institutional Analysis Protocol v4.0
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Signals;
