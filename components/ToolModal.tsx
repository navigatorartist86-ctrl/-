
import React, { ReactNode } from 'react';

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const ToolModal: React.FC<ToolModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto scrollbar-modal" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-2 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-slate-900/75 transition-opacity backdrop-blur-sm" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal Container - Full Width Wrapper */}
        <div className="inline-block align-middle text-left transform transition-all sm:my-4 sm:w-full sm:max-w-[98vw]">
            
            {/* Layout: Left Ad | Tool | Right Ad - Edge to Edge */}
            <div className="flex flex-row min-h-[80vh] max-h-[92vh] items-stretch gap-4 justify-between">
                
                {/* Left Ad Sidebar - Pushed to far Left */}
                <div className="hidden xl:flex w-80 flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex-shrink-0 shadow-2xl">
                    <div className="w-full h-full border-4 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex items-center justify-center text-slate-400 bg-slate-100/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                         <div className="text-center space-y-2">
                            <span className="block font-black text-2xl opacity-30 group-hover:opacity-50 tracking-widest">AD</span>
                            <span className="text-xs font-bold tracking-widest opacity-50 uppercase">Space Available</span>
                         </div>
                    </div>
                </div>

                {/* Main Content Column - Expanded Center */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 relative z-10 w-full">
                     {/* Content Scroll Container */}
                     <div className="flex-1 overflow-y-auto scrollbar-modal">
                        <div className="px-6 pt-6 pb-6 sm:p-10 flex flex-col min-h-full">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-6 flex-shrink-0">
                                <h3 className="text-3xl sm:text-4xl font-bold leading-tight text-slate-900 dark:text-white" id="modal-title">
                                    {title}
                                </h3>
                                <button 
                                    onClick={onClose}
                                    className="text-slate-400 hover:text-slate-500 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 outline-none transform hover:rotate-90 duration-200"
                                >
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            {/* Tool Content */}
                            <div className="mt-2 flex-grow">
                                {children}
                            </div>
                        </div>
                     </div>
                </div>

                {/* Right Ad Sidebar - Pushed to far Right */}
                <div className="hidden xl:flex w-80 flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex-shrink-0 shadow-2xl">
                    <div className="w-full h-full border-4 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex items-center justify-center text-slate-400 bg-slate-100/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                        <div className="text-center space-y-2">
                            <span className="block font-black text-2xl opacity-30 group-hover:opacity-50 tracking-widest">AD</span>
                            <span className="text-xs font-bold tracking-widest opacity-50 uppercase">Space Available</span>
                         </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};
