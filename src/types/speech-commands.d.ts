import * as tf from '@tensorflow/tfjs';

export interface SpeechCommandRecognizer {
  ensureModelLoaded(): Promise<void>;
  listen(
    callback: (result: SpeechCommandResult) => void,
    options?: {
      includeSpectrogram?: boolean;
      probabilityThreshold?: number;
      invokeCallbackOnNoiseAndUnknown?: boolean;
    }
  ): void;
  stopListening(): void;
  wordLabels: string[];
}

export interface SpeechCommandResult {
  scores: Float32Array;
  spectrogram: tf.Tensor;
  wordLabels: string[];
}

export function create(modelName: string): SpeechCommandRecognizer; 