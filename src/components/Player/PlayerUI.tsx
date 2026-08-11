import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { Play, Pause, SkipForward, SkipBack, Disc3 } from 'lucide-react';
import { getNextSong } from '../../utils/selectionEngine';
import { autoDriver90sPlaylist as songs } from '../../data/autoDriver90sPlaylist';

export const PlayerUI: React.FC = () => {
  const { currentSong, isPlaying, togglePlay, nextSong, prevSong, driver, history } = usePlayerStore();

  if (!currentSong) return null;

  const nextSongPreview = driver ? getNextSong(driver.id, currentSong.id, songs, history) : null;

  return (
    <div className="w-full max-w-lg flex flex-col gap-1.5">
      {/* Up Next label */}
      {nextSongPreview && (
        <div className="text-white/40 text-[10px] md:text-xs font-medium tracking-wide uppercase px-2 text-right">
          UP NEXT · {nextSongPreview.title}
        </div>
      )}
      
      {/* Mini Player */}
      <div className="bg-black/40 backdrop-blur-md border border-zinc-500/20 rounded-2xl py-2 px-3 flex items-center gap-3 shadow-2xl overflow-hidden relative">
        
        {/* Subtle Progress Bar */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-white/10 w-full" />
        <div 
          className="absolute bottom-0 left-0 h-[2px] bg-white/40 rounded-r-full transition-all duration-[2000ms] ease-linear" 
          style={{ width: `${usePlayerStore(state => state.progress)}%` }}
        />
        
        {/* Thumbnail */}
        <div className="w-11 h-11 md:w-12 md:h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex-shrink-0 flex items-center justify-center overflow-hidden relative">
          {currentSong.artwork ? (
            <img src={currentSong.artwork} alt={currentSong.title} className="w-full h-full object-cover" />
          ) : (
            <Disc3 className={`w-5 h-5 text-zinc-700 ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
        </div>

        {/* Metadata */}
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-sm md:text-base font-bold text-white tracking-tight truncate drop-shadow-md">
            {currentSong.title}
          </h3>
          <p className="text-zinc-300 text-xs truncate drop-shadow-md">
            {currentSong.artist}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 md:gap-3 pr-2">
          <button 
            onClick={prevSong} 
            className="text-white/70 hover:text-white transition-opacity active:scale-95 p-2"
          >
            <SkipBack fill="currentColor" size={18} />
          </button>

          <button 
            onClick={togglePlay} 
            className="w-9 h-9 bg-white/90 text-black rounded-full flex items-center justify-center transition-opacity active:scale-95 shadow-none"
          >
            {isPlaying ? <Pause fill="currentColor" size={16} /> : <Play fill="currentColor" size={16} className="ml-0.5" />}
          </button>
          
          <button 
            onClick={() => nextSong(true)} 
            className="text-white/70 hover:text-white transition-opacity active:scale-95 p-2"
          >
            <SkipForward fill="currentColor" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

