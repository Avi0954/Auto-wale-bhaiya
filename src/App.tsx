import { useState, useEffect } from 'react';
import { usePlayerStore } from './store/usePlayerStore';
import { Ride } from './pages/Ride';
import { youtubeService } from './services/youtubeService';

function App() {
  const driver = usePlayerStore(state => state.driver);
  const initRide = usePlayerStore(state => state.initRide);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    youtubeService.init('youtube-player-container');
  }, []);

  const handleStart = () => {
    initRide(); // This will pick a random driver and start playback
    setStarted(true);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white font-sans selection:bg-auto-yellow selection:text-black">
      <div id="youtube-player-container" style={{ display: 'none' }} />
      {!started || !driver ? (
        <div className="relative min-h-screen flex items-center justify-center cursor-pointer" onClick={handleStart}>
          <div className="absolute inset-0 bg-grain pointer-events-none opacity-60 mix-blend-overlay" />
          <div className="text-center z-10 animate-pulse">
            <h1 className="text-2xl tracking-[0.5em] text-zinc-500 mb-6 uppercase">
              <span className="text-auto-yellow">Auto</span> Mein
            </h1>
            <p className="text-sm tracking-widest text-zinc-400 border border-zinc-800 py-3 px-8 rounded-full shadow-[0_0_20px_rgba(255,215,0,0.1)]">
              [ TAP TO ENTER ]
            </p>
          </div>
        </div>
      ) : (
        <Ride />
      )}
    </div>
  );
}

export default App;
