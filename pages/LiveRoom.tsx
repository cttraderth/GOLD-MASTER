
import React, { useState, useEffect, useRef, memo } from 'react';
import { Maximize2, RefreshCw, Layers, Zap, Sliders, ShieldCheck, Mic, MicOff, Volume2, Activity, MonitorPlay } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Language } from '../types';
import { translations } from '../translations';

interface LiveRoomProps {
  language: Language;
}

// Separate component for TradingView Widget to handle script loading safely
const TradingViewWidget = memo(() => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": "OANDA:XAUUSD",
      "interval": "60",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "backgroundColor": "rgba(5, 5, 5, 1)",
      "gridColor": "rgba(255, 255, 255, 0.06)",
      "withdateranges": true,
      "hide_side_toolbar": false,
      "allow_symbol_change": true,
      "save_image": false,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });
    
    if (container.current) {
      container.current.innerHTML = ""; // Clear placeholder
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container h-full w-full" ref={container}>
      <div className="tradingview-widget-container__widget h-full w-full"></div>
    </div>
  );
});

const LiveRoom: React.FC<LiveRoomProps> = ({ language }) => {
  const t = translations[language].live;
  const common = translations[language].common;
  
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState("");
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Function to implement manual base64 encoding/decoding as required by guidelines
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const startLiveAnalyst = async () => {
    if (isLiveActive) return stopLiveAnalyst();
    
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.log('Gemini Live session opened');
            setIsConnecting(false);
            setIsLiveActive(true);
            
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64EncodedAudioString),
                ctx,
                24000,
                1,
              );
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => (prev + " " + message.serverContent?.outputTranscription?.text).slice(-200));
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error('Gemini Live error:', e),
          onclose: () => stopLiveAnalyst(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: `You are a professional Gold Market AI Analyst. 
          The user is currently looking at the XAUUSD Live Terminal. 
          Provide real-time technical analysis and insights when asked. 
          Be concise, authoritative, and maintain a high-level institutional tone. 
          Response in ${language === 'th' ? 'Thai' : 'English'}.`,
          outputAudioTranscription: {},
        },
      });
      
      sessionRef.current = await sessionPromise;
      
    } catch (err) {
      console.error('Failed to start Live AI Analyst:', err);
      setIsConnecting(false);
    }
  };

  const stopLiveAnalyst = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    sourcesRef.current.clear();
    setIsLiveActive(false);
    setIsConnecting(false);
    setTranscription("");
  };

  useEffect(() => {
    return () => stopLiveAnalyst();
  }, []);

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-4">
      <header className="flex justify-between items-center px-2">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">{t.terminal}</h1>
          <div className="hidden md:flex space-x-2">
            {['1M', '5M', '15M', '1H', '4H', '1D'].map(tf => (
              <button key={tf} className={`px-2 py-1 rounded text-[10px] font-bold ${tf === '1H' ? 'bg-yellow-500 text-black' : 'bg-neutral-800 text-neutral-500 hover:text-white transition-colors'}`}>
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={startLiveAnalyst}
            disabled={isConnecting}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isLiveActive ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'gold-gradient text-black shadow-lg shadow-yellow-500/20 hover:scale-105'}`}
          >
            {isConnecting ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : isLiveActive ? (
              <MicOff size={14} />
            ) : (
              <Mic size={14} />
            )}
            <span>{isConnecting ? common.loading : isLiveActive ? t.disconnect : t.connectAnalyst}</span>
          </button>
          <div className="hidden md:flex space-x-4 text-neutral-500">
            <button className="hover:text-white transition-colors"><RefreshCw size={18} /></button>
            <button className="hover:text-white transition-colors"><Layers size={18} /></button>
            <button className="hover:text-white transition-colors"><Maximize2 size={18} /></button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        <div className="flex-1 glass-card rounded-2xl border border-yellow-500/10 overflow-hidden relative min-h-[300px] bg-[#050505]">
          {/* REAL TRADINGVIEW WIDGET */}
          <div className="absolute inset-0">
             <TradingViewWidget />
          </div>

          {/* AI Overlay Layer - only visible when AI is active */}
          {isLiveActive && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20 flex items-center justify-center pointer-events-none">
               <div className="w-full max-w-2xl px-8 pointer-events-auto">
                  <div className="flex flex-col items-center space-y-8">
                    <div className="relative">
                      <div className="w-32 h-32 bg-yellow-500/10 rounded-full border-4 border-yellow-500/40 flex items-center justify-center overflow-hidden">
                        <Activity className="text-yellow-500 animate-pulse" size={48} />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">LIVE</div>
                    </div>
                    
                    <div className="text-center space-y-2">
                       <h3 className="text-xl font-black gold-text italic uppercase tracking-tighter">{t.listening}</h3>
                       <p className="text-neutral-400 text-xs uppercase tracking-widest">{t.analystInstruction}</p>
                    </div>

                    {transcription && (
                      <div className="w-full bg-neutral-900/80 backdrop-blur border border-yellow-500/20 p-6 rounded-3xl shadow-2xl animate-in slide-in-from-bottom-4">
                        <div className="flex items-start space-x-3">
                           <Volume2 className="text-yellow-500 mt-1 flex-shrink-0" size={18} />
                           <p className="text-neutral-200 text-sm italic font-medium leading-relaxed">
                             "{transcription}..."
                           </p>
                        </div>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          )}

          {/* Persistent Overlay Widgets */}
          {!isLiveActive && (
            <div className="absolute top-6 left-6 w-64 glass-card p-4 rounded-xl border-white/5 backdrop-blur-xl shadow-2xl z-10">
              <h4 className="text-xs font-black uppercase text-yellow-500 mb-3 tracking-widest flex items-center">
                <Activity size={12} className="mr-2" /> {t.sentiment}
              </h4>
              <div className="space-y-3">
                 <div className="flex justify-between items-center">
                   <span className="text-[10px] text-neutral-400 font-bold uppercase">{t.buyers}</span>
                   <span className="text-xs font-bold text-green-500">64%</span>
                 </div>
                 <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                   <div className="h-full bg-green-500" style={{ width: '64%' }}></div>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-[10px] text-neutral-400 font-bold uppercase">{t.sellers}</span>
                   <span className="text-xs font-bold text-red-500">36%</span>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Technical Summary */}
        <div className="w-full lg:w-80 space-y-4 flex flex-col h-full overflow-y-auto pr-1 custom-scroll">
          <div className="glass-card p-5 rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black uppercase text-yellow-500 tracking-widest flex items-center">
                  <Sliders size={14} className="mr-2" /> {t.techSummary}
                </h4>
             </div>
             
             <div className="flex flex-col items-center py-4">
                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                   <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#262626" strokeWidth="8" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#eab308" strokeWidth="8" strokeDasharray="212" strokeDashoffset="70" strokeLinecap="round" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs font-black text-yellow-500 uppercase">{t.strongBuy}</span>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full">
                   {[
                     { l: 'RSI(14)', v: '68.5', c: 'text-green-500' },
                     { l: 'MACD', v: 'Buy', c: 'text-green-500' },
                     { l: 'MA(50)', v: 'Buy', c: 'text-green-500' },
                     { l: 'MA(200)', v: 'Strong Buy', c: 'text-green-500' },
                     { l: 'Pivot', v: '2034.1', c: 'text-white' },
                     { l: 'ADX(14)', v: '32.1', c: 'text-white' }
                   ].map((item, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-tighter">{item.l}</span>
                        <span className={`text-[11px] font-black ${item.c}`}>{item.v}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-green-500/10 flex items-center space-x-3">
             <div className="p-2 bg-green-500/10 text-green-500 rounded-lg"><ShieldCheck size={20} /></div>
             <div>
                <p className="text-[10px] font-black uppercase text-green-500 leading-tight">Confluence Found</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter">3 Technical & 1 Macro indicator align for Buy.</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4">
        {[
          { label: 'R3', value: '2065.20', color: 'text-red-500' },
          { label: 'R2', value: '2054.50', color: 'text-red-400' },
          { label: 'R1', value: '2042.80', color: 'text-red-300' },
          { label: 'S1', value: '2012.30', color: 'text-green-300' },
          { label: 'S2', value: '2005.10', color: 'text-green-400' },
          { label: 'S3', value: '1992.40', color: 'text-green-500' }
        ].map((level, i) => (
          <div key={i} className="glass-card p-2 md:p-3 rounded-xl flex flex-col items-center justify-center border-b-2 border-b-neutral-800 hover:border-b-yellow-500 transition-colors cursor-default">
            <span className={`text-[10px] font-black uppercase tracking-tighter mb-1 ${level.color}`}>{level.label}</span>
            <span className="font-mono font-black text-[10px] md:text-sm tracking-wider">${level.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveRoom;
