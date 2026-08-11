declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year?: number;
  genre?: string[];
  era?: string;
  mood?: string[];
  audioUrl?: string; // URL to the audio file (optional for youtube tracks)
  artwork?: string; // Optional cover art url
  duration?: number;
  movie?: string;
  youtubeVideoId?: string;
  youtubeUrl?: string;
  thumbnail?: string;
}

export type PreferenceLevel = 'high' | 'medium' | 'low';

export interface Driver {
  id: string;
  name: string;
  personality: string;
  musicTaste: string[];
  preferences: Record<string, PreferenceLevel>;
  messageFrequency: number; // Probability (0.0 to 1.0) of saying something when a song changes
  messages: string[]; // Collection of things they might say
  reactions: {
    skip: string[]; // Shown when user skips a song
    positive: string[]; // Shown when user listens to several songs without skipping
  };
  image?: string;
}

export interface PlayerState {
  currentSong: Song | null;
  history: string[]; // Stores previously played song IDs
  isPlaying: boolean;
  volume: number;
  progress: number;
  isMuted: boolean;
  driver: Driver | null;
  currentMessage: string | null;
  distance: number; // in km
}
