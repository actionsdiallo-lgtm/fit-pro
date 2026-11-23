export type CoachLanguage =
  | "fr"
  | "en"
  | "es"
  | "de"
  | "it"
  | "pt"
  | "ar"
  | "wo";

export interface CoachCueInput {
  language: CoachLanguage;
  event: "start_exercise" | "phase_tip" | "rest" | "next_exercise" | "complete";
  exerciseName: string;
  phaseText?: string;
  secondsRemaining?: number;
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

const TEMPLATES: Record<
  CoachLanguage,
  Record<CoachCueInput["event"], (input: CoachCueInput) => string>
> = {
  fr: {
    start_exercise: ({ exerciseName }) =>
      `C'est parti pour ${exerciseName}. Gardez une posture contrôlée.`,
    phase_tip: ({ phaseText }) =>
      phaseText || "Maintenez le rythme et respirez régulièrement.",
    rest: ({ secondsRemaining }) =>
      `Temps de repos${secondsRemaining ? ` : ${secondsRemaining} secondes` : ""}. Récupérez calmement.`,
    next_exercise: ({ exerciseName }) =>
      `Prochain exercice : ${exerciseName}. Préparez-vous.`,
    complete: () =>
      "Séance terminée ! Excellent travail, votre progression est enregistrée.",
  },
  en: {
    start_exercise: ({ exerciseName }) =>
      `Let's start ${exerciseName}. Keep a controlled form.`,
    phase_tip: ({ phaseText }) =>
      phaseText || "Keep steady rhythm and breathe consistently.",
    rest: ({ secondsRemaining }) =>
      `Rest time${secondsRemaining ? `: ${secondsRemaining} seconds` : ""}. Recover smoothly.`,
    next_exercise: ({ exerciseName }) =>
      `Next exercise: ${exerciseName}. Get ready.`,
    complete: () =>
      "Workout complete! Great job, your progress is saved.",
  },
  es: {
    start_exercise: ({ exerciseName }) =>
      `Empezamos con ${exerciseName}. Mantén una postura controlada.`,
    phase_tip: ({ phaseText }) =>
      phaseText || "Mantén el ritmo y respira con regularidad.",
    rest: ({ secondsRemaining }) =>
      `Descanso${secondsRemaining ? `: ${secondsRemaining} segundos` : ""}. Recupérate con calma.`,
    next_exercise: ({ exerciseName }) =>
      `Siguiente ejercicio: ${exerciseName}. Prepárate.`,
    complete: () =>
      "¡Sesión completada! Buen trabajo, tu progreso está guardado.",
  },
  de: {
    start_exercise: ({ exerciseName }) =>
      `Los geht's mit ${exerciseName}. Achte auf eine saubere Haltung.`,
    phase_tip: ({ phaseText }) =>
      phaseText || "Halte ein gleichmäßiges Tempo und atme ruhig.",
    rest: ({ secondsRemaining }) =>
      `Pause${secondsRemaining ? `: ${secondsRemaining} Sekunden` : ""}. Erhole dich ruhig.`,
    next_exercise: ({ exerciseName }) =>
      `Nächste Übung: ${exerciseName}. Mach dich bereit.`,
    complete: () =>
      "Training abgeschlossen! Starke Leistung, dein Fortschritt ist gespeichert.",
  },
  it: {
    start_exercise: ({ exerciseName }) =>
      `Iniziamo con ${exerciseName}. Mantieni una postura controllata.`,
    phase_tip: ({ phaseText }) =>
      phaseText || "Mantieni un ritmo costante e respira regolarmente.",
    rest: ({ secondsRemaining }) =>
      `Recupero${secondsRemaining ? `: ${secondsRemaining} secondi` : ""}. Riprendi fiato.`,
    next_exercise: ({ exerciseName }) =>
      `Prossimo esercizio: ${exerciseName}. Preparati.`,
    complete: () =>
      "Allenamento completato! Ottimo lavoro, i tuoi progressi sono salvati.",
  },
  pt: {
    start_exercise: ({ exerciseName }) =>
      `Vamos começar ${exerciseName}. Mantém uma postura controlada.`,
    phase_tip: ({ phaseText }) =>
      phaseText || "Mantém o ritmo e respira de forma constante.",
    rest: ({ secondsRemaining }) =>
      `Descanso${secondsRemaining ? `: ${secondsRemaining} segundos` : ""}. Recupera com calma.`,
    next_exercise: ({ exerciseName }) =>
      `Próximo exercício: ${exerciseName}. Prepara-te.`,
    complete: () =>
      "Treino concluído! Excelente trabalho, o teu progresso foi guardado.",
  },
  ar: {
    start_exercise: ({ exerciseName }) =>
      `لنبدأ تمرين ${exerciseName}. حافظ على وضعية صحيحة ومتحكم بها.`,
    phase_tip: ({ phaseText }) =>
      phaseText || "حافظ على إيقاع ثابت وتنفس بانتظام.",
    rest: ({ secondsRemaining }) =>
      `وقت الراحة${secondsRemaining ? `: ${secondsRemaining} ثانية` : ""}. التقط أنفاسك.`,
    next_exercise: ({ exerciseName }) =>
      `التمرين التالي: ${exerciseName}. استعد.`,
    complete: () =>
      "اكتملت الحصة! عمل رائع وتم حفظ تقدمك.",
  },
  wo: {
    start_exercise: ({ exerciseName }) =>
      `Dañuy tambali ${exerciseName}. Toppal sa taxawaay bu baax.`,
    phase_tip: ({ phaseText }) =>
      phaseText || "Wëyal sa doxalin te nga noyyi bu baax.",
    rest: ({ secondsRemaining }) =>
      `Noppalu${secondsRemaining ? ` : ${secondsRemaining} saa` : ""}. Nokk sa noyyi.`,
    next_exercise: ({ exerciseName }) =>
      `Éggalekaay bi ci topp : ${exerciseName}. Waajlal.`,
    complete: () =>
      "Jàng bi jeex na ! Jëf ju rafet, sa yokkute denc nañu ko.",
  },
};

export function buildCoachMessage(input: CoachCueInput): string {
  const langPack = TEMPLATES[input.language] || TEMPLATES.fr;
  const builder = langPack[input.event];
  return builder(input);
}

export function stopVoiceCoach(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }
  window.speechSynthesis.cancel();
}

export function speakCoachCue(
  input: CoachCueInput,
  options?: { enabled?: boolean; rate?: number; pitch?: number }
): string {
  const message = buildCoachMessage(input);
  const enabled = options?.enabled ?? true;

  if (!enabled) {
    return message;
  }

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return message;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = LOCALE_MAP[input.language] || "fr-FR";
    utterance.rate = options?.rate ?? 1;
    utterance.pitch = options?.pitch ?? 1;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) =>
      v.lang.toLowerCase().startsWith(utterance.lang.slice(0, 2).toLowerCase())
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech synthesis errors on restricted devices
  }

  return message;
    }
  
