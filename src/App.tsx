import { useState, useEffect } from 'react';
import { usePlayerStore } from './store/usePlayerStore';
import { Ride } from './pages/Ride';
import { youtubeService } from './services/youtubeService';
import { ambientAudioService } from './services/ambientAudioService';

function App() {
  const driver = usePlayerStore(state => state.driver);
  const initRide = usePlayerStore(state => state.initRide);

  useEffect(() => {
    youtubeService.init('youtube-player-container').then(() => {
      initRide();
    });

    const handleFirstInteraction = () => {
      const state = usePlayerStore.getState();
      if (state.isPlaying) {
        youtubeService.play();
        ambientAudioService.setMusicPlaying(true);
      }
      document.removeEventListener('pointerdown', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('pointerdown', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white font-sans selection:bg-auto-yellow selection:text-black">
      <div id="youtube-player-container" style={{ display: 'none' }} />
      {driver ? <Ride /> : null}
    </div>
  );
}

export default App;
