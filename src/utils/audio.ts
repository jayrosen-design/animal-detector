export const playFrequency = (frequency: number, durationMs: number = 3000) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Convert kHz to Hz
  oscillator.frequency.value = frequency * 1000;
  
  // Start with 0 volume and fade in
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
  
  // Start playing
  oscillator.start(audioContext.currentTime);
  
  // Fade out and stop
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + (durationMs / 1000));
  oscillator.stop(audioContext.currentTime + (durationMs / 1000));
};