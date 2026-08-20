// Web Audio API Synth Engine for soothing ambient water soundscapes, breathing guides, and chimes

class MentalSoundEngine {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private isPlayingAmbient = false;
  private currentAmbientType: string | null = null;

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Play a soft water drop or chime tone
  playChime(freq = 528, duration = 1.2) {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio not initialized:", e);
    }
  }

  // Breathing cue tone
  playBreathCue(phase: "inhale" | "hold" | "exhale") {
    const freqs = {
      inhale: 432,
      hold: 528,
      exhale: 396,
    };
    this.playChime(freqs[phase] || 440, 0.8);
  }

  // Start continuous ambient water/nature noise
  startAmbient(type: "rain" | "waves" | "stream" | "whitenoise" = "stream") {
    try {
      this.init();
      if (!this.ctx) return;
      this.stopAmbient();

      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = white * 0.08;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      // Filter for water/stream effect
      const filter = this.ctx.createBiquadFilter();
      if (type === "stream" || type === "waves") {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(type === "waves" ? 400 : 750, this.ctx.currentTime);
      } else if (type === "rain") {
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(900, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
      } else {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      }

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      this.noiseNode = whiteNoise;
      this.isPlayingAmbient = true;
      this.currentAmbientType = type;
    } catch (e) {
      console.warn("Ambient audio error:", e);
    }
  }

  startSoundscape(type: "rain" | "waves" | "stream" | "whitenoise" = "stream") {
    this.startAmbient(type);
  }

  stopAmbient() {
    if (this.noiseNode) {
      try {
        (this.noiseNode as any).stop();
      } catch (e) {
        // ignore
      }
      this.noiseNode = null;
    }
    this.isPlayingAmbient = false;
    this.currentAmbientType = null;
  }

  stopSoundscape() {
    this.stopAmbient();
  }

  getIsPlaying() {
    return this.isPlayingAmbient;
  }

  getCurrentType() {
    return this.currentAmbientType;
  }
}

export const soundEngine = new MentalSoundEngine();
