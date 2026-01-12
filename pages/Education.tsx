
import React, { useState } from 'react';
import { MOCK_COURSES } from '../constants';
import { Search, PlayCircle, Clock, BookOpen, Send } from 'lucide-react';
import { getAITutorResponse } from '../services/geminiService';
import { Language } from '../types';
import { translations } from '../translations';

interface EducationProps {
  language: Language;
}

const Education: React.FC<EducationProps> = ({ language }) => {
  const t = translations[language].education;
  const common = translations[language].common;
  
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;
    setLoading(true);
    const res = await getAITutorResponse(question, language);
    setAnswer(res || (language === 'th' ? "ไม่พบคำตอบ" : "I couldn't find an answer."));
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-neutral-400">{t.subtitle}</p>
      </header>

      {/* AI Tutor Section */}
      <section className="glass-card rounded-2xl p-6 border border-yellow-500/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BookOpen size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-xl font-bold mb-2 flex items-center">
            <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-black mr-2">AI</span>
            {t.tutorTitle}
          </h2>
          <p className="text-neutral-400 text-sm mb-4">{t.tutorDesc}</p>
          
          <form onSubmit={handleAsk} className="flex space-x-2">
            <input 
              type="text" 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t.placeholder} 
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded-xl transition-colors disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>

          {answer && (
            <div className="mt-4 p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/10 animate-in fade-in slide-in-from-top-2">
              <p className="text-sm leading-relaxed text-neutral-200 whitespace-pre-wrap">{answer}</p>
            </div>
          )}
        </div>
      </section>

      {/* Courses Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t.availableCourses}</h2>
          <div className="flex space-x-4 text-sm">
            <button className="text-yellow-500 font-bold border-b-2 border-yellow-500 pb-1">{t.all}</button>
            <button className="text-neutral-400 hover:text-neutral-200 pb-1">{t.basics}</button>
            <button className="text-neutral-400 hover:text-neutral-200 pb-1">{t.advanced}</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_COURSES.map(course => (
            <div key={course.id} className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer group">
              <div className="relative h-48">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <PlayCircle size={48} className="text-white" />
                </div>
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase">
                  {course.level}
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-yellow-500 font-bold mb-1 uppercase">{course.category}</p>
                <h3 className="text-lg font-bold mb-3 line-clamp-1">{course.title}</h3>
                <div className="flex items-center text-xs text-neutral-500">
                  <Clock size={12} className="mr-1" /> {course.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Education;
