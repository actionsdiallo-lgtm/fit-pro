export type CoachLanguage = "fr" | "en" | "es" | "pt" | "ar";

export interface VoiceCoachOptions {
  lang?: CoachLanguage | string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

const LOCALE_MAP: Record<string, string> = {
  fr: "fr-FR",
  en: "en-US",
  es: "es-ES",
  pt: "pt-PT",
  ar: "ar-SA",
};

export function resolveCoachLocale(lang?: string): string {
  if (!lang) return "fr-FR";
  const normalized = lang.toLowerCase();
  return LOCALE_MAP[normalized] ?? lang;
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
  const locale = resolveCoachLocale(options.lang);
  utterance.lang = locale;
  utterance.rate = options.rate ?? 1;
  utterance.pitch = options.pitch ?? 1;
  utterance.volume = options.volume ?? 1;

  const voices = window.speechSynthesis.getVoices();
  const prefix = locale.slice(0, 2).toLowerCase();
  const matchedVoice = voices.find((v) =>
    v.lang.toLowerCase().startsWith(prefix)
  );
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}
