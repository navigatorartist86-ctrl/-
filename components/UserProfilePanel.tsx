
import React, { useState, useRef } from 'react';
import { User, ViewState } from '../types';

interface UserProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  onLogout: () => void;
  onNavigate: (view: ViewState) => void;
}

export const UserProfilePanel: React.FC<UserProfilePanelProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
  onNavigate
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameSave = () => {
    if (tempName.trim()) {
      onUpdateUser({ name: tempName.trim() });
    } else {
        setTempName(user.name);
    }
    setIsEditingName(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-slate-900 shadow-2xl z-[51] transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header / Close */}
        <div className="flex justify-end p-4">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 flex flex-col items-center mb-8 relative flex-shrink-0">
            {/* Avatar */}
            <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-3xl border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        user.name[0].toUpperCase()
                    )}
                </div>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>

            {/* Name & Email */}
            <div className="mt-4 text-center w-full">
                {isEditingName ? (
                    <div className="flex items-center gap-2 justify-center">
                        <input 
                            type="text" 
                            value={tempName} 
                            onChange={(e) => setTempName(e.target.value)}
                            className="w-full p-1 text-center border-b border-indigo-500 bg-transparent focus:outline-none dark:text-white"
                            autoFocus
                            onBlur={handleNameSave}
                            onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                        <svg className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </div>
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{user.email}</p>
            </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto scrollbar-panel px-6">
            
            {/* Token Card */}
            <div className="mb-8">
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/50">
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider mb-1">Available Tokens</p>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 relative flex-shrink-0">
                             <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-amber-500 drop-shadow-sm">
                                <circle cx="12" cy="12" r="10" fill="currentColor" />
                                <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
                                <path d="M12 7v10M9 10h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="text-3xl font-black text-amber-900 dark:text-amber-400">{user.tokens.toLocaleString()}</span>
                    </div>
                    <button 
                        onClick={() => handleNav('pricing')}
                        className="mt-3 w-full py-2 bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-lg shadow-sm hover:bg-amber-50 transition-colors"
                    >
                        Get More Tokens
                    </button>
                </div>
            </div>

            {/* Menu Links */}
            <div className="space-y-2 pb-6">
                <button onClick={() => handleNav('home')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <span className="font-medium">Home</span>
                </button>
                <button onClick={() => handleNav('pricing')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="font-medium">Plans & Pricing</span>
                </button>
                <button onClick={() => handleNav('privacy')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    <span className="font-medium">Privacy Policy</span>
                </button>
                <button onClick={() => handleNav('contact')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span className="font-medium">Contact Us</span>
                </button>
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
            <button 
                onClick={onLogout}
                className="w-full py-3 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-bold"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Log Out
            </button>
        </div>
      </div>
    </>
  );
};
