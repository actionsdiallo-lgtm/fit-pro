
"use client";

import React, { useEffect, useMemo, useState } from "react";
"use client";

import React, { useEffect, useMemo, useState } from "react";

function ExerciseVideo({
  animationUrl,
  exerciseName,
}: {
  animationUrl?: string;
  exerciseName: string;
}) {
  const [videoMissing, setVideoMissing] = useState(false);

  if (!animationUrl || videoMissing) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl bg-slate-100 p-6 text-center">
        <p className="text-lg font-semibold text-slate-800">
          Animation 2D indisponible
        </p>
        <p className="mt-2 text-sm text-slate-500">
          La vidéo de {exerciseName} n'a pas encore été ajoutée.
        </p>
      </div>
    );
  }

  return (
    <video
      key={animationUrl}
      src={animationUrl}
      autoPlay
      loop
      muted
      playsInline
      controls
      onError={() => setVideoMissing(true)}
      className="w-full rounded-2xl bg-white object-contain"
    />
  );
}

type Exercise = {
type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: number;
  duration?: number;
  level: string;
  equipment: string;
  muscle: string;
  animationUrl?: string;
  photoUrl?: string;
  instructions: string;
};

type Workout = {
  id: number;
  title: string;
  subtitle: string;
  duration: number;
  level: string;
  equipment: string;
  caloriesMin: number;
  caloriesMax: number;
  muscle: string;
  hasJump: boolean;
  image: string;
  exercises: Exercise[];
};

const photos = {
  full: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000",
  cardio: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000",
  upper: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1000",
  legs: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=1000",
  abs: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=1000",
  hiit: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1000",
  stretch: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1000",
  back: "https://images.unsplash.com/photo-1517838277536-f9a5a5f5b4d7?w=1000",
  arms: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1000",
  home: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1000",
};

const makeExercise = (
  id: string,
  name: string,
  sets: number,
  reps: number,
  rest: number,
  level: string,
  equipment: string,
  muscle: string,
  instructions: string,
  duration?: number
): Exercise => ({
  id,
  name,
  sets,
  reps,
  rest,
  level,
  equipment,
  muscle,
  instructions,
  duration,
});

