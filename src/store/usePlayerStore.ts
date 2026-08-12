import { create } from 'zustand';
import type { PlayerState, Song } from '../types';
import { autoDriver90sPlaylist as songs } from '../data/autoDriver90sPlaylist';
import { drivers } from '../data/drivers';
import { getNextSong, getPreviousSong } from '../utils/selectionEngine';
import { youtubeService } from '../services/youtubeService';
import { ambientAudioService } from '../services/ambientAudioService';

interface PlayerStore extends PlayerState {
  consecutiveSongsPlayed: number;
  messageTimeoutId: ReturnType<typeof setTimeout> | null;
  isAdvancing: boolean;
  initRide: (driverId?: string) => void;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  nextSong: (isSkip?: boolean) => void;
  prevSong: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setProgress: (progress: number) => void;
  setCurrentMessage: (message: string | null) => void;
  tickEnvironment: () => void;
  isBumping: boolean;
  triggerBump: () => void;
}

const isValidYouTubeId = (id: any): boolean => {
  if (typeof id !== 'string') return false;
  if (id.length !== 11) return false;
  return /^[A-Za-z0-9_-]{11}$/.test(id);
};

const playYoutubeAudio = (song: Song, get: () => PlayerStore) => {
  if (song.youtubeVideoId) {
    if (!isValidYouTubeId(song.youtubeVideoId)) {
      console.warn(`Invalid YouTube ID detected for song "${song.title}": ${song.youtubeVideoId}. Skipping track.`);
      setTimeout(() => {
        get().nextSong(false);
      }, 0);
      return;
    }
    youtubeService.loadAndPlay(song.youtubeVideoId);
    youtubeService.setVolume(get().volume);
  } else {
    // Failsafe for non-youtube songs, though the playlist should only have youtube songs
    setTimeout(() => {
      const state = get();
      if (state.currentSong?.id === song.id && state.isPlaying) {
        state.nextSong(false);
      }
    }, 15000);
  }

  // Setup Mobile/Lock Screen Controls (Media Session API)
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      artwork: song.artwork ? [
        { src: song.artwork, sizes: '512x512', type: 'image/jpeg' }
      ] : []
    });

    navigator.mediaSession.setActionHandler('play', () => get().togglePlay());
    navigator.mediaSession.setActionHandler('pause', () => get().togglePlay());
    navigator.mediaSession.setActionHandler('previoustrack', () => get().prevSong());
    navigator.mediaSession.setActionHandler('nexttrack', () => get().nextSong(true));
  }
};

// Setup global YouTube listeners once
let listenersSetup = false;
const setupYoutubeListeners = (get: () => PlayerStore) => {
  if (listenersSetup) return;
  listenersSetup = true;

  youtubeService.on('stateChange', (state: number) => {
    const store = get();
    if (state === 0) {
      // Ended
      store.nextSong(false);
    } else if (state === 1) {
      // Playing
      if (!store.isPlaying) {
        usePlayerStore.setState({ isPlaying: true });
        ambientAudioService.setMusicPlaying(true);
      }
    } else if (state === 2) {
      // Paused
      if (store.isPlaying) {
        usePlayerStore.setState({ isPlaying: false });
        ambientAudioService.setMusicPlaying(false);
      }
    }
  });

  youtubeService.on('error', () => {
    // Skip unavailable or un-embeddable videos seamlessly
    console.warn("YouTube Player Error, skipping to next track");
    const store = get();
    if (store.isAdvancing) return;
    usePlayerStore.setState({ isAdvancing: true });
    setTimeout(() => {
      get().nextSong(false);
      usePlayerStore.setState({ isAdvancing: false });
    }, 1000);
  });
};


