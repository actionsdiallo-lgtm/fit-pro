
"use client";

import React, { useEffect, useMemo, useState } from "react";

/* =========================================
   FIT PRO — TYPES ET CONFIGURATION
========================================= */

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
  instructions: string;
  animationUrl: string;
  photoUrl: string;
};

type Workout = {
  id: number;
  title: string;
  subtitle: string;
  duration: number;
  level: string;
  calories: number;
  muscle: string;
  equipment: string;
  image: string;
  description: string;
  exercises: Exercise[];
};

type Tab =
  | "home"
  | "workouts"
  | "nutrition"
  | "progress"
  | "settings";
type WorkoutRecord = {
  id: string;
  workoutId: number;
  workoutTitle: string;
  date: string;
  durationSeconds: number;
  calories: number;
  exercisesCompleted: number;
};
type View =
  | "home"
  | "workouts"
  | "detail"
  | "reader"
  | "complete"
  | "nutrition"
  | "progress"
  | "settings";

/* =========================================
   PHOTOS DES PROGRAMMES
========================================= */

const photos = {
  fullBody:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900",
  strength:
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900",
  upper:
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900",
  legs:
    "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=900",
  abs:
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900",
  cardio:
    "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=900",
  mobility:
    "https://images.unsplash.com/photo-1510894347719-fc3ed6fdfd4e?w=900",
  back:
    "https://images.unsplash.com/photo-1517838277536-f4e5f2e8c7f4?w=900",
  arms:
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900",
  home:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200",
};

/* =========================================
   CRÉATION DES EXERCICES
========================================= */

function makeExercise(
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
): Exercise {
  return {
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
    animationUrl: `/animations/${id}.mp4`,
    photoUrl: `/exercise-images/${id}.jpg`,
  };
}

/* =========================================
   PROGRAMMES — LES DONNÉES ARRIVENT
   DANS LE MORCEAU 2
========================================= */