export const workouts: Workout[] = [
  {
    id: 1,
    title: "Full Body Débutant",
    subtitle: "Renforce tout le corps à ton rythme.",
    duration: 18,
    level: "Débutant",
    equipment: "Aucun",
    caloriesMin: 90,
    caloriesMax: 150,
    muscle: "Corps entier",
    hasJump: false,
    image: photos.full,
    exercises: [
      makeExercise("1-1", "Squat", 3, 12, 30, "Débutant", "Aucun", "Jambes", "Garde le dos droit, descends en poussant les hanches vers l'arrière."),
      makeExercise("1-2", "Pompes sur les genoux", 3, 10, 30, "Débutant", "Tapis", "Pectoraux", "Garde le corps aligné et descends doucement."),
      makeExercise("1-3", "Fente avant", 3, 10, 30, "Débutant", "Aucun", "Jambes", "Avance un pied et fléchis les deux genoux sans perdre l'équilibre."),
      makeExercise("1-4", "Planche", 3, 30, 30, "Débutant", "Tapis", "Abdominaux", "Garde le corps aligné et contracte les abdominaux.", 30),
      makeExercise("1-5", "Mountain Climbers lents", 3, 20, 30, "Débutant", "Tapis", "Core", "En position de planche, ramène alternativement les genoux vers la poitrine.", 20),
    ],
  },
  {
    id: 2,
    title: "Full Body Intermédiaire",
    subtitle: "Une séance complète pour progresser.",
    duration: 25,
    level: "Intermédiaire",
    equipment: "Aucun",
    caloriesMin: 150,
    caloriesMax: 250,
    muscle: "Corps entier",
    hasJump: true,
    image: photos.cardio,
    exercises: [
      makeExercise("2-1", "Burpees sans saut", 3, 10, 30, "Intermédiaire", "Aucun", "Corps entier", "Place les mains au sol, recule les pieds et reviens debout."),
      makeExercise("2-2", "Pompes classiques", 3, 12, 30, "Intermédiaire", "Tapis", "Pectoraux", "Garde le corps droit et fléchis les coudes."),
      makeExercise("2-3", "Squat sauté", 3, 10, 40, "Intermédiaire", "Aucun", "Jambes", "Descends en squat puis saute verticalement en contrôlant la réception."),
      makeExercise("2-4", "Fente sautée", 3, 8, 40, "Intermédiaire", "Aucun", "Jambes", "Alterne les jambes avec une réception souple."),
      makeExercise("2-5", "Gainage dynamique", 3, 40, 30, "Intermédiaire", "Tapis", "Core", "Passe des avant-bras aux mains sans bouger les hanches.", 40),
    ],
  },
  {
    id: 3,
    title: "Haut du Corps",
    subtitle: "Travaille les pectoraux, bras et épaules.",
    duration: 22,
    level: "Intermédiaire",
    equipment: "Chaise",
    caloriesMin: 120,
    caloriesMax: 200,
    muscle: "Haut du corps",
    hasJump: false,
    image: photos.upper,
    exercises: [
      makeExercise("3-1", "Pompes larges", 4, 12, 30, "Intermédiaire", "Aucun", "Pectoraux", "Place les mains plus larges que les épaules."),
      makeExercise("3-2", "Pompes diamant", 3, 8, 30, "Intermédiaire", "Aucun", "Triceps", "Rapproche les mains sous la poitrine et descends avec contrôle."),
      makeExercise("3-3", "Pike Push-Up", 3, 10, 30, "Intermédiaire", "Aucun", "Épaules", "Forme un V inversé et fléchis les coudes."),
      makeExercise("3-4", "Dips sur chaise", 3, 12, 30, "Intermédiaire", "Chaise stable", "Triceps", "Descends doucement sans forcer les épaules."),
      makeExercise("3-5", "Superman", 3, 12, 30, "Intermédiaire", "Tapis", "Dos", "Allongé sur le ventre, soulève doucement les bras et les jambes."),
    ],
  },
  {
    id: 4,
    title: "Jambes & Fessiers",
    subtitle: "Renforce les jambes et les fessiers.",
    duration: 24,
    level: "Tous niveaux",
    equipment: "Aucun",
    caloriesMin: 120,
    caloriesMax: 210,
    muscle: "Jambes",
    hasJump: false,
    image: photos.legs,
    exercises: [
      makeExercise("4-1", "Squat sumo", 4, 15, 30, "Tous niveaux", "Aucun", "Jambes", "Écarte les pieds et oriente légèrement les pointes vers l'extérieur."),
      makeExercise("4-2", "Fente arrière", 3, 12, 30, "Tous niveaux", "Aucun", "Jambes", "Recule une jambe et descends verticalement."),
      makeExercise("4-3", "Pont fessier", 4, 15, 30, "Tous niveaux", "Tapis", "Fessiers", "Pousse sur les pieds et soulève le bassin."),
      makeExercise("4-4", "Donkey Kick", 3, 12, 30, "Tous niveaux", "Tapis", "Fessiers", "À quatre pattes, lève un pied vers le plafond sans cambrer le dos."),
      makeExercise("4-5", "Wall Sit", 3, 40, 30, "Tous niveaux", "Mur", "Jambes", "Maintiens la position assise contre un mur.", 40),
    ],
  },
  {
    id: 5,
    title: "Abdos & Core",
    subtitle: "Travaille la stabilité du centre du corps.",
    duration: 15,
    level: "Débutant",
    equipment: "Tapis",
    caloriesMin: 60,
    caloriesMax: 120,
    muscle: "Abdominaux",
    hasJump: false,
    image: photos.abs,
    exercises: [
      makeExercise("5-1", "Crunch", 3, 15, 20, "Débutant", "Tapis", "Abdominaux", "Soulève légèrement les épaules sans tirer sur la nuque."),
      makeExercise("5-2", "Leg Raises", 3, 12, 20, "Débutant", "Tapis", "Abdominaux", "Lève et abaisse les jambes en contrôlant le bas du dos."),
      makeExercise("5-3", "Russian Twist", 3, 20, 20, "Débutant", "Tapis", "Abdominaux", "Tourne le buste alternativement de chaque côté."),
      makeExercise("5-4", "Bicycle Crunch", 3, 20, 20, "Débutant", "Tapis", "Abdominaux", "Rapproche alternativement le coude du genou opposé."),
      makeExercise("5-5", "Dead Bug", 3, 10, 20, "Débutant", "Tapis", "Core", "Allonge un bras et la jambe opposée en gardant le dos stable."),
    ],
  },
];
         
