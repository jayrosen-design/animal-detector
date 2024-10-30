import { Detection } from './types';
import { AUDIO_RANGES } from './types';

// Using direct Google Storage URL to avoid CORS redirect issues
const MODEL_URL = "https://storage.googleapis.com/tm-model/5UM9CXpEc/";

let model: any = null;

export const loadModel = async () => {
  if (!model) {
    await new Promise((resolve) => {
      const checkTmImage = () => {
        if (window.tmImage) {
          resolve(true);
        } else {
          setTimeout(checkTmImage, 100);
        }
      };
      checkTmImage();
    });

    try {
      const modelURL = MODEL_URL + "model.json";
      const metadataURL = MODEL_URL + "metadata.json";
      
      model = await window.tmImage.load(modelURL, metadataURL);
    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error('Failed to load the animal detection model. Please try again later.');
    }
  }
  return model;
};

export const predictFromImage = async (imageElement: HTMLImageElement): Promise<Detection | null> => {
  try {
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
        timestamp: new Date(),
        imageUrl: imageElement.src
      };
    }
    return null;
  } catch (error) {
    console.error('Error during prediction:', error);
    throw error;
  }
};

interface TeachableMachineWebcam {
  setup: () => Promise<void>;
  play: () => Promise<void>;
  stop: () => void;
  update: () => void;
  canvas: HTMLCanvasElement;
}

export const setupWebcam = async () => {
  await loadModel(); // Ensure model is loaded before setting up webcam
  const flip = true;
  const webcam = new window.tmImage.Webcam(400, 400, flip) as TeachableMachineWebcam;
  await webcam.setup();
  return webcam;
};
