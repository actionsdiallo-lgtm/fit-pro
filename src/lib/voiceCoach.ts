export type CoachLanguage = "fr" | "en" | "es" | "de" | "it" | "pt" | "ar" | "wo";

export type CoachCueEvent =
  | "start_exercise"
  | "phase_tip"
  | "rest"
  | "next_exercise"
  | "complete";

export interface CoachCuePayload {
  language?: CoachLanguage;
  event?: CoachCueEvent;
  exerciseName?: string;
  phaseText?: string;
  secondsRemaining?: number;
}

export interface CoachCueOptions {
  enabled?: boolean;
  rate?: number;
  pitch?: number;
  volume?: number;
}

const LOCALE_MAP: Record<CoachLanguage, string> = {
  fr: "fr-FR",
  en: "en-US",
  es: "es-ES",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-PT",
  ar: "ar-SA",
  wo: "fr-FR",
};

function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopVoiceCoach(): void {
  if (!isSpeechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {}
}

function buildCueMessage(payload: CoachCuePayload): string {
  const { event, exerciseName, phaseText, secondsRemaining } = payload;

  if (event === "complete") {
    return phaseText || "Séance terminée, excellent travail.";
  }
  if (event === "rest") {
    const restText =
      typeof secondsRemaining === "number" && secondsRemaining > 0
        ? `Repos pendant ${secondsRemaining} secondes.`
        : "Temps de repos.";
    return phaseText ? `${restText} ${phaseText}` : restText;
  }
  if (event === "next_exercise") {
    const nextText = exerciseName ? `Exercice suivant : ${exerciseName}.` : "Exercice suivant.";
    return phaseText ? `${nextText} ${phaseText}` : nextText;
  }
  if (event === "phase_tip") {
    return phaseText || (exerciseName ? `Conseil pour ${exerciseName}.` : "");
  }

  const startText = exerciseName ? `${exerciseName}.` : "";
  return phaseText ? `${startText} ${phaseText}`.trim() : startText;
}

export function speakCoachCue(
  payload: CoachCuePayload,
  options: CoachCueOptions = {}
): void {
  if (options.enabled === false) return;
  if (!isSpeechSupported()) return;

  const message = buildCueMessage(payload).trim();
  if (!message) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    const langCode: CoachLanguage = payload.language ?? "fr";
    const locale = LOCALE_MAP[langCode] ?? "fr-FR";

    utterance.lang = locale;
    utterance.rate = options.rate ?? 1;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;

    const voices = window.speechSynthesis.getVoices();
    const prefix = locale.slice(0, 2).toLowerCase();
    const matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {}
}
