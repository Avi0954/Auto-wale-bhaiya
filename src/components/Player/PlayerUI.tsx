import React, { useState, useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { Play, Pause, SkipForward, SkipBack, Disc3 } from 'lucide-react';
import { getNextSong } from '../../utils/selectionEngine';
import { autoDriver90sPlaylist as songs } from '../../data/autoDriver90sPlaylist';
import { youtubeService } from '../../services/youtubeService';

export const PlayerUI: React.FC = () => {
  const { currentSong, isPlaying, togglePlay, nextSong, prevSong, driver, history, volume, setVolume } = usePlayerStore();
  
  const [timeStr, setTimeStr] = useState("00:00");
  
  // LED Clock sync
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        const t = youtubeService.getCurrentTime();
        const mins = Math.floor(t / 60);
        const secs = Math.floor(t % 60);
        setTimeStr(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Physical Knob Interaction
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startVol = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startVol.current = volume;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = startY.current - e.clientY; // positive is up
    const deltaVol = deltaY * 0.01; 
    let newVol = startVol.current + deltaVol;
    newVol = Math.max(0, Math.min(1, newVol));
    setVolume(newVol);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  if (!currentSong) return null;

  const nextSongPreview = driver ? getNextSong(driver.id, currentSong.id, songs, history) : null;
  const rotation = -135 + (volume * 270);

  return (
    <div className="w-full max-w-[580px] flex flex-col gap-1 mx-auto font-sans">
      {/* Up Next label */}
      {nextSongPreview && (
        <div className="text-white/30 text-[10px] md:text-xs font-medium tracking-wide uppercase px-2 text-right mb-0.5 drop-shadow-md">
          UP NEXT · {nextSongPreview.title}
        </div>
      )}
      
      {/* The Physical Stereo Unit */}
      <div className="bg-[#0a0a0a] rounded-sm p-1.5 md:p-2 flex flex-col gap-1.5 md:gap-2 relative border-t-[1.5px] border-l-[1.5px] border-zinc-700/60 border-b-2 border-r-2 border-black shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_0_15px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* Top Printed Label Strip */}
        <div className="flex justify-between items-center px-2 py-0.5 border-b border-white/5 pb-1">
          <span className="text-[8px] md:text-[9px] text-zinc-400 font-bold tracking-[0.2em]">
            DIGITAL AUDIO SETUP
          </span>
          <div className="flex gap-2.5 text-[7px] md:text-[8px] text-zinc-500 tracking-wider">
            <span>MP3</span>
            <span>USB</span>
            <span>SD/TF</span>
            <span>FM</span>
            <span className="text-zinc-700">MIC</span>
          </div>
        </div>

        {/* Main Stereo Deck Area */}
        <div className="flex items-center gap-2 md:gap-3 px-1 md:px-2 py-1">
          
          {/* Left: Album Art */}
          <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 border-t-2 border-l-2 border-black border-b border-r border-zinc-800 rounded-[2px] overflow-hidden bg-black shadow-[inset_0_0_10px_rgba(0,0,0,1)] p-0.5">
            {currentSong.artwork ? (
              <img src={currentSong.artwork} alt="art" className="w-full h-full object-cover opacity-90 sepia-[0.1]" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Disc3 className="w-4 h-4 text-zinc-700" /></div>
            )}
          </div>

          {/* Center-Left: Song Text (Physical LCD look) */}
          <div className="flex-1 min-w-0 flex flex-col justify-center h-full border-r border-white/5 pr-1 md:pr-2">
            <h3 className="text-[11px] md:text-[13px] font-bold text-zinc-300 tracking-tight truncate uppercase drop-shadow-md">
              {currentSong.title}
            </h3>
            <p className="text-[8px] md:text-[10px] text-zinc-500 truncate uppercase mt-0.5">
              {currentSong.artist}
            </p>
          </div>

          {/* Center-Right: LED Time Display */}
          <div className="w-12 h-6 md:w-14 md:h-7 bg-[#170404] rounded-sm flex items-center justify-center border-t-2 border-l-2 border-black border-b border-r border-zinc-800 shadow-[inset_0_2px_6px_rgba(0,0,0,1)] relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
            <span className="font-mono text-[10px] md:text-xs text-[#ff3333] tracking-widest drop-shadow-[0_0_4px_rgba(255,51,51,0.8)] z-10 font-bold">
              {timeStr}
            </span>
          </div>

          {/* Controls Cluster */}
          <div className="flex items-center gap-1.5 md:gap-2 pl-1 md:pl-2 border-l border-white/5">
            <button 
              onClick={prevSong} 
              className="w-7 h-6 md:w-8 md:h-7 bg-[#1c1c1c] border-t border-zinc-600 border-b-[3px] border-black rounded-[2px] flex items-center justify-center text-zinc-400 active:translate-y-[2px] active:border-b-[1px] hover:text-zinc-300 transition-all shadow-sm"
            >
              <SkipBack fill="currentColor" size={11} />
            </button>
            <button 
              onClick={togglePlay} 
              className="w-8 h-7 md:w-9 md:h-8 bg-[#1c1c1c] border-t border-zinc-600 border-b-[3px] border-black rounded-[2px] flex items-center justify-center text-zinc-300 active:translate-y-[2px] active:border-b-[1px] hover:text-zinc-200 transition-all shadow-sm"
            >
              {isPlaying ? <Pause fill="currentColor" size={13} /> : <Play fill="currentColor" size={13} className="ml-0.5" />}
            </button>
            <button 
              onClick={() => nextSong(true)} 
              className="w-7 h-6 md:w-8 md:h-7 bg-[#1c1c1c] border-t border-zinc-600 border-b-[3px] border-black rounded-[2px] flex items-center justify-center text-zinc-400 active:translate-y-[2px] active:border-b-[1px] hover:text-zinc-300 transition-all shadow-sm"
            >
              <SkipForward fill="currentColor" size={11} />
            </button>
          </div>

          {/* Right: Volume Knob */}
          <div className="flex flex-col items-center justify-center pl-2 md:pl-4 border-l border-white/5 gap-0.5 md:gap-1 flex-shrink-0">
            <span className="text-[6px] md:text-[7px] text-zinc-500 font-bold tracking-widest">VOL</span>
            <div 
              className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-900 border-2 border-zinc-950 shadow-[0_4px_6px_rgba(0,0,0,0.8),inset_0_1px_3px_rgba(255,255,255,0.2)] flex items-center justify-center relative cursor-ns-resize touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div 
                className="absolute w-full h-full transition-transform duration-75"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div className="w-[3px] h-2.5 md:h-3 bg-zinc-200 absolute top-0.5 left-1/2 -translate-x-1/2 rounded-full shadow-[inset_0_0_2px_rgba(0,0,0,0.5)]" />
              </div>
            </div>
            <div className="w-[120%] flex justify-between text-[5px] md:text-[6px] text-zinc-600 px-0.5 font-bold">
              <span>MIN</span>
              <span>MAX</span>
            </div>
          </div>
          
        </div>
        
        {/* Subtle Progress Track (integrated into stereo body) */}
        <div className="w-full h-1 bg-black rounded-full overflow-hidden mt-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,1)] relative">
          <div 
            className="absolute top-0 left-0 h-full bg-zinc-700 transition-all duration-[2000ms] ease-linear"
            style={{ width: `${usePlayerStore(state => state.progress)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