workouts.push(
  {
    id: 6,
    title: "Cardio Brûle-Graisse HIIT",
    subtitle: "Améliore ton endurance avec des intervalles.",
    duration: 20,
    level: "Intermédiaire",
    equipment: "Aucun",
    caloriesMin: 130,
    caloriesMax: 230,
    muscle: "Corps entier",
    hasJump: true,
    image: photos.hiit,
    exercises: [
      makeExercise("6-1", "Jumping Jacks", 4, 30, 20, "Intermédiaire", "Aucun", "Cardio", "Écarte simultanément les bras et les jambes puis reviens.", 30),
      makeExercise("6-2", "High Knees", 4, 30, 20, "Intermédiaire", "Aucun", "Cardio", "Cours sur place en montant alternativement les genoux.", 30),
      makeExercise("6-3", "Skater", 3, 30, 20, "Intermédiaire", "Aucun", "Jambes", "Saute latéralement d'un pied à l'autre.", 30),
      makeExercise("6-4", "Burpees", 3, 8, 30, "Intermédiaire", "Aucun", "Corps entier", "Enchaîne la position au sol et le retour debout."),
      makeExercise("6-5", "Squat to Punch", 3, 30, 20, "Intermédiaire", "Aucun", "Cardio", "Descends en squat puis donne un coup de poing contrôlé.", 30),
    ],
  },
  {
    id: 7,
    title: "Mobilité & Étirements",
    subtitle: "Améliore ta mobilité et ta souplesse.",
    duration: 12,
    level: "Tous niveaux",
    equipment: "Tapis",
    caloriesMin: 25,
    caloriesMax: 55,
    muscle: "Corps entier",
    hasJump: false,
    image: photos.stretch,
    exercises: [
      makeExercise("7-1", "Chat-Vache", 2, 10, 10, "Tous niveaux", "Tapis", "Dos", "Alter­ne doucement le dos rond et le dos creux."),
      makeExercise("7-2", "Étirement ischio-jambiers", 2, 30, 10, "Tous niveaux", "Tapis", "Jambes", "Étire doucement l'arrière de la cuisse.", 30),
      makeExercise("7-3", "Ouverture de hanche", 2, 30, 10, "Tous niveaux", "Tapis", "Hanches", "Réalise une ouverture douce de la hanche.", 30),
      makeExercise("7-4", "Étirement du dos", 2, 30, 10, "Tous niveaux", "Tapis", "Dos", "Étire le dos sans forcer.", 30),
      makeExercise("7-5", "Rotation des épaules", 2, 10, 10, "Tous niveaux", "Aucun", "Épaules", "Effectue des rotations lentes des épaules."),
    ],
  },
  {
    id: 8,
    title: "Dos & Posture",
    subtitle: "Renforce les muscles du dos.",
    duration: 18,
    level: "Débutant",
    equipment: "Aucun",
    caloriesMin: 60,
    caloriesMax: 110,
    muscle: "Dos",
    hasJump: false,
    image: photos.back,
    exercises: [
      makeExercise("8-1", "Superman Pull", 3, 12, 30, "Débutant", "Tapis", "Dos", "Allongé sur le ventre, tire les coudes vers les côtes en contrôlant le mouvement."),
      makeExercise("8-2", "Bird Dog", 3, 10, 20, "Débutant", "Tapis", "Dos", "À quatre pattes, tends le bras et la jambe opposés."),
      makeExercise("8-3", "Reverse Snow Angel", 3, 12, 30, "Débutant", "Tapis", "Dos", "Allongé sur le ventre, déplace les bras en arc de cercle."),
      makeExercise("8-4", "Good Morning", 3, 12, 30, "Débutant", "Aucun", "Dos", "Pousse les hanches vers l'arrière en gardant le dos neutre."),
    ],
  },
  {
    id: 9,
    title: "Bras & Épaules",
    subtitle: "Développe la force du haut du corps.",
    duration: 16,
    level: "Intermédiaire",
    equipment: "Chaise",
    caloriesMin: 70,
    caloriesMax: 130,
    muscle: "Bras",
    hasJump: false,
    image: photos.arms,
    exercises: [
      makeExercise("9-1", "Pompes épaules", 3, 10, 30, "Intermédiaire", "Aucun", "Épaules", "Place le bassin haut et fléchis les bras en direction du sol."),
      makeExercise("9-2", "Cercles de bras", 3, 30, 20, "Intermédiaire", "Aucun", "Épaules", "Réalise des cercles contrôlés avec les bras.", 30),
      makeExercise("9-3", "Dips", 3, 12, 30, "Intermédiaire", "Chaise stable", "Triceps", "Fléchis les coudes avec une amplitude confortable."),
      makeExercise("9-4", "Planche latérale", 3, 30, 20, "Intermédiaire", "Tapis", "Core", "Maintiens le bassin aligné.", 30),
    ],
  },
  {
    id: 10,
    title: "Sans Saut Appartement",
    subtitle: "Bouge chez toi sans impact ni bruit de saut.",
    duration: 20,
    level: "Débutant",
    equipment: "Aucun",
    caloriesMin: 75,
    caloriesMax: 140,
    muscle: "Corps entier",
    hasJump: false,
    image: photos.home,
    exercises: [
      makeExercise("10-1", "Squat lent", 3, 12, 30, "Débutant", "Aucun", "Jambes", "Descends lentement puis remonte en contrôlant."),
      makeExercise("10-2", "Fente statique", 3, 10, 30, "Débutant", "Aucun", "Jambes", "Fléchis les genoux sans déplacer les pieds."),
      makeExercise("10-3", "Marche planche", 3, 10, 30, "Débutant", "Tapis", "Core", "Depuis la planche, avance les mains ou les pieds de façon contrôlée."),
      makeExercise("10-4", "Pont fessier", 3, 15, 30, "Débutant", "Tapis", "Fessiers", "Soulève le bassin en contractant les fessiers."),
      makeExercise("10-5", "Gainage", 3, 40, 30, "Débutant", "Tapis", "Abdominaux", "Maintiens le corps aligné et respire normalement.", 40),
    ],
  }
);
             