const workouts: Workout[] = [
  
  {
    id: 1,
    title: "Full Body",
    subtitle: "Entraînement complet",
    duration: 30,
    level: "Débutant",
    calories: 220,
    muscle: "Tout le corps",
    equipment: "Sans matériel",
    image: photos.fullBody,
    description: "Travaille tout le corps avec des mouvements simples et efficaces.",
    exercises: [
      makeExercise("jumping-jacks", "Jumping Jacks", 3, 20, 30, "Débutant", "Aucun", "Corps entier", "Saute en écartant les jambes et en levant les bras."),
      makeExercise("bodyweight-squats", "Squats", 3, 15, 45, "Débutant", "Aucun", "Jambes", "Descends les hanches en gardant le dos droit."),
      makeExercise("push-ups", "Pompes", 3, 10, 45, "Intermédiaire", "Aucun", "Pectoraux", "Descends la poitrine vers le sol puis repousse."),
      makeExercise("mountain-climbers", "Mountain Climbers", 3, 20, 30, "Intermédiaire", "Aucun", "Abdominaux", "En position de planche, ramène alternativement les genoux."),
      makeExercise("plank", "Planche", 3, 1, 45, "Débutant", "Aucun", "Abdominaux", "Garde le corps aligné sur les avant-bras.", 30),
    ],
  },
  {
    id: 2,
    title: "Force et puissance",
    subtitle: "Développer la force",
    duration: 35,
    level: "Intermédiaire",
    calories: 280,
    muscle: "Corps entier",
    equipment: "Haltères",
    image: photos.strength,
    description: "Une séance pour renforcer les principaux groupes musculaires.",
    exercises: [
      makeExercise("dumbbell-squats", "Squats avec haltères", 3, 12, 45, "Intermédiaire", "Haltères", "Jambes", "Tiens les haltères et réalise un squat contrôlé."),
      makeExercise("dumbbell-press", "Développé avec haltères", 3, 12, 60, "Intermédiaire", "Haltères", "Pectoraux", "Pousse les haltères vers le haut puis redescends lentement."),
      makeExercise("dumbbell-row", "Rowing avec haltères", 3, 12, 45, "Intermédiaire", "Haltères", "Dos", "Tire les coudes vers l'arrière."),
      makeExercise("dumbbell-shoulder-press", "Développé épaules", 3, 10, 45, "Intermédiaire", "Haltères", "Épaules", "Pousse les haltères au-dessus de la tête."),
      makeExercise("dumbbell-lunges", "Fentes avec haltères", 3, 10, 45, "Intermédiaire", "Haltères", "Jambes", "Avance un pied et descends en contrôlant le mouvement."),
    ],
  },
  {
    id: 3,
    title: "Haut du corps",
    subtitle: "Pectoraux, dos et épaules",
    duration: 30,
    level: "Intermédiaire",
    calories: 230,
    muscle: "Haut du corps",
    equipment: "Sans matériel",
    image: photos.upper,
    description: "Renforce les muscles du haut du corps.",
    exercises: [
      makeExercise("wide-push-ups", "Pompes larges", 3, 12, 45, "Intermédiaire", "Aucun", "Pectoraux", "Place les mains plus largement que les épaules."),
      makeExercise("diamond-push-ups", "Pompes diamant", 3, 8, 60, "Avancé", "Aucun", "Triceps", "Rapproche les mains sous la poitrine."),
      makeExercise("pike-push-ups", "Pompes pike", 3, 10, 45, "Avancé", "Aucun", "Épaules", "Forme un V inversé et fléchis les coudes."),
      makeExercise("superman", "Superman", 3, 15, 30, "Débutant", "Aucun", "Dos", "Allongé sur le ventre, lève doucement bras et jambes."),
      makeExercise("arm-circles", "Cercles des bras", 3, 20, 30, "Débutant", "Aucun", "Épaules", "Réalise de petits cercles contrôlés avec les bras.", 30),
    ],
  },
  {
    id: 4,
    title: "Jambes et fessiers",
    subtitle: "Renforcement du bas du corps",
    duration: 35,
    level: "Intermédiaire",
    calories: 270,
    muscle: "Jambes et fessiers",
    equipment: "Sans matériel",
    image: photos.legs,
    description: "Renforce les jambes et les fessiers.",
    exercises: [
      makeExercise("sumo-squats", "Squats sumo", 3, 15, 45, "Débutant", "Aucun", "Adducteurs", "Écarte les pieds et descends les hanches."),
      makeExercise("reverse-lunges", "Fentes arrière", 3, 12, 45, "Débutant", "Aucun", "Jambes", "Recule un pied et plie les deux genoux."),
      makeExercise("glute-bridges", "Pont fessier", 3, 15, 30, "Débutant", "Aucun", "Fessiers", "Allongé sur le dos, soulève le bassin."),
      makeExercise("calf-raises", "Extensions des mollets", 3, 20, 30, "Débutant", "Aucun", "Mollets", "Monte sur la pointe des pieds puis redescends."),
      makeExercise("donkey-kicks", "Donkey Kicks", 3, 12, 30, "Débutant", "Aucun", "Fessiers", "À quatre pattes, pousse un pied vers le plafond."),
    ],
  },
  {
    id: 5,
    title: "Abdominaux",
    subtitle: "Renforcement du centre du corps",
    duration: 20,
    level: "Débutant",
    calories: 150,
    muscle: "Abdominaux",
    equipment: "Tapis",
    image: photos.abs,
    description: "Travaille les abdominaux et la stabilité du tronc.",
    exercises: [
      makeExercise("crunches", "Crunchs", 3, 15, 30, "Débutant", "Tapis", "Abdominaux", "Soulève légèrement les épaules sans tirer sur la nuque."),
      makeExercise("bicycle-crunches", "Crunchs vélo", 3, 20, 30, "Intermédiaire", "Tapis", "Obliques", "Ramène alternativement le coude vers le genou opposé."),
      makeExercise("leg-raises", "Relevés de jambes", 3, 12, 45, "Intermédiaire", "Tapis", "Bas des abdominaux", "Lève les jambes tendues en gardant le bas du dos stable."),
      makeExercise("russian-twists", "Russian Twists", 3, 20, 30, "Intermédiaire", "Tapis", "Obliques", "Tourne le buste doucement de chaque côté."),
      makeExercise("dead-bug", "Dead Bug", 3, 12, 30, "Débutant", "Tapis", "Abdominaux profonds", "Étends le bras et la jambe opposés en gardant le dos stable."),
    ],
  },
  {
    id: 6,
    title: "Cardio brûle-calories",
    subtitle: "Endurance et énergie",
    duration: 25,
    level: "Intermédiaire",
    calories: 250,
    muscle: "Corps entier",
    equipment: "Aucun",
    image: photos.cardio,
    description: "Une séance dynamique pour améliorer l'endurance.",
    exercises: [
      makeExercise("high-knees", "Montées de genoux", 3, 30, 30, "Intermédiaire", "Aucun", "Cardio", "Cours sur place en montant les genoux.", 30),
      makeExercise("butt-kicks", "Talons-fesses", 3, 30, 30, "Débutant", "Aucun", "Cardio", "Cours sur place en ramenant les talons vers les fessiers.", 30),
      makeExercise("skaters", "Skaters", 3, 20, 45, "Intermédiaire", "Aucun", "Jambes", "Saute latéralement d'un pied à l'autre."),
      makeExercise("burpees", "Burpees", 3, 10, 60, "Avancé", "Aucun", "Corps entier", "Enchaîne accroupissement, planche et redressement."),
      makeExercise("fast-feet", "Pas rapides", 3, 30, 30, "Intermédiaire", "Aucun", "Cardio", "Effectue de petits pas rapides sur place.", 30),
    ],
  },
  {
    id: 7,
    title: "Mobilité et souplesse",
    subtitle: "Bouger avec fluidité",
    duration: 20,
    level: "Débutant",
    calories: 90,
    muscle: "Corps entier",
    equipment: "Tapis",
    image: photos.mobility,
    description: "Améliore la mobilité et la souplesse avec des mouvements doux.",
    exercises: [
      makeExercise("cat-cow", "Chat-vache", 2, 12, 20, "Débutant", "Tapis", "Dos", "Alterne dos arrondi et dos creusé doucement."),
      makeExercise("child-pose", "Posture de l'enfant", 2, 1, 20, "Débutant", "Tapis", "Dos", "Assieds-toi vers les talons et étends les bras.", 40),
      makeExercise("hip-circles", "Cercles des hanches", 2, 12, 20, "Débutant", "Aucun", "Hanches", "Réalise des cercles lents avec le bassin."),
      makeExercise("standing-side-stretch", "Étirement latéral", 2, 1, 20, "Débutant", "Aucun", "Obliques", "Incline doucement le buste sur chaque côté.", 30),
      makeExercise("hamstring-stretch", "Étirement des ischio-jambiers", 2, 1, 20, "Débutant", "Aucun", "Arrière des jambes", "Étends une jambe et incline doucement le buste.", 30),
    ],
  },
  {
    id: 8,
    title: "Dos et posture",
    subtitle: "Renforcer le dos",
    duration: 25,
    level: "Débutant",
    calories: 160,
    muscle: "Dos",
    equipment: "Tapis",
    image: photos.back,
    description: "Renforce le dos et favorise une posture équilibrée.",
    exercises: [
      makeExercise("bird-dog", "Bird Dog", 3, 12, 30, "Débutant", "Tapis", "Dos", "À quatre pattes, tends le bras et la jambe opposés."),
      makeExercise("reverse-snow-angels", "Anges inversés", 3, 12, 30, "Débutant", "Tapis", "Haut du dos", "Allongé sur le ventre, déplace les bras en arc de cercle."),
      makeExercise("prone-cobra", "Cobra au sol", 3, 12, 30, "Débutant", "Tapis", "Dos", "Soulève doucement la poitrine en gardant le bassin au sol."),
      makeExercise("wall-angels", "Anges au mur", 3, 12, 30, "Débutant", "Mur", "Épaules", "Glisse les bras le long du mur sans cambrer le dos."),
    ],
  },
  {
    id: 9,
    title: "Bras et épaules",
    subtitle: "Renforcement des bras",
    duration: 25,
    level: "Intermédiaire",
    calories: 180,
    muscle: "Bras et épaules",
    equipment: "Haltères",
    image: photos.arms,
    description: "Travaille les biceps, triceps et épaules.",
    exercises: [
      makeExercise("bicep-curls", "Curl biceps", 3, 12, 45, "Débutant", "Haltères", "Biceps", "Plie les coudes pour remonter les haltères."),
      makeExercise("tricep-extensions", "Extensions triceps", 3, 12, 45, "Intermédiaire", "Haltères", "Triceps", "Fléchis puis tends les coudes au-dessus de la tête."),
      makeExercise("lateral-raises", "Élévations latérales", 3, 12, 45, "Débutant", "Haltères", "Épaules", "Lève les bras sur les côtés jusqu'à hauteur des épaules."),
      makeExercise("front-raises", "Élévations frontales", 3, 12, 45, "Débutant", "Haltères", "Épaules", "Lève les haltères devant toi sans balancer le corps."),
    ],
  },
  {
    id: 10,
    title: "Débutant à la maison",
    subtitle: "Reprendre le sport progressivement",
    duration: 20,
    level: "Débutant",
    calories: 130,
    muscle: "Corps entier",
    equipment: "Sans matériel",
    image: photos.home,
    description: "Une séance accessible pour commencer à bouger à la maison.",
    exercises: [
      makeExercise("march-in-place", "Marche sur place", 2, 1, 20, "Débutant", "Aucun", "Cardio", "Marche tranquillement sur place.", 60),
      makeExercise("chair-squats", "Squats sur chaise", 2, 12, 30, "Débutant", "Chaise", "Jambes", "Assieds-toi puis relève-toi en contrôlant le mouvement."),
      makeExercise("wall-push-ups", "Pompes contre le mur", 2, 12, 30, "Débutant", "Mur", "Pectoraux", "Plie les coudes pour rapprocher la poitrine du mur."),
      makeExercise("standing-knee-raises", "Montées de genoux debout", 2, 16, 20, "Débutant", "Aucun", "Abdominaux", "Monte alternativement les genoux sans te pencher."),
      makeExercise("standing-calf-raises", "Mollets debout", 2, 15, 20, "Débutant", "Aucun", "Mollets", "Monte sur la pointe des pieds puis redescends lentement."),
    ],
  },
];
      
