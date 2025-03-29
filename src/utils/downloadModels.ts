import * as faceapi from 'face-api.js';

export async function downloadModels() {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models/face_expression_model-weights_manifest.json'),

      faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68_model-weights_manifest.json')

    ]);
    console.log('Face detection models downloaded successfully from /models directory');

  } catch (error) {
    console.error('Error downloading face detection models from /models directory:', error);

  }
}
