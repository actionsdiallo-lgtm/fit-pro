"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import SmartVideoPlayer, {
  type SynchronizedVideoStep,
} from "@/components/SmartVideoPlayer";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

interface WorkoutItem {
  id: number;
  title: string;
  cat: "Musculation" | "Cardio" | "Yoga";
  level: string;
  durationMinutes: number;
  caloriesBurned: number;
  img: string;
  videoUrl: string | null;
  desc: string;
  steps: SynchronizedVideoStep[];
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
      it: "Rispetta il tempo di recupero prima della serie successiva.",
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
    title: "Full Body Débutant",
    cat: "Musculation",
    level: "Débutant",
    durationMinutes: 30,
    caloriesBurned: 280,
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    videoUrl: null,
    desc: "Tout le corps, sans matériel. Parfait pour commencer.",
    steps: DEFAULT_STEPS,
  },
  {
    id: 2,
    title: "HIIT Brûle-Graisse",
    cat: "Cardio",
    level: "Intermédiaire",
    durationMinutes: 25,
    caloriesBurned: 350,
    img: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80",
    videoUrl: null,
    desc: "Intervalles intenses pour brûler un maximum.",
    steps: DEFAULT_STEPS,
  },
  {
    id: 3,
    title: "Push - Pecs / Épaules",
    cat: "Musculation",
    level: "Avancé",
    durationMinutes: 45,
    caloriesBurned: 420,
    img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
    videoUrl: null,
    desc: "Poussée, développé, dips. Pour prendre du volume.",
    steps: DEFAULT_STEPS,
  },
  {
    id: 4,
    title: "Yoga Flow Matin",
    cat: "Yoga",
    level: "Débutant",
    durationMinutes: 20,
    caloriesBurned: 120,
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    videoUrl: null,
    desc: "Réveil en douceur, mobilité et respiration.",
    steps: DEFAULT_STEPS,
  },
  {
    id: 5,
    title: "Leg Day Puissance",
    cat: "Musculation",
    level: "Avancé",
    durationMinutes: 50,
    caloriesBurned: 500,
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    videoUrl: null,
    desc: "Squats, fentes, mollets. Jambes en feu.",
    steps: DEFAULT_STEPS,
  },
  {
    id: 6,
    title: "Cardio Danse Fun",
    cat: "Cardio",
    level: "Débutant",
    durationMinutes: 30,
    caloriesBurned: 300,
    img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80",
    videoUrl: null,
    desc: "Cardio en musique, sans s'ennuyer.",
    steps: DEFAULT_STEPS,
  },
];

export default function Entrainement() {
  const playerSectionRef = useRef<HTMLElement | null>(null);
  const [filter, setFilter] = useState<string>("Tous");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [completedTitles, setCompletedTitles] = useState<string[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutItem | null>(
    null
  );

  const loadUserWorkouts = useCallback(async () => {
    setLoading(true);
    setStatusMsg(null);
    if (!supabase) {
      setUserId(null);
      setCompletedTitles([]);
      setLoading(false);
      return;
    }

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setUserId(null);
        setCompletedTitles([]);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("workouts")
        .select("id, title, duration_minutes, calories_burned, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const rows: UserWorkoutRow[] = data ?? [];
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
    } finally {
      setLoading(false);
    }
  }, []);

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
    if (!supabase || !userId) {
      setStatusMsg(
        "Connectez-vous à votre compte FIT PRO pour enregistrer vos séances."
      );
      return;
    }

    setSavingId(workout.id);
    setStatusMsg(null);

    try {
      const { error } = await supabase.from("workouts").insert({
        user_id: userId,
        title: workout.title,
        duration_minutes: workout.durationMinutes,
        calories_burned: workout.caloriesBurned,
      });

      if (error) {
        throw new Error(error.message);
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
    filter === "Tous"
      ? WORKOUTS
      : WORKOUTS.filter((w) => w.cat === filter);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <Link href="/" className="text-gray-400 text-sm hover:text-lime-400">
          ← Retour
        </Link>
        <h1 className="text-3xl md:text-5xl font-black mt-4">ENTRAÎNEMENT</h1>

        {loading ? (
          <p className="text-gray-400 mt-2 text-sm">
            Chargement de votre suivi personnel...
          </p>
        ) : userId ? (
          <p className="text-gray-400 mt-2 text-sm">
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
                  Lecteur vidéo intelligent
                </p>
                <h2 className="text-xl font-black mt-0.5">
                  {selectedWorkout.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWorkout(null)}
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-200"
              >
                Fermer
              </button>
            </div>

            <SmartVideoPlayer
              title={selectedWorkout.title}
              videoUrl={selectedWorkout.videoUrl}
              posterUrl={selectedWorkout.img}
              steps={selectedWorkout.steps}
              userId={userId}
            />
          </section>
        )}

        <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
          {["Tous", "Musculation", "Cardio", "Yoga"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                filter === c
                  ? "bg-lime-400 text-black"
                  : "bg-white/10 text-white"
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

            return (
              <div
                key={w.id}
                className="bg-[#1A1A1A] rounded-3xl overflow-hidden border border-white/10"
              >
                <div className="relative h-48">
                  <img
                    src={w.img}
                    className="w-full h-full object-cover"
                    alt={w.title}
                  />
                  <span className="absolute top-3 left-3 bg-black/70 px-3 py-1 rounded-full text-xs font-bold">
                    {w.cat}
                  </span>
                  {countForWorkout > 0 && (
                    <span className="absolute top-3 right-3 bg-lime-400 text-black px-3 py-1 rounded-full text-xs font-black">
                      ✓ {countForWorkout}x FAIT
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-black text-lg">{w.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{w.desc}</p>
                  <div className="flex gap-2 mt-3 text-xs text-gray-300">
                    <span className="bg-white/10 px-2 py-1 rounded-full">
                      {w.level}
                    </span>
                    <span className="bg-white/10 px-2 py-1 rounded-full">
                      {w.durationMinutes} min
                    </span>
                    <span className="bg-white/10 px-2 py-1 rounded-full">
                      {w.caloriesBurned} kcal
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedWorkout(w)}
                      className="w-full py-2.5 rounded-full font-bold text-xs bg-white/10 text-white hover:bg-white/15"
                    >
                      Ouvrir le lecteur vidéo
                    </button>

                    <button
                      type="button"
                      disabled={savingId === w.id}
                      onClick={() => handleLogWorkout(w)}
                      className="w-full py-3 rounded-full font-black text-sm bg-lime-400 text-black disabled:opacity-60"
                    >
                      {savingId === w.id
                        ? "Enregistrement..."
                        : "✓ ENREGISTRER LA SÉANCE"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
      }
      
