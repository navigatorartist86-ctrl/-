import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../services/audioUtils';
import { Language } from '../types';

interface LiveSessionProps {
  lang: Language;
  onClose: () => void;
}

export const LiveSession: React.FC<LiveSessionProps> = ({ lang, onClose }) => {
  const [status, setStatus] = useState<'initializing' | 'listening' | 'speaking' | 'error'>('initializing');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  
  // Refs for cleanup
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    let mounted = true;

    const startSession = async () => {
      try {
        if (!process.env.API_KEY) {
          throw new Error("API Key not found. Please check environment configuration.");
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Output Audio Context
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = outputCtx;
        const outputNode = outputCtx.createGain();
        outputNode.connect(outputCtx.destination);

        // Input Audio Context
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        inputContextRef.current = inputCtx;

        // Microphone Stream
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const config = {
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            systemInstruction: `You are a helpful, creative AI assistant. The user is speaking in ${lang === 'ar' ? 'Arabic' : lang === 'fr' ? 'French' : 'English'}. Respond in the same language. Be concise and friendly.`,
          },
        };

        const sessionPromise = ai.live.connect({
          model: config.model,
          config: config.config,
          callbacks: {
            onopen: () => {
              if (!mounted) return;
              setStatus('listening');
              
              // Setup Audio Input Processing
              const source = inputCtx.createMediaStreamSource(stream);
              const processor = inputCtx.createScriptProcessor(4096, 1, 1);
              
              processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                
                // Simple volume visualization
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) {
                  sum += Math.abs(inputData[i]);
                }
                if(mounted) setVolume(Math.min(100, (sum / inputData.length) * 5000));

                const pcmBlob = createPcmBlob(inputData);
                sessionPromise.then((session) => {
                    session.sendRealtimeInput({ media: pcmBlob });
                });
              };

              source.connect(processor);
              processor.connect(inputCtx.destination);
              
              sourceRef.current = source;
              processorRef.current = processor;
            },
            onmessage: async (message: LiveServerMessage) => {
              if (!mounted) return;
              
              // Handle Audio Output
              const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (base64Audio) {
                setStatus('speaking');
                
                const ctx = audioContextRef.current;
                if (!ctx) return;

                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                const audioBuffer = await decodeAudioData(
                  base64ToUint8Array(base64Audio),
                  ctx,
                  24000,
                  1
                );

                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNode);
                
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0 && mounted) {
                    setStatus('listening');
                  }
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }
              
              // Handle Interruption
              if (message.serverContent?.interrupted) {
                  sourcesRef.current.forEach(s => {
                      try { s.stop(); } catch(e) {}
                  });
                  sourcesRef.current.clear();
                  nextStartTimeRef.current = 0;
                  setStatus('listening');
              }
            },
            onclose: () => {
               console.log("Session closed");
            },
            onerror: (e) => {
              console.error("Session error", e);
              if (mounted) {
                 setStatus('error');
                 setErrorMsg("Connection error. Please try again.");
              }
            }
          }
        });
        
        sessionRef.current = sessionPromise;

      } catch (e: any) {
        console.error(e);
        if (mounted) {
            setStatus('error');
            setErrorMsg(e.message || "Failed to initialize audio session.");
        }
      }
    };

    startSession();

    return () => {
      mounted = false;
      // Cleanup
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (processorRef.current) {
          processorRef.current.disconnect();
          processorRef.current.onaudioprocess = null;
      }
      if (sourceRef.current) sourceRef.current.disconnect();
      if (inputContextRef.current) inputContextRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
      
      // Close session if possible (the API implies we just drop it or use session.close if available in the promise result)
      if(sessionRef.current) {
         sessionRef.current.then((s: any) => s.close && s.close());
      }
    };
  }, [lang]);

  return (
    <div className="flex flex-col items-center justify-center space-y-12 w-full h-full">
       
      {/* Visualizer / Status Orb */}
      <div className="relative">
        <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${
            status === 'error' ? 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)]' :
            status === 'speaking' ? 'bg-gradient-to-br from-indigo-400 to-purple-600 shadow-[0_0_60px_rgba(99,102,241,0.6)] scale-110' :
            status === 'listening' ? 'bg-slate-800 shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-slate-700' :
            'bg-slate-800 opacity-50'
        }`}>
            {status === 'initializing' && (
                <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            
            {status === 'listening' && (
                 <div 
                    className="absolute inset-0 rounded-full bg-indigo-500 opacity-20"
                    style={{ transform: `scale(${1 + volume/50})`, transition: 'transform 0.1s ease-out' }}
                 />
            )}

             <div className="z-10">
                {status === 'listening' && <div className="flex space-x-1 h-8 items-center">
                     {[1,2,3,4,5].map(i => (
                         <div key={i} className="w-2 bg-white rounded-full animate-pulse" style={{ height: `${10 + Math.random() * volume}%` }}></div>
                     ))}
                </div>}
                {status === 'speaking' && <svg className="w-16 h-16 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>}
             </div>
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-light text-white">
            {status === 'initializing' && 'Connecting to Gemini Live...'}
            {status === 'listening' && 'Listening...'}
            {status === 'speaking' && 'Gemini is speaking...'}
            {status === 'error' && 'Error Occurred'}
        </h3>
        {errorMsg && <p className="text-red-400 text-sm max-w-md">{errorMsg}</p>}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button 
            onClick={onClose}
            className="px-8 py-3 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 transition-colors"
        >
            End Session
        </button>
      </div>
    </div>
  );
};