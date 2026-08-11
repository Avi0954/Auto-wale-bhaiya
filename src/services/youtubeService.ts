export type YouTubePlayerEvent = 'ready' | 'stateChange' | 'error';
export type YouTubePlayerState = -1 | 0 | 1 | 2 | 3 | 5; // unstarted, ended, playing, paused, buffering, cued

type EventCallback = (data: any) => void;

class YouTubeService {
  private player: any = null;
  private isApiLoaded = false;
  private isApiLoading = false;
  private listeners: Record<YouTubePlayerEvent, EventCallback[]> = {
    ready: [],
    stateChange: [],
    error: []
  };
  private containerId: string = 'youtube-player-container';

  public init(containerId: string = 'youtube-player-container'): Promise<void> {
    this.containerId = containerId;
    return new Promise((resolve) => {
      if (this.isApiLoaded && this.player) {
        resolve();
        return;
      }

      if (window.YT && window.YT.Player) {
        this.isApiLoaded = true;
        this.createPlayer();
        resolve();
        return;
      }

      if (!this.isApiLoading) {
        this.isApiLoading = true;
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          this.isApiLoaded = true;
          this.createPlayer();
          resolve();
        };
      } else {
        // Poll until loaded
        const interval = setInterval(() => {
          if (this.isApiLoaded && this.player) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      }
    });
  }

  private createPlayer() {
    const el = document.getElementById(this.containerId);
    if (!el) {
      console.warn(`Container #${this.containerId} not found, unable to create YouTube player.`);
      return;
    }
    
    this.player = new window.YT.Player(this.containerId, {
      height: '0',
      width: '0',
      videoId: '', // start empty
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        playsinline: 1
      },
      events: {
        onReady: (event: any) => {
          this.emit('ready', event);
        },
        onStateChange: (event: any) => {
          this.emit('stateChange', event.data);
        },
        onError: (event: any) => {
          console.error("YouTube Player Error:", event.data);
          this.emit('error', event.data);
        }
      }
    });
  }

  public loadAndPlay(videoId: string) {
    if (this.player && typeof this.player.loadVideoById === 'function') {
      this.player.loadVideoById(videoId);
    }
  }

  public play() {
    if (this.player && typeof this.player.playVideo === 'function') {
      this.player.playVideo();
    }
  }

  public pause() {
    if (this.player && typeof this.player.pauseVideo === 'function') {
      this.player.pauseVideo();
    }
  }

  public stop() {
    if (this.player && typeof this.player.stopVideo === 'function') {
      this.player.stopVideo();
    }
  }

  public seekTo(seconds: number) {
    if (this.player && typeof this.player.seekTo === 'function') {
      this.player.seekTo(seconds, true);
    }
  }

  public setVolume(volume: number) {
    if (this.player && typeof this.player.setVolume === 'function') {
      // YouTube volume is 0-100, we expect 0.0-1.0
      this.player.setVolume(volume * 100);
    }
  }

  public getDuration(): number {
    if (this.player && typeof this.player.getDuration === 'function') {
      return this.player.getDuration();
    }
    return 0;
  }

  public getCurrentTime(): number {
    if (this.player && typeof this.player.getCurrentTime === 'function') {
      return this.player.getCurrentTime();
    }
    return 0;
  }

  public on(event: YouTubePlayerEvent, callback: EventCallback) {
    this.listeners[event].push(callback);
  }

  public off(event: YouTubePlayerEvent, callback: EventCallback) {
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  private emit(event: YouTubePlayerEvent, data: any) {
    this.listeners[event].forEach(cb => cb(data));
  }
}

export const youtubeService = new YouTubeService();
