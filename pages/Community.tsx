
import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Crown, CheckCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface CommunityProps {
  language: Language;
}

const Community: React.FC<CommunityProps> = ({ language }) => {
  const t = translations[language].community;
  
  const posts = [
    {
      id: 1,
      author: "Alex Trades",
      isVip: true,
      avatar: "https://picsum.photos/seed/alex/100/100",
      content: language === 'en' 
        ? "Just caught the 2035 breakout! Who else is riding this move? #XAUUSD #GoldMaster"
        : "เข้าทันจังหวะเบรค 2035 พอดี! มีใครถือรันตามมาบ้าง? #XAUUSD #GoldMaster",
      time: language === 'en' ? "10m ago" : "10 นาทีที่แล้ว",
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      author: "Sarah Gold",
      isVip: false,
      avatar: "https://picsum.photos/seed/sarah/100/100",
      content: language === 'en'
        ? "Waiting for the FOMC minutes before taking any new positions. Cash is a position too! 🛡️"
        : "รอข่าว FOMC คืนนี้ก่อนดีกว่า ช่วงนี้ถือเงินสดก็คือสถานะอย่างหนึ่ง! 🛡️",
      time: language === 'en' ? "2h ago" : "2 ชม. ที่แล้ว",
      likes: 56,
      comments: 12
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold uppercase italic tracking-tighter">{t.title}</h1>
        <p className="text-neutral-400">{t.subtitle}</p>
      </header>

      <div className="glass-card p-4 rounded-2xl border border-white/5">
        <div className="flex space-x-4">
          <div className="relative">
             <img src="https://picsum.photos/seed/user/100/100" className="w-10 h-10 rounded-full bg-neutral-800" alt="me" />
          </div>
          <textarea 
            placeholder={t.placeholder} 
            className="flex-1 bg-transparent border-none focus:outline-none pt-2 resize-none text-sm"
            rows={2}
          />
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-end">
          <button className="gold-gradient px-8 py-2 rounded-xl text-black font-black text-xs uppercase tracking-widest shadow-lg shadow-yellow-500/10">{t.post}</button>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className={`glass-card p-6 rounded-2xl border ${post.isVip ? 'border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-transparent' : 'border-white/5'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`relative p-0.5 rounded-full ${post.isVip ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-neutral-800'}`}>
                   <img src={post.avatar} className="w-10 h-10 rounded-full border-2 border-black" alt={post.author} />
                   {post.isVip && (
                     <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black p-0.5 rounded-full border border-black">
                       <Crown size={10} />
                     </div>
                   )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className={`font-bold text-sm ${post.isVip ? 'text-yellow-500' : 'text-neutral-200'}`}>{post.author}</h4>
                    {post.isVip && <span className="bg-yellow-500/10 text-yellow-500 text-[8px] px-1.5 py-0.5 rounded font-black uppercase border border-yellow-500/20">VIP</span>}
                  </div>
                  <p className="text-[10px] text-neutral-500 font-medium">{post.time}</p>
                </div>
              </div>
              <button className="text-neutral-500 hover:text-white"><MoreHorizontal size={20} /></button>
            </div>
            
            <p className="text-neutral-300 mb-4 text-sm leading-relaxed">{post.content}</p>
            
            <div className="flex items-center space-x-6 pt-4 border-t border-neutral-800/50">
              <button className="flex items-center space-x-2 text-neutral-500 hover:text-red-500 transition-colors">
                <Heart size={16} />
                <span className="text-xs font-bold">{post.likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-neutral-500 hover:text-yellow-500 transition-colors">
                <MessageCircle size={16} />
                <span className="text-xs font-bold">{post.comments}</span>
              </button>
              <button className="flex items-center space-x-2 text-neutral-500 hover:text-blue-500 transition-colors">
                <Share2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
