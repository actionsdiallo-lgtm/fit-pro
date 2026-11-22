"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

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

export interface ProgrammeFitPro {
  id: string;
  titre: string;
  categorie: Exclude<CategorieNom, "Tous">;
  niveau: NiveauProgramme;
  objectif: string;
  exercices: ExerciceReel[];
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
  repetitionsEffectuees?: number;
  seriesTerminees?: number;
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

export function categorieToSlug(cat: Exclude<CategorieNom, "Tous">): string {
  const found = CATEGORIES_LISTE.find((c) => c.nom === cat);
  return found ? found.slug : "musculation";
}

export const EXERCICES_REELS: ExerciceReel[] = [
  {
    id: "ex-dos-superman",
    nom: "Extension dorsale au tapis",
    categorie: "Épaules et dos",
    niveau: "Débutant",
    photoUrl: "/images/exercices/superman.jpg",
    photoAlt: "Athlète réalisant une extension du dos au tapis",
    seriesCibles: 3,
    repetitionsCibles: 12,
    dureeSecondes: 30,
    reposSecondes: 15,
    metEstime: 4.5,
    mouvement2D: "superman",
    musclesPrincipaux: ["Érecteurs du rachis", "Trapèzes", "Fessiers"],
    zonesCiblees: ["dos", "fessiers"],
    bonnePosture: [
      "Tête neutre alignée avec la colonne vertébrale.",
      "Sangle abdominale légèrement gainée pour protéger les lombaires.",
    ],
    erreursAEviter: [
      "Casser la nuque en levant trop haut la tête.",
      "Donner des à-coups rapides au lieu d'un contrôle fluide.",
    ],
    etapes: [
      "Allonge-toi sur le ventre sur le tapis, bras et jambes tendus.",
      "Décolle bras et jambes de quelques centimètres en expirant.",
      "Maintiens brièvement puis redescends avec contrôle.",
    ],
    vocal: {
      fr: "Extension dorsale au tapis. Gardez la nuque alignée, levez avec contrôle et évitez les à-coups.",
      en: "Floor back extension. Keep your neck neutral, lift under control, and avoid jerky movements.",
      ar: "تمرين تقوية الظهر على الأرض. حافظ على استقامة الرقبة وارفع بتحكم دون اندفاع.",
    },
  },
  {
    id: "ex-muscu-rowing",
    nom: "Rowing & gainage haut du corps",
    categorie: "Musculation",
    niveau: "Intermédiaire",
    photoUrl: "/images/exercices/gainage.jpg",
    photoAlt: "Athlète en séance de musculation haut du corps",
    seriesCibles: 4,
    repetitionsCibles: 12,
    dureeSecondes: 35,
    reposSecondes: 20,
    metEstime: 6.0,
    mouvement2D: "bras",
    musclesPrincipaux: ["Grand dorsal", "Rhomboïdes", "Biceps"],
    zonesCiblees: ["dos", "bras"],
    bonnePosture: [
      "Dos plat et épaules abaissées loin des oreilles.",
      "Coudes tirés vers l'arrière près du buste.",
    ],
    erreursAEviter: [
      "Arrondir le haut du dos pendant la traction.",
      "Hausser les épaules à chaque répétition.",
    ],
    etapes: [
      "Place-toi en position stable avec le tronc gainé.",
      "Tire les coudes en arrière en resserrant les omoplates.",
      "Reviens lentement à la position initiale.",
    ],
    vocal: {
      fr: "Musculation : gardez le dos plat, tirez avec les coudes et contrôlez le retour.",
      en: "Strength: keep your back flat, pull with your elbows, and control the return.",
      ar: "تمارين القوة: حافظ على استقامة الظهر واسحب بالمرفقين مع التحكم في العودة.",
    },
  },
  {
    id: "ex-cardio-hiit",
    nom: "Cardio dynamique & endurance",
    categorie: "Cardio",
    niveau: "Intermédiaire",
    photoUrl: "/images/exercices/cardio.jpg",
    photoAlt: "Sportif en séance cardio intensive",
    seriesCibles: 4,
    repetitionsCibles: 20,
    dureeSecondes: 40,
    reposSecondes: 15,
    metEstime: 8.0,
    mouvement2D: "squat",
    musclesPrincipaux: ["Système cardiovasculaire", "Quadriceps", "Mollets"],
    zonesCiblees: ["jambes", "abdos"],
    bonnePosture: [
      "Buste légèrement incliné vers l'avant, abdos engagés.",
      "Réception souple sur l'avant du pied.",
    ],
    erreursAEviter: [
      "Bloquer sa respiration pendant l'effort.",
      "Poser les talons lourdement à chaque appui.",
    ],
    etapes: [
      "Démarre sur un rythme fluide et régulier.",
      "Enchaîne les mouvements en gardant une respiration continue.",
      "Profite du temps de repos automatique pour récupérer.",
    ],
    vocal: {
      fr: "Cardio : gardez une respiration régulière et un appui souple au sol.",
      en: "Cardio: keep a steady breath and soft landings on the floor.",
      ar: "الكارديو: حافظ على تنفس منتظم وهبوط خفيف على الأرض.",
    },
  },
  {
    id: "ex-flex-mobilite",
    nom: "Étirement chaîne postérieure",
    categorie: "Flexibilité",
    niveau: "Débutant",
    photoUrl: "/images/exercices/etirement.jpg",
    photoAlt: "Athlète réalisant un étirement de souplesse",
    seriesCibles: 3,
    repetitionsCibles: 10,
    dureeSecondes: 35,
    reposSecondes: 15,
    metEstime: 3.0,
    mouvement2D: "etirement",
    musclesPrincipaux: ["Ischio-jambiers", "Mollets", "Bas du dos"],
    zonesCiblees: ["jambes", "dos"],
    bonnePosture: [
      "Mouvement progressif sans à-coup.",
      "Respiration lente et profonde.",
    ],
    erreursAEviter: [
      "Rebondir en fin d'étirement.",
      "Forcer au-delà d'une tension légère.",
    ],
    etapes: [
      "Installe-toi confortablement sur le tapis.",
      "Allonge le mouvement jusqu'à ressentir une tension douce.",
      "Maintiens puis relâche lentement.",
    ],
    vocal: {
      fr: "Flexibilité : étirez-vous sans rebondir et expirez lentement.",
      en: "Flexibility: stretch without bouncing and exhale slowly.",
      ar: "المرونة: قم بالإطالة بهدوء دون ارتداد مع زفير بطيء.",
    },
  },
  {
    id: "ex-abdos-crunch",
    nom: "Crunch contrôlé & gainage abdos",
    categorie: "Abdos",
    niveau: "Intermédiaire",
    photoUrl: "/images/exercices/crunch.jpg",
    photoAlt: "Athlète travaillant les abdominaux au sol",
    seriesCibles: 4,
    repetitionsCibles: 18,
    dureeSecondes: 30,
    reposSecondes: 15,
    metEstime: 5.0,
    mouvement2D: "abdos",
    musclesPrincipaux: ["Grand droit de l'abdomen", "Obliques", "Transverse"],
    zonesCiblees: ["abdos"],
    bonnePosture: [
      "Menton légèrement décollé, sans tirer sur la nuque.",
      "Contraction continue des abdominaux.",
    ],
    erreursAEviter: [
      "Tirer la tête avec les mains.",
      "Décoller brutalement le bas du dos.",
    ],
    etapes: [
      "Allonge-toi sur le dos, genoux fléchis, abdos engagés.",
      "Enroule le buste en expirant.",
      "Redescends lentement en gardant la tension.",
    ],
    vocal: {
      fr: "Abdos : contractez la sangle abdominale sans tirer sur la nuque.",
      en: "Abs: brace your core without pulling on your neck.",
      ar: "البطن: شد عضلات البطن دون سحب الرقبة.",
    },
  },
  {
    id: "ex-bras-curl",
    nom: "Curl & renforcement des bras",
    categorie: "Bras",
    niveau: "Débutant",
    photoUrl: "/images/exercices/curl.jpg",
    photoAlt: "Athlète réalisant un mouvement pour les bras",
    seriesCibles: 3,
    repetitionsCibles: 12,
    dureeSecondes: 30,
    reposSecondes: 15,
    metEstime: 4.5,
    mouvement2D: "bras",
    musclesPrincipaux: ["Biceps brachial", "Brachial antérieur", "Triceps"],
    zonesCiblees: ["bras", "avant-bras"],
    bonnePosture: [
      "Coudes fixes le long du buste.",
      "Buste stable sans balancier.",
    ],
    erreursAEviter: [
      "Balancer le buste pour aider la montée.",
      "Avancer les coudes vers l'avant.",
    ],
    etapes: [
      "Tiens la charge ou adopte la posture bras le long du corps.",
      "Fléchis avec contrôle en contractant le biceps.",
      "Reviens lentement en position de départ.",
    ],
    vocal: {
      fr: "Bras : gardez les coudes fixes et évitez de balancer le buste.",
      en: "Arms: keep your elbows pinned and avoid swinging your torso.",
      ar: "الذراعين: حافظ على ثبات المرفقين وتجنب تأرجح الجذع.",
    },
  },
  {
    id: "ex-avant-bras-poigne",
    nom: "Renforcement avant-bras & prise",
    categorie: "Avant-bras",
    niveau: "Débutant",
    photoUrl: "/images/exercices/curl.jpg",
    photoAlt: "Athlète travaillant les avant-bras et la prise",
    seriesCibles: 3,
    repetitionsCibles: 15,
    dureeSecondes: 30,
    reposSecondes: 15,
    metEstime: 4.0,
    mouvement2D: "bras",
    musclesPrincipaux: ["Fléchisseurs de l'avant-bras", "Extenseurs", "Poignets"],
    zonesCiblees: ["avant-bras"],
    bonnePosture: [
      "Avant-bras stables et poignets alignés.",
      "Amplitude régulière sans hyper-extension.",
    ],
    erreursAEviter: [
      "Casser brutalement l'articulation du poignet.",
      "Aller trop vite sans contrôle musculaire.",
    ],
    etapes: [
      "Stabilise l'avant-bras et le poignet.",
      "Exécute la flexion ou l'extension sur toute l'amplitude sûre.",
      "Relâche pendant la pause.",
    ],
    vocal: {
      fr: "Avant-bras : contrôlez l'amplitude du poignet sans forcer l'articulation.",
      en: "Forearms: control wrist range of motion without straining the joint.",
      ar: "الساعد: تحكم في مدى حركة المعصم دون إجهاد المفصل.",
    },
  },
  {
    id: "ex-poitrine-pompes",
    nom: "Pompes contrôlées poitrine",
    categorie: "Poitrine",
    niveau: "Intermédiaire",
    photoUrl: "/images/exercices/pompes.jpg",
    photoAlt: "Athlète effectuant des pompes pour la poitrine",
    seriesCibles: 4,
    repetitionsCibles: 12,
    dureeSecondes: 30,
    reposSecondes: 20,
    metEstime: 6.5,
    mouvement2D: "pompe",
    musclesPrincipaux: ["Grand pectoral", "Triceps", "Deltoïdes antérieurs"],
    zonesCiblees: ["pectoraux", "bras"],
    bonnePosture: [
      "Corps aligné de la tête aux pieds ou aux genoux.",
      "Coudes à environ 45 degrés du buste.",
    ],
    erreursAEviter: [
      "Creuser les lombaires ou lever les fessiers trop haut.",
      "Écarter les coudes à 90 degrés.",
    ],
    etapes: [
      "Mains placées sous ou légèrement en dehors des épaules.",
      "Descends le buste en inspirant tout en gainant le tronc.",
      "Pousse fort en expirant jusqu'à l'extension contrôlée.",
    ],
    vocal: {
      fr: "Poitrine : gardez le corps gainé et descendez avec contrôle.",
      en: "Chest: keep your body braced and lower under control.",
      ar: "الصدر: حافظ على شد الجسم وأنزل بتحكم.",
    },
  },
  {
    id: "ex-jambes-squat",
    nom: "Squat complet & stabilité jambes",
    categorie: "Jambes",
    niveau: "Avancé",
    photoUrl: "/images/exercices/squat.jpg",
    photoAlt: "Athlète réalisant un squat profond",
    seriesCibles: 4,
    repetitionsCibles: 15,
    dureeSecondes: 35,
    reposSecondes: 20,
    metEstime: 7.5,
    mouvement2D: "squat",
    musclesPrincipaux: ["Quadriceps", "Fessiers", "Ischio-jambiers"],
    zonesCiblees: ["jambes", "fessiers"],
    bonnePosture: [
      "Pieds ancrés au sol, genoux alignés avec les pointes de pieds.",
      "Dos neutre et buste tonique.",
    ],
    erreursAEviter: [
      "Laisser les genoux rentrer vers l'intérieur.",
      "Décoller les talons du sol.",
    ],
    etapes: [
      "Recule les hanches et fléchis les genoux de façon coordonnée.",
      "Descends jusqu'à la profondeur confortable et maîtrisée.",
      "Pousse dans le sol pour remonter.",
    ],
    vocal: {
      fr: "Jambes : gardez les talons au sol et les genoux dans l'axe des pieds.",
      en: "Legs: keep heels planted and knees tracking over your toes.",
      ar: "الأرجل: حافظ على ثبات الكعبين واتجاه الركبتين مع مشط القدم.",
    },
  },
  {
    id: "ex-fessiers-extension",
    nom: "Extension fessiers & fentes",
    categorie: "Fessiers",
    niveau: "Intermédiaire",
    photoUrl: "/images/exercices/fessiers.jpg",
    photoAlt: "Athlète ciblant les fessiers et le bas du corps",
    seriesCibles: 4,
    repetitionsCibles: 15,
    dureeSecondes: 30,
    reposSecondes: 15,
    metEstime: 6.0,
    mouvement2D: "squat",
    musclesPrincipaux: ["Grand fessier", "Moyen fessier", "Ischio-jambiers"],
    zonesCiblees: ["fessiers", "jambes"],
    bonnePosture: [
      "Bassin stable et contraction volontaire en fin de course.",
      "Tronc gainé.",
    ],
    erreursAEviter: [
      "Cambrer excessivement le bas du dos.",
      "Précipiter le retour.",
    ],
    etapes: [
      "Adopte la position de départ avec appuis stables.",
      "Effectue le mouvement en contractant les fessiers.",
      "Reviens avec contrôle.",
    ],
    vocal: {
      fr: "Fessiers : contractez le fessier en haut du mouvement sans cambrer le dos.",
      en: "Glutes: squeeze at the top without arching your lower back.",
      ar: "المؤخرة: شد العضلة في الأعلى دون تقوس أسفل الظهر.",
    },
  },
];

export function buildProgrammes(categorie: CategorieNom): ProgrammeFitPro[] {
  const base =
    categorie === "Tous"
      ? EXERCICES_REELS
      : EXERCICES_REELS.filter((e) => e.categorie === categorie);

  return (["Débutant", "Intermédiaire", "Avancé"] as NiveauProgramme[]).map(
    (niv, idx) => {
      const matches = base.filter((e) => e.niveau === niv);
      const exercices = matches.length > 0 ? matches : base.slice(0, 2);
      const labelCat = categorie === "Tous" ? "FIT PRO Global" : categorie;
      return {
        id: `prog-${categorieToSlug(categorie === "Tous" ? "Musculation" : categorie)}-${niv}-${idx}`,
        titre: `${labelCat} — ${niv}`,
        categorie: categorie === "Tous" ? "Musculation" : categorie,
        niveau: niv,
        objectif:
          niv === "Débutant"
            ? "Apprentissage de la posture et régularité"
            : niv === "Intermédiaire"
            ? "Progression des répétitions et de l'endurance"
            : "Volume soutenu et précision technique",
        exercices,
      };
    }
  );
}

/**
 * Affiche uniquement de vraies photographies (jamais remplacées par un dessin).
 */
function PhotoExerciceReelle({
  src,
  alt,
  titre,
}: {
  src: string;
  alt: string;
  titre: string;
}) {
  const [erreurChargement, setErreurChargement] = useState(false);

  return (
    <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-green-500/25 bg-[#0a120d]">
      {!erreurChargement ? (
        <img
          src={src}
          alt={alt}
          onError={() => setErreurChargement(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0d1f14] via-[#09120c] to-black px-4 text-center">
          <span className="rounded-full border border-green-500/40 bg-green-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-green-300">
            Photo réelle · {titre}
          </span>
          <p className="mt-2 text-xs text-slate-300">
            Déposez la photo <code className="text-green-400">{src}</code> dans{" "}
            <code className="text-green-400">public/</code> pour l&apos;afficher.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Vidéo animée dessinée 2D + mise en évidence anatomique des muscles sollicités.
 */
function VideoAnimee2D({
  mouvement,
  zones,
  enLecture,
}: {
  mouvement: MouvementAnime2D;
  zones: ZoneMuscle[];
  enLecture: boolean;
}) {
  const animName =
    mouvement === "pompe"
      ? "animPompe2D 1.6s ease-in-out infinite"
      : mouvement === "abdos"
      ? "animAbdos2D 1.5s ease-in-out infinite"
      : mouvement === "squat"
      ? "animSquat2D 1.4s ease-in-out infinite"
      : mouvement === "bras"
      ? "animBras2D 1.5s ease-in-out infinite"
      : mouvement === "etirement"
      ? "animEtirement2D 1.8s ease-in-out infinite"
      : "animSuperman2D 1.6s ease-in-out infinite";

  const highlight = (z: ZoneMuscle) => (zones.includes(z) ? "#22c55e" : "#475569");

  return (
    <div className="grid grid-cols-12 gap-2 rounded-2xl border border-green-500/30 bg-[#07110b] p-3 items-center">
      <div className="col-span-8 overflow-hidden rounded-xl border border-white/10 bg-[#0d1812] p-2">
        <style>{`
          @keyframes animSuperman2D {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-7px); }
          }
          @keyframes animPompe2D {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(8px); }
          }
          @keyframes animAbdos2D {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-6deg); }
          }
          @keyframes animSquat2D {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(9px); }
          }
          @keyframes animBras2D {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-8deg); }
          }
          @keyframes animEtirement2D {
            0%, 100% { transform: scaleX(1); }
            50% { transform: scaleX(1.03); }
          }
          .fitpro-2d-figure {
            transform-origin: 140px 75px;
            animation: ${animName};
            animation-play-state: ${enLecture ? "running" : "paused"};
          }
        `}</style>
        <svg
          viewBox="0 0 280 120"
          className="h-28 w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Animation 2D du mouvement"
        >
          <line x1="20" y1="102" x2="260" y2="102" stroke="#1e293b" strokeWidth="3" />
          <g className="fitpro-2d-figure">
            <circle cx="195" cy="52" r="10" fill="#e2e8f0" />
            <path
              d="M110 66L185 60L186 76L112 82Z"
              fill={highlight("dos")}
            />
            <path
              d="M110 66L65 54L68 63L112 75Z"
              fill={highlight("fessiers")}
            />
            <path
              d="M112 76L62 88L64 96L114 84Z"
              fill={highlight("jambes")}
            />
            <path
              d="M182 62L242 46L244 54L185 70Z"
              fill={highlight("bras")}
            />
            <path
              d="M182 70L240 78L239 85L181 77Z"
              fill={highlight("avant-bras")}
            />
          </g>
        </svg>
      </div>

      {/* Schéma anatomique des muscles sollicités */}
      <div className="col-span-4 flex flex-col items-center justify-center rounded-xl bor
