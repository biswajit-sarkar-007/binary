declare module 'voice-activity-detection' {
  interface VADOptions {
    fftSize?: number;
    bufferLen?: number;
    smoothingTimeConstant?: number;
    minCaptureFreq?: number;
    maxCaptureFreq?: number;
    noiseCaptureDuration?: number;
    minNoiseLevel?: number;
    maxNoiseLevel?: number;
    avgNoiseMultiplier?: number;
  }

  interface VADInstance {
    volume: number;
    on(event: 'voice' | 'silence', callback: () => void): void;
    destroy(): void;
  }

  function VAD(
    audioContext: AudioContext,
    source: MediaStreamAudioSourceNode,
    options?: VADOptions
  ): VADInstance;

  export default VAD;
} 