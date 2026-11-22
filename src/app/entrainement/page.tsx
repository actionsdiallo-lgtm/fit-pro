"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type CategorieNom =
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

type NiveauProgramme = "Débutant" | "Intermédiaire" | "Avancé";

type ZoneMuscle =
  | "dos"
  | "pectoraux"
  | "abdos"
  | "bras"
  | "avant-bras"
  | "jambes"
  | "fessiers";

type MouvementAnime2D =
  | "superman"
  | "pompe"
  | "abdos"
  | "squat"
  | "bras"
  | "etirement";

interface ExerciceReel {
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

interface SeanceEnregistree {
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

const CATEGORIES: { nom: CategorieNom; slug: string }[] = [
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

const EXERCICES: ExerciceReel[] = [
  {
    id: "ex-dos-1",
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
      "Sangle abdominale légèrement gainée.",
    ],
    erreursAEviter: [
      "Casser la nuque en levant trop haut la tête.",
      "Donner des à-coups rapides.",
    ],
    etapes: [
      "Allonge-toi sur le ventre sur le tapis, bras et jambes tendus.",
      "Décolle bras et jambes avec contrôle en expirant.",
      "Redescends doucement et répète.",
    ],
    vocal: {
      fr: "Extension dorsale au tapis. Gardez la nuque alignée et levez avec contrôle.",
      en: "Floor back extension. Keep your neck neutral and lift with control.",
      ar: "تمرين تقوية الظهر على الأرض. حافظ على استقامة الرقبة وارفع بتحكم.",
    },
  },
  {
    id: "ex-muscu-1",
    nom: "Rowing et gainage haut du corps",
    categorie: "Musculation",
    niveau: "Intermédiaire",
    photoUrl: "/images/exercices/gainage.jpg",
    photoAlt: "Athlète en musculation haut du corps",
    seriesCibles: 4,
    repetitionsCibles: 12,
    dureeSecondes: 35,
    reposSecondes: 20,
    metEstime: 6.0,
    mouvement2D: "bras",
    musclesPrincipaux: ["Grand dorsal", "Rhomboïdes", "Biceps"],
    zonesCiblees: ["dos", "bras"],
    bonnePosture: [
      "Dos plat et épaules abaissées.",
      "Coudes tirés près du buste.",
    ],
    erreursAEviter: [
      "Arrondir le haut du dos.",
      "Hausser les épaules.",
    ],
    etapes: [
      "Adopte une posture stable avec le tronc gainé.",
      "Tire les coudes vers l'arrière en resserrant les omoplates.",
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
    photoAlt: "Sportif en séance cardio",
    seriesCibles: 4,
    repetitionsCibles: 20,
    dureeSecondes: 40,
    reposSecondes: 15,
    metEstime: 8.0,
    mouvement2D: "squat",
    musclesPrincipaux: ["Système cardiovasculaire", "Quadriceps", "Mollets"],
    zonesCiblees: ["jambes", "abdos"],
    bonnePosture: [
      "Buste gainé et rythme régulier.",
      "Appuis souples.",
    ],
    erreursAEviter: [
      "Bloquer la respiration.",
      "Poser les talons lourdement.",
    ],
    etapes: [
      "Démarre sur un rythme fluide.",
      "Enchaîne les répétitions en respirant calmement.",
      "Récupère pendant le repos automatique.",
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
    photoAlt: "Athlète réalisant un étirement",
    seriesCibles: 3,
    repetitionsCibles: 10,
    dureeSecondes: 35,
    reposSecondes: 15,
    metEstime: 3.0,
    mouvement2D: "etirement",
    musclesPrincipaux: ["Ischio-jambiers", "Mollets", "Dos"],
    zonesCiblees: ["jambes", "dos"],
    bonnePosture: [
      "Mouvement progressif sans à-coup.",
      "Respiration lente.",
    ],
    erreursAEviter: [
      "Rebondir en fin d'étirement.",
      "Forcer jusqu'à la douleur.",
    ],
    etapes: [
      "Installe-toi sur le tapis.",
      "Étire en douceur jusqu'à une tension légère.",
      "Maintiens puis relâche.",
    ],
    vocal: {
      fr: "Flexibilité : étirez-vous en douceur sans rebondir.",
      en: "Flexibility: stretch gently without bouncing.",
      ar: "المرونة: قم بالإطالة بلطف دون ارتداد.",
    },
  },
  {
    id: "ex-abdos-1",
    nom: "Crunch contrôlé et gainage abdos",
    categorie: "Abdos",
    niveau: "Intermédiaire",
    photoUrl: "/images/exercices/crunch.jpg",
    photoAlt: "Athlète travaillant les abdominaux",
    seriesCibles: 4,
    repetitionsCibles: 18,
    dureeSecondes: 30,
    reposSecondes: 15,
    metEstime: 5.0,
    mouvement2D: "abdos",
    musclesPrincipaux: ["Grand droit", "Obliques", "Transverse"],
    zonesCiblees: ["abdos"],
    bonnePosture: [
      "Menton légèrement décollé.",
      "Contraction continue des abdos.",
    ],
    erreursAEviter: [
      "Tirer sur la nuque.",
      "Décoller brutalement le bas du dos.",
    ],
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
    photoAlt: "Athlète travaillant les bras",
    seriesCibles: 3,
    repetitionsCibles: 12,
    dureeSecondes: 30,
    reposSecondes: 15,
    metEstime: 4.5,
    mouvement2D: "bras",
    musclesPrincipaux: ["Biceps", "Triceps"],
    zonesCiblees: ["bras", "avant-bras"],
    bonnePosture: [
      "Coudes fixes le long du buste.",
      "Tronc stable.",
    ],
    erreursAEviter: [
      "Balancer le buste.",
      "Avancer les coudes.",
    ],
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
    photoAlt: "Athlète travaillant les avant-bras",
    seriesCibles: 3,
    repetitionsCibles: 15,
    dureeSecondes: 30,
    reposSecondes: 15,
    metEstime: 4.0,
    mouvement2D: "bras",
    musclesPrincipaux: ["Avant-bras", "Poignets"],
    zonesCiblees: ["avant-bras"],
    bonnePosture: [
      "Avant-bras stables.",
      "Amplitude régulière.",
    ],
    erreursAEviter: [
      "Forcer brutalement le poignet.",
      "Précipiter les répétitions.",
    ],
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
    photoAlt: "Athlète effectuant des pompes",
    seriesCibles: 4,
    repetitionsCibles: 12,
    dureeSecondes: 30,
    reposSecondes: 20,
    metEstime: 6.5,
    mouvement2D: "pompe",
    musclesPrincipaux: ["Grand pectoral", "Triceps", "Épaules"],
    zonesCiblees: ["pectoraux", "bras"],
    bonnePosture: [
      "Corps aligné.",
      "Coudes à environ 45 degrés.",
    ],
    erreursAEviter: [
      "Creuser le bas du dos.",
      "Écarter les coudes à 90 degrés.",
    ],
    etapes: [
      "Mains sous ou légèrement en dehors des épaules.",
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
    nom: "Squat complet et stabilité jambes",
    categorie: "Jambes",
    niveau: "Avancé",
    photoUrl: "/images/exercices/squat.jpg",
    photoAlt: "Athlète réalisant un squat",
    seriesCibles: 4,
    repetitionsCibles: 15,
    dureeSecondes: 35,
    reposSecondes: 20,
    metEstime: 7.5,
    mouvement2D: "squat",
    musclesPrincipaux: ["Quadriceps", "Fessiers", "Ischio-jambiers"],
    zonesCiblees: ["jambes", "fessiers"],
    bonnePosture: [
      "Talons au sol, genoux alignés.",
      "Dos neutre.",
    ],
    erreursAEviter: [
      "Genoux qui rentrent vers l'intérieur.",
      "Arrondir le dos.",
    ],
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
    photoAlt: "Athlète ciblant les fessiers",
    seriesCibles: 4,
    repetitionsCibles: 15,
    dureeSecondes: 30,
    reposSecondes: 15,
    metEstime: 6.0,
    mouvement2D: "squat",
    musclesPrincipaux: ["Grand fessier", "Moyen fessier"],
    zonesCiblees: ["fessiers", "jambes"],
    bonnePosture: [
      "Bassin stable.",
      "Contraction en fin de course.",
    ],
    erreursAEviter: [
      "Cambrer excessivement les lombaires.",
      "Précipiter le retour.",
    ],
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

function PhotoReelle({
  src,
  alt,
  titre,
}: {
  src: string;
  alt: string;
  titre: string;
}) {
  const [erreur, setErreur] = useState(false);

  return (
    <div className="relative h-36 w-full overflow-hidden rounded-2xl border border-green-500/25 bg-[#0a120d]">
      {!erreur ? (
        <img
          src={src}
          alt={alt}
          onError={() => setErreur(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0d1f14] via-[#09120c] to-black px-3 text-center">
          <span className="rounded-full border border-green-500/40 bg-green-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-green-300">
            Photo réelle · {titre}
          </span>
          <p className="mt-1.5 text-[11px] text-slate-300">{src}</p>
        </div>
      )}
    </div>
  );
}

function Animation2D({
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
      ? "fitproPompe 1.6s ease-in-out infinite"
      : mouvement === "abdos"
      ? "fitproAbdos 1.5s ease-in-out infinite"
      : mouvement === "squat"
      ? "fitproSquat 1.4s ease-in-out infinite"
      : mouvement === "bras"
      ? "fitproBras 1.5s ease-in-out infinite"
      : mouvement === "etirement"
      ? "fitproEtire 1.8s ease-in-out infinite"
      : "fitproSuper 1.6s ease-in-out infinite";

  const couleurZone = (z: ZoneMuscle) =>
    zones.includes(z) ? "#22c55e" : "#475569";

  return (
    <div className="grid grid-cols-12 gap-2 rounded-2xl border border-green-500/30 bg-[#07110b] p-2.5 items-center">
      <div className="col-span-8 overflow-hidden rounded-xl border border-white/10 bg-[#0d1812] p-2">
        <style>{`
          @keyframes fitproSuper {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          @keyframes fitproPompe {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(7px); }
          }
          @keyframes fitproAbdos {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-6deg); }
          }
          @keyframes fitproSquat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(8px); }
          }
          @keyframes fitproBras {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-7deg); }
          }
          @keyframes fitproEtire {
            0%, 100% { transform: scaleX(1); }
            50% { transform: scaleX(1.03); }
          }
          .fitpro-anim-2d {
            transform-origin: 140px 72px;
            animation: ${animName};
            animation-play-state: ${enLecture ? "running" : "paused"};
          }
        `}</style>
        <svg viewBox="0 0 280 110" className="h-24 w-full" fill="none">
          <line x1="20" y1="96" x2="260" y2="96" stroke="#1e293b" strokeWidth="3" />
          <g className="fitpro-anim-2d">
            <circle cx="195" cy="48" r="9" fill="#e2e8f0" />
            <path d="M110 62L185 56L186 70L112 76Z" fill={couleurZone("dos")} />
            <path d="M110 62L65 50L68 58L112 70Z" fill={couleurZone("fessiers")} />
            <path d="M112 70L62 82L64 89L114 77Z" fill={couleurZone("jambes")} />
            <path d="M182 58L240 42L242 50L185 66Z" fill={couleurZone("bras")} />
            <path d="M182 66L238 74L237 81L181 73Z" fill={couleurZone("avant-bras")} />
          </g>
        </svg>
      </div>

      <div className="col-span-4 flex flex-col items-center justify-center rounded-xl border border-white/10 bg-[#0d1812] p-1.5">
        <span className="text-[10px] font-bold uppercase text-green-400">
          Muscles
        </span>
        <svg viewBox="0 0 60 80" className="h-20 w-12" fill="none">
          <circle cx="30" cy="9" r="5.5" fill="#64748b" />
          <path
            d="M18 19C18 16 24 15 30 15C36 15 42 16 42 19L39 39H21L18 19Z"
            fill={couleurZone("pectoraux")}
          />
          <rect
            x="23"
            y="29"
            width="14"
            height="10"
            rx="2"
            fill={couleurZone("abdos")}
          />
          <path
            d="M18 20L10 36L14 38L21 25M42 20L50 36L46 38L39 25"
            fill={couleurZone("bras")}
          />
          <path
            d="M22 40L19 74H26L29 48M38 40L41 74H34L31 48"
            fill={couleurZone("jambes")}
          />
        </svg>
      </div>
    </div>
  );
}

export default function EntrainementPage() {
  const { data: session, status } = useSession();

  const [categorieActive, setCategorieActive] = useState<CategorieNom>("Tous");
  const [niveauActif, setNiveauActif] = useState<NiveauProgramme>("Débutant");
  const [indexExercice, setIndexExercice] = useState<number>(0);

  const [serieActuelle, setSerieActuelle] = useState<number>(1);
  const [seriesTerminees, setSeriesTerminees] = useState<number>(0);
  const [repetitionsFaites, setRepetitionsFaites] = useState<number>(0);
  const [secondesRestantes, setSecondesRestantes] = useState<number>(30);
  const [enRepos, setEnRepos] = useState<boolean>(false);
  const [enLecture, setEnLecture] = useState<boolean>(true);
  const [dureeReelleSec, setDureeReelleSec] = useState<number>(0);
  const [exercicesFaits, setExercicesFaits] = useState<Record<string, boolean>>({});

  const [langue, setLangue] = useState<"fr" | "en" | "ar">("fr");
  const [voixUri, setVoixUri] = useState<string>("");
  const [voixList, setVoixList] = useState<SpeechSynthesisVoice[]>([]);

  const [historique, setHistorique] = useState<SeanceEnregistree[]>([]);
  const [messageSync, setMessageSync] = useState<string>("");
  const sauvegardeFaiteRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const majVoix = () => setVoixList(window.speechSynthesis.getVoices());
    majVoix();
    window.speechSynthesis.onvoiceschanged = majVoix;
  }, []);

  const chargerHistorique = useCallback(async () => {
    try {
      const res = await fetch("/api/entrainement/seances", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.sessions)) {
        setHistorique(data.sessions);
      }
    } catch {
      // Hors ligne
    }
  }, []);

  useEffect(() => {
    void chargerHistorique();
  }, [chargerHistorique, status]);

  const exercicesFiltres = useMemo(() => {
    const parCat =
      categorieActive === "Tous"
        ? EXERCICES
        : EXERCICES.filter((e) => e.categorie === categorieActive);
    const parNiv = parCat.filter((e) => e.niveau === niveauActif);
    return parNiv.length > 0 ? parNiv : parCat;
  }, [categorieActive, niveauActif]);

  const exerciceCourant =
    exercicesFiltres[indexExercice] ?? exercicesFiltres[0] ?? EXERCICES[0];

  const parler = useCallback(
    (texteOverride?: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const texte = texteOverride ?? exerciceCourant.vocal[langue];
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(texte);
      const mapLang = { fr: "fr-FR", en: "en-US", ar: "ar-SA" };
      utter.lang = mapLang[langue];
      if (voixUri) {
        const trouvée = voixList.find((v) => v.voiceURI === voixUri);
        if (trouvée) utter.voice = trouvée;
      }
      window.speechSynthesis.speak(utter);
    },
    [exerciceCou
