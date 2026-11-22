"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import SmartVideoPlayer, {
  type SynchronizedVideoStep,
} from "@/components/SmartVideoPlayer";

type TrainingFocus =
  | "Tous"
  | "Poitrine"
  | "Avant-bras"
  | "Bras"
  | "Abdos"
  | "Jambes"
  | "Brûlez les graisses"
  | "Rester en forme";

interface ExercisePreview {
  name: string;
  target: string;
  poseSvg: "jacks" | "squat" | "press" | "plank" | "stretch";
}

interface WorkoutItem {
  id: number;
  title: string;
  cat: "Musculation" | "Cardio" | "Yoga";
  focus: Exclude<TrainingFocus, "Tous">;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  durationMinutes: number;
  caloriesBurned: number;
  exerciseCount: number;
  img: string;
  desc: string;
  videoUrl: string | null;
  steps: SynchronizedVideoStep[];
  exercises: ExercisePreview[];
}

interface UserWorkoutRow {
  id: string;
  title?: string | null;
  duration_minutes?: number | null;
  calories_burned?: number | null;
  created_at: string;
}

const DEFAULT_STEPS: SynchronizedVideoStep[] = [
  {
    id: "step-1",
    phase: "presentation",
    label: "1. Présentation de l'exercice",
    startSec: 0,
    endSec: 8,
    captions: {
      fr: "Présentation de l'exercice et des groupes musculaires sollicités.",
      en: "Exercise overview and targeted muscle groups.",
      es: "Presentación del ejercicio y los grupos musculares trabajados.",
      pt: "Apresentação do exercício e dos grupos musculares trabalhados.",
      ar: "تقديم التمرين والمجموعات العضلية المستهدفة.",
      de: "Vorstellung der Übung und der beanspruchten Muskelgruppen.",
      it: "Presentazione dell'esercizio e dei gruppi muscolari coinvolti.",
    },
  },
  {
    id: "step-2",
    phase: "start_position",
    label: "2. Position de départ",
    startSec: 8,
    endSec: 16,
    captions: {
      fr: "Placez-vous en position de départ stable, buste gainé et appuis solides.",
      en: "Set a stable starting position with a braced core and solid footing.",
      es: "Colócate en una posición inicial estable, con el core activado y buen apoyo.",
      pt: "Assuma uma posição inicial estável, abdômen firme e bom apoio.",
      ar: "اتخذ وضعية بداية ثابتة مع شد الجذع وتثبيت الارتكاز.",
      de: "Nimm eine stabile Ausgangsposition mit aktivierter Rumpfspannung ein.",
      it: "Assumi una posizione di partenza stabile con core attivo e appoggi saldi.",
    },
  },
  {
    id: "step-3",
    phase: "movement",
    label: "3. Démonstration du mouvement",
    startSec: 16,
    endSec: 28,
    captions: {
      fr: "Exécutez le mouvement avec amplitude contrôlée sans à-coup.",
      en: "Perform the movement through a controlled range of motion without jerking.",
      es: "Ejecuta el movimiento con amplitud controlada y sin tirones.",
      pt: "Execute o movimento com amplitude controlada e sem trancos.",
      ar: "نفّذ الحركة بمدى متحكم فيه دون اندفاع مفاجئ.",
      de: "Führe die Bewegung kontrolliert ohne Schwung aus.",
      it: "Esegui il movimento con ampiezza controllata e senza strappi.",
    },
  },
  {
    id: "step-4",
    phase: "breathing",
    label: "4. Respiration",
    startSec: 28,
    endSec: 36,
    captions: {
      fr: "Inspirez lors de la phase excentrique et expirez sur l'effort.",
      en: "Inhale on the lowering phase and exhale on exertion.",
      es: "Inhala al bajar y exhala durante el esfuerzo.",
      pt: "Inspire na fase de descida e expire no esforço.",
      ar: "استنشق عند النزول وازفر أثناء بذل الجهد.",
      de: "Atme beim Absenken ein und bei der Belastung aus.",
      it: "Inspira nella fase di discesa ed espira durante lo sforzo.",
    },
  },
  {
    id: "step-5",
    phase: "reps",
    label: "5. Répétitions",
    startSec: 36,
    endSec: 44,
    captions: {
      fr: "Enchaînez vos répétitions à un rythme régulier adapté à votre niveau.",
      en: "Complete your repetitions at a steady pace suited to your level.",
      es: "Completa tus repeticiones a un ritmo constante adaptado a tu nivel.",
      pt: "Complete as repetições em um ritmo constante adequado ao seu nível.",
      ar: "أكمل التكرارات بإيقاع منتظم يناسب مستواك.",
      de: "Absolviere die Wiederholungen in einem gleichmäßigen Tempo.",
      it: "Completa le ripetizioni con un ritmo costante adatto al tuo livello.",
    },
  },
  {
    id: "step-6",
    phase: "rest",
    label: "6. Temps de repos",
    startSec: 44,
    endSec: 52,
    captions: {
      fr: "Respectez votre temps de récupération avant la série suivante.",
      en: "Take your rest period before starting the next set.",
      es: "Respeta el tiempo de descanso antes de la siguiente serie.",
      pt: "Respeite o tempo de descanso antes da próxima série.",
      ar: "التزم بوقت الراحة قبل بدء المجموعة التالية.",
      de: "Halte deine Pause vor dem nächsten Satz ein.",
      it: "Rispetta il tempo de recupero prima della serie successiva.",
    },
  },
  {
    id: "step-7",
    phase: "safety",
    label: "7. Conseils de sécurité",
    startSec: 52,
    endSec: 60,
    captions: {
      fr: "Gardez le dos neutre et arrêtez immédiatement en cas de douleur articulaire.",
      en: "Keep a neutral spine and stop immediately if you feel joint pain.",
      es: "Mantén la espalda neutra y detente de inmediato ante dolor articular.",
      pt: "Mantenha a coluna neutra e pare imediatamente se sentir dor articular.",
      ar: "حافظ على استقامة الظهر وتوقف فوراً عند الشعور بألم في المفاصل.",
      de: "Halte den Rücken neutral und brich bei Gelenkschmerzen sofort ab.",
      it: "Mantieni la schiena neutra e fermati subito in caso di dolore articolare.",
    },
  },
];

