import React, { useState, useEffect } from 'react';
import { PlayerUI } from '../components/Player/PlayerUI';
import { LivePassengerIndicator } from '../components/UI/LivePassengerIndicator';
import { usePlayerStore } from '../store/usePlayerStore';


export const Ride: React.FC = () => {
  const currentMessage = usePlayerStore(state => state.currentMessage);

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

      {/* Live Passenger Indicator */}
      <LivePassengerIndicator />

      {/* UI Layer */}
      <div className="relative z-20 flex flex-col h-full justify-between p-4 md:p-8">

        {/* Top Area Stack */}
        <div className="flex flex-col w-full gap-4 md:gap-6">

          {/* Top Bar (Time) */}
          <div className="flex justify-start items-center w-full text-xs md:text-sm font-medium tracking-wide">
            {/* Top-left: Time */}
            <div className="text-white/80 drop-shadow-md min-w-[80px]">
              {time}
            </div>
          </div>

          {/* Top-center: Wordmark */}
          <div className="text-center w-full flex flex-col items-center gap-1 mt-2 md:mt-4">
            <h1 className="text-2xl md:text-4xl font-bold tracking-[0.2em] text-white/90 uppercase ml-[0.2em] drop-shadow-lg">
              AUTO WALE BHAIYA
            </h1>
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
