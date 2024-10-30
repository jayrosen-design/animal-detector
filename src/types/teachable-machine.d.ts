declare global {
  interface Window {
    tmImage: {
      load: (modelURL: string, metadataURL: string) => Promise<any>;
      Webcam: new (width: number, height: number, flip: boolean) => {
        setup: () => Promise<void>;
        play: () => Promise<void>;
        stop: () => void;
        update: () => void;
        canvas: HTMLCanvasElement;
      };
    };
  }
}

export {};