const WORKOUTS: WorkoutItem[] = [
  {
    id: 1,
    title: "Poitrine Débutant",
    cat: "Musculation",
    focus: "Poitrine",
    level: "Débutant",
    durationMinutes: 11,
    caloriesBurned: 140,
    exerciseCount: 11,
    img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
    desc: "Pompes mains surélevées et pompes sur les genoux pour débuter.",
    videoUrl: null,
    steps: DEFAULT_STEPS,
    exercises: [
      { name: "Jumping jacks", target: "00:30", poseSvg: "jacks" },
      { name: "Pompes mains surélevées", target: "x16", poseSvg: "press" },
      { name: "Pompes sur les genoux", target: "x12", poseSvg: "plank" },
    ],
  },
  {
    id: 2,
    title: "Poitrine Intermédiaire & Avancé",
    cat: "Musculation",
    focus: "Poitrine",
    level: "Intermédiaire",
    durationMinutes: 19,
    caloriesBurned: 260,
    exerciseCount: 16,
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    desc: "Travail complet des pectoraux avec amplitude contrôlée.",
    videoUrl: null,
    steps: DEFAULT_STEPS,
    exercises: [
      { name: "Jumping jacks", target: "00:30", poseSvg: "jacks" },
      { name: "Pompes classiques", target: "x14", poseSvg: "press" },
      { name: "Pompes piquées", target: "x14", poseSvg: "press" },
    ],
  },
  {
    id: 3,
    title: "Avant-bras Débutant à Avancé",
    cat: "Musculation",
    focus: "Avant-bras",
    level: "Intermédiaire",
    durationMinutes: 20,
    caloriesBurned: 190,
    exerciseCount: 24,
    img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    desc: "Renforcement de la prise, des poignets et des avant-bras.",
    videoUrl: null,
    steps: DEFAULT_STEPS,
    exercises: [
      { name: "Élévation latérale", target: "x10", poseSvg: "press" },
      { name: "Flexion marteau", target: "x12", poseSvg: "jacks" },
      { name: "Étirement poignets", target: "00:20", poseSvg: "stretch" },
    ],
  },
  {
    id: 4,
    title: "Bras Débutant à Avancé",
    cat: "Musculation",
    focus: "Bras",
    level: "Avancé",
    durationMinutes: 25,
    caloriesBurned: 290,
    exerciseCount: 25,
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    desc: "Dips triceps, cercles de bras et gainage dynamique.",
    videoUrl: null,
    steps: DEFAULT_STEPS,
    exercises: [
      { name: "Cercles de bras", target: "x30", poseSvg: "jacks" },
      { name: "Triceps dips sur chaise", target: "x12", poseSvg: "squat" },
      { name: "Sauter sans corde", target: "00:30", poseSvg: "jacks" },
    ],
  },
  {
    id: 5,
    title: "Abdos & Ceinture Abdominale",
    cat: "Cardio",
    focus: "Abdos",
    level: "Intermédiaire",
    durationMinutes: 22,
    caloriesBurned: 240,
    exerciseCount: 21,
    img: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80",
    desc: "Toucher les talons, crunchs croisés et pont latéral.",
    videoUrl: null,
    steps: DEFAULT_STEPS,
    exercises: [
      { name: "Toucher les talons", target: "x26", poseSvg: "plank" },
      { name: "Crunchs croisés", target: "x20", poseSvg: "plank" },
      { name: "Pont latéral", target: "x20", poseSvg: "plank" },
    ],
  },
  {
    id: 6,
    title: "Jambes & Fessiers Puissance",
    cat: "Musculation",
    focus: "Jambes",
    level: "Intermédiaire",
    durationMinutes: 33,
    caloriesBurned: 380,
    exerciseCount: 36,
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    desc: "Squats, fentes, sauts latéraux et renforcement du bas du corps.",
    videoUrl: null,
    steps: DEFAULT_STEPS,
    exercises: [
      { name: "Squats", target: "x14", poseSvg: "squat" },
      { name: "Saut de côté", target: "00:30", poseSvg: "jacks" },
      { name: "Fente avec torsion", target: "x10", poseSvg: "squat" },
    ],
  },
  {
    id: 7,
    title: "HIIT Brûle-Graisse",
    cat: "Cardio",
    focus: "Brûlez les graisses",
    level: "Intermédiaire",
    durationMinutes: 25,
    caloriesBurned: 350,
    exerciseCount: 18,
    img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80",
    desc: "Intervalles dynamiques pour maximiser la dépense calorique.",
    videoUrl: null,
    steps: DEFAULT_STEPS,
    exercises: [
      { name: "Jumping jacks", target: "00:30", poseSvg: "jacks" },
      { name: "Squats avec saut", target: "x15", poseSvg: "squat" },
      { name: "Gainage actif", target: "00:40", poseSvg: "plank" },
    ],
  },
  {
    id: 8,
    title: "Mobilité & Rester en forme",
    cat: "Yoga",
    focus: "Rester en forme",
    level: "Débutant",
    durationMinutes: 20,
    caloriesBurned: 120,
    exerciseCount: 12,
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    desc: "Étirements doux du dos et du bas du corps pour la souplesse.",
    videoUrl: null,
    steps: DEFAULT_STEPS,
    exercises: [
      { name: "Étirement du dos", target: "00:45", poseSvg: "stretch" },
      { name: "Étirement bas du corps", target: "00:45", poseSvg: "stretch" },
      { name: "Respiration profonde", target: "00:30", poseSvg: "jacks" },
    ],
  },
];

