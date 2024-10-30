import * as tf from '@tensorflow/tfjs';
import { AUDIO_RANGES } from './types';

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/5UM9CXpEc/";

let model: any = null;

export const loadModel = async () => {
  if (!model) {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    model = await window.tmImage.load(modelURL, metadataURL);
  }
  return model;
};

export const predictFromImage = async (imageElement: HTMLImageElement) => {
  if (!model) {
    model = await loadModel();
  }
  const predictions = await model.predict(imageElement);
  const bestPrediction = predictions.reduce((prev: any, current: any) => 
    (prev.probability > current.probability) ? prev : current
  );
  
  if (bestPrediction.probability >= 0.5) {
    return {
      animal: bestPrediction.className,
      confidence: bestPrediction.probability,
      audioRange: AUDIO_RANGES[bestPrediction.className],
      timestamp: new Date()
    };
  }
  return null;
};

export const setupWebcam = async () => {
  const flip = true;
  const webcam = new window.tmImage.Webcam(400, 400, flip);
  await webcam.setup();
  return webcam;
};