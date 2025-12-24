
import React from 'react';
import { Language, ViewState, User } from '../types';

interface NavbarProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  languages: { code: Language; name: string; flag: string }[];
  isDark: boolean;
  toggleTheme: () => void;
  onNavigate: (view: ViewState) => void;
  user: User | null;
  onLogout?: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentLang, 
  onLangChange, 
  languages, 
  isDark, 
  toggleTheme,
  onNavigate,
  user,
  onOpenProfile
}) => {
  const t = {
    login: { en: 'Login', ar: 'دخول', fr: 'Connexion' },
    pricing: { en: 'Pricing', ar: 'الأسعار', fr: 'Tarifs' },
    privacy: { en: 'Privacy', ar: 'الخصوصية', fr: 'Confidentialité' },
    contact: { en: 'Contact', ar: 'اتصل بنا', fr: 'Contact' }
  };

  const handleLogoClick = () => {
    onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo - Navigation Link to Home */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group select-none active:scale-95 transition-transform"
        >
          <div className="relative w-8 h-8 flex items-center justify-center bg-slate-900 dark:bg-white rounded-xl shadow-lg group-hover:rotate-6 transition-all">
            <svg className="w-5 h-5 text-white dark:text-slate-900" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            minimo
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse mx-4">
             <button onClick={() => onNavigate('privacy')} className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                 {t.privacy[currentLang]}
             </button>
             <button onClick={() => onNavigate('contact')} className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                 {t.contact[currentLang]}
             </button>
             <button onClick={() => onNavigate('pricing')} className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                 {t.pricing[currentLang]}
             </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? (
               <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
               <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>

          {/* Language Dropdown */}
          <div className="relative group z-50">
            <button className="flex items-center space-x-1 rtl:space-x-reverse px-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
              <span className="text-lg">{languages.find(l => l.code === currentLang)?.flag}</span>
            </button>
            <div className="absolute right-0 rtl:left-0 rtl:right-auto top-full mt-1 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 hidden group-hover:block overflow-hidden">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLangChange(lang.code)}
                  className={`w-full text-left rtl:text-right px-4 py-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center space-x-2 rtl:space-x-reverse ${currentLang === lang.code ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

          {/* Auth Buttons / User Profile */}
          {user ? (
            <div 
              className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer active:scale-95 transition-transform" 
              onClick={onOpenProfile}
            >
               {/* Token Balance */}
               <div className="hidden sm:flex items-center bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-800/30 group hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors">
                  <div className="w-4 h-4 relative mr-2 rtl:ml-2 rtl:mr-0">
                      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-amber-500">
                          <circle cx="12" cy="12" r="10" fill="currentColor" />
                          <path d="M12 7v10M9 10h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                  </div>
                  <span className="text-xs font-black text-amber-700 dark:text-amber-400">
                      {user.tokens.toLocaleString()}
                  </span>
               </div>

              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-black text-sm border border-indigo-200 dark:border-indigo-700 overflow-hidden ring-2 ring-transparent hover:ring-indigo-400 transition-all">
                 {user.avatar ? (
                     <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                 ) : (
                     user.name[0].toUpperCase()
                 )}
              </div>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('auth')}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all whitespace-nowrap shadow-md shadow-slate-900/10"
            >
              {t.login[currentLang]}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
