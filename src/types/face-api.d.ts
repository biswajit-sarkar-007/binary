declare module 'face-api.js' {
  export namespace nets {
    export const tinyFaceDetector: {
      loadFromUri: (uri: string) => Promise<void>;
    };
    export const faceExpressionNet: {
      loadFromUri: (uri: string) => Promise<void>;
    };
    export const faceLandmark68Net: {
      loadFromUri: (uri: string) => Promise<void>;
    };
  }

  export interface FaceExpressions {
    angry: number;
    disgusted: number;
    fearful: number;
    happy: number;
    sad: number;
    surprised: number;
  }

  export interface TinyFaceDetectorOptions { // Ensure inputSize and scoreThreshold are optional

    inputSize?: number;
    scoreThreshold?: number;
  }

  export function detectAllFaces(video: HTMLVideoElement, options: TinyFaceDetectorOptions): Promise<any>; // Ensure options are of the correct type

  export function matchDimensions(canvas: HTMLCanvasElement, displaySize: { width: number; height: number }): void;
  export function resizeResults(detections: any, displaySize: { width: number; height: number }): any;
  export const draw: { // Corrected to use 'const' instead of 'function'

    drawDetections: (canvas: HTMLCanvasElement, detections: any) => void;
    drawFaceExpressions: (canvas: HTMLCanvasElement, detections: any, minProbability: number) => void;
  };
}
