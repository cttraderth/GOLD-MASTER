
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { TradeSignal, Language } from '../types';
import { translations } from '../translations';
import { Save, Trash2, Plus, AlertCircle, Database, ShieldAlert, TrendingUp, TrendingDown, Clock, LayoutGrid } from 'lucide-react';

interface AdminDashboardProps {
  language: Language;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const t = translations[language].admin;
  const signalTrans = translations[language].signals;
  
  const [signals, setSignals] = useState<TradeSignal[]>([]);
  const [tickerText, setTickerText] = useState("");
  const [tickerList, setTickerList] = useState<string[]>([]);
  
  // New Signal Form State
  const [newSignal, setNewSignal] = useState<Partial<TradeSignal>>({
    pair: 'XAUUSD',
    type: 'BUY',
    entry: 2024.50,
    sl: 2015.00,
    tp1: 2035.00,
    tp2: 2045.00,
    isVip: false
  });

  useEffect(() => {
    setSignals(dbService.getSignals());
    setTickerList(dbService.getTickerMessages());
  }, []);

  const handleAddSignal = () => {
    const signal: TradeSignal = {
      ...newSignal,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      status: 'ACTIVE',
      probability: Math.floor(Math.random() * 20) + 80,
      aiAnalysis: "Manual expert override signal provided by system administrator."
    } as TradeSignal;
    
    dbService.addSignal(signal);
    setSignals(dbService.getSignals());
  };

  const handleDeleteSignal = (id: string) => {
    dbService.deleteSignal(id);
    setSignals(dbService.getSignals());
  };

  const handleUpdateTicker = () => {
    if (!tickerText) return;
    const newList = [tickerText, ...tickerList].slice(0, 5);
    dbService.updateTickerMessages(newList);
    setTickerList(newList);
    setTickerText("");
  };

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-yellow-500/10 pb-6">
        <div>
          <h1 className="text-3xl font-black gold-text italic tracking-tighter uppercase">{t.title}</h1>
          <p className="text-neutral-500 text-sm font-medium">{t.subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 bg-yellow-500/10 px-4 py-2 rounded-xl border border-yellow-500/20">
          <ShieldAlert size={18} className="text-yellow-500" />
          <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Admin Access Restricted</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Signal Manager */}
        <div className="lg:col-span-8 space-y-8">
          <section className="glass-card p-6 rounded-2xl border border-white/5 bg-[#0a0a0a]">
            <h2 className="text-lg font-black uppercase italic tracking-tight mb-6 flex items-center">
              <Plus size={20} className="text-yellow-500 mr-3" /> {t.createSignal}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-[9px] text-neutral-500 font-black uppercase mb-1 block tracking-widest">Type</label>
                <select 
                  value={newSignal.type}
                  onChange={(e) => setNewSignal({...newSignal, type: e.target.value as 'BUY' | 'SELL'})}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-sm font-bold focus:border-yellow-500 outline-none"
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] text-neutral-500 font-black uppercase mb-1 block tracking-widest">Entry</label>
                <input 
                  type="number" step="0.01" value={newSignal.entry}
                  onChange={(e) => setNewSignal({...newSignal, entry: Number(e.target.value)})}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-sm font-bold focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] text-neutral-500 font-black uppercase mb-1 block tracking-widest">SL</label>
                <input 
                  type="number" step="0.01" value={newSignal.sl}
                  onChange={(e) => setNewSignal({...newSignal, sl: Number(e.target.value)})}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-sm font-bold focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] text-neutral-500 font-black uppercase mb-1 block tracking-widest">TP 1</label>
                <input 
                  type="number" step="0.01" value={newSignal.tp1}
                  onChange={(e) => setNewSignal({...newSignal, tp1: Number(e.target.value)})}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-sm font-bold focus:border-yellow-500 outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
               <label className="flex items-center cursor-pointer group">
                  <input 
                    type="checkbox" checked={newSignal.isVip} 
                    onChange={(e) => setNewSignal({...newSignal, isVip: e.target.checked})}
                    className="hidden" 
                  />
                  <div className={`w-10 h-6 rounded-full relative transition-colors ${newSignal.isVip ? 'bg-yellow-500' : 'bg-neutral-800'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${newSignal.isVip ? 'left-5' : 'left-1'}`}></div>
                  </div>
                  <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-yellow-500">Enable VIP Signal</span>
               </label>
               <button 
                 onClick={handleAddSignal}
                 className="gold-gradient text-black font-black px-6 py-2 rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-yellow-500/10 flex items-center"
               >
                 <Save size={14} className="mr-2" /> Publish Signal
               </button>
            </div>
          </section>

          <section className="space-y-4">
             <h3 className="text-sm font-black uppercase text-neutral-500 tracking-widest mb-4 flex items-center">
               <Database size={16} className="mr-2" /> Live Database Entries ({signals.length})
             </h3>
             {signals.map(s => (
               <div key={s.id} className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center space-x-4">
                     <div className={`p-2 rounded-lg ${s.type === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {s.type === 'BUY' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                     </div>
                     <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-black">{s.pair} @ {s.entry}</span>
                          {s.isVip && <span className="text-[8px] bg-yellow-500 text-black px-1 rounded font-black">VIP</span>}
                        </div>
                        <p className="text-[9px] text-neutral-500 uppercase font-black tracking-tighter">ID: {s.id} • {new Date(s.timestamp).toLocaleTimeString()}</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteSignal(s.id)}
                    className="p-2 text-neutral-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
               </div>
             ))}
          </section>
        </div>

        {/* Right: Ticker Manager & Stats */}
        <div className="lg:col-span-4 space-y-6">
          <section className="glass-card p-6 rounded-2xl border border-red-500/10 bg-gradient-to-br from-red-500/5 to-transparent">
             <h2 className="text-lg font-black uppercase italic tracking-tight mb-6 flex items-center text-red-500">
               <AlertCircle size={20} className="mr-3" /> {t.tickerTitle}
             </h2>
             <textarea 
               value={tickerText}
               onChange={(e) => setTickerText(e.target.value)}
               placeholder={t.tickerPlaceholder}
               className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs font-bold focus:border-red-500 outline-none mb-4 resize-none h-24"
             />
             <button 
               onClick={handleUpdateTicker}
               className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-colors"
             >
               {t.saveTicker}
             </button>
             
             <div className="mt-6 space-y-2">
                <p className="text-[9px] font-black uppercase text-neutral-600 tracking-widest">Active Tickers:</p>
                {tickerList.map((msg, i) => (
                  <div key={i} className="text-[10px] text-neutral-400 font-bold border-l border-red-500/30 pl-3 py-1">
                    {msg}
                  </div>
                ))}
             </div>
          </section>

          <section className="glass-card p-6 rounded-2xl border border-white/5">
             <h2 className="text-sm font-black uppercase text-neutral-400 tracking-widest mb-6 flex items-center">
               <LayoutGrid size={16} className="mr-2" /> {t.stats}
             </h2>
             <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-neutral-800/50">
                   <span className="text-[10px] font-black uppercase text-neutral-500">{t.activeSignals}</span>
                   <span className="text-sm font-black">{signals.length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-800/50">
                   <span className="text-[10px] font-black uppercase text-neutral-500">{t.totalPosts}</span>
                   <span className="text-sm font-black">242</span>
                </div>
                <div className="flex justify-between items-center py-2">
                   <span className="text-[10px] font-black uppercase text-neutral-500">{t.systemHealth}</span>
                   <span className="text-[10px] font-black text-green-500 uppercase">Operational</span>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