/* =========================================
   COMPOSANTS VISUELS
========================================= */

function Icon({
  name,
  size = 22,
}: {
  name: string;
  size?: number;
}) {
  const icons: Record<string, string> = {
    home: "⌂",
    workouts: "🏋️",
    nutrition: "🥗",
    progress: "📈",
    settings: "⚙️",
    search: "⌕",
    clock: "◷",
    fire: "🔥",
    play: "▶",
    back: "←",
    heart: "♡",
    check: "✓",
    close: "×",
    pause: "Ⅱ",
    dumbbell: "🏋️",
    calendar: "▦",
    trophy: "🏆",
  };

  return (
    <span
      style={{ fontSize: size, lineHeight: 1 }}
      aria-hidden="true"
    >
      {icons[name] || "•"}
    </span>
  );
}

/* =========================================
   IMAGE AVEC SOLUTION DE REPLI
========================================= */

function Photo({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-200 text-slate-500 ${className}`}
      >
        <span className="text-3xl">🏋️</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

/* =========================================
   TITRE DE SECTION
========================================= */

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold text-slate-900">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* =========================================
   CARTE STATISTIQUE
========================================= */

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-2">
        <Icon name={icon} size={24} />
      </div>

      <p className="text-xl font-bold text-slate-900">
        {value}
      </p>

      <p className="text-xs text-slate-500">
        {label}
      </p>
    </div>
  );
}

/* =========================================
   CARTE D'ENTRAÎNEMENT
========================================= */

function WorkoutCard({
  workout,
  favorite,
  onFavorite,
  onClick,
}: {
  workout: Workout;
  favorite: boolean;
  onFavorite: () => void;
  onClick: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left"
      >
        <div className="relative h-44">
          <Photo
            src={workout.image}
            alt={workout.title}
            className="h-full w-full object-cover"
          />

          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800">
            {workout.level}
          </span>

          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
            {workout.duration} min
          </span>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-slate-900">
            {workout.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {workout.subtitle}
          </p>

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            <span>🔥 {workout.calories} kcal estimées</span>
            <span>💪 {workout.exercises.length} exercices</span>
          </div>
        </div>
      </button>

      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
        <span className="text-xs text-slate-500">
          {workout.muscle}
        </span>

        <button
          type="button"
          onClick={onFavorite}
          aria-label={
            favorite
              ? "Retirer des favoris"
              : "Ajouter aux favoris"
          }
          className="rounded-full p-2 text-xl hover:bg-slate-100"
        >
          <span className={favorite ? "text-red-500" : "text-slate-400"}>
            {favorite ? "♥" : "♡"}
          </span>
        </button>
      </div>
    </div>
  );
}

/* =========================================
   NAVIGATION DU BAS
========================================= */

function BottomNavigation({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
}) {
  const items: {
    id: Tab;
    label: string;
    icon: string;
  }[] = [
    { id: "home", label: "Accueil", icon: "home" },
    { id: "workouts", label: "Sport", icon: "workouts" },
    { id: "nutrition", label: "Nutrition", icon: "nutrition" },
    { id: "progress", label: "Progrès", icon: "progress" },
    { id: "settings", label: "Réglages", icon: "settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white px-2 pb-safe">
      <div className="mx-auto flex max-w-3xl justify-around py-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs ${
              active === item.id
                ? "font-bold text-blue-700"
                : "text-slate-500"
            }`}
          >
            <Icon name={item.icon} size={22} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

/* =========================================
   LECTEUR D'ANIMATION 2D
========================================= */

function ExerciseVideo({
  animationUrl,
  exerciseName,
}: {
  animationUrl?: string;
  exerciseName: string;
}) {
  const [videoMissing, setVideoMissing] = useState(false);

  useEffect(() => {
    setVideoMissing(false);
  }, [animationUrl]);

  if (!animationUrl || videoMissing) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl bg-slate-100 p-6 text-center">
        <div className="mb-3 text-4xl">🎬</div>

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
    <div className="overflow-hidden rounded-2xl bg-white">
      <video
        key={animationUrl}
        src={animationUrl}
        autoPlay
        loop
        muted
        playsInline
        onError={() => setVideoMissing(true)}
        className="aspect-video w-full object-contain"
      />
    </div>
  );
    }
      
