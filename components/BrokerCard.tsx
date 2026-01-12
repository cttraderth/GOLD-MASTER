
import React from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface BrokerCardProps {
  language: Language;
}

const BrokerCard: React.FC<BrokerCardProps> = ({ language }) => {
  const t = translations[language].broker;
  
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl p-6 border border-red-500/20 shadow-xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-red-600/20 transition-all"></div>
      
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-red-600 text-white font-black px-2 py-1 rounded text-lg italic tracking-tighter">XM</div>
        <h3 className="text-xl font-bold">{t.partner}</h3>
      </div>
      
      <p className="text-sm text-neutral-400 mb-6">{t.desc}</p>
      
      <ul className="space-y-2 mb-8">
        {[t.benefit1, t.benefit2, t.benefit3].map((benefit, i) => (
          <li key={i} className="flex items-center text-xs text-neutral-300">
            <CheckCircle size={14} className="text-red-500 mr-2" />
            {benefit}
          </li>
        ))}
      </ul>
      
      <a 
        href="https://www.xm.com/register" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center"
      >
        {t.cta} <ExternalLink size={14} className="ml-2" />
      </a>
    </div>
  );
};

export default BrokerCard;
