export const playFrequency = (frequency: number, durationMs: number = 3000) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Scale the frequency to an audible range (200-2000 Hz)
  // Map the original kHz range (0.3-85) to audible frequencies
  const normalizedFreq = ((frequency - 0.3) / (85 - 0.3)) * (2000 - 200) + 200;
  oscillator.frequency.value = normalizedFreq;
  
  // Start with 0 volume and fade in
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
  
  // Start playing
  oscillator.start(audioContext.currentTime);
  
  // Fade out and stop
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + (durationMs / 1000));
  oscillator.stop(audioContext.currentTime + (durationMs / 1000));
};