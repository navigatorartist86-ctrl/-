
import React, { useState, useEffect, useRef } from 'react';
import { Tool, Language, User } from '../types';
// @ts-ignore
import { jsPDF } from 'jspdf';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import JSZip from 'jszip';
// @ts-ignore
import { PDFDocument, rgb, degrees } from 'pdf-lib';

interface ServiceRunnerProps {
  tool: Tool;
  lang: Language;
  user: User | null;
  deductTokens: (amount: number) => boolean;
  onRequireAuth: () => void;
}

export const ServiceRunner: React.FC<ServiceRunnerProps> = ({ tool, lang, user, deductTokens, onRequireAuth }) => {
  const [textInput, setTextInput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [filesCollection, setFilesCollection] = useState<File[]>([]);
  const [codeValues, setCodeValues] = useState({ html: '<h1>Hello</h1>', css: 'body { color: #4F46E5; font-family: sans-serif; }', js: '' });
  const [activeCodeTab, setActiveCodeTab] = useState<'html'|'css'|'js'>('html');
  const [result, setResult] = useState<string | null>(null);
  const [outputFiles, setOutputFiles] = useState<{url: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenCost] = useState(Math.floor(Math.random() * 31) + 20);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [rotatedImage, setRotatedImage] = useState<string | null>(null);
  const [cropImage, setCropImage] = useState<HTMLImageElement | null>(null);
  const [cropRect, setCropRect] = useState<{x: number, y: number, w: number, h: number} | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playgroundRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setTextInput(''); setFileInput(null); setFilesCollection([]); setResult(null); setOutputFiles([]); setError(null);
  }, [tool.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFileInput(newFiles[0]);
      if (['zip-files', 'image-to-pdf'].includes(tool.id)) setFilesCollection(prev => [...prev, ...newFiles]);
      
      if (['crop-image', 'rotate-image'].includes(tool.id)) {
        const img = new Image();
        img.src = URL.createObjectURL(newFiles[0]);
        img.onload = () => {
            if (tool.id === 'crop-image') {
                setCropImage(img);
                setCropRect({ x: img.width*0.25, y: img.height*0.25, w: img.width*0.5, h: img.height*0.5 });
            } else setRotatedImage(img.src);
        };
      }
    }
  };

  const execute = async () => {
    if (!user) { onRequireAuth(); return; }
    if (!deductTokens(tokenCost)) { setError("Insufficient tokens!"); return; }
    setIsLoading(true); setError(null);

    try {
        switch (tool.id) {
            case 'qr-gen': setResult(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(textInput)}`); break;
            case 'word-counter': setResult(`Words: ${textInput.split(/\s+/).filter(x=>x).length}\nChars: ${textInput.length}`); break;
            case 'password-gen': setResult(Array.from(crypto.getRandomValues(new Uint32Array(16))).map(n => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*".charAt(n % 70)).join('')); break;
            case 'text-to-pdf': 
                const doc = new jsPDF();
                doc.text(doc.splitTextToSize(textInput, 180), 10, 10);
                setOutputFiles([{ url: doc.output('bloburi').toString(), name: 'minimo-doc.pdf' }]);
                break;
            case 'image-converter':
                const img = new Image();
                img.src = URL.createObjectURL(fileInput!);
                img.onload = () => {
                    const c = document.createElement('canvas');
                    c.width = img.width; c.height = img.height;
                    c.getContext('2d')?.drawImage(img, 0, 0);
                    setOutputFiles([{ url: c.toDataURL(`image/${targetFormat}`), name: `converted.${targetFormat}` }]);
                };
                break;
            default: setTimeout(() => setIsLoading(false), 500); break;
        }
    } catch(e) { setError("Action failed. Try again."); }
    setIsLoading(false);
  };

  if (tool.id === 'code-playground') {
      return (
          <div className="flex flex-col h-[75vh] bg-white dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
              <div className="flex bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800 p-2 gap-2">
                  {['html', 'css', 'js'].map(t => (
                      <button key={t} onClick={() => setActiveCodeTab(t as any)} className={`px-6 py-2 rounded-xl font-black uppercase text-xs transition-all ${activeCodeTab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>{t}</button>
                  ))}
              </div>
              <div className="flex-1 flex flex-col md:flex-row divide-x divide-slate-100 dark:divide-slate-800">
                  <textarea value={codeValues[activeCodeTab]} onChange={(e) => setCodeValues({...codeValues, [activeCodeTab]: e.target.value})} className="w-full md:w-1/2 p-6 font-mono text-sm bg-transparent outline-none resize-none dark:text-slate-300" placeholder={`Write ${activeCodeTab.toUpperCase()}...`} />
                  <iframe srcDoc={`<html><head><style>${codeValues.css}</style></head><body>${codeValues.html}<script>${codeValues.js}</script></body></html>`} className="w-full md:w-1/2 bg-white" title="preview" />
              </div>
          </div>
      );
  }

  if (['file-encrypt', 'office-image-compress', 'office-yt-downloader'].includes(tool.id)) {
      const isPro = user?.plan === 'pro';
      const dlLink = tool.id === 'file-encrypt' ? "1p2qB4BaNGQEXW1CBmDgbL1NLEPcvN2EV" : tool.id === 'office-image-compress' ? "1sJvwaj_fl2bf-HUoNIOVpeHtxCYkb82e" : "1y-x68ju64mHoD-DP_aKGIvAHkN4Lm0rl";
      
      return (
          <div className="py-20 flex flex-col items-center max-w-2xl mx-auto text-center space-y-8">
              <div className="w-32 h-32 bg-indigo-600/10 rounded-[2.5rem] flex items-center justify-center text-indigo-600 animate-float">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tool.icon} /></svg>
              </div>
              <h3 className="text-4xl font-black dark:text-white">{tool.name[lang]}</h3>
              <p className="text-xl text-slate-500 leading-relaxed">{tool.description[lang]}</p>
              
              {isPro ? (
                  <a href={`https://drive.google.com/uc?export=download&id=${dlLink}`} className="px-12 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-indigo-500/30 hover:scale-105 transition-all">Download Now</a>
              ) : (
                  <div className="p-8 bg-slate-100 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                      <p className="text-red-500 font-bold mb-4">Pro Feature Only</p>
                      <button onClick={() => onRequireAuth()} className="px-8 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-black">Upgrade to Access</button>
                  </div>
              )}
          </div>
      );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12 h-full">
      {/* Configuration Column */}
      <div className="space-y-8">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Input Area</h4>
            
            {['qr-gen', 'text-to-pdf', 'word-counter'].includes(tool.id) && (
                <textarea value={textInput} onChange={e => setTextInput(e.target.value)} rows={6} className="w-full p-5 bg-white dark:bg-slate-950 rounded-2xl border-none outline-none ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-indigo-500 transition-all text-lg dark:text-white" placeholder="Paste your data here..." />
            )}

            {['image-converter', 'image-compressor', 'crop-image'].includes(tool.id) && (
                <div className="relative group overflow-hidden rounded-2xl">
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="p-12 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-all">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform"><svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg></div>
                        <p className="font-bold text-slate-500">{fileInput ? fileInput.name : 'Drop your file here'}</p>
                    </div>
                </div>
            )}
            
            {tool.id === 'image-converter' && (
                <div className="mt-8 flex gap-3">
                    {['png', 'jpeg', 'webp'].map(f => (
                        <button key={f} onClick={() => setTargetFormat(f as any)} className={`flex-1 py-3 rounded-xl font-bold uppercase text-xs transition-all ${targetFormat === f ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>{f}</button>
                    ))}
                </div>
            )}
        </div>

        <button onClick={execute} disabled={isLoading} className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] font-black text-xl hover:scale-[1.02] transition-all disabled:opacity-50 shadow-2xl flex items-center justify-center gap-3 group">
            {isLoading ? <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></span> : <>Execute Tool <span className="px-2 py-1 bg-white/20 dark:bg-slate-900/20 rounded-lg text-xs">-{tokenCost}T</span></>}
        </button>
        {error && <p className="text-red-500 font-bold text-center">{error}</p>}
      </div>

      {/* Results Column */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 p-8 shadow-xl flex flex-col min-h-[400px]">
         <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">Output <span className="w-2 h-2 rounded-full bg-green-500"></span></h4>
         <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
            {!result && outputFiles.length === 0 && (
                <div className="opacity-20 flex flex-col items-center">
                    <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.691.387a2 2 0 01-1.132.252 2 2 0 01-1.132-.252l-.69-.387a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547V18a2 2 0 002 2h11a2 2 0 002-2v-2.572z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <p className="text-lg font-bold">Waiting for input...</p>
                </div>
            )}
            
            {result && (
                <div className="w-full space-y-4">
                    {tool.id === 'qr-gen' ? <img src={result} className="mx-auto w-64 h-64 rounded-2xl shadow-xl border-8 border-white" /> : <pre className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl text-left dark:text-indigo-400 font-mono text-lg overflow-auto max-h-80">{result}</pre>}
                    <button onClick={() => { navigator.clipboard.writeText(result); alert('Copied!'); }} className="px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs uppercase text-slate-500 hover:text-slate-900">Copy Result</button>
                </div>
            )}
            
            {outputFiles.map((file, i) => (
                <div key={i} className="w-full p-6 bg-indigo-600 text-white rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-indigo-700 transition-colors" onClick={() => { const a = document.createElement('a'); a.href = file.url; a.download = file.name; a.click(); }}>
                    <div className="text-left">
                        <p className="font-black truncate max-w-[150px]">{file.name}</p>
                        <p className="text-xs opacity-60 uppercase font-bold tracking-widest">Ready to download</p>
                    </div>
                    <svg className="w-8 h-8 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};
