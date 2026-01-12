
import React, { useState } from 'react';
import { Calculator, Shield, Zap, Info, FileText } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface ToolsProps {
  language: Language;
}

const Tools: React.FC<ToolsProps> = ({ language }) => {
  const t = translations[language].tools;
  
  const [accountSize, setAccountSize] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [stopLossPips, setStopLossPips] = useState(50);
  
  const lotSize = (accountSize * (riskPercent / 100)) / (stopLossPips * 1);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <header>
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-neutral-400">{t.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="glass-card rounded-2xl p-6 h-fit">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-yellow-500 text-black rounded-lg">
              <Calculator size={24} />
            </div>
            <h2 className="text-xl font-bold">{t.calcTitle}</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-neutral-400 mb-2">{t.balance}</label>
              <input 
                type="number" 
                value={accountSize} 
                onChange={(e) => setAccountSize(Number(e.target.value))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">{t.risk}</label>
                <input 
                  type="number" 
                  value={riskPercent} 
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">{t.slPips}</label>
                <input 
                  type="number" 
                  value={stopLossPips} 
                  onChange={(e) => setStopLossPips(Number(e.target.value))}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>

            <div className="bg-yellow-500/10 rounded-2xl p-8 text-center border border-yellow-500/20">
              <p className="text-sm text-neutral-400 uppercase font-bold tracking-widest mb-2">{t.recommended}</p>
              <h3 className="text-5xl font-black text-yellow-500">{(lotSize / 10).toFixed(2)}</h3>
              <p className="text-xs text-neutral-500 mt-4 italic">{t.estimatedRisk}: ${(accountSize * (riskPercent / 100)).toFixed(2)}</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          {/* Contract Specs - The Missing Info */}
          <div className="glass-card p-6 rounded-2xl border border-blue-500/10">
            <h3 className="text-lg font-bold mb-5 flex items-center">
              <FileText size={20} className="text-blue-500 mr-2" /> 
              {t.contractSpecs}
            </h3>
            <div className="space-y-4">
               {[
                 { label: t.contractSize, value: '100 Ounces' },
                 { label: t.minLot, value: '0.01 Lot' },
                 { label: t.maxLeverage, value: '1:1000' },
                 { label: t.marginReq, value: '0.10%' },
                 { label: 'Market Swaps', value: 'Long: -42.1 / Short: 28.5' }
               ].map((spec, i) => (
                 <div key={i} className="flex justify-between items-center py-2 border-b border-neutral-800/50 last:border-0">
                    <span className="text-xs text-neutral-500 font-bold uppercase">{spec.label}</span>
                    <span className="text-sm font-bold text-neutral-200">{spec.value}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Shield size={20} className="text-yellow-500 mr-2" /> 
              {t.rulesTitle}
            </h3>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                {t.rule1}
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                {t.rule2}
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                {t.rule3}
              </li>
            </ul>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full">
                <Zap size={24} />
              </div>
              <div>
                <h4 className="font-bold">{t.economicCal}</h4>
                <p className="text-xs text-neutral-500">{t.economicCalDesc}</p>
              </div>
            </div>
            <Info size={16} className="text-neutral-700 group-hover:text-neutral-300 transition-colors" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Tools;
