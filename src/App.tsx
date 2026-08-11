import { useState, useEffect } from 'react';
import { usePlayerStore } from './store/usePlayerStore';
import { Ride } from './pages/Ride';
import { youtubeService } from './services/youtubeService';

function App() {
  const driver = usePlayerStore(state => state.driver);
  const initRide = usePlayerStore(state => state.initRide);

  useEffect(() => {
    youtubeService.init('youtube-player-container').then(() => {
      initRide();
    });
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white font-sans selection:bg-auto-yellow selection:text-black">
      <div id="youtube-player-container" style={{ display: 'none' }} />
      {driver ? <Ride /> : null}
    </div>
  );
}

export default App;
