export interface Detection {
  timestamp: Date;
  animal: string;
  confidence: number;
  audioRange: string;
}

export interface AnimalAudioRange {
  [key: string]: string;
}

export const AUDIO_RANGES: AnimalAudioRange = {
  Deer: "2-5 kHz",
  Squirrel: "0.5-10 kHz",
  Armadillo: "1-4 kHz",
  Opossum: "0.8-7 kHz",
  Cat: "48-85 kHz",
  Dog: "67-45 kHz",
  Raccoon: "0.3-8 kHz",
  Rabbit: "5-10 kHz",
};