function MovementIllustration({ pose }: { pose: ExercisePreview["poseSvg"] }) {
  return (
    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
      <svg
        viewBox="0 0 48 48"
        className="w-9 h-9 text-lime-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {pose === "jacks" && (
          <>
            <circle cx="24" cy="9" r="3.5" />
            <path d="M24 13v12" />
            <path d="M24 16L12 8M24 16l12-8" />
            <path d="M24 25l-9 14M24 25l9 14" />
          </>
        )}
        {pose === "squat" && (
          <>
            <circle cx="22" cy="11" r="3.5" />
            <path d="M22 15l6 10-7 6" />
            <path d="M25 18h10" />
            <path d="M21 31l-4 9M21 31l6 9" />
          </>
        )}
        {pose === "press" && (
          <>
            <circle cx="35" cy="21" r="3.5" />
            <path d="M32 23L19 25l-9 5" />
            <path d="M25 24l2 12" />
          </>
        )}
        {pose === "plank" && (
          <>
            <circle cx="37" cy="23" r="3.5" />
            <path d="M34 25L12 31" />
            <path d="M30 26l-2 10M12 31l-2 5" />
          </>
        )}
        {pose === "stretch" && (
          <>
            <circle cx="16" cy="22" r="3.5" />
            <path d="M19 24l12 8h10" />
            <path d="M22 26l13-3" />
          </>
        )}
      </svg>
    </div>
  );
}

const FOCUS_LIST: TrainingFocus[] = [
  "Tous",
  "Poitrine",
  "Avant-bras",
  "Bras",
  "Abdos",
  "Jambes",
  "Brûlez les graisses",
  "Rester en forme",
];

export default function Entrainement() {
  const { data: session, status } = useSession();
  const playerSectionRef = useRef<HTMLElement | null>(null);
  const [focusFilter, setFocusFilter] = useState<TrainingFocus>("Tous");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [completedTitles, setCompletedTitles] = useState<string[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutItem | null>(
    null
  );

  const userId =
    (session?.user as { id?: string } | undefined)?.id ??
    session?.user?.email ??
    null;

  const loadUserWorkouts = useCallback(async () => {
    if (status === "loading") return;

    if (!userId) {
      setCompletedTitles([]);
      return;
    }

    setStatusMsg(null);
    try {
      const res = await fetch("/api/workouts", { cache: "no-store" });
      if (!res.ok) {
        return;
      }
      const data = await res.json().catch(() => null);
      const rows: UserWorkoutRow[] = Array.isArray(data?.workouts)
        ? data.workouts
        : Array.isArray(data)
          ? data
          : [];
      const titles = rows
        .map((r) => r.title)
        .filter((t): t is string => Boolean(t));
      setCompletedTitles(titles);
    } catch (err) {
      setStatusMsg(
        err instanceof Error
          ? err.message
          : "Impossible de charger vos séances enregistrées."
      );
    }
  }, [status, userId]);

  useEffect(() => {
    loadUserWorkouts();
  }, [loadUserWorkouts]);

  useEffect(() => {
    if (selectedWorkout && playerSectionRef.current) {
      playerSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedWorkout]);

  const handleLogWorkout = async (workout: WorkoutItem) => {
    if (!userId) {
      setStatusMsg(
        "Connectez-vous à votre compte FIT PRO pour enregistrer vos séances."
      );
      return;
    }

    setSavingId(workout.id);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: workout.title,
          duration_minutes: workout.durationMinutes,
          calories_burned: workout.caloriesBurned,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.error || "Erreur lors de l'enregistrement de la séance."
        );
      }

      setCompletedTitles((prev) => [workout.title, ...prev]);
      setStatusMsg(`Séance "${workout.title}" enregistrée dans votre compte.`);
    } catch (err) {
      setStatusMsg(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'enregistrement de la séance."
      );
    } finally {
      setSavingId(null);
    }
  };

  const filtered =
    focusFilter === "Tous"
      ? WORKOUTS
      : WORKOUTS.filter((w) => w.focus === focusFilter);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <Link href="/" className="text-gray-400 text-sm hover:text-lime-400">
          ← Retour
        </Link>
        <h1 className="text-3xl md:text-5xl font-black mt-4">ENTRAÎNEMENT</h1>
        <p className="text-gray-400 text-sm mt-1">
          Choisissez votre entraînement, visualisez les mouvements et suivez la
          vidéo guidée étape par étape.
        </p>

        {status === "loading" ? (
          <p className="text-gray-400 mt-3 text-sm">
            Chargement de votre suivi personnel...
          </p>
        ) : userId ? (
          <p className="text-lime-400 mt-3 text-sm font-semibold">
            {completedTitles.length} séance(s) enregistrée(s) sur votre compte
          </p>
        ) : (
          <div className="mt-3 rounded-2xl border border-amber-500/30 bg-amber-950/40 p-3 text-xs text-amber-200 flex items-center justify-between gap-3">
            <span>
              Connectez-vous pour enregistrer et consulter vos séances
              personnelles.
            </span>
            <Link
              href="/login"
              className="rounded-lg bg-lime-400 px-3 py-1.5 font-bold text-black whitespace-nowrap"
            >
              Connexion
            </Link>
          </div>
        )}

        {statusMsg && (
          <p className="mt-3 rounded-xl border border-white/10 bg-[#151515] px-4 py-2.5 text-xs text-lime-300">
            {statusMsg}
          </p>
        )}

        {selectedWorkout && (
          <section
            ref={playerSectionRef}
            className="mt-6 rounded-3xl border border-lime-400/30 bg-[#141414] p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-lime-400 uppercase">
                  Vidéo &amp; mouvements guidés • {selectedWorkout.focus}
                </p>
                <h2 className="text-xl md:text-2xl font-black mt-0.5">
                  {selectedWorkout.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWorkout(null)}
                className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-gray-200 hover:bg-white/15"
              >
                Fermer
              </button>
            </div>

            <div className="mt-4">
              <SmartVideoPlayer
                title={selectedWorkout.title}
                videoUrl={selectedWorkout.videoUrl}
                posterUrl={selectedWorkout.img}
                steps={selectedWorkout.steps}
                userId={userId}
              />
            </div>

            <div className="mt-5 grid sm:grid-cols-3 gap-3">
              {selectedWorkout.exercises.map((ex) => (
                <div
                  key={ex.name}
                  className="flex items-center gap-3 rounded-2xl bg-[#1C1C1C] border border-white/10 p-3"
                >
                  <MovementIllustration pose={ex.poseSvg} />
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{ex.name}</p>
                    <p className="text-xs text-lime-400 font-semibold mt-0.5">
                      {ex.target}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
          {FOCUS_LIST.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFocusFilter(c)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${
                focusFilter === c
                  ? "bg-lime-400 text-black"
                  : "bg-white/10 text-white hover:bg-white/15"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {filtered.map((w) => {
            const countForWorkout = completedTitles.filter(
              (t) => t === w.title
            ).length;

                    </div>
            );
          })}
        </div>
      </div>
    </div>
  );
    }
                        
