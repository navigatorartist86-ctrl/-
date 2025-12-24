
import React from 'react';
import { Tool, Language } from '../types';

interface ServiceCardProps {
  tool: Tool;
  lang: Language;
  onClick: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ tool, lang, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-[2rem] p-7 border border-slate-200 dark:border-slate-700/50 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-300 cursor-pointer flex flex-col h-full hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-2 overflow-hidden"
    >
      {/* Decorative background glow on hover */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        {/* Premium Icon Container */}
        <div className="relative">
            <div className="absolute inset-0 bg-indigo-600 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
            <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-white group-hover:scale-110 group-hover:rotate-3 shadow-sm border border-slate-100 dark:border-slate-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tool.icon} />
              </svg>
            </div>
        </div>

        <div className="flex gap-2">
            {tool.category === 'security' && (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                    Safe
                </span>
            )}
            {tool.isNew && (
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                    New
                </span>
            )}
        </div>
      </div>
      
      <div className="relative z-10">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
            {tool.name[lang]}
          </h3>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium line-clamp-2">
            {tool.description[lang]}
          </p>
      </div>

      {/* Hover Arrow */}
      <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Launch Tool</span>
          <svg className="w-4 h-4 text-indigo-600 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
      </div>
    </div>
  );
};
