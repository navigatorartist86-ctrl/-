
import React, { useState, useEffect, useMemo } from 'react';
import { languages, tools } from './constants';
import { Tool, Language, ViewState, User, ServiceCategory } from './types';
import { ServiceCard } from './components/ServiceCard';
import { ServiceRunner } from './components/ServiceRunner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ToolModal } from './components/ToolModal';
import { UserProfilePanel } from './components/UserProfilePanel';
import firebase, { auth } from './services/firebase';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<ViewState>('home');
  const [isDark, setIsDark] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset' | 'magic_link'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  
  // Unauthorized Domain Handling
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  
  // Profile Panel State
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  // --- Effects ---

  useEffect(() => {
    if (auth.isSignInWithEmailLink(window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      if (email) {
        setAuthLoading(true);
        auth.signInWithEmailLink(email, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            window.history.replaceState({}, document.title, window.location.pathname);
            setAuthSuccess("Successfully signed in via Magic Link!");
          })
          .catch((error) => {
            if (error.code === 'auth/unauthorized-domain') {
                 setUnauthorizedDomain(window.location.hostname);
            } else {
                 setAuthError("Invalid or expired login link.");
                 setView('auth');
            }
          })
          .finally(() => {
             setAuthLoading(false);
          });
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        if (!firebaseUser.emailVerified) {
            setUser(null);
            return;
        }

        const storageKey = `minimo_data_${firebaseUser.uid}`;
        const storedData = localStorage.getItem(storageKey);
        
        let additionalData = { tokens: 20000, plan: 'free' as 'free'|'pro' };
        
        if (storedData) {
           additionalData = JSON.parse(storedData);
        } else {
           localStorage.setItem(storageKey, JSON.stringify(additionalData));
        }

        setUser({
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          plan: additionalData.plan,
          tokens: additionalData.tokens,
          avatar: firebaseUser.photoURL || undefined
        });
        
        if (view === 'auth') setView('home');
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [view]);

  useEffect(() => {
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [currentLang, isDark]);

  useEffect(() => {
    if (user && auth.currentUser) {
       const storageKey = `minimo_data_${auth.currentUser.uid}`;
       localStorage.setItem(storageKey, JSON.stringify({ tokens: user.tokens, plan: user.plan }));
    }
  }, [user]);

  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return tools.filter((tool) => {
      const name = tool.name[currentLang].toLowerCase();
      const desc = tool.description[currentLang].toLowerCase();
      return name.includes(query) || desc.includes(query);
    });
  }, [searchQuery, currentLang]);

  const handleContactSubmit = () => {
      const { name, email, message } = contactForm;
      window.location.href = `mailto:milleurartist@gmail.com?subject=${encodeURIComponent(`Contact: ${name}`)}&body=${encodeURIComponent(message)}`;
  };

  const handleAuth = async () => {
      setAuthError(null); setAuthSuccess(null); setShowResend(false);
      setAuthLoading(true);
      try {
        if (authMode === 'signup') {
            const userCredential = await auth.createUserWithEmailAndPassword(authForm.email, authForm.password);
            if (userCredential.user) {
                await userCredential.user.updateProfile({ displayName: authForm.name });
                await userCredential.user.sendEmailVerification();
            }
            await auth.signOut();
            setAuthSuccess("Verification email sent! Check your inbox.");
            setAuthMode('login');
        } else if (authMode === 'login') {
            const userCredential = await auth.signInWithEmailAndPassword(authForm.email, authForm.password);
            if (userCredential.user && !userCredential.user.emailVerified) {
                await auth.signOut();
                setShowResend(true);
                throw new Error("Email not verified.");
            }
        }
      } catch (err: any) {
          setAuthError(err.message);
      } finally { setAuthLoading(false); }
  };

  const deductTokens = (amount: number): boolean => {
      if (!user) return false;
      if (user.tokens < amount) return false;
      setUser(prev => prev ? ({ ...prev, tokens: prev.tokens - amount }) : null);
      return true;
  };

  const renderContent = () => {
    switch (view) {
        case 'office':
            return (
                <div className="container mx-auto px-4 py-12 min-h-screen">
                    <div className="flex items-center gap-4 mb-12">
                        <button onClick={() => setView('home')} className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:text-indigo-600 transition-all">
                            <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </button>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                            {currentLang === 'ar' ? 'أدوات المكتب الاحترافية' : (currentLang === 'fr' ? 'Outils de Bureau Pro' : 'Professional Office Tools')}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {tools.filter(t => t.category === 'office').map(tool => (
                            <ServiceCard key={tool.id} tool={tool} lang={currentLang} onClick={() => setSelectedTool(tool)} />
                        ))}
                    </div>
                </div>
            );
        case 'pricing':
            return (
                <div className="py-24 max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black mb-4 dark:text-white">The Right Plan for You</h2>
                        <p className="text-slate-500 text-lg">Choose the perfect tier for your needs.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: 'Free', price: '$0', feat: ['20,000 Free Tokens', 'Access to basic tools', 'Community Support'] },
                            { name: 'Pro', price: '$9', feat: ['Unlimited Access', 'Desktop Office Tools', 'No Advertisements', 'Priority Support'], highlight: true },
                            { name: 'Team', price: '$29', feat: ['10 User seats', 'Custom Branding', 'Advanced Analytics'] }
                        ].map((plan, i) => (
                            <div key={i} className={`relative p-8 rounded-[2rem] border transition-all duration-300 ${plan.highlight ? 'border-indigo-500 bg-white dark:bg-slate-800 shadow-[0_20px_50px_rgba(79,70,229,0.15)] scale-105 z-10' : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50'}`}>
                                {plan.highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Most Popular</div>}
                                <h3 className="text-2xl font-bold mb-2 dark:text-white">{plan.name}</h3>
                                <div className="text-5xl font-black mb-8 dark:text-white">{plan.price}<span className="text-lg font-normal text-slate-400">/mo</span></div>
                                <ul className="space-y-4 mb-10">
                                    {plan.feat.map((f, j) => (
                                        <li key={j} className="flex items-center text-slate-600 dark:text-slate-300">
                                            <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0">
                                                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-4 rounded-2xl font-black transition-all ${plan.highlight ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200'}`}>
                                    Get Started
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'home':
        default:
             return (
                <>
                    <Hero lang={currentLang} onNavigate={setView} />
                    
                    <div className="container mx-auto px-4 -mt-12 mb-20 relative z-20">
                        <div onClick={() => setView('office')} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/20 dark:border-slate-700/30 flex flex-col md:flex-row items-center justify-between cursor-pointer hover:scale-[1.02] transition-all group overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] -z-10 group-hover:bg-indigo-500/10 transition-colors"></div>
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                                     <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <div className="text-center md:text-left rtl:md:text-right">
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                                        {currentLang === 'ar' ? 'أدوات المكتب' : (currentLang === 'fr' ? 'Outils de Bureau' : 'Office Tools')}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                                        {currentLang === 'ar' ? 'أدوات احترافية لسطح المكتب تمنحك كفاءة قصوى.' : (currentLang === 'fr' ? 'Applications pro pour une efficacité maximale.' : 'Pro desktop apps for maximum efficiency.')}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 md:mt-0 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                                {currentLang === 'ar' ? 'اكتشف المزيد' : 'Explore'}
                                <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className="mb-20 px-4">
                        <div className="relative max-w-2xl mx-auto group">
                            <input
                                type="text"
                                placeholder={currentLang === 'ar' ? 'ما الذي تبحث عنه اليوم؟' : 'What are you looking for today?'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-6 pl-16 rtl:pr-16 rtl:pl-6 rounded-[2rem] shadow-2xl border-none outline-none text-xl bg-white dark:bg-slate-800 dark:text-white ring-2 ring-transparent focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                            />
                            <svg className="absolute left-6 rtl:right-6 rtl:left-auto top-1/2 -translate-y-1/2 text-indigo-500 w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    <div className="space-y-24 px-4 mb-32 container mx-auto">
                        {['image', 'pdf', 'utility', 'security', 'text', 'dev'].map(catId => {
                            const catTools = filteredTools.filter(t => t.category === catId);
                            if (catTools.length === 0) return null;
                            return (
                                <div key={catId}>
                                    <div className="flex items-center gap-6 mb-10">
                                        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-200 capitalize">{catId} Tools</h2>
                                        <div className="h-1 flex-grow bg-gradient-to-r from-slate-200 dark:from-slate-800 to-transparent rounded-full"></div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        {catTools.map(tool => (
                                            <ServiceCard key={tool.id} tool={tool} lang={currentLang} onClick={() => setSelectedTool(tool)} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            );
       }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-500 ${currentLang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <Navbar 
        currentLang={currentLang} onLangChange={setCurrentLang} languages={languages}
        isDark={isDark} toggleTheme={() => setIsDark(!isDark)}
        onNavigate={(v) => { setView(v); setSelectedTool(null); }}
        user={user} onOpenProfile={() => setIsProfileOpen(true)}
      />
      <main className="flex-grow">{renderContent()}</main>
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-16 mt-auto">
          <div className="container mx-auto px-4 text-center">
              <div className="flex justify-center space-x-8 rtl:space-x-reverse mb-10 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">
                  <button onClick={() => setView('privacy')} className="hover:text-indigo-600 transition-colors">Privacy</button>
                  <button onClick={() => setView('contact')} className="hover:text-indigo-600 transition-colors">Contact</button>
                  <button onClick={() => setView('pricing')} className="hover:text-indigo-600 transition-colors">Pricing</button>
              </div>
              <p className="text-slate-400 text-sm">© 2024 Minimo. Built for creators.</p>
          </div>
      </footer>
      {selectedTool && (
        <ToolModal isOpen={!!selectedTool} onClose={() => setSelectedTool(null)} title={selectedTool.name[currentLang]}>
          <ServiceRunner tool={selectedTool} lang={currentLang} user={user} deductTokens={deductTokens} onRequireAuth={() => { setSelectedTool(null); setView('auth'); }} />
        </ToolModal>
      )}
      {user && <UserProfilePanel isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} onUpdateUser={(u) => setUser({...user, ...u})} onLogout={() => { auth.signOut(); setView('auth'); setIsProfileOpen(false); }} onNavigate={setView} />}
    </div>
  );
}
