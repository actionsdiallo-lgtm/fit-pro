export interface VoiceCoachOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function isVoiceCoachSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopVoiceCoach(): void {
  if (!isVoiceCoachSupported()) return;
  window.speechSynthesis.cancel();
}

export function speakCoachMessage(
  text: string,
  options: VoiceCoachOptions = {}
): void {
  if (!isVoiceCoachSupported() || !text.trim()) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang ?? "fr-FR";
  utterance.rate = options.rate ?? 1;
  utterance.pitch = options.pitch ?? 1;
  utterance.volume = options.volume ?? 1;

  const voices = window.speechSynthesis.getVoices();
  const frenchVoice = voices.find((v) =>
    v.lang.toLowerCase().startsWith(utterance.lang.slice(0, 2).toLowerCase())
  );
  if (frenchVoice) {
    utterance.voice = frenchVoice;
  }

  window.speechSynthesis.speak(utterance);
}
