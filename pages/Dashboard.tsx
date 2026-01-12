
import React, { useState, useEffect } from 'react';
import PriceCard from '../components/PriceCard';
import BrokerCard from '../components/BrokerCard';
import { analyzeMarketSentiment } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { TrendingUp, Award, Clock, ArrowUpRight, Crown, ChevronRight, Zap, AlertTriangle, Calendar, Newspaper, Activity, Globe, Check, ShieldCheck, Star, MonitorPlay, BellRing, Gauge, ShieldAlert, Target } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface DashboardProps {
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ language }) => {
  const t = translations[language].dashboard;
  const common = translations[language].common;
  
  const [insight, setInsight] = useState(t.analyzing);
  const [price, setPrice] = useState(2024.50);
  const [tickerMessages, setTickerMessages] = useState<string[]>([]);

  useEffect(() => {
    setTickerMessages(dbService.getTickerMessages());
    
    const getInsight = async () => {
      const res = await analyzeMarketSentiment(price, "Bullish", language);
      setInsight(res || t.analyzing);
    };
    getInsight();
    
    const interval = setInterval(() => {
      setPrice(prev => prev + (Math.random() - 0.5) * 2);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [language, price]);

  const levels = {
    resistance: [2065.20, 2054.50, 2042.80],
    pivot: 2028.50,
    support: [2012.30, 2005.10, 1992.40]
  };

  const calendarEvents = [
    { time: '20:30', event: 'US CPI y/y', impact: 'high', currency: 'USD' },
    { time: '22:00', event: 'Fed Chair Powell Speaks', impact: 'high', currency: 'USD' },
    { time: '23:30', event: 'Crude Oil Inventories', impact: 'low', currency: 'USD' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Scrolling News Ticker (Admin Controlled) */}
      <div className="w-full bg-red-500/10 border-y border-red-500/20 py-2 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee group">
          {tickerMessages.map((msg, i) => (
            <span key={i} className={`text-[10px] font-black uppercase mx-8 inline-flex items-center ${i % 2 === 0 ? 'text-red-500' : 'text-yellow-500'}`}>
               {i % 2 === 0 ? <AlertTriangle size={12} className="mr-2" /> : <Zap size={12} className="mr-2" />}
               {msg}
            </span>
          ))}
          {/* Duplicate for smooth loop */}
          {tickerMessages.map((msg, i) => (
            <span key={`dup-${i}`} className={`text-[10px] font-black uppercase mx-8 inline-flex items-center ${i % 2 === 0 ? 'text-red-500' : 'text-yellow-500'}`}>
               {i % 2 === 0 ? <AlertTriangle size={12} className="mr-2" /> : <Zap size={12} className="mr-2" />}
               {msg}
            </span>
          ))}
        </div>
      </div>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
        <div>
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">{t.title}</h1>
          <p className="text-neutral-500 mt-1 font-medium">{t.subtitle}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-neutral-800 hover:bg-neutral-700 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
            {common.freeAccount}
          </button>
          <button className="gold-gradient px-6 py-2.5 rounded-xl text-black font-black hover:scale-105 transition-all flex items-center shadow-lg shadow-yellow-500/20 uppercase tracking-widest text-xs">
            <Crown size={14} className="mr-2" /> {common.joinVip}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <PriceCard price={price} change={1.24} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full -mr-12 -mt-12 transition-all group-hover:bg-blue-500/10"></div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[11px] font-black uppercase text-neutral-400 tracking-widest flex items-center">
                  <Activity size={14} className="mr-2 text-blue-500" /> {t.correlation}
                </h4>
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-bold text-neutral-500">LIVE</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-neutral-300 italic">DXY Index</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono font-bold text-green-500">104.20</span>
                    <TrendingUp size={12} className="text-green-500" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-neutral-300 italic">US 10Y Yield</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono font-bold text-red-500">4.12%</span>
                    <ArrowUpRight size={12} className="text-red-500 rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 blur-2xl rounded-full -mr-12 -mt-12 transition-all group-hover:bg-yellow-500/10"></div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[11px] font-black uppercase text-neutral-400 tracking-widest flex items-center">
                  <Globe size={14} className="mr-2 text-yellow-500" /> {t.sessions}
                </h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    <span className="text-sm font-bold text-neutral-200">{t.london}</span>
                  </div>
                  <span className="text-[10px] bg-green-500/10 text-green-500 px-2.5 py-1 rounded-lg font-black uppercase tracking-widest">{t.active}</span>
                </div>
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-600"></div>
                    <span className="text-sm font-bold text-neutral-400">{t.newyork}</span>
                  </div>
                  <span className="text-[10px] bg-neutral-800 text-neutral-500 px-2.5 py-1 rounded-lg font-black uppercase tracking-widest">Starts in 3h</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: t.activeSignals, value: '3', icon: <TrendingUp className="text-yellow-500" /> },
              { label: t.winRate, value: '78%', icon: <Award className="text-yellow-500" /> },
              { label: t.marketBias, value: language === 'en' ? 'Bullish' : 'ขาขึ้น', icon: <ChevronRight className="text-green-500" /> },
              { label: t.spread, value: '1.2 pips', icon: <Zap className="text-yellow-500" /> }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-4 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-all cursor-default">
                <div className="bg-neutral-800/80 w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-inner">{stat.icon}</div>
                <p className="text-[10px] text-neutral-500 uppercase font-black tracking-tighter mb-1">{stat.label}</p>
                <p className="text-xl font-black italic">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Membership Comparison Section */}
          <div className="glass-card rounded-[2rem] overflow-hidden relative border border-yellow-500/20 bg-[#080808] shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none -mr-32 -mt-32"></div>
            
            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-yellow-500/5 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic flex items-center text-white">
                    <Star size={24} className="text-yellow-500 mr-3 animate-pulse" />
                    {t.tierTitle}
                  </h3>
                  <p className="text-neutral-500 text-xs font-medium mt-1">Legally compliant and regulated professional environment</p>
                </div>
                <ShieldCheck size={40} className="text-yellow-500/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 border-r border-white/5 bg-neutral-900/10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h4 className="text-xl font-bold text-neutral-400">{t.tierStandard}</h4>
                    <p className="text-[10px] text-neutral-600 uppercase font-black tracking-[0.2em] mt-1">Guest Level</p>
                  </div>
                  <div className="w-12 h-12 bg-neutral-800/50 rounded-2xl flex items-center justify-center text-neutral-600">
                    <Activity size={24} />
                  </div>
                </div>
                <div className="space-y-6">
                  {[
                    { icon: <BellRing size={18} />, text: t.benefit1, sub: "15-30 min delay" },
                    { icon: <Globe size={18} />, text: t.benefit2, sub: "Standard news" },
                    { icon: <Activity size={18} />, text: t.benefit3, sub: "General discussion" },
                    { icon: <Clock size={18} />, text: t.benefit4, sub: "Basic modules" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start group opacity-60">
                      <div className="mt-1 text-neutral-600 group-hover:text-neutral-400 transition-colors">{item.icon}</div>
                      <div className="ml-4">
                        <p className="text-sm font-bold text-neutral-400 leading-none">{item.text}</p>
                        <p className="text-[10px] text-neutral-600 mt-1 uppercase font-black">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-gradient-to-br from-yellow-500/[0.08] to-transparent relative group">
                <div className="absolute top-6 right-8">
                   <div className="bg-yellow-500 text-black text-[9px] font-black px-3 py-1 rounded-full shadow-lg shadow-yellow-500/20 uppercase tracking-widest italic animate-bounce">ELITE ACCESS</div>
                </div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h4 className="text-2xl font-black gold-text italic tracking-tighter">{t.tierVip}</h4>
                    <p className="text-[10px] text-yellow-500/70 uppercase font-black tracking-[0.3em] mt-1">Professional Grade</p>
                  </div>
                  <div className="w-14 h-14 gold-gradient rounded-2xl flex items-center justify-center text-black shadow-xl shadow-yellow-500/20 border-2 border-white/10">
                    <Crown size={28} />
                  </div>
                </div>
                <div className="space-y-6">
                  {[
                    { icon: <Zap size={18} />, text: t.benefitVip1, sub: "Instant AI Verification", color: "text-yellow-500" },
                    { icon: <MonitorPlay size={18} />, text: t.benefitVip2, sub: "Low Latency Terminal", color: "text-yellow-500" },
                    { icon: <Gauge size={18} />, text: t.benefitVip3, sub: "Unlimited Pro Suite", color: "text-yellow-500" },
                    { icon: <ShieldCheck size={18} />, text: t.benefitVip4, sub: "Verified Performance", color: "text-yellow-500" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start group">
                      <div className={`mt-1 ${item.color} group-hover:scale-110 transition-transform`}>{item.icon}</div>
                      <div className="ml-4">
                        <p className="text-sm font-black text-white leading-none">{item.text}</p>
                        <p className="text-[10px] text-yellow-500/60 mt-1 uppercase font-black tracking-widest">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-10 gold-gradient py-4 rounded-2xl text-black font-black uppercase tracking-[0.25em] text-xs shadow-2xl shadow-yellow-500/30 hover:brightness-110 hover:scale-[1.02] transition-all flex items-center justify-center">
                  <Zap size={16} className="mr-2" /> {common.unlockNow}
                </button>
              </div>
            </div>
            
            <div className="bg-neutral-900/80 p-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="flex items-center text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                  <ShieldAlert size={14} className="mr-2 text-yellow-500" />
                  {t.legalNote}
               </div>
               <div className="flex space-x-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/XM_Logo.svg" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" alt="XM" />
                  <div className="h-4 w-px bg-white/10"></div>
                  <span className="text-[10px] font-black text-neutral-600">GM-SECURE PROTOCOL v4.2</span>
               </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl -mr-16 -mt-16"></div>
            <h3 className="text-xl font-black mb-8 flex items-center uppercase italic tracking-tighter">
              <Target size={22} className="text-yellow-500 mr-3" />
              {t.levels}
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-red-500 uppercase mb-2 tracking-[0.3em] flex items-center">
                  <div className="w-2 h-0.5 bg-red-500 mr-2"></div> {t.resistance}
                </p>
                {levels.resistance.map((val, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${val <= price ? 'bg-red-500/20 border-red-500 shadow-lg shadow-red-500/10' : 'bg-neutral-800/40 border-neutral-700/50 hover:border-neutral-600'}`}>
                    <span className="text-xs font-black text-neutral-500 tracking-widest">R{3-i}</span>
                    <span className="font-mono font-black text-lg">${val.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="py-2">
                <div className="bg-yellow-500/10 border-2 border-yellow-500/40 rounded-2xl p-5 flex items-center justify-between shadow-xl shadow-yellow-500/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-yellow-500/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-yellow-500 text-black flex items-center justify-center mr-4">
                      <Star size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">{t.pivot}</p>
                      <p className="text-2xl font-mono font-black italic text-white">${levels.pivot.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${price > levels.pivot ? 'border-green-500/50 text-green-500 bg-green-500/5' : 'border-red-500/50 text-red-500 bg-red-500/5'}`}>
                      {price > levels.pivot ? 'Trading Above' : 'Trading Below'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-green-500 uppercase mb-2 tracking-[0.3em] flex items-center">
                  <div className="w-2 h-0.5 bg-green-500 mr-2"></div> {t.support}
                </p>
                {levels.support.map((val, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${val >= price ? 'bg-green-500/20 border-green-500 shadow-lg shadow-green-500/10' : 'bg-neutral-800/40 border-neutral-700/50 hover:border-neutral-600'}`}>
                    <span className="text-xs font-black text-neutral-500 tracking-widest">S{i+1}</span>
                    <span className="font-mono font-black text-lg">${val.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-red-500/20 bg-gradient-to-b from-red-500/5 to-transparent">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black uppercase tracking-tighter flex items-center">
                <Calendar size={20} className="text-red-500 mr-3" />
                {t.calendar}
              </h3>
              <div className="px-2 py-1 bg-red-500/20 rounded-md">
                 <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="space-y-6">
              {calendarEvents.map((ev, i) => (
                <div key={i} className="flex items-start justify-between group cursor-default">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black font-mono text-neutral-500 tracking-widest uppercase">{ev.time}</span>
                    <span className="text-sm font-black group-hover:text-red-400 transition-colors mt-0.5">{ev.event}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black uppercase text-neutral-600 mb-1 tracking-widest">{ev.currency}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ${ev.impact === 'high' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-neutral-800 text-neutral-400'}`}>
                      {ev.impact === 'high' ? common.highImpact : common.lowImpact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <BrokerCard language={language} />
          
          <div className="glass-card p-6 rounded-3xl border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black uppercase tracking-tighter flex items-center">
                <Newspaper size={20} className="text-yellow-500 mr-3" />
                {t.news}
              </h3>
              <button className="text-[10px] text-yellow-500 font-black uppercase tracking-widest hover:underline">{t.viewAll}</button>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full group-hover:scale-150 transition-transform"></div>
                    <p className="text-[10px] text-yellow-500/70 font-black uppercase tracking-[0.2em]">Institutional Feed • 2h ago</p>
                  </div>
                  <h4 className="text-sm font-black group-hover:text-yellow-400 transition-colors line-clamp-2 leading-relaxed italic">
                    {language === 'en' 
                      ? "Middle East tensions escalate, driving Gold safe-haven demand above $2,050." 
                      : "ความตึงเครียดในตะวันออกกลางปะทุ ผลักดันแรงซื้อทองคำในฐานะสินทรัพย์ปลอดภัยทะลุ $2,050"}
                  </h4>
                  {i < 3 && <hr className="mt-6 border-white/5" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
