import React, { useState, useEffect } from 'react';
import { PlayerUI } from '../components/Player/PlayerUI';
import { usePlayerStore } from '../store/usePlayerStore';
import { Volume2, VolumeX } from 'lucide-react';

export const Ride: React.FC = () => {
  const currentMessage = usePlayerStore(state => state.currentMessage);
  const isMuted = usePlayerStore(state => state.isMuted);
  const toggleMute = usePlayerStore(state => state.toggleMute);
  const initRide = usePlayerStore(state => state.initRide);
  
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    };
    updateTime();
    
    const timeInterval = setInterval(updateTime, 10000);
    const tickInterval = setInterval(() => {
      usePlayerStore.getState().tickEnvironment();
    }, 1000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(tickInterval);
    };
  }, []);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black select-none font-sans text-white">
      
      {/* Video Hero Background */}
      <video
        src="/driver-video.mp4"
        autoPlay
        muted // Force muted initially to allow autoplay on all browsers, Howler plays the actual audio
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover object-[75%_center] md:object-center z-0 animate-auto-zoom ${usePlayerStore(state => state.isBumping) ? 'animate-bump' : ''}`}
      />
      
      {/* Very Subtle Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10 pointer-events-none" />
      
      {/* UI Layer */}
      <div className="relative z-20 flex flex-col h-full justify-between p-4 md:p-8">
        
        {/* Top Area Stack */}
        <div className="flex flex-col w-full gap-4 md:gap-6">
          
          {/* Top Bar (Time, Status, Volume) */}
          <div className="flex justify-between items-center w-full text-xs md:text-sm font-medium tracking-wide">
            {/* Top-left: Time */}
            <div className="text-white/80 drop-shadow-md min-w-[80px]">
              {time}
            </div>
            
            {/* Top-center: Status */}
            <div className="flex items-center gap-2 text-white/60 font-normal">
              <div className="w-1.5 h-1.5 rounded-full bg-auto-green animate-pulse" />
              <span>629 on the road</span>
            </div>
            
            {/* Top-right: Sound Utility */}
            <button 
              onClick={toggleMute}
              className="text-white/60 hover:text-white/90 transition-colors min-w-[80px] flex justify-end p-2"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>

          {/* Top-center: Wordmark & Micro-context */}
          <div className="text-center w-full flex flex-col items-center gap-1 mt-2">
            <h1 className="text-xl md:text-2xl font-semibold tracking-[0.2em] text-white/90 uppercase ml-[0.2em]">
              AUTO WALO BHAIYA
            </h1>
            <span className="text-[9px] md:text-[10px] tracking-widest text-white/30 uppercase font-light">
              90s Romance
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center w-full gap-4 md:gap-8 pb-0">
          
          {/* Driver Message Floating Bubble */}
          <div className="w-full max-w-lg flex justify-start md:justify-center px-2">
            {currentMessage && (
              <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl rounded-bl-sm px-5 py-3 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-white/90 font-serif italic text-sm md:text-base drop-shadow-md">
                  "{currentMessage}"
                </p>
              </div>
            )}
          </div>

          {/* Floating Mini Player */}
          <PlayerUI />

        </div>
        
        {/* Next Auto Action (Absolute Bottom Right) */}
        <button 
          onClick={() => initRide()}
          className="absolute right-5 bottom-5 md:right-8 md:bottom-8 lg:right-10 lg:bottom-9 text-[10px] md:text-xs tracking-widest text-white/50 hover:text-white/70 transition-opacity uppercase z-50"
        >
          NEXT AUTO ↻
        </button>
      </div>
    </div>
  );
};
