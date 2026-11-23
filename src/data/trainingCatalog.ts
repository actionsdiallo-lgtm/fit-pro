export type DifficultyLevel = "Débutant" | "Intermédiaire" | "Avancé";

export type MotionType =
  | "pushup"
  | "incline_pushup"
  | "bench_press"
  | "chest_fly"
  | "chest_stretch"
  | "crunch"
  | "plank"
  | "leg_raise"
  | "bicep_curl"
  | "tricep_dip"
  | "wrist_curl"
  | "superman"
  | "back_extension"
  | "shoulder_press"
  | "lateral_raise"
  | "squat"
  | "lunge"
  | "glute_bridge"
  | "donkey_kick"
  | "calf_raise"
  | "jumping_jack"
  | "burpee"
  | "hamstring_stretch";

export interface TrainingCategory {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface ExerciseItem {
  slug: string;
  name: string;
  categories: string[];
  difficulty: DifficultyLevel;
  motionType: MotionType;
  photoUrl: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  recommendedDurationSec: number;
  reps: number;
  sets: number;
  restSeconds: number;
  caloriesPerSet: number;
  equipment: string[];
  goodPosture: string;
  mistakesToAvoid: string[];
  steps: string[];
  breathingTip: string;
  safetyTip: string;
}

export const TRAINING_CATEGORIES: TrainingCategory[] = [
  { slug: "tous-les-exercices", name: "Tous les exercices", description: "Catalogue complet FIT PRO", icon: "⚡" },
  { slug: "musculation", name: "Musculation", description: "Force et développement musculaire", icon: "🏋️" },
  { slug: "cardio", name: "Cardio", description: "Endurance et dépense calorique", icon: "🔥" },
  { slug: "flexibilite", name: "Flexibilité", description: "Mobilité articulaire et souplesse", icon: "🧘" },
  { slug: "abdominaux", name: "Abdominaux", description: "Sangle abdominale et gainage", icon: "🛡️" },
  { slug: "bras", name: "Bras", description: "Biceps et triceps toniques", icon: "💪" },
  { slug: "avant-bras", name: "Avant-bras", description: "Poigne et fléchisseurs", icon: "✊" },
  { slug: "poitrine", name: "Poitrine", description: "Pectoraux puissants et dessinés", icon: "🦅" },
  { slug: "dos", name: "Dos", description: "Posture et chaîne postérieure", icon: "🦾" },
  { slug: "epaules", name: "Épaules", description: "Deltoïdes et stabilité", icon: "🏔️" },
  { slug: "jambes", name: "Jambes", description: "Quadriceps et ischio-jambiers", icon: "🦵" },
  { slug: "fessiers", name: "Fessiers", description: "Galbe et puissance des hanches", icon: "🍑" },
  { slug: "mollets", name: "Mollets", description: "Explosivité et soutien", icon: "👟" },
  { slug: "etirements", name: "Étirements", description: "Récupération et relâchement", icon: "🌿" },
  { slug: "perte-de-poids", name: "Perte de poids", description: "Séances rythmées haute dépense", icon: "📉" },
  { slug: "prise-de-masse", name: "Prise de masse", description: "Hypertrophie et tension contrôlée", icon: "📈" },
  { slug: "debutant", name: "Débutant", description: "Bases solides accessibles à tous", icon: "🌱" },
  { slug: "intermediaire", name: "Intermédiaire", description: "Progression structurée et volume", icon: "⚙️" },
  { slug: "avance", name: "Avancé", description: "Intensité maximale et maîtrise", icon: "🏆" },
];

export const EXERCISES_CATALOG: ExerciseItem[] = [
  {
    slug: "pompes-classiques",
    name: "Pompes classiques",
    categories: ["poitrine", "musculation", "prise-de-masse", "debutant"],
    difficulty: "Débutant",
    motionType: "pushup",
    photoUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=1000&q=80",
    primaryMuscles: ["Grand pectoral", "Faisceau sternal"],
    secondaryMuscles: ["Triceps", "Deltoïde antérieur", "Abdominaux"],
    recommendedDurationSec: 45,
    reps: 12,
    sets: 3,
    restSeconds: 45,
    caloriesPerSet: 14,
    equipment: ["Poids du corps"],
    goodPosture: "Corps parfaitement aligné de la tête aux talons, mains sous les épaules, bassin gainé.",
    mistakesToAvoid: ["Creuser le bas du dos", "Écarter les coudes à 90 degrés", "Ne descendre qu'à moitié"],
    steps: [
      "Placez les mains au sol légèrement plus larges que les épaules.",
      "Tendez les jambes et contractez les abdominaux et les fessiers.",
      "Fléchissez les coudes pour descendre la poitrine près du sol.",
      "Poussez fermement dans les paumes pour revenir bras tendus."
    ],
    breathingTip: "Inspirez en descendant vers le sol, expirez en poussant vers le haut.",
    safetyTip: "Gardez la nuque neutre dans le prolongement de la colonne."
  },
  {
    slug: "pompes-inclinees",
    name: "Pompes inclinées",
    categories: ["poitrine", "debutant", "musculation"],
    difficulty: "Débutant",
    motionType: "incline_pushup",
    photoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=80",
    primaryMuscles: ["Pectoraux inférieurs"],
    secondaryMuscles: ["Triceps", "Épaules"],
    recommendedDurationSec: 40,
    reps: 15,
    sets: 3,
    restSeconds: 40,
    caloriesPerSet: 11,
    equipment: ["Banc ou support stable"],
    goodPosture: "Mains appuyées sur un support stable à hauteur des hanches, dos droit.",
    mistakesToAvoid: ["Relâcher le ventre", "Utiliser un support instable"],
    steps: [
      "Posez les mains sur le bord d'un banc solide.",
      "Reculez les pieds pour incliner le corps en ligne droite.",
      "Amenez le buste vers le support en contrôlant la descente.",
      "Repoussez jusqu'à l'extension complète des bras."
    ],
    breathingTip: "Inspirez à la descente, soufflez à la poussée.",
    safetyTip: "Vérifiez que le support ne glisse pas avant de démarrer."
  },
  {
    slug: "developpe-couche",
    name: "Développé couché",
    categories: ["poitrine", "musculation", "prise-de-masse", "intermediaire"],
    difficulty: "Intermédiaire",
    motionType: "bench_press",
    photoUrl: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=1000&q=80",
    primaryMuscles: ["Grand pectoral"],
    secondaryMuscles: ["Triceps brachial", "Deltoïde antérieur"],
    recommendedDurationSec: 50,
    reps: 10,
    sets: 4,
    restSeconds: 60,
    caloriesPerSet: 18,
    equipment: ["Banc", "Haltères ou barre"],
    goodPosture: "Omoplates serrées contre le banc, pieds ancrés au sol, poignets droits.",
    mistakesToAvoid: ["Décoller les fesses du banc", "Faire rebondir la charge sur la poitrine"],
    steps: [
      "Allongez-vous sur le banc les pieds bien à plat au sol.",
      "Descendez la charge au niveau du milieu de la poitrine.",
      "Marquez un court contrôle en bas sans relâcher la tension.",
      "Poussez verticalement jusqu'à tendre les bras sans verrouiller brutalement."
    ],
    breathingTip: "Inspirez profondément avant de descendre, expirez en fin de poussée.",
    safetyTip: "Ne cambrez pas excessivement les lombaires."
  },
  {
    slug: "ecartes-pectoraux",
    name: "Écartés aux haltères",
    categories: ["poitrine", "prise-de-masse", "intermediaire"],
    difficulty: "Intermédiaire",
    motionType: "chest_fly",
    photoUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1000&q=80",
    primaryMuscles: ["Pectoraux (faisceau interne et externe)"],
    secondaryMuscles: ["Deltoïde antérieur", "Biceps (stabilisation)"],
    recommendedDurationSec: 45,
    reps: 12,
    sets: 3,
    restSeconds: 45,
    caloriesPerSet: 13,
    equipment: ["Haltères", "Banc ou tapis"],
    goodPosture: "Coudes légèrement fléchis et verrouillés dans le même angle tout au long du mouvement.",
    mistakesToAvoid: ["Descendre les bras trop bas sous le niveau des épaules", "Tendre complètement les coudes"],
    steps: [
      "Tenez les haltères au-dessus de la poitrine, paumes face à face.",
      "Ouvrez les bras en arc de cercle en gardant les coudes souples.",
      "Arrêtez l'ouverture dès que les coudes arrivent à hauteur du buste.",
      "Contractez les pectoraux pour ramener les haltères l'un vers l'autre."
    ],
    breathingTip: "Inspirez pendant l'ouverture, expirez en refermant les bras.",
    safetyTip: "Privilégiez un mouvement lent plutôt qu'une charge trop lourde."
  },
  {
    slug: "etirement-poitrine",
    name: "Étirement de la poitrine",
    categories: ["poitrine", "etirements", "flexibilite", "debutant"],
    difficulty: "Débutant",
    motionType: "chest_stretch",
    photoUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1000&q=80",
    primaryMuscles: ["Grand pectoral", "Petit pectoral"],
    secondaryMuscles: ["Deltoïde antérieur", "Biceps"],
    recommendedDurationSec: 40,
    reps: 6,
    sets: 2,
    restSeconds: 20,
    caloriesPerSet: 5,
    equipment: ["Aucun"],
    goodPosture: "Buste ouvert, épaules basses et dégagées des oreilles, regard droit devant.",
    mistakesToAvoid: ["Bloquer la respiration", "Forcer brusquement sur l'articulation de l'épaule"],
    steps: [
      "Tenez-vous droit, entrelacez les mains derrière le dos ou appuyez l'avant-bras contre un mur.",
      "Ouvrez doucement la cage thoracique vers l'avant.",
      "Maintenez l'étirement 20 à 30 secondes sans à-coups.",
      "Relâchez lentement et répétez."
    ],
    breathingTip: "Respirez lentement et profondément par le nez et la bouche.",
    safetyTip: "L'étirement doit rester confortable, jamais douloureux."
  },
  {
    slug: "crunch-abdominal",
    name: "Crunch abdominal",
    categories: ["abdominaux", "perte-de-poids", "debutant"],
    difficulty: "Débutant",
    motionType: "crunch",
    photoUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1000&q=80",
    primaryMuscles: ["Grand droit de l'abdomen"],
    secondaryMuscles: ["Obliques"],
    recommendedDurationSec: 45,
    reps: 16,
    sets: 3,
    restSeconds: 30,
    caloriesPerSet: 12,
    equipment: ["Tapis"],
    goodPosture: "Bas du dos plaqué au sol, menton décollé de la poitrine, mains derrière les tempes.",
    mistakesToAvoid: ["Tirer sur la nuque avec les mains", "Décoller le bas du dos"],
    steps: [
      "Allongez-vous sur le dos, genoux fléchis et pieds au sol.",
      "Placez le bout des doigts près des tempes.",
      "Enroulez le haut du buste en contractant fort les abdominaux.",
      "Redescendez lentement sans reposer complètement les épaules."
    ],
    breathingTip: "Expirez en montant le buste, inspirez en redescendant.",
    safetyTip: "Fixez un point au plafond pour protéger vos cervicales."
  },
  {
    slug: "planche-gainage",
    name: "Planche abdominale",
    categories: ["abdominaux", "musculation", "perte-de-poids", "debutant", "intermediaire"],
    difficulty: "Débutant",
    motionType: "plank",
    photoUrl: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=1000&q=80",
    primaryMuscles: ["Transverse", "Grand droit de l'abdomen"],
    secondaryMuscles: ["Obliques", "Lombaires", "Épaules", "Fessiers"],
    recommendedDurationSec: 45,
    reps: 1,
    sets: 3,
    restSeconds: 30,
    caloriesPerSet: 12,
    equipment: ["Tapis"],
    goodPosture: "Coudes sous les épaules, bassin rétroverse, corps aligné comme une planche.",
    mistakesToAvoid: ["Monter les fesses trop haut", "Laisser le bassin s'affaisser"],
    steps: [
      "Appuyez-vous sur les avant-bras et la pointe des pieds.",
      "Contractez les fessiers et rentrez le nombril vers la colonne.",
      "Maintenez la position immobile en respirant régulièrement."
    ],
    breathingTip: "Gardez une respiration fluide et continue, ne bloquez jamais l'air.",
    safetyTip: "Stoppez la série si vous sentez une tension dans le bas du dos."
  },
  {
    slug: "releves-de-jambes",
    name: "Relevés de jambes au sol",
    categories: ["abdominaux", "intermediaire", "avance"],
    difficulty: "Intermédiaire",
    motionType: "leg_raise",
    photoUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80",
    primaryMuscles: ["Partie inférieure du grand droit"],
    secondaryMuscles: ["Fléchisseurs de la hanche", "Transverse"],
    recommendedDurationSec: 45,
    reps: 12,
    sets: 3,
    restSeconds: 40,
    caloriesPerSet: 14,
    equipment: ["Tapis"],
    goodPosture: "Lombaires collées au tapis, jambes tendues ou très légèrement fléchies.",
    mistakesToAvoid: ["Cambrer le dos à la descente", "Laisser tomber les jambes brusquement"],
    steps: [
      "Allongez-vous sur le dos, bras le long du corps.",
      "Levez les jambes jointes jusqu'à la verticale.",
      "Redescendez-les lentement jusqu'à quelques centimètres du sol sans cambrer."
    ],
    breathingTip: "Expirez en montant les jambes, inspirez en contrôlant la descente.",
    safetyTip: "Pliez légèrement les genoux si le bas du dos se décolle."
  },
  {
    slug: "curl-biceps",
    name: "Curl biceps alterné",
    categories: ["bras", "musculation", "prise-de-masse", "debutant"],
    difficulty: "Débutant",
    motionType: "bicep_curl",
    photoUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80",
    primaryMuscles: ["Biceps brachial"],
    secondaryMuscles: ["Brachial antérieur", "Avant-bras"],
    recommendedDurationSec: 45,
    reps: 12,
    sets: 3,
    restSeconds: 40,
    caloriesPerSet: 12,
    equipment: ["Haltères ou bouteilles lestées"],
    goodPosture: "Buste droit, coudes fixes collés près des côtes, épaules basses.",
    mistakesToAvoid: ["Balancer le dos pour monter la charge", "Avancer les coudes"],
    steps: [
      "Tenez un haltère dans chaque main, bras le long du corps.",
      "Fléchissez un coude pour amener la charge vers l'épaule.",
      "Contractez le biceps en haut puis redescendez en contrôlant."
    ],
    breathingTip: "Expirez à la montée, inspirez à la descente.",
    safetyTip: "Gardez les poignets alignés avec les avant-bras."
  },
  {
    slug: "dips-triceps",
    name: "Extensions triceps sur banc",
    categories: ["bras", "musculation", "intermediaire"],
    difficulty: "Intermédiaire",
    motionType: "tricep_dip",
    photoUrl: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&w=1000&q=80",
    primaryMuscles: ["Triceps brachial"],
    secondaryMuscles: ["Deltoïde antérieur", "Pectoraux"],
    recommendedDurationSec: 45,
    reps: 12,
    sets: 3,
    restSeconds: 45,
    caloriesPerSet: 14,
    equipment: ["Banc ou chaise stable"],
    goodPosture: "Dos proche du bord du banc, coudes dirigés vers l'arrière.",
    mistakesToAvoid: ["Éloigner le bassin du banc", "Écarter les coudes sur les côtés"],
    steps: [
      "Placez les mains sur le bord d'un banc derrière vous.",
      "Fléchissez les coudes pour descendre le bassin verticalement.",
      "Poussez dans les paumes pour remonter jusqu'à l'extension des bras."
    ],
    breathingTip: "Inspirez en descendant, expirez en poussant vers le haut.",
    safetyTip: "Ne descendez pas plus bas que 90 degrés aux coudes."
  },
  {
    slug: "flexion-poignets-avant-bras",
    name: "Flexion des poignets",
    categories: ["avant-bras", "bras", "musculation", "debutant"],
    difficulty: "Débutant",
    motionType: "wrist_curl",
    photoUrl: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1000&q=80",
    primaryMuscles: ["Fléchisseurs de l'avant-bras"],
    secondaryMuscles: ["Muscles de la poigne"],
    recommendedDurationSec: 35,
    reps: 15,
    sets: 3,
    restSeconds: 30,
    caloriesPerSet: 8,
    equipment: ["Haltères légers"],
    goodPosture: "Avant-bras posés à plat sur les cuisses ou un banc, seuls les poignets bougent.",
    mistakesToAvoid: ["Décoller les avant-bras", "Utiliser une charge trop lourde"],
    steps: [
      "Asseyez-vous et posez les avant-bras sur vos cuisses, paumes vers le haut.",
      "Laissez descendre la charge au bout des doigts.",
      "Enroulez les poignets vers le haut en contractant les avant-bras."
    ],
    breathingTip: "Expirez en fléchissant les poignets, inspirez en relâchant.",
    safetyTip: "Privilégiez un rythme fluide sans à-coups."
  },
  {
    slug: "superman-dos",
    name: "Superman au sol",
    categories: ["dos", "flexibilite", "debutant"],
    difficulty: "Débutant",
    motionType: "superman",
    photoUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1000&q=80",
    primaryMuscles: ["Érecteurs du rachis (lombaires)", "Grand dorsal"],
    secondaryMuscles: ["Fessiers", "Deltoïdes postérieurs"],
    recommendedDurationSec: 40,
    reps: 12,
    sets: 3,
    restSeconds: 35,
    caloriesPerSet: 10,
    equipment: ["Tapis"],
    goodPosture: "Regard dirigé vers le tapis pour garder la nuque alignée, mouvements lents.",
    mistakesToAvoid: ["Relever brusquement la tête", "Donner des à-coups avec le bas du dos"],
    steps: [
      "Allongez-vous sur le ventre, bras tendus devant vous.",
      "Décollez simultanément la poitrine, les bras et les jambes de quelques centimètres.",
      "Maintenez 2 secondes en haut puis reposez doucement."
    ],
    breathingTip: "Expirez lors de l'élévation, inspirez au retour au sol.",
    safetyTip: "Recherchez l'allongement plutôt que la hauteur maximale."
  },
  {
    slug: "extensions-dorsales",
    name: "Extensions dorsales",
    categories: ["dos", "musculation", "intermediaire"],
    difficulty: "Intermédiaire",
    motionType: "back_extension",
    photoUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1000&q=80",
    primaryMuscles: ["Chaîne postérieure", "Lombaires", "Trapèzes moyens"],
    secondaryMuscles: ["Fessiers", "Ischio-jambiers"],
    recommendedDurationSec: 45,
    reps: 12,
    sets: 3,
    restSeconds: 40,
    caloriesPerSet: 12,
    equipment: ["Tapis"],
    goodPosture: "Omoplates resserrées, coudes tirés vers l'arrière, bassin stable au sol.",
    mistakesToAvoid: ["Hyper-cambrer la colonne", "Crisper les trapèzes supérieurs"],
    steps: [
      "Allongez-vous face au sol, mains derrière les oreilles.",
      "Soulevez le buste en resserrant les omoplates.",
      "Redescendez lentement sans relâcher la sangle abdominale."
    ],
    breathingTip: "Expirez en redressant le buste, inspirez en redescendant.",
    safetyTip: "Gardez les pointes de pieds en contact avec le sol."
  },
  {
    slug: "developpe-epaules",
    name: "Développé épaules",
    categories: ["epaules", "musculation", "prise-de-masse", "intermediaire"],
    difficulty: "Intermédiaire",
    motionType: "shoulder_press",
    photoUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1000&q=80",
    primaryMuscles: ["Deltoïde antérieur et moyen"],
    secondaryMuscles: ["Triceps", "Trapèzes supérieurs"],
    recommendedDurationSec: 45,
    reps: 10,
    sets: 3,
    restSeconds: 45,
    caloriesPerSet: 14,
    equipment: ["Haltères"],
    goodPosture: "Abdominaux contractés pour éviter de cambrer le dos, coudes légèrement en avant.",
    mistakesToAvoid: ["Cambrer les lombaires sous la charge", "Entrechoquer les haltères en haut"],
    steps: [
      "Amenez les haltères à hauteur des oreilles, paumes vers l'avant.",
      "Poussez les charges au-dessus de la tête jusqu'à tendre les bras.",
      "Redescendez lentement à la position de départ."
    ],
    breathingTip: "Expirez en poussant vers le ciel, inspirez à la descente.",
    safetyTip: "Gardez les côtes basses et les abdominaux engagés."
  },
  {
    slug: "elevations-laterales",
    name: "Élévations latérales",
    categories: ["epaules", "musculation", "debutant", "intermediaire"],
    difficulty: "Débutant",
    motionType: "lateral_raise",
    photoUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?auto=format&fit=crop&w=1000&q=80",
    primaryMuscles: ["Deltoïde latéral"],
    secondaryMuscles: ["Trapèzes", "Coiffe des rotateurs"],
    recommendedDurationSec: 40,
    reps: 14,
    sets: 3,
    restSeconds: 35,
    caloriesPerSet: 10,
    equipment: ["Haltères légers"],
    goodPosture: "Buste droit, coudes légèrement fléchis, épaules basses.",
        mistakesToAvoid: ["Monter les épaules vers les oreilles", "Balancer le buste", "Lever les bras au-dessus de l'horizontale"],
    steps: [
      "Tenez-vous droit avec un haltère dans chaque main, bras le long du corps.",
      "Levez les bras sur les côtés jusqu'à hauteur d'épaules en gardant une légère flexion des coudes.",
      "Redescendez lentement et de façon contrôlée jusqu'à la position de départ."
    ],
    breathingTip: "Expirez en montant les bras, inspirez en redescendant.",
    safetyTip: "Gardez les poignets neutres et évitez de hausser les épaules."
  }
];