/* =========================================
   COMPOSANT PRINCIPAL FIT PRO
========================================= */

export default function FitProHome() {
  const [view, setView] = useState<View>("home");
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const [selectedWorkout, setSelectedWorkout] =
    useState<Workout>(workouts[0]);

  const [exerciseIndex, setExerciseIndex] = useState(0);

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("Tous");

  const [favorites, setFavorites] = useState<string[]>([]);
  const [completedWorkouts, setCompletedWorkouts] =
    useState<number[]>([]);

  const [completedExercises, setCompletedExercises] =
    useState<string[]>([]);

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);

  const [restSeconds, setRestSeconds] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
const [workoutHistory, setWorkoutHistory] = useState<WorkoutRecord[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] =
    useState(false);

  const [darkMode, setDarkMode] = useState(false);

  const currentExercise =
    selectedWorkout.exercises[exerciseIndex];

  const totalExercises = selectedWorkout.exercises.length;

  const progress =
    totalExercises > 0
      ? Math.round(
          (completedExercises.filter((id) =>
            selectedWorkout.exercises.some(
              (exercise) => exercise.id === id
            )
          ).length /
            totalExercises) *
            100
        )
      : 0;

  /* =====================================
     RECHERCHE ET FILTRES
  ===================================== */

  const filteredWorkouts = useMemo(() => {
    return workouts.filter((workout) => {
      const matchesSearch =
        workout.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        workout.subtitle
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        workout.muscle
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesLevel =
        levelFilter === "Tous" ||
        workout.level === levelFilter;

      const matchesFavorite =
        !showFavoritesOnly ||
        favorites.includes(String(workout.id));

      return (
        matchesSearch &&
        matchesLevel &&
        matchesFavorite
      );
    });
  }, [search, levelFilter, showFavoritesOnly, favorites]);

  /* =====================================
     CHRONOMÈTRE ET TEMPS DE REPOS
  ===================================== */

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      if (isResting) {
        setRestSeconds((previous) => {
          if (previous <= 1) {
            setIsResting(false);
            return 0;
          }

          return previous - 1;
        });
      } else {
        setSeconds((previous) => previous + 1);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, isResting]);

  /* =====================================
     FORMATER LE TEMPS
  ===================================== */

  function formatTime(value: number) {
    const minutes = Math.floor(value / 60);
    const remainingSeconds = value % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  /* =====================================
     FAVORIS
  ===================================== */

  function toggleFavorite(id: string) {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  function toggleWorkoutFavorite(id: number) {
    toggleFavorite(String(id));
  }

  /* =====================================
     OUVRIR UN PROGRAMME
  ===================================== */

  function openWorkout(workout: Workout) {
    setSelectedWorkout(workout);
    setExerciseIndex(0);
    setCompletedExercises([]);
    setSeconds(0);
    setRestSeconds(0);
    setIsResting(false);
    setIsRunning(false);
    setSessionStarted(false);
    setView("detail");
    setActiveTab("workouts");
  }

  /* =====================================
     DÉMARRER UNE SÉANCE
  ===================================== */

  function startWorkout() {
    setExerciseIndex(0);
    setCompletedExercises([]);
    setSeconds(0);
    setRestSeconds(0);
    setIsResting(false);
    setSessionStarted(true);
    setIsRunning(true);
    setView("reader");
  }

  /* =====================================
     DÉMARRER LE REPOS
  ===================================== */

  function startRest() {
    setIsResting(true);
    setRestSeconds(currentExercise.rest);
  }

  /* =====================================
     EXERCICE SUIVANT
  ===================================== */

  function nextExercise() {
    setCompletedExercises((previous) =>
      previous.includes(currentExercise.id)
        ? previous
        : [...previous, currentExercise.id]
    );

    if (exerciseIndex >= totalExercises - 1) {
      finishWorkout();
      return;
    }

    setExerciseIndex((previous) => previous + 1);
    setIsResting(false);
    setRestSeconds(0);
    startRest();
  }

  /* =====================================
     EXERCICE PRÉCÉDENT
  ===================================== */

  function previousExercise() {
    if (exerciseIndex > 0) {
      setExerciseIndex((previous) => previous - 1);
      setIsResting(false);
      setRestSeconds(0);
    }
  }

  /* =====================================
     TERMINER UNE SÉANCE
  ===================================== */

  function finishWorkout() {
    setIsRunning(false);
    setIsResting(false);
    setRestSeconds(0);

    setCompletedWorkouts((previous) =>
      previous.includes(selectedWorkout.id)
        ? previous
        : [...previous, selectedWorkout.id]
    );

    setView("complete");
  }

  /* =====================================
     QUITTER UNE SÉANCE
  ===================================== */

  function quitWorkout() {
    setIsRunning(false);
    setIsResting(false);
    setRestSeconds(0);
    setView("detail");
  }

  /* =====================================
     NAVIGATION
  ===================================== */

  function navigate(tab: Tab) {
    setActiveTab(tab);
    setView(tab);
  }

  /* =====================================
     RETOUR
  ===================================== */

  function goBack() {
    if (view === "reader") {
      quitWorkout();
    } else if (view === "complete") {
      setView("home");
      setActiveTab("home");
    } else if (view === "detail") {
      setView("workouts");
      setActiveTab("workouts");
    } else {
      setView("home");
      setActiveTab("home");
    }
  }

  /* =====================================
     CLASSE CSS PRINCIPALE
  ===================================== */

  const appTheme = darkMode
    ? "bg-slate-950 text-white"
    : "bg-slate-50 text-slate-900";

  /* =====================================
     LE MORCEAU 5 CONTINUE ICI
  ===================================== */
  
  return (
    <main
      className={`min-h-screen pb-24 transition-colors ${appTheme}`}
    >
      {/* EN-TÊTE */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("home")}
            className="text-left"
          >
            <h1 className="text-2xl font-black tracking-tight text-blue-700">
              FIT PRO
            </h1>
            <p className="text-xs text-slate-500">
              Ton entraînement, tes objectifs
            </p>
          </button>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-5">

        {/* =================================
             PAGE ACCUEIL
        ================================= */}

        {view === "home" && (
          <div className="space-y-7">
            <section className="overflow-hidden rounded-3xl bg-blue-950 text-white">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="p-6">
                  <span className="rounded-full bg-blue-800 px-3 py-1 text-xs">
                    BIENVENUE SUR FIT PRO
                  </span>

                  <h2 className="mt-5 text-3xl font-black">
                    Dépasse tes limites !
                  </h2>

                  <p className="mt-3 text-sm text-blue-100">
                    Entraîne-toi à ton rythme et progresse chaque jour.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("workouts")}
                    className="mt-6 rounded-xl bg-white px-5 py-3 font-bold text-blue-950"
                  >
                    Voir les entraînements
                  </button>
                </div>

                <Photo
                  src={photos.home}
                  alt="Entraînement sportif"
                  className="h-48 w-full object-cover sm:h-full"
                />
              </div>
            </section>

            <section>
              <SectionTitle
                title="Ton activité"
                subtitle="Retrouve tes statistiques"
              />

              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  icon="trophy"
                  value={completedWorkouts.length}
                  label="Séances terminées"
                />

                <StatCard
                  icon="heart"
                  value={favorites.length}
                  label="Favoris"
                />

                <StatCard
                  icon="dumbbell"
                  value={workouts.length}
                  label="Programmes disponibles"
                />

                <StatCard
                  icon="fire"
                  value={workouts.reduce(
                    (total, workout) =>
                      total + workout.calories,
                    0
                  )}
                  label="Calories estimées pour toutes les séances"
                />
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <SectionTitle
                  title="Entraînements populaires"
                  subtitle="Choisis ton prochain programme"
                />

                <button
                  type="button"
                  onClick={() => navigate("workouts")}
                  className="text-sm font-bold text-blue-700"
                >
                  Tout voir
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {workouts.slice(0, 2).map((workout) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    favorite={favorites.includes(
                      String(workout.id)
                    )}
                    onFavorite={() =>
                      toggleWorkoutFavorite(workout.id)
                    }
                    onClick={() => openWorkout(workout)}
                  />
                ))}
              </div>
            </section>

            <section>
              <SectionTitle
                title="Commence aujourd'hui"
                subtitle="Un programme adapté à ton niveau"
              />

              <button
                type="button"
                onClick={() => openWorkout(workouts[9])}
                className="w-full rounded-2xl bg-blue-700 p-5 text-left text-white"
              >
                <p className="text-sm text-blue-100">
                  PROGRAMME CONSEILLÉ
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  Débutant à la maison
                </h3>

                <p className="mt-2 text-sm text-blue-100">
                  20 minutes · Sans matériel
                </p>
              </button>
            </section>
          </div>
        )}

        {/* =================================
             PAGE ENTRAÎNEMENTS
        ================================= */}

        {view === "workouts" && (
          <div className="space-y-5">
            <section>
              <h2 className="text-2xl font-black">
                Entraînements
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Découvre les 10 programmes FIT PRO.
              </p>
            </section>

            {/* RECHERCHE */}
            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Rechercher un entraînement..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
            />

            {/* FILTRES */}
            <div className="flex flex-wrap gap-2">
              {["Tous", "Débutant", "Intermédiaire", "Avancé"].map(
                (level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setLevelFilter(level)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      levelFilter === level
                        ? "bg-blue-700 text-white"
                        : "bg-white text-slate-600"
                    }`}
                  >
                    {level}
                  </button>
                )
              )}
            </div>

            {/* FILTRE FAVORIS */}
            <button
              type="button"
              onClick={() =>
                setShowFavoritesOnly(!showFavoritesOnly)
              }
              className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                showFavoritesOnly
                  ? "bg-red-100 text-red-700"
                  : "bg-white text-slate-600"
              }`}
            >
              {showFavoritesOnly
                ? "♥ Afficher tous les programmes"
                : "♡ Afficher uniquement les favoris"}
            </button>

            <p className="text-sm text-slate-500">
              {filteredWorkouts.length} programme(s) trouvé(s)
            </p>

            {/* CARTES */}
            {filteredWorkouts.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredWorkouts.map((workout) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    favorite={favorites.includes(
                      String(workout.id)
                    )}
                    onFavorite={() =>
                      toggleWorkoutFavorite(workout.id)
                    }
                    onClick={() => openWorkout(workout)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-8 text-center">
                <p className="text-lg font-bold">
                  Aucun entraînement trouvé
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Essaie une autre recherche ou un autre filtre.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setLevelFilter("Tous");
                    setShowFavoritesOnly(false);
                  }}
                  className="mt-4 rounded-xl bg-blue-700 px-5 py-3 text-white"
                >
                  Réinitialiser
                </button>
              </div>
            )}
          </div>
        )}

        {/* =================================
             DÉTAIL DU PROGRAMME
        ================================= */}

        {view === "detail" && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={goBack}
              className="font-semibold text-blue-700"
            >
              ← Retour aux entraînements
            </button>

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <Photo
                src={selectedWorkout.image}
                alt={selectedWorkout.title}
                className="h-56 w-full object-cover"
              />

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      {selectedWorkout.title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedWorkout.subtitle}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toggleWorkoutFavorite(selectedWorkout.id)
                    }
                    className="text-2xl"
                  >
                    {favorites.includes(
                      String(selectedWorkout.id)
                    )
                      ? "♥"
                      : "♡"}
                  </button>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {selectedWorkout.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <StatCard
                    icon="clock"
                    value={`${selectedWorkout.duration} min`}
                    label="Durée estimée"
                  />

                  <StatCard
                    icon="fire"
                    value={`${selectedWorkout.calories} kcal`}
                    label="Calories estimées"
                  />
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p>
                    <strong>Niveau :</strong>{" "}
                    {selectedWorkout.level}
                  </p>
                  <p className="mt-2">
                    <strong>Muscles :</strong>{" "}
                    {selectedWorkout.muscle}
                  </p>
                  <p className="mt-2">
                    <strong>Matériel :</strong>{" "}
                    {selectedWorkout.equipment}
                  </p>
                  <p className="mt-2">
                    <strong>Exercices :</strong>{" "}
                    {selectedWorkout.exercises.length}
                  </p>
                </div>
              </div>
            </div>

            <section>
              <SectionTitle
                title="Liste des exercices"
                subtitle="Découvre les mouvements de cette séance"
              />

              <div className="space-y-3">
                {selectedWorkout.exercises.map(
                  (exercise, index) => (
                    <div
                      key={exercise.id}
                      className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900">
                          {exercise.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {exercise.sets} séries ·{" "}
                          {exercise.duration
                            ? `${exercise.duration} secondes`
                            : `${exercise.reps} répétitions`}
                        </p>
                      </div>

                      <span className="text-xs text-slate-400">
                        {exercise.level}
                      </span>
                    </div>
                  )
                )}
              </div>
            </section>

            <button
              type="button"
              onClick={startWorkout}
              className="w-full rounded-2xl bg-blue-700 py-4 font-bold text-white shadow-lg"
            >
              ▶ Commencer l'entraînement
            </button>
          </div>
        )}
         
        {/* =================================
             LECTEUR D'EXERCICE
        ================================= */}

        {view === "reader" && currentExercise && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={quitWorkout}
              className="font-semibold text-blue-700"
            >
              ← Quitter la séance
            </button>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {selectedWorkout.title}
                </p>
                <h2 className="text-xl font-black">
                  Exercice {exerciseIndex + 1} / {totalExercises}
                </h2>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-2 text-sm font-bold text-blue-700">
                {progress} %
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${
                    ((exerciseIndex + 1) / totalExercises) * 100
                  }%`,
                }}
              />
            </div>

            <section className="rounded-3xl bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-2xl font-black text-slate-900">
                {currentExercise.name}
              </h2>

              <ExerciseVideo
                animationUrl={currentExercise.animationUrl}
                exerciseName={currentExercise.name}
              />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <StatCard
                  icon="dumbbell"
                  value={currentExercise.sets}
                  label="Séries"
                />

                <StatCard
                  icon="clock"
                  value={
                    currentExercise.duration
                      ? `${currentExercise.duration} sec`
                      : `${currentExercise.reps} reps`
                  }
                  label="Objectif"
                />
              </div>

              <div className="mt-4 rounded-2xl bg-blue-50 p-4">
                <h3 className="font-bold text-blue-900">
                  Comment réaliser le mouvement
                </h3>

                <p className="mt-2 text-sm leading-6 text-blue-900">
                  {currentExercise.instructions}
                </p>
              </div>

              <div className="mt-4 text-sm text-slate-500">
                <p>
                  <strong>Muscles :</strong>{" "}
                  {currentExercise.muscle}
                </p>

                <p className="mt-2">
                  <strong>Matériel :</strong>{" "}
                  {currentExercise.equipment}
                </p>

                <p className="mt-2">
                  <strong>Repos prévu :</strong>{" "}
                  {currentExercise.rest} secondes
                </p>
              </div>
            </section>

            {/* CHRONOMÈTRE */}
            <section className="rounded-3xl bg-slate-900 p-6 text-center text-white">
              <p className="text-sm text-slate-300">
                {isResting ? "Temps de repos" : "Temps de séance"}
              </p>

              <p className="my-3 text-5xl font-black tabular-nums">
                {formatTime(isResting ? restSeconds : seconds)}
              </p>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className="rounded-xl bg-blue-600 px-5 py-3 font-bold"
                >
                  {isRunning ? "Pause" : "Reprendre"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSeconds(0);
                    setRestSeconds(0);
                    setIsResting(false);
                  }}
                  className="rounded-xl bg-slate-700 px-5 py-3 font-bold"
                >
                  Réinitialiser
                </button>
              </div>
            </section>

            {isResting && (
              <div className="rounded-2xl bg-amber-50 p-4 text-center text-amber-900">
                <p className="font-bold">Récupération</p>
                <p className="mt-1 text-sm">
                  Respire tranquillement avant le prochain exercice.
                </p>
              </div>
            )}

            {/* COMMANDES */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={exerciseIndex === 0}
                onClick={previousExercise}
                className="rounded-xl border border-slate-200 bg-white py-4 font-bold text-slate-700 disabled:opacity-40"
              >
                ← Précédent
              </button>

              <button
                type="button"
                onClick={nextExercise}
                className="rounded-xl bg-blue-700 py-4 font-bold text-white"
              >
                {exerciseIndex === totalExercises - 1
                  ? "Terminer"
                  : "Exercice suivant →"}
              </button>
            </div>
          </div>
        )}

        {/* =================================
             FIN DE SÉANCE
        ================================= */}

        {view === "complete" && (
          <div className="py-12 text-center">
            <div className="text-7xl">🏆</div>

            <h2 className="mt-5 text-3xl font-black">
              Bravo !
            </h2>

            <p className="mt-3 text-slate-500">
              Tu as terminé ta séance FIT PRO.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <StatCard
                icon="clock"
                value={formatTime(seconds)}
                label="Temps écoulé"
              />

              <StatCard
                icon="dumbbell"
                value={completedExercises.length}
                label="Exercices terminés"
              />
            </div>

            <div className="mt-8 rounded-2xl bg-blue-50 p-5 text-blue-900">
              <p className="font-bold">
                Continue comme ça !
              </p>
              <p className="mt-2 text-sm">
                La régularité est la clé de ta progression.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setView("home");
                setActiveTab("home");
                setCompletedExercises([]);
              }}
              className="mt-8 w-full rounded-2xl bg-blue-700 py-4 font-bold text-white"
            >
              Retour à l'accueil
            </button>
          </div>
        )}

        {/* =================================
             NUTRITION
        ================================= */}

        {view === "nutrition" && (
          <div className="space-y-5">
            <SectionTitle
              title="Nutrition"
              subtitle="Quelques conseils pour accompagner tes entraînements"
            />

            <div className="rounded-3xl bg-green-700 p-6 text-white">
              <div className="text-4xl">🥗</div>
              <h2 className="mt-3 text-2xl font-black">
                Mange équilibré
              </h2>
              <p className="mt-2 text-sm text-green-100">
                Varie les légumes, les fruits, les protéines et les
                féculents selon tes besoins.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                {
                  icon: "💧",
                  title: "Hydratation",
                  description:
                    "Bois régulièrement de l'eau, notamment autour de tes séances.",
                },
                {
                  icon: "🥚",
                  title: "Protéines",
                  description:
                    "Les œufs, le poisson, les légumineuses et les viandes peuvent contribuer à la récupération musculaire.",
                },
                {
                  icon: "🍚",
                  title: "Énergie",
                  description:
                    "Le riz, les céréales, les fruits et les tubercules apportent de l'énergie.",
                },
                {
                  icon: "🥦",
                  title: "Légumes",
                  description:
                    "Consomme des légumes variés pour leurs fibres et micronutriments.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  <h3 className="font-bold text-slate-900">
                    {item.icon} {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500">
              Ces conseils sont généraux et ne remplacent pas les
              recommandations d'un professionnel de santé.
            </p>
          </div>
        )}

        {/* =================================
             PROGRESSION
        ================================= */}

        {view === "progress" && (
          <div className="space-y-5">
            <SectionTitle
              title="Ma progression"
              subtitle="Suis tes activités dans FIT PRO"
            />

            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon="trophy"
                value={completedWorkouts.length}
                label="Programmes terminés"
              />

              <StatCard
                icon="heart"
                value={favorites.length}
                label="Favoris"
              />
            </div>

            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="font-bold text-slate-900">
                Programmes disponibles
              </h3>

              <p className="mt-2 text-3xl font-black text-blue-700">
                {completedWorkouts.length} / {workouts.length}
              </p>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: `${
                      (completedWorkouts.length / workouts.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </section>

            <section>
              <SectionTitle title="Tes programmes" />

              <div className="space-y-3">
                {workouts.map((workout) => {
                  const completed =
                    completedWorkouts.includes(workout.id);

                  return (
                    <div
                      key={workout.id}
                      className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {workout.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {workout.duration} minutes
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-2 text-xs font-bold ${
                          completed
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {completed ? "Terminé ✓" : "À faire"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* =================================
             PARAMÈTRES
        ================================= */}

        {view === "settings" && (
          <div className="space-y-5">
            <SectionTitle
              title="Paramètres"
              subtitle="Personnalise ton application"
            />

            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="font-bold text-slate-900">
                Apparence
              </h3>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">
                    Mode sombre
                  </p>
                  <p className="text-xs text-slate-500">
                    Modifier l'apparence de l'application
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className="rounded-xl bg-blue-100 px-4 py-2 font-bold text-blue-700"
                >
                  {darkMode ? "Activé" : "Désactivé"}
                </button>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="font-bold text-slate-900">
                À propos
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                FIT PRO — Application d'entraînement sportif.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Version 1.0.0
              </p>
            </section>

            <section className="rounded-2xl bg-amber-50 p-5 text-amber-900">
              <h3 className="font-bold">
                Conseils de sécurité
              </h3>

              <p className="mt-2 text-sm leading-6">
                Échauffe-toi avant chaque séance. Adapte les exercices
                à ton niveau et arrête-toi en cas de douleur.
              </p>
            </section>
          </div>
        )}
      </div>

      {/* NAVIGATION DU BAS */}
      {view !== "reader" && view !== "complete" && (
        <BottomNavigation
          active={activeTab}
          onChange={navigate}
        />
      )}
    </main>
  );
                }
                
