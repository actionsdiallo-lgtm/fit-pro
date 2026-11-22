export type CategorieNom =
  | "Tous"
  | "Musculation"
  | "Cardio"
  | "Flexibilité"
  | "Abdos"
  | "Bras"
  | "Avant-bras"
  | "Poitrine"
  | "Jambes"
  | "Fessiers"
  | "Épaules et dos";

export type NiveauProgramme = "Débutant" | "Intermédiaire" | "Avancé";

export type ZoneMuscle =
  | "dos"
  | "pectoraux"
  | "abdos"
  | "bras"
  | "avant-bras"
  | "jambes"
  | "fessiers";

export type MouvementAnime2D =
  | "superman"
  | "pompe"
  | "abdos"
  | "squat"
  | "bras"
  | "etirement";

export interface ExerciceReel {
  id: string;
  nom: string;
  categorie: Exclude<CategorieNom, "Tous">;
  niveau: NiveauProgramme;
  photoUrl: string;
  photoAlt: string;
  seriesCibles: number;
  repetitionsCibles: number;
  dureeSecondes: number;
  reposSecondes: number;
  metEstime: number;
  mouvement2D: MouvementAnime2D;
  musclesPrincipaux: string[];
  zonesCiblees: ZoneMuscle[];
  bonnePosture: string[];
  erreursAEviter: string[];
  etapes: string[];
  vocal: {
    fr: string;
    en: string;
    ar: string;
  };
}

export interface SeanceEnregistree {
  id: string;
  categorie: string;
  programmeTitre: string;
  niveau: string;
  dureeSecondes: number;
  caloriesEstimees: number;
  exercicesFaits: number;
  totalExercices: number;
  completedAt: string;
}

export const CATEGORIES_LISTE: { nom: CategorieNom; slug: string }[] = [
  { nom: "Tous", slug: "tous" },
  { nom: "Musculation", slug: "musculation" },
  { nom: "Cardio", slug: "cardio" },
  { nom: "Flexibilité", slug: "flexibilite" },
  { nom: "Abdos", slug: "abdos" },
  { nom: "Bras", slug: "bras" },
  { nom: "Avant-bras", slug: "avant-bras" },
  { nom: "Poitrine", slug: "poitrine" },
  { nom: "Jambes", slug: "jambes" },
  { nom: "Fessiers", slug: "fessiers" },
  { nom: "Épaules et dos", slug: "epaules-et-dos" },
];