const Icon = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center justify-center ${className}`}
    aria-hidden="true"
  >
    {children}
  </span>
);

function Photo({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold text-white sm:text-xl">{title}</h2>
      {action && (
        <button
          onClick={onAction}
          className="text-sm font-semibold text-yellow-400 hover:text-yellow-300"
        >
          {action}
        </button>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-[#111111] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xl text-yellow-400">{icon}</span>
      </div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="mt-1 text-xs text-gray-500">{detail}</div>
    </div>
  );
}

function WorkoutCard({
  workout,
  onClick,
  favorite,
  onFavorite,
}: {
  workout: Workout;
  onClick: () => void;
  favorite: boolean;
  onFavorite: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111111] transition hover:border-yellow-400/50">
      <button
        onClick={onClick}
        className="block w-full text-left"
        aria-label={`Voir ${workout.title}`}
      >
        <div className="relative h-40 overflow-hidden sm:h-48">
          <Photo
            src={workout.image}
            alt={`Photo de ${workout.title}`}
            className="transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-xs font-semibold text-yellow-300">
            {workout.level}
          </span>
          <span className="absolute bottom-3 left-3 text-lg font-bold text-white">
            {workout.title}
          </span>
        </div>
      </button>

      <div className="p-4">
        <p className="mb-3 text-sm text-gray-400">{workout.subtitle}</p>
        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-300">
          <span>◷ {workout.duration} min</span>
          <span>♧ {workout.exercises.length} exercices</span>
          <span>~{workout.caloriesMin}-{workout.caloriesMax} kcal</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onClick}
            className="rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-yellow-300"
          >
            Voir le programme
          </button>
          <button
            onClick={onFavorite}
            aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            className={`rounded-xl border px-3 py-2.5 text-lg ${
              favorite
                ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                : "border-white/10 text-gray-400"
            }`}
          >
            {favorite ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </article>
  );
}

function BottomNavigation({
  active,
  onChange,
}: {
  active: string;
  onChange: (value: string) => void;
}) {
  const items = [
    { id: "home", label: "Accueil", icon: "⌂" },
    { id: "workouts", label: "Entraînement", icon: "⚒" },
    { id: "nutrition", label: "Nutrition", icon: "◉" },
    { id: "progress", label: "Progrès", icon: "▥" },
    { id: "settings", label: "Paramètres", icon: "⚙" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-around">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex min-w-0 flex-1 flex-col items-center gap-1 py-1 text-[10px] sm:text-xs ${
              active === item.id ? "text-yellow-400" : "text-gray-500"
            }`}
          >
            <span className="text-2xl leading-none">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
  }
  
