export function playClick() {
  const audio = new AudioContext();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.frequency.value = 600;
  gain.gain.value = 0.1;
  osc.start();
  osc.stop(audio.currentTime + 0.08);
}

export function playSuccess() {
  const audio = new AudioContext();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.frequency.setValueAtTime(500, audio.currentTime);
  osc.frequency.setValueAtTime(800, audio.currentTime + 0.1);
  osc.frequency.setValueAtTime(1200, audio.currentTime + 0.2);
  gain.gain.value = 0.15;
  osc.start();
  osc.stop(audio.currentTime + 0.35);
}