export const EXERCICES_REELS: ExerciceReel[] = [
  {
    id: "ex-dos-1",
    nom: "Extension dorsale au tapis",
    categorie: "Épaules et dos",
    niveau: "Débutant",
    photoUrl: "/images/exercices/superman.jpg",
    photoAlt: "Extension dorsale au tapis",
    seriesCibles: 3,
    repetitionsCibles: 12,
    dureeSecondes: 30,
    reposSecondes: 15,
    metEstime: 4.5,
    mouvement2D: "superman",
    musclesPrincipaux: ["Érecteurs du rachis", "Trapèzes", "Fessiers"],
    zonesCiblees: ["dos", "fessiers"],
    bonnePosture: ["Nuque alignée avec la colonne", "Abdos gainés"],
    erreursAEviter: ["Lever la tête trop haut", "Mouvements brusques"],
    etapes: [
      "Allonge-toi sur le ventre, bras et jambes tendus.",
      "Décolle bras et jambes avec contrôle.",
      "Redescends doucement et répète.",
    ],
    vocal: {
      fr: "Extension dorsale. Gardez la nuque alignée et levez avec contrôle.",
      en: "Back extension. Keep your neck neutral and lift under control.",
      ar: "تمرين تقوية الظهر. حافظ على استقامة الرقبة وارفع بتحكم.",
    },
  },
  {
    id: "ex-muscu-1",
    nom: "Rowing et gainage haut du corps",
    categorie: "Musculation",
    niveau: "Intermédiaire",
    photoUrl: "/images/exercices/gainage.jpg",
    photoAlt: "Musculation haut du corps",
    seriesCibles: 4,
    repetitionsCibles: 12,
    dureeSecondes: 35,
    reposSecondes: 20,
    metEstime: 6.0,
    mouvement2D: "bras",
    musclesPrincipaux: ["Grand dorsal", "Rhomboïdes", "Biceps"],
    zonesCiblees: ["dos", "bras"],
    bonnePosture: ["Dos plat", "Coudes près du buste"],
    erreursAEviter: ["Arrondir le dos", "Hausser les épaules"],
    etapes: [
      "Adopte une posture stable avec le tronc gainé.",
      "Tire les coudes vers l'arrière.",
      "Reviens lentement à la position initiale.",
    ],
    vocal: {
      fr: "Musculation : gardez le dos plat et tirez avec contrôle.",
      en: "Strength: keep your back flat and pull with control.",
      ar: "تمارين القوة: حافظ على استقامة الظهر واسحب بتحكم.",
    },
  },
  {
    id: "ex-cardio-1",
    nom: "Cardio dynamique et endurance",
    categorie: "Cardio",
    niveau: "Intermédiaire",
    photoUrl: "/images/exercices/cardio.jpg",
    photoAlt: "Séance cardio",
    seriesCibles: 4,
    repetitionsCibles: 20,
    dureeSecondes: 40,
    reposSecondes: 15,
    metEstime: 8.0,
    mouvement2D: "squat",
    musclesPrincipaux: ["Cardio", "Quadriceps", "Mollets"],
    zonesCiblees: ["jambes", "abdos"],
    bonnePosture: ["Buste gainé", "Appuis souples"],
    erreursAEviter: ["Bloquer la respiration", "Talons lourds"],
    etapes: [
      "Démarre sur un rythme fluide.",
      "Enchaîne en respirant calmement.",
      "Récupère pendant le repos.",
    ],
    vocal: {
      fr: "Cardio : gardez une respiration régulière et un rythme fluide.",
      en: "Cardio: keep a steady breath and smooth pace.",
      ar: "الكارديو: حافظ على تنفس منتظم وإيقاع ثابت.",
    },
  },
  {
    id: "ex-flex-1",
    nom: "Étirement chaîne postérieure",
    categorie: "Flexibilité",
    niveau: "Débutant",
    photoUrl: "/images/exercices/etirement.jpg",
    photoAlt: "Étirement de souplesse",
    seriesCibles: 3,
    repetitionsCibles: 10,
    dureeSecondes: 35,
    reposSecondes: 15,
    metEstime: 3.0,
    mouvement2D: "etirement",
    musclesPrincipaux: ["Ischio-jambiers", "Mollets", "Dos"],
    zonesCiblees: ["jambes", "dos"],
    bonnePosture: ["Mouvement progressif", "Respiration lente"],
    erreursAEviter: ["Rebondir", "Forcer jusqu'à la douleur"],
    etapes: [
      "Installe-toi confortablement sur le tapis.",
      "Étire en douceur jusqu'à une tension légère.",
      "Maintiens puis relâche lentement.",
    ],
    vocal: {
      fr: "Flexibilité : étirez-vous en douceur sans rebondir.",
      en: "Flexibility: stretch gently without bouncing.",
      ar: "المرونة: قم بالإطالة بلطف دون ارتداد.",
    },
  },
  {
    id: "ex-abdos-1",
    nom: "Crunch contrôlé et abdos",
    categorie: "Abdos",
    niveau: "Intermédiaire",
    photoUrl: "/images/exercices/crunch.jpg",
    photoAlt: "Exercice abdominaux",
    seriesCibles: 4,
    repetitionsCibles: 18,
    dureeSecondes: 30,
    reposSecondes: 15,
    metEstime: 5.0,
    mouvement2D: "abdos",
    musclesPrincipaux: ["Grand droit", "Obliques", "Transverse"],
    zonesCiblees: ["abdos"],
    bonnePosture: ["Menton légèrement décollé", "Abdos contractés"],
    erreursAEviter: ["Tirer sur la nuque", "Décoller brutalement le dos"],
    etapes: [
      "Allonge-toi sur le dos, genoux fléchis.",
      "Contracte les abdos pour relever le buste.",
      "Redescends lentement.",
    ],
    vocal: {
      fr: "Abdos : contractez la sangle abdominale sans tirer sur la nuque.",
      en: "Abs: brace your core without pulling on your neck.",
      ar: "البطن: شد عضلات البطن دون سحب الرقبة.",
    },
  },
  {
    id: "ex-bras-1",
    nom: "Curl et renforcement des bras",
    categorie: "Bras",
    niveau: "Débutant",
    photoUrl: "/images/exercices/curl.jpg",
    photoAlt: "Exercice des bras",
    seriesCibles: 3,
    repetitionsCibles: 12,
    dureeSecondes: 30,
    reposSecondes: 15,
    metEstime: 4.5,
    mouvement2D: "bras",
    musclesPrincipaux: ["Biceps", "Triceps"],
    zonesCiblees: ["bras", "avant-bras"],
    bonnePosture: ["Coudes fixes", "Buste stable"],
    erreursAEviter: ["Balancer le buste", "Avancer les coudes"],
    etapes: [
      "Place les bras le long du corps.",
      "Fléchis avec contrôle.",
      "Reviens lentement.",
    ],
    vocal: {
      fr: "Bras : gardez les coudes fixes et contrôlez le mouvement.",
      en: "Arms: keep elbows pinned and control the movement.",
      ar: "الذراعين: حافظ على ثبات المرفقين وتحكم في الحركة.",
    },
  },
  {
    id: "ex-avant-bras-1",
    nom: "Renforcement avant-bras et prise",
    categorie: "Avant-bras",
    niveau: "Débutant",
    photoUrl: "/images/exercices/curl.jpg",
    photoAlt: "Exercice avant-bras",
    seriesCibles: 3,
    repetitionsCibles: 15,
    dureeSecondes: 30,
    reposSecondes: 15,
    metEstime: 4.0,
    mouvement2D: "bras",
    musclesPrincipaux: ["Avant-bras", "Poignets"],
    zonesCiblees: ["avant-bras"],
    bonnePosture: ["Avant-bras stables", "Amplitude régulière"],
    erreursAEviter: ["Forcer le poignet", "Précipiter les répétitions"],
    etapes: [
      "Stabilise l'avant-bras.",
      "Exécute la répétition avec contrôle.",
      "Relâche pendant la pause.",
    ],
    vocal: {
      fr: "Avant-bras : contrôlez l'amplitude sans forcer le poignet.",
      en: "Forearms: control range without straining the wrist.",
      ar: "الساعد: تحكم في الحركة دون إجهاد المعصم.",
    },
  },
  {
    id: "ex-poitrine-1",
    nom: "Pompes contrôlées poitrine",
    categorie: "Poitrine",
    niveau: "Intermédiaire",
    photoUrl: "/images/exercices/pompes.jpg",
    photoAlt: "Pompes poitrine",
    seriesCibles: 4,
    repetitionsCibles: 12,
    dureeSecondes: 30,
    reposSecondes: 20,
    metEstime: 6.5,
    mouvement2D: "pompe",
    musclesPrincipaux: ["Grand pectoral", "Triceps", "Épaules"],
    zonesCiblees: ["pectoraux", "bras"],
    bonnePosture: ["Corps aligné", "Coudes à 45 degrés"],
    erreursAEviter: ["Creuser le bas du dos", "Écarter les coudes à 90 degrés"],
    etapes: [
      "Mains placées sous ou légèrement en dehors des épaules.",
      "Descends le buste en gainant.",
      "Pousse fort pour remonter.",
    ],
    vocal: {
      fr: "Poitrine : gardez le corps gainé et descendez avec contrôle.",
      en: "Chest: keep your body braced and lower under control.",
      ar: "الصدر: حافظ على شد الجسم وأنزل بتحكم.",
    },
  },
  {
    id: "ex-jambes-1",
    nom: "Squat complet et jambes",
    categorie: "Jambes",
    niveau: "Avancé",
    photoUrl: "/images/exercices/squat.jpg",
    photoAlt: "Squat jambes",
    seriesCibles: 4,
    repetitionsCibles: 15,
    dureeSecondes: 35,
    reposSecondes: 20,
    metEstime: 7.5,
    mouvement2D: "squat",
    musclesPrincipaux: ["Quadriceps", "Fessiers", "Ischio-jambiers"],
    zonesCiblees: ["jambes", "fessiers"],
    bonnePosture: ["Talons au sol", "Genoux alignés"],
    erreursAEviter: ["Genoux qui rentrent", "Arrondir le dos"],
    etapes: [
      "Fléchis les hanches et les genoux.",
      "Descends de façon maîtrisée.",
      "Remonte en poussant dans les talons.",
    ],
    vocal: {
      fr: "Jambes : gardez les talons au sol et les genoux alignés.",
      en: "Legs: keep heels planted and knees aligned.",
      ar: "الأرجل: حافظ على ثبات الكعبين واستقامة الركبتين.",
    },
  },
  {
    id: "ex-fessiers-1",
    nom: "Extension fessiers et fentes",
    categorie: "Fessiers",
    niveau: "Intermédiaire",
    photoUrl: "/images/exercices/fessiers.jpg",
    photoAlt: "Exercice fessiers",
    seriesCibles: 4,
    repetitionsCibles: 15,
    dureeSecondes: 30,
    reposSecondes: 15,
    metEstime: 6.0,
    mouvement2D: "squat",
    musclesPrincipaux: ["Grand fessier", "Moyen fessier"],
    zonesCiblees: ["fessiers", "jambes"],
    bonnePosture: ["Bassin stable", "Contraction en fin de course"],
    erreursAEviter: ["Cambrer le bas du dos", "Précipiter le retour"],
    etapes: [
      "Adopte la position de départ.",
      "Contracte les fessiers sur l'effort.",
      "Reviens avec contrôle.",
    ],
    vocal: {
      fr: "Fessiers : contractez le fessier en haut sans cambrer le dos.",
      en: "Glutes: squeeze at the top without arching your back.",
      ar: "المؤخرة: شد العضلة في الأعلى دون تقوس الظهر.",
    },
  },
];
      
