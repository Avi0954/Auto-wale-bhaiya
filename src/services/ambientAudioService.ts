class AmbientAudioService {
  private engineAudio: HTMLAudioElement;
  private ambienceAudio: HTMLAudioElement;
  private bumpAudio: HTMLAudioElement;
  
  private isInitialized = false;
  private isMuted = false;
  private isMusicPlaying = false;

  // Target volumes
  private readonly ENGINE_PLAYING_VOL = 0.12;
  private readonly ENGINE_PAUSED_VOL = 0.25;
  private readonly AMBIENCE_PLAYING_VOL = 0.4;
  private readonly AMBIENCE_PAUSED_VOL = 0.7;
  private readonly BUMP_VOL = 0.3;

  constructor() {
    // Note: If files are missing, the browser will log a 404 but won't crash the JS.
    this.engineAudio = new Audio('/audio/engine.mp3');
    this.engineAudio.loop = true;
    
    this.ambienceAudio = new Audio('/audio/traffic.mp3');
    this.ambienceAudio.loop = true;
    
    this.bumpAudio = new Audio('/audio/bump.mp3');
    this.bumpAudio.loop = false;

    // Set initial volumes
    this.engineAudio.volume = 0;
    this.ambienceAudio.volume = 0;
    this.bumpAudio.volume = this.BUMP_VOL;
  }

  public init() {
    if (this.isInitialized) return;
    
    // Autoplay restrictions require user interaction before playing audio
    this.engineAudio.play().catch(() => console.warn('Ambient engine audio blocked by autoplay'));
    this.ambienceAudio.play().catch(() => console.warn('Ambient road audio blocked by autoplay'));
    
    this.isInitialized = true;
    this.updateVolumes();
  }

  public setMusicPlaying(playing: boolean) {
    this.isMusicPlaying = playing;
    if (!this.isInitialized && playing) {
       this.init();
    }
    this.updateVolumes();
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    this.engineAudio.muted = muted;
    this.ambienceAudio.muted = muted;
    this.bumpAudio.muted = muted;
  }

  public playBump() {
    if (this.isMuted) return;
    
    // Reset and play
    this.bumpAudio.currentTime = 0;
    this.bumpAudio.play().catch(() => {
      // Ignored if missing or blocked
    });
  }

  // Smooth volume transition
  private updateVolumes() {
    if (!this.isInitialized) return;

    const targetEngineVol = this.isMusicPlaying ? this.ENGINE_PLAYING_VOL : this.ENGINE_PAUSED_VOL;
    const targetAmbienceVol = this.isMusicPlaying ? this.AMBIENCE_PLAYING_VOL : this.AMBIENCE_PAUSED_VOL;

    this.fadeVolume(this.engineAudio, targetEngineVol, true);
    this.fadeVolume(this.ambienceAudio, targetAmbienceVol, false);
  }

  private engineFadeInterval: number | null = null;
  private ambienceFadeInterval: number | null = null;

  private fadeVolume(audio: HTMLAudioElement, targetVolume: number, isEngine: boolean) {
    if (isEngine && this.engineFadeInterval) clearInterval(this.engineFadeInterval);
    if (!isEngine && this.ambienceFadeInterval) clearInterval(this.ambienceFadeInterval);

    const startVolume = audio.volume;
    const difference = targetVolume - startVolume;
    
    if (difference === 0) return;

    const steps = 20;
    const stepTime = 500 / steps;
    const stepAmount = difference / steps;
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      let newVol = startVolume + (stepAmount * currentStep);
      
      if (newVol < 0) newVol = 0;
      if (newVol > 1) newVol = 1;
      
      audio.volume = newVol;
      
      if (currentStep >= steps) {
        if (isEngine && this.engineFadeInterval) clearInterval(this.engineFadeInterval);
        if (!isEngine && this.ambienceFadeInterval) clearInterval(this.ambienceFadeInterval);
        audio.volume = targetVolume;
      }
    }, stepTime);

    if (isEngine) this.engineFadeInterval = interval;
    else this.ambienceFadeInterval = interval;
  }
}

export const ambientAudioService = new AmbientAudioService();
