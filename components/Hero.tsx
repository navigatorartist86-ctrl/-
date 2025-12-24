
import React from 'react';
import { Language, ViewState } from '../types';

interface HeroProps {
  lang: Language;
  onNavigate: (view: ViewState) => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onNavigate }) => {
  const t = {
    en: {
      title: "Tools That Just Work.",
      subtitle: "Experience Minimo — the ultimate suite of 30+ lightweight, local-first tools for your daily digital workflow.",
      cta: "Explore Tools",
      secondary: "View Plans"
    },
    ar: {
      title: "أدوات تعمل ببساطة.",
      subtitle: "اختبر Minimo — المجموعة الأفضل من الأدوات الخفيفة والمحلية لمهامك الرقمية اليومية.",
      cta: "استكشف الأدوات",
      secondary: "عرض الخطط"
    },
    fr: {
      title: "Des outils qui fonctionnent.",
      subtitle: "Découvrez Minimo — la suite ultime de plus de 30 outils légers pour votre flux de travail numérique.",
      cta: "Explorer",
      secondary: "Voir les Tarifs"
    }
  };

  const content = t[lang];

  return (
    <div className="relative pt-16 pb-20 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -z-10 animate-bounce" style={{ animationDuration: '8s' }}></div>

      <div className="container mx-auto px-4 text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 border border-white/20 backdrop-blur-md shadow-sm mb-2">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Everything Local. No Cloud Lag.</span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-slate-900 dark:text-white transition-all leading-tight">
            {content.title.split(' ').map((word, i) => (
                <span key={i} className={i === 1 ? 'text-indigo-600' : ''}>
                    {word}{' '}
                </span>
            ))}
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
          {content.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
             onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
             className="group relative w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-[1.2rem] font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2 justify-center">
                {content.cta}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </span>
          </button>
          
          <button 
             onClick={() => onNavigate('pricing')}
             className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white rounded-[1.2rem] font-black text-lg hover:border-indigo-500 transition-all active:scale-95"
          >
            {content.secondary}
          </button>
        </div>

        {/* Floating Tool Badges */}
        <div className="flex flex-wrap justify-center gap-3 pt-8 opacity-40">
            {['PDF', 'Image', 'Security', 'Dev', 'Text'].map((badge) => (
                <span key={badge} className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs">
                    {badge}
                </span>
            ))}
        </div>
      </div>
    </div>
  );
};