export const usePlayerStore = create<PlayerStore>((set, get) => {
  // Initialize listeners
  setupYoutubeListeners(get);

  return {
    currentSong: null,
    history: [],
    isPlaying: false,
    volume: 0.8,
    progress: 0,
    isMuted: false,
    driver: null,
    currentMessage: null,
    distance: 0.0,
    consecutiveSongsPlayed: 0,
    messageTimeoutId: null,
    isAdvancing: false,
    isBumping: false,

    triggerBump: () => {
      const state = get();
      if (!state.isPlaying || state.isBumping) return;
      
      set({ isBumping: true });
      ambientAudioService.playBump();
      
      setTimeout(() => {
        set({ isBumping: false });
      }, 400); // 400ms visual and audio shake
    },

    initRide: (driverId?: string) => {
      const driver = driverId
        ? drivers.find(d => d.id === driverId) || drivers[0]
        : drivers[Math.floor(Math.random() * drivers.length)];
        
      const firstSong = getNextSong(driver.id, null, songs, []);
      
      let message = null;
      if (driver.messages && driver.messages.length > 0) {
        message = driver.messages[Math.floor(Math.random() * driver.messages.length)];
      }

      const state = get();
      if (state.messageTimeoutId) clearTimeout(state.messageTimeoutId);

      const timeoutId = setTimeout(() => {
        get().setCurrentMessage(null);
      }, 7000);

      set({ 
        driver, 
        currentSong: firstSong, 
        isPlaying: true, 
        history: [], 
        currentMessage: message,
        distance: 0.0,
        consecutiveSongsPlayed: 0,
        messageTimeoutId: timeoutId,
        isBumping: false
      });

      playYoutubeAudio(firstSong, get);
      ambientAudioService.setMusicPlaying(true);
    },

    playSong: (song) => {
      const state = get();
      const newHistory = state.currentSong 
        ? [...state.history, state.currentSong.id] 
        : state.history;
        
      set({ currentSong: song, isPlaying: true, history: newHistory });
      playYoutubeAudio(song, get);
      ambientAudioService.setMusicPlaying(true);
    },
    
    togglePlay: () => {
      const state = get();
      const newIsPlaying = !state.isPlaying;
      
      if (newIsPlaying) {
        youtubeService.play();
      } else {
        youtubeService.pause();
      }
      
      set({ isPlaying: newIsPlaying });
      ambientAudioService.setMusicPlaying(newIsPlaying);
    },
    
    nextSong: (isSkip = false) => {
      const state = get();
      if (!state.currentSong || !state.driver) return;
      
      const next = getNextSong(state.driver.id, state.currentSong.id, songs, state.history);
      
      let newConsecutive = isSkip ? 0 : state.consecutiveSongsPlayed + 1;
      
      let message = null;
      
      if (isSkip && Math.random() < 0.4 && state.driver.reactions?.skip?.length > 0) {
        message = state.driver.reactions.skip[Math.floor(Math.random() * state.driver.reactions.skip.length)];
      } else if (!isSkip && newConsecutive >= 3 && Math.random() < 0.3 && state.driver.reactions?.positive?.length > 0) {
        message = state.driver.reactions.positive[Math.floor(Math.random() * state.driver.reactions.positive.length)];
        newConsecutive = 0; 
      } else if (Math.random() < state.driver.messageFrequency && state.driver.messages.length > 0) {
        message = state.driver.messages[Math.floor(Math.random() * state.driver.messages.length)];
      }

      if (state.messageTimeoutId) clearTimeout(state.messageTimeoutId);
      
      let newTimeoutId = null;
      if (message) {
        newTimeoutId = setTimeout(() => {
          get().setCurrentMessage(null);
        }, 7000);
      }
      
      set({ 
        currentSong: next, 
        isPlaying: true, 
        progress: 0,
        history: [...state.history, state.currentSong.id],
        currentMessage: message,
        consecutiveSongsPlayed: newConsecutive,
        messageTimeoutId: newTimeoutId
      });

      playYoutubeAudio(next, get);
    },
    
    prevSong: () => {
      const state = get();
      if (state.history.length === 0) {
        set({ progress: 0 });
        youtubeService.seekTo(0);
        return;
      }
      
      const prev = getPreviousSong(songs, state.history);
      if (prev) {
        const newHistory = [...state.history];
        newHistory.pop();
        set({ currentSong: prev, progress: 0, history: newHistory, currentMessage: null });
        playYoutubeAudio(prev, get);
      } else {
        set({ progress: 0 });
        youtubeService.seekTo(0);
      }
    },
    
    setVolume: (volume) => {
      youtubeService.setVolume(volume);
      set({ volume });
    },
    
    toggleMute: () => {
      const state = get();
      const newIsMuted = !state.isMuted;
      if (newIsMuted) {
        youtubeService.setVolume(0);
      } else {
        youtubeService.setVolume(state.volume);
      }
      set({ isMuted: newIsMuted });
      ambientAudioService.setMute(newIsMuted);
    },
    
    setProgress: (progress) => {
      const duration = youtubeService.getDuration();
      if (duration > 0) {
        youtubeService.seekTo((progress / 100) * duration);
      }
      set({ progress });
    },

    setCurrentMessage: (message) => set({ currentMessage: message }),

    tickEnvironment: () => {
      const state = get();
      if (!state.isPlaying) return;

      const newDistance = state.distance + 0.02;

      // Random road bump (average every ~40 seconds)
      if (Math.random() < 0.025 && !state.isBumping) {
        get().triggerBump();
      }

      // Sync progress visually
      let currentProgress = state.progress;
      const duration = youtubeService.getDuration();
      if (duration > 0) {
        const currentTime = youtubeService.getCurrentTime();
        currentProgress = (currentTime / duration) * 100;
      } else {
        // Mock progress for the failsafe 15s track if youtube fails
        currentProgress = Math.min(100, state.progress + (2000 / 15000) * 100);
      }

      set({ distance: newDistance, progress: currentProgress });
    }
  };
});