export default function FitProHome() {
  const [activeTab, setActiveTab] = useState("home");
  const [view, setView] = useState<"home" | "workouts" | "detail" | "reader">("home");
  const [selectedWorkout, setSelectedWorkout] = useState<Workout>(workouts[0]);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("Tous");
  const [jumpFilter, setJumpFilter] = useState("Tous");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [restMode, setRestMode] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const currentExercise = selectedWorkout.exercises[exerciseIndex];

  const filteredWorkouts = useMemo(() => {
    return workouts.filter((workout) => {
      const matchesSearch =
        workout.title.toLowerCase().includes(search.toLowerCase()) ||
        workout.muscle.toLowerCase().includes(search.toLowerCase()) ||
        workout.subtitle.toLowerCase().includes(search.toLowerCase());

      const matchesLevel =
        levelFilter === "Tous" || workout.level === levelFilter;

      const matchesJump =
        jumpFilter === "Tous" ||
        (jumpFilter === "Sans saut" && !workout.hasJump) ||
        (jumpFilter === "Avec saut" && workout.hasJump);

      return matchesSearch && matchesLevel && matchesJump;
    });
  }, [search, levelFilter, jumpFilter]);

  const progress = selectedWorkout.exercises.length
    ? Math.round(
        (completed.filter((id) =>
          selectedWorkout.exercises.some((ex) => ex.id === id)
        ).length /
          selectedWorkout.exercises.length) *
          100
      )
    : 0;

  useEffect(() => {
    if (view !== "reader" || paused || finished) return;

    const timer = window.setInterval(() => {
      setElapsed((value) => value + 1);

      if (restMode) {
        setRestSeconds((value) => {
          if (value <= 1) {
            setRestMode(false);
            return 0;
          }
          return value - 1;
        });
      } else if (seconds > 0) {
        setSeconds((value) => Math.max(0, value - 1));
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [view, paused, finished, restMode, seconds]);

  const formatTime = (value: number) => {
    const minutes = Math.floor(value / 60);
    const secs = value % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const toggleFavorite = (id: number) => {
    setFavorites((old) =>
      old.includes(id) ? old.filter((item) => item !== id) : [...old, id]
    );
  };

  const openWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setExerciseIndex(0);
    setCompleted([]);
    setView("detail");
    setActiveTab("workouts");
    setFinished(false);
  };

  const startWorkout = () => {
    setExerciseIndex(0);
    setCompleted([]);
    setElapsed(0);
    setPaused(false);
    setFinished(false);
    setRestMode(false);
    setSeconds(
      selectedWorkout.exercises[0]?.duration || 30
    );
    setView("reader");
  };

  const nextExercise = () => {
    if (!currentExercise) return;

    setCompleted((old) =>
      old.includes(currentExercise.id)
        ? old
        : [...old, currentExercise.id]
    );

    if (exerciseIndex >= selectedWorkout.exercises.length - 1) {
      setFinished(true);
      return;
    }

    setExerciseIndex((old) => old + 1);
    setRestMode(true);
    setRestSeconds(currentExercise.rest);
    setSeconds(30);
    setPaused(false);
  };

  const previousExercise = () => {
    if (exerciseIndex > 0) {
      setExerciseIndex((old) => old - 1);
      setRestMode(false);
      setSeconds(30);
    }
  };

  const startRest = (extra = 0) => {
    setRestMode(true);
    setRestSeconds((old) => Math.max(0, old + extra));
  };

  const stopWorkout = () => {
    if (window.confirm("Veux-tu vraiment arrêter cet entraînement ?")) {
      setView("detail");
      setRestMode(false);
      setPaused(false);
    }
  };

  const openWorkouts = () => {
    setView("workouts");
    setActiveTab("workouts");
  };

  const goHome = () => {
    setView("home");
    setActiveTab("home");
  };
    
  return (
    <div className="min-h-screen bg-[#050505] pb-28 text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/95 px-5 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <button onClick={goHome} className="text-2xl font-black tracking-tight">
            FIT<span className="text-yellow-400">PRO</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              className="rounded-full border border-white/10 px-3 py-2 text-sm text-gray-300"
              aria-label="Notifications"
            >
              ♧
            </button>
            <button
              className="h-10 w-10 overflow-hidden rounded-full border-2 border-yellow-400"
              aria-label="Profil"
              onClick={() => {
                setActiveTab("settings");
                setView("home");
              }}
            >
              <Photo src={photos.full} alt="Profil utilisateur" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* ACCUEIL */}
        {view === "home" && activeTab === "home" && (
          <div className="space-y-8">
            <section>
              <p className="text-sm text-gray-400">
                Bonjour, <span className="text-yellow-400">Champion 👋</span>
              </p>
              <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">
                Construis ta discipline.
                <br />
                Sois <span className="text-yellow-400">inarrêtable.</span>
              </h1>
            </section>

            {/* BANNIÈRE */}
            <section className="relative min-h-[270px] overflow-hidden rounded-3xl border border-yellow-400/20">
              <Photo
                src={photos.full}
                alt="Sportif en entraînement"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/10" />
              <div className="relative z-10 flex min-h-[270px] flex-col justify-between p-6 sm:max-w-lg">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">
                    Objectif hebdomadaire
                  </span>
                  <h2 className="mt-3 text-2xl font-bold">
                    Reste régulier.
                  </h2>
                  <p className="mt-2 max-w-xs text-sm text-gray-300">
                    Chaque séance te rapproche de tes objectifs.
                  </p>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span><b className="text-yellow-400">3/5</b> séances</span>
                    <span className="text-gray-300">60%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-[60%] rounded-full bg-yellow-400" />
                  </div>
                </div>
              </div>
            </section>

            {/* RACCOURCIS */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["⚒", "Entraînements", "workouts"],
                ["▤", "Programmes", "workouts"],
                ["◉", "Nutrition", "nutrition"],
                ["▥", "Progrès", "progress"],
              ].map(([icon, label, tab]) => (
                <button
                  key={tab + label}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === "workouts") setView("workouts");
                    else setView("home");
                  }}
                  className="rounded-2xl border border-white/10 bg-[#111111] p-5 text-center transition hover:border-yellow-400/60"
                >
                  <span className="block text-3xl text-yellow-400">{icon}</span>
                  <span className="mt-2 block text-sm font-semibold">
                    {label}
                  </span>
                </button>
              ))}
            </section>

            {/* PLAN DU JOUR */}
            <section>
              <SectionTitle
                title="Programme du jour"
                action="Tout voir"
                onAction={openWorkouts}
              />
              <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#111111] p-3 sm:flex-row sm:items-center">
                <div className="h-40 overflow-hidden rounded-xl sm:h-28 sm:w-40">
                  <Photo src={photos.upper} alt="Exercice de musculation" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold">Haut du corps</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Pectoraux • Épaules • Triceps
                  </p>
                  <p className="mt-3 text-xs text-gray-400">
                    ♧ 5 exercices &nbsp; ◷ 22 min
                  </p>
                </div>
                <button
                  onClick={() => openWorkout(workouts[2])}
                  className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black hover:bg-yellow-300"
                >
                  Commencer ▶
                </button>
              </div>
            </section>

            {/* STATISTIQUES */}
            <section>
              <SectionTitle title="Ta progression" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatCard
                  label="Entraînements"
                  value="12"
                  detail="Ce mois"
                  icon="⚒"
                />
                <StatCard
                  label="Calories"
                  value="~2 450"
                  detail="Estimation du mois"
                  icon="◉"
                />
                <StatCard
                  label="Séances"
                  value="3/5"
                  detail="Objectif hebdomadaire"
                  icon="▥"
                />
              </div>
            </section>

            {/* PROGRAMMES POPULAIRES */}
            <section>
              <SectionTitle
                title="Programmes populaires"
                action="Tout voir"
                onAction={openWorkouts}
              />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {workouts.slice(0, showAll ? 10 : 4).map((workout) => (
                  <button
                    key={workout.id}
                    onClick={() => openWorkout(workout)}
                    className="group relative h-48 overflow-hidden rounded-2xl border border-white/10 text-left"
                  >
                    <Photo
                      src={workout.image}
                      alt={workout.title}
                      className="transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-0 p-3">
                      <p className="font-bold">{workout.title}</p>
                      <p className="mt-1 text-xs text-gray-300">
                        {workout.exercises.length} exercices
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#111111] p-4">
              <div>
                <p className="font-bold">La discipline aujourd'hui.</p>
                <p className="text-sm text-gray-400">La force demain.</p>
              </div>
              <button
                onClick={openWorkouts}
                className="shrink-0 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black"
              >
                S'entraîner ▶
              </button>
            </section>
          </div>
        )}

        {/* LISTE DES ENTRAÎNEMENTS */}
        {view === "workouts" && (
          <div className="space-y-6">
            <section>
              <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
                FIT PRO
              </p>
              <h1 className="mt-2 text-3xl font-black">
                Entraînements
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                Choisis une séance adaptée à tes objectifs.
              </p>
            </section>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un entraînement..."
              className="w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-4 text-white outline-none placeholder:text-gray-500 focus:border-yellow-400"
            />

            <div className="grid grid-cols-2 gap-3">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#111111] p-3 text-sm text-white"
              >
                <option value="Tous">Tous les niveaux</option>
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Tous niveaux">Tous niveaux</option>
              </select>

              <select
                value={jumpFilter}
                onChange={(e) => setJumpFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#111111] p-3 text-sm text-white"
              >
                <option value="Tous">Avec ou sans saut</option>
                <option value="Sans saut">Sans saut</option>
                <option value="Avec saut">Avec saut</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {filteredWorkouts.length} programme(s) trouvé(s)
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setLevelFilter("Tous");
                  setJumpFilter("Tous");
                }}
                className="text-xs font-semibold text-yellow-400"
              >
                Réinitialiser
              </button>
            </div>

            {filteredWorkouts.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredWorkouts.map((workout) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onClick={() => openWorkout(workout)}
                    favorite={favorites.includes(workout.id)}
                    onFavorite={() => toggleFavorite(workout.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-[#111111] p-10 text-center">
                <p className="text-2xl">⌕</p>
                <p className="mt-3 font-bold">Aucun entraînement trouvé</p>
                <p className="mt-2 text-sm text-gray-400">
                  Essaie un autre mot ou un autre filtre.
                </p>
              </div>
            )}
          </div>
        )}
           
        {/* DÉTAIL DU PROGRAMME */}
        {view === "detail" && (
          <div className="space-y-6">
            <button
              onClick={openWorkouts}
              className="text-sm font-semibold text-yellow-400"
            >
              ← Retour aux entraînements
            </button>

            <div className="relative h-64 overflow-hidden rounded-3xl">
              <Photo
                src={selectedWorkout.image}
                alt={selectedWorkout.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black">
                  {selectedWorkout.level}
                </span>
                <h1 className="mt-3 text-3xl font-black">
                  {selectedWorkout.title}
                </h1>
                <p className="mt-2 text-sm text-gray-300">
                  {selectedWorkout.subtitle}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard
                label="Durée"
                value={`${selectedWorkout.duration} min`}
                detail="Indicative"
                icon="◷"
              />
              <StatCard
                label="Exercices"
                value={`${selectedWorkout.exercises.length}`}
                detail="Au programme"
                icon="⚒"
              />
              <StatCard
                label="Calories"
                value={`~${selectedWorkout.caloriesMin}-${selectedWorkout.caloriesMax}`}
                detail="kcal estimées"
                icon="◉"
              />
              <StatCard
                label="Matériel"
                value={selectedWorkout.equipment}
                detail="Nécessaire"
                icon="▣"
              />
            </div>

            <section>
              <SectionTitle title="Les exercices de la séance" />
              <div className="space-y-3">
                {selectedWorkout.exercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111111] p-3"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-[#101a35]">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold">{exercise.name}</h3>
                      <p className="mt-1 text-xs text-gray-400">
                        {exercise.sets} séries ×{" "}
                        {exercise.duration
                          ? `${exercise.duration} secondes`
                          : `${exercise.reps} répétitions`}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Repos : {exercise.rest}s
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {exercise.muscle}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4">
              <h3 className="font-bold text-yellow-300">
                Conseils de sécurité
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">
                Cette séance doit être adaptée à tes capacités. Respecte les
                consignes de chaque mouvement. Arrête-toi en cas de douleur,
                vertige ou essoufflement inhabituel. En cas de problème de
                santé ou de blessure, demande conseil à un professionnel.
              </p>
            </div>

            <button
              onClick={startWorkout}
              className="w-full rounded-2xl bg-yellow-400 py-4 text-lg font-black text-black transition hover:bg-yellow-300"
            >
              COMMENCER L'ENTRAÎNEMENT ▶
            </button>
          </div>
        )}

        {/* LECTEUR D'EXERCICE */}
        {view === "reader" && !finished && currentExercise && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={stopWorkout}
                className="text-sm font-semibold text-gray-400"
              >
                ✕ Arrêter
              </button>
              <span className="text-sm font-bold text-yellow-400">
                {exerciseIndex + 1}/{selectedWorkout.exercises.length}
              </span>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-xs text-gray-400">
                <span>Progression de la séance</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <section className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
                Exercice {exerciseIndex + 1}
              </p>
              <h1 className="mt-2 text-3xl font-black">
                {currentExercise.name}
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                {currentExercise.muscle}
              </p>
            </section>

            {/* ZONE D'ANIMATION 2D */}
            <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white p-5">
              {currentExercise.animationUrl ? (
                <video
                  key={currentExercise.animationUrl}
                  src={currentExercise.animationUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-h-[320px] w-full object-contain"
                />
              ) : (
                <div className="text-center text-[#101a35]">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#101a35] text-3xl text-white">
                    2D
                  </div>
                  <p className="font-bold">
                    Animation 2D à intégrer
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {currentExercise.name}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Ajoute ici l'URL de l'animation correcte de cet exercice.
                  </p>
                </div>
              )}
            </div>

            {/* COMPTEUR */}
            <div className="rounded-3xl border border-white/10 bg-[#111111] p-6 text-center">
              {restMode ? (
                <>
                  <p className="text-sm font-semibold text-yellow-400">
                    TEMPS DE REPOS
                  </p>
                  <div className="my-4 text-6xl font-black tabular-nums">
                    {formatTime(restSeconds)}
                  </div>
                  <p className="text-sm text-gray-400">
                    Prépare-toi pour le prochain exercice.
                  </p>
                  <button
                    onClick={() => startRest(10)}
                    className="mt-5 rounded-xl border border-white/20 px-5 py-3 font-semibold"
                  >
                    +10 secondes
                  </button>
                  <button
                    onClick={() => {
                      setRestMode(false);
                      setRestSeconds(0);
                    }}
                    className="ml-2 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black"
                  >
                    Passer le repos
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-400">
                    {currentExercise.duration
                      ? "MINUTEUR"
                      : "RÉPÉTITIONS CIBLES"}
                  </p>
                  <div className="my-4 text-6xl font-black tabular-nums">
                    {currentExercise.duration
                      ? formatTime(seconds)
                      : `${currentExercise.reps}`}
                  </div>
                  <p className="text-sm text-gray-400">
                    {currentExercise.sets} séries · Repos{" "}
                    {currentExercise.rest}s
                  </p>
                </>
              )}
            </div>

            {/* CONSIGNES */}
            <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
              <h3 className="font-bold text-yellow-400">
                Consigne de mouvement
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">
                {currentExercise.instructions}
              </p>
            </div>

            {/* COMMANDES */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={previousExercise}
                disabled={exerciseIndex === 0}
                className="rounded-xl border border-white/10 py-4 text-sm font-semibold disabled:opacity-30"
              >
                ← Précédent
              </button>
              <button
                onClick={() => setPaused(!paused)}
                className="rounded-xl bg-yellow-400 py-4 text-sm font-bold text-black"
              >
                {paused ? "▶ Reprendre" : "Ⅱ Pause"}
              </button>
              <button
                onClick={nextExercise}
                className="rounded-xl border border-white/10 py-4 text-sm font-semibold"
              >
                Suivant →
              </button>
            </div>

            <button
              onClick={nextExercise}
              className="w-full rounded-xl border border-white/10 py-3 text-sm text-gray-300"
            >
              Terminer / Passer cet exercice
            </button>

            <p className="text-center text-xs text-gray-500">
              Temps total effectué : {formatTime(elapsed)}
            </p>
          </div>
        )}

        {/* FIN DE SÉANCE */}
        {view === "reader" && finished && (
          <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">
            <div className="text-6xl">🏆</div>
            <h1 className="mt-5 text-4xl font-black">
              Bravo !
            </h1>
            <p className="mt-3 text-gray-400">
              Tu as terminé cette séance.
            </p>
            <div className="my-8 grid w-full grid-cols-2 gap-3">
              <StatCard
                label="Temps effectué"
                value={formatTime(elapsed)}
                detail="Durée réelle"
                icon="◷"
              />
              <StatCard
                label="Exercices"
                value={`${selectedWorkout.exercises.length}/${selectedWorkout.exercises.length}`}
                detail="Terminés"
                icon="✓"
              />
            </div>
            <p className="mb-6 text-sm text-gray-400">
              Calories estimées : ~{selectedWorkout.caloriesMin} à{" "}
              {selectedWorkout.caloriesMax} kcal.
              <br />
              Cette estimation varie selon ton corps et ton intensité.
            </p>
            <button
              onClick={() => setView("detail")}
              className="w-full rounded-xl bg-yellow-400 py-4 font-bold text-black"
            >
              Terminer
            </button>
            <button
              onClick={startWorkout}
              className="mt-3 w-full rounded-xl border border-white/20 py-4 font-semibold"
            >
              Refaire la séance
            </button>
          </div>
        )}

        {/* AUTRES RUBRIQUES */}
        {activeTab === "nutrition" && (
          <section className="space-y-4">
            <h1 className="text-3xl font-black">Nutrition</h1>
            <p className="text-gray-400">
              Conseils alimentaires et suivi nutritionnel.
            </p>
            <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
              <p className="text-lg font-bold">Bien manger, mieux progresser.</p>
              <p className="mt-2 text-sm text-gray-400">
                Cette rubrique est prête à recevoir tes programmes nutritionnels.
              </p>
            </div>
          </section>
        )}

        {activeTab === "progress" && (
          <section className="space-y-4">
            <h1 className="text-3xl font-black">Mes progrès</h1>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Favoris" value={`${favorites.length}`} detail="Programmes sauvegardés" icon="♥" />
              <StatCard label="Séances" value={`${completed.length}`} detail="Exercices terminés en mémoire" icon="✓" />
            </div>
            <p className="text-sm text-gray-400">
              Les statistiques complètes nécessitent une sauvegarde persistante des séances.
            </p>
          </section>
        )}

        {activeTab === "settings" && (
          <section className="space-y-4">
            <h1 className="text-3xl font-black">Paramètres</h1>
            <div className="space-y-3 rounded-2xl border border-white/10 bg-[#111111] p-5">
              <p className="font-bold">Préférences FIT PRO</p>
              <p className="text-sm text-gray-400">Langue : Français</p>
              <p className="text-sm text-gray-400">Thème : Sombre</p>
              <p className="text-sm text-gray-400">Unités : kg / cm</p>
              <p className="text-xs text-gray-500">
                Les réglages complets seront connectés aux préférences utilisateur.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* NAVIGATION */}
      {view !== "reader" && (
        <BottomNavigation
          active={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
            if (tab === "workouts") setView("workouts");
            else setView("home");
          }}
        />
      )}
    </div>
  );
                  }
              
