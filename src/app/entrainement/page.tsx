"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Niveau = "Débutant" | "Intermédiaire" | "Avancé";

type CategorieEntrainement =
  | "Tous"
  | "Abdos"
  | "Bras"
  | "Avant-bras"
  | "Poitrine"
  | "Jambes"
  | "Fessiers"
  | "Épaules et dos"
  | "Augmentation de taille"
  | "Objectifs populaires";

interface ExerciceDessine {
  id: string;
  nom: string;
  zone: string;
  dosage: string;
  dureeMinutes: number;
  couleur: string;
  mouvement: "debout" | "sol" | "squat" | "etirement";
}

interface ProgrammeEntrainement {
  id: string;
  titre: string;
  categorie: Exclude<CategorieEntrainement, "Tous">;
  niveau: Niveau;
  dureeMinutes: number;
  nbExercices: number;
  couleur: string;
  exercices: ExerciceDessine[];
}

const CATEGORIES: CategorieEntrainement[] = [
  "Tous",
  "Abdos",
  "Bras",
  "Avant-bras",
  "Poitrine",
  "Jambes",
  "Fessiers",
  "Épaules et dos",
  "Augmentation de taille",
  "Objectifs populaires",
];

const PROGRAMMES: ProgrammeEntrainement[] = [
  {
    id: "abdos-intermediaire",
    titre: "Abdos Intermédiaire",
    categorie: "Abdos",
    niveau: "Intermédiaire",
    dureeMinutes: 4,
    nbExercices: 21,
    couleur: "#38bdf8",
    exercices: [
      { id: "a1", nom: "Jumping jacks", zone: "Cardio & Sangle", dosage: "00:30", dureeMinutes: 1, couleur: "#38bdf8", mouvement: "debout" },
      { id: "a2", nom: "Toucher les talons", zone: "Obliques", dosage: "x26", dureeMinutes: 1, couleur: "#38bdf8", mouvement: "sol" },
      { id: "a3", nom: "Crunchs croisés", zone: "Abdos", dosage: "x20", dureeMinutes: 2, couleur: "#38bdf8", mouvement: "sol" },
    ],
  },
  {
    id: "abdos-avance",
    titre: "Abdos Avancé",
    categorie: "Abdos",
    niveau: "Avancé",
    dureeMinutes: 5,
    nbExercices: 21,
    couleur: "#0ea5e9",
    exercices: [
      { id: "a4", nom: "Jumping jacks", zone: "Échauffement", dosage: "00:30", dureeMinutes: 1, couleur: "#0ea5e9", mouvement: "debout" },
      { id: "a5", nom: "Relevés de buste", zone: "Grand droit", dosage: "x20", dureeMinutes: 2, couleur: "#0ea5e9", mouvement: "sol" },
      { id: "a6", nom: "Pont latéral gauche", zone: "Gainage latéral", dosage: "x20", dureeMinutes: 2, couleur: "#0ea5e9", mouvement: "sol" },
    ],
  },
  {
    id: "bras-debutant",
    titre: "Bras Débutant",
    categorie: "Bras",
    niveau: "Débutant",
    dureeMinutes: 3,
    nbExercices: 19,
    couleur: "#a3e635",
    exercices: [
      { id: "b1", nom: "Élévations des bras", zone: "Épaules & Bras", dosage: "x10", dureeMinutes: 1, couleur: "#a3e635", mouvement: "debout" },
      { id: "b2", nom: "Élévation latérale des bras", zone: "Deltoïdes", dosage: "x10", dureeMinutes: 1, couleur: "#a3e635", mouvement: "debout" },
      { id: "b3", nom: "Triceps : dips sur chaise", zone: "Triceps", dosage: "x10", dureeMinutes: 1, couleur: "#a3e635", mouvement: "squat" },
    ],
  },
  {
    id: "bras-intermediaire",
    titre: "Bras Intermédiaire",
    categorie: "Bras",
    niveau: "Intermédiaire",
    dureeMinutes: 4,
    nbExercices: 25,
    couleur: "#84cc16",
    exercices: [
      { id: "b4", nom: "Cercles de bras sens horaire", zone: "Épaules", dosage: "x30", dureeMinutes: 1, couleur: "#84cc16", mouvement: "debout" },
      { id: "b5", nom: "Cercles de bras sens antihoraire", zone: "Épaules", dosage: "x30", dureeMinutes: 1, couleur: "#84cc16", mouvement: "debout" },
      { id: "b6", nom: "Dips au sol", zone: "Triceps", dosage: "x14", dureeMinutes: 2, couleur: "#84cc16", mouvement: "sol" },
    ],
  },
  {
    id: "bras-avance",
    titre: "Bras Avancé",
    categorie: "Bras",
    niveau: "Avancé",
    dureeMinutes: 5,
    nbExercices: 28,
    couleur: "#65a30d",
    exercices: [
      { id: "b7", nom: "Cercles de bras sens horaire", zone: "Endurance bras", dosage: "x30", dureeMinutes: 2, couleur: "#65a30d", mouvement: "debout" },
      { id: "b8", nom: "Cercles de bras sens antihoraire", zone: "Endurance bras", dosage: "x30", dureeMinutes: 2, couleur: "#65a30d", mouvement: "debout" },
      { id: "b9", nom: "Sauter sans corde", zone: "Cardio & Poignets", dosage: "00:30", dureeMinutes: 1, couleur: "#65a30d", mouvement: "debout" },
    ],
  },
  {
    id: "avant-bras-debutant",
    titre: "Avant-bras Débutant",
    categorie: "Avant-bras",
    niveau: "Débutant",
    dureeMinutes: 3,
    nbExercices: 24,
    couleur: "#f59e0b",
    exercices: [
      { id: "av1", nom: "Flexion marteau alternée", zone: "Avant-bras & Biceps", dosage: "x6", dureeMinutes: 2, couleur: "#f59e0b", mouvement: "debout" },
      { id: "av2", nom: "Étirement des poignets et chevilles", zone: "Mobilité", dosage: "00:20", dureeMinutes: 1, couleur: "#f59e0b", mouvement: "etirement" },
    ],
  },
  {
    id: "avant-bras-intermediaire",
    titre: "Avant-bras Intermédiaire",
    categorie: "Avant-bras",
    niveau: "Intermédiaire",
    dureeMinutes: 3,
    nbExercices: 24,
    couleur: "#d97706",
    exercices: [
      { id: "av3", nom: "Élévation latérale avec haltère", zone: "Épaules & Prise", dosage: "x8", dureeMinutes: 2, couleur: "#d97706", mouvement: "debout" },
      { id: "av4", nom: "Étirement des poignets et chevilles", zone: "Récupération", dosage: "00:20", dureeMinutes: 1, couleur: "#d97706", mouvement: "etirement" },
    ],
  },
  {
    id: "avant-bras-avance",
    titre: "Avant-bras Avancé",
    categorie: "Avant-bras",
    niveau: "Avancé",
    dureeMinutes: 4,
    nbExercices: 24,
    couleur: "#b45309",
    exercices: [
      { id: "av5", nom: "Développé militaire", zone: "Épaules & Stabilisation", dosage: "x10", dureeMinutes: 2, couleur: "#b45309", mouvement: "debout" },
      { id: "av6", nom: "Étirement des poignets et chevilles", zone: "Mobilité", dosage: "00:20", dureeMinutes: 2, couleur: "#b45309", mouvement: "etirement" },
    ],
  },
  {
    id: "poitrine-debutant",
    titre: "Poitrine Débutant",
    categorie: "Poitrine",
    niveau: "Débutant",
    dureeMinutes: 3,
    nbExercices: 11,
    couleur: "#f43f5e",
    exercices: [
      { id: "p1", nom: "Jumping jacks", zone: "Échauffement", dosage: "00:30", dureeMinutes: 1, couleur: "#f43f5e", mouvement: "debout" },
      { id: "p2", nom: "Pompes avec mains surélevées", zone: "Pectoraux", dosage: "x16", dureeMinutes: 1, couleur: "#f43f5e", mouvement: "sol" },
      { id: "p3", nom: "Pompes sur les genoux", zone: "Pectoraux", dosage: "x12", dureeMinutes: 1, couleur: "#f43f5e", mouvement: "sol" },
    ],
  },
  {
    id: "poitrine-intermediaire",
    titre: "Poitrine Intermédiaire",
    categorie: "Poitrine",
    niveau: "Intermédiaire",
    dureeMinutes: 4,
    nbExercices: 14,
    couleur: "#e11d48",
    exercices: [
      { id: "p4", nom: "Jumping jacks", zone: "Échauffement", dosage: "00:30", dureeMinutes: 1, couleur: "#e11d48", mouvement: "debout" },
      { id: "p5", nom: "Pompes sur les genoux", zone: "Pectoraux", dosage: "x12", dureeMinutes: 1, couleur: "#e11d48", mouvement: "sol" },
      { id: "p6", nom: "Pompes classiques", zone: "Pectoraux & Triceps", dosage: "x12", dureeMinutes: 2, couleur: "#e11d48", mouvement: "sol" },
    ],
  },
  {
    id: "poitrine-avance",
    titre: "Poitrine Avancé",
    categorie: "Poitrine",
    niveau: "Avancé",
    dureeMinutes: 4,
    nbExercices: 16,
    couleur: "#be123c",
    exercices: [
      { id: "p7", nom: "Jumping jacks", zone: "Échauffement", dosage: "00:30", dureeMinutes: 1, couleur: "#be123c", mouvement: "debout" },
      { id: "p8", nom: "Cercle avec les bras", zone: "Mobilité épaules", dosage: "x20", dureeMinutes: 2, couleur: "#be123c", mouvement: "debout" },
      { id: "p9", nom: "Étirement des épaules", zone: "Souplesse", dosage: "00:30", dureeMinutes: 1, couleur: "#be123c", mouvement: "etirement" },
    ],
  },
  {
    id: "jambes-debutant",
    titre: "Jambes Débutant",
    categorie: "Jambes",
    niveau: "Débutant",
    dureeMinutes: 4,
    nbExercices: 23,
    couleur: "#a855f7",
    exercices: [
      { id: "j1", nom: "Saut de côté", zone: "Agilité & Jambes", dosage: "00:30", dureeMinutes: 2, couleur: "#a855f7", mouvement: "squat" },
      { id: "j2", nom: "Squats", zone: "Quadriceps & Fessiers", dosage: "x12", dureeMinutes: 2, couleur: "#a855f7", mouvement: "squat" },
    ],
  },
  {
    id: "jambes-intermediaire",
    titre: "Jambes Intermédiaire",
    categorie: "Jambes",
    niveau: "Intermédiaire",
    dureeMinutes: 5,
    nbExercices: 36,
    couleur: "#9333ea",
    exercices: [
      { id: "j3", nom: "Jumping jacks", zone: "Échauffement", dosage: "00:30", dureeMinutes: 2, couleur: "#9333ea", mouvement: "debout" },
      { id: "j4", nom: "Squats", zone: "Quadriceps & Fessiers", dosage: "x12", dureeMinutes: 3, couleur: "#9333ea", mouvement: "squat" },
    ],
  },
  {
    id: "jambes-avance",
    titre: "Jambes Avancé",
    categorie: "Jambes",
    niveau: "Avancé",
    dureeMinutes: 6,
    nbExercices: 43,
    couleur: "#7e22ce",
    exercices: [
      { id: "j5", nom: "Burpees", zone: "Full body & Jambes", dosage: "x10", dureeMinutes: 3, couleur: "#7e22ce", mouvement: "squat" },
      { id: "j6", nom: "Squats", zone: "Quadriceps & Fessiers", dosage: "x14", dureeMinutes: 3, couleur: "#7e22ce", mouvement: "squat" },
    ],
  },
  {
    id: "fessiers-debutant",
    titre: "Fessiers Débutant",
    categorie: "Fessiers",
    niveau: "Débutant",
    dureeMinutes: 3,
    nbExercices: 15,
    couleur: "#ec4899",
    exercices: [
      { id: "f1", nom: "Genou au torse debout", zone: "Hanches & Fessiers", dosage: "x10", dureeMinutes: 1, couleur: "#ec4899", mouvement: "debout" },
      { id: "f2", nom: "Coups de pied squat", zone: "Fessiers", dosage: "x10", dureeMinutes: 1, couleur: "#ec4899", mouvement: "squat" },
      { id: "f3", nom: "Flexion avant", zone: "Ischio-jambiers", dosage: "x14", dureeMinutes: 1, couleur: "#ec4899", mouvement: "etirement" },
    ],
  },
  {
    id: "fessiers-intermediaire",
    titre: "Fessiers Intermédiaire",
    categorie: "Fessiers",
    niveau: "Intermédiaire",
    dureeMinutes: 4,
    nbExercices: 17,
    couleur: "#db2777",
    exercices: [
      { id: "f4", nom: "Coups de pied squat", zone: "Fessiers", dosage: "x10", dureeMinutes: 1, couleur: "#db2777", mouvement: "squat" },
      { id: "f5", nom: "Levé de jambe en arrière", zone: "Grand fessier", dosage: "x30", dureeMinutes: 1, couleur: "#db2777", mouvement: "debout" },
      { id: "f6", nom: "Squats avec saut", zone: "Puissance jambes", dosage: "x22", dureeMinutes: 2, couleur: "#db2777", mouvement: "squat" },
    ],
  },
  {
    id: "fessiers-avance",
    titre: "Fessiers Avancé",
    categorie: "Fessiers",
    niveau: "Avancé",
    dureeMinutes: 5,
    nbExercices: 18,
    couleur: "#be185d",
    exercices: [
      { id: "f7", nom: "Cercle de hanche debout", zone: "Mobilité hanche", dosage: "x8", dureeMinutes: 1, couleur: "#be185d", mouvement: "debout" },
      { id: "f8", nom: "Fente avec torsion", zone: "Fessiers & Obliques", dosage: "x8", dureeMinutes: 2, couleur: "#be185d", mouvement: "squat" },
      { id: "f9", nom: "Squat sumo", zone: "Adducteurs & Fessiers", dosage: "x10", dureeMinutes: 2, couleur: "#be185d", mouvement: "squat" },
    ],
  },
  {
    id: "epaules-dos-debutant",
    titre: "Épaules et dos Débutant",
    categorie: "Épaules et dos",
    niveau: "Débutant",
    dureeMinutes: 3,
    nbExercices: 17,
    couleur: "#14b8a6",
    exercices: [
      { id: "e1", nom: "Jumping jacks", zone: "Échauffement", dosage: "00:30", dureeMinutes: 1, couleur: "#14b8a6", mouvement: "debout" },
      { id: "e2", nom: "Élévations des bras", zone: "Épaules", dosage: "x6", dureeMinutes: 1, couleur: "#14b8a6", mouvement: "debout" },
      { id: "e3", nom: "Étirements des rhomboïdes", zone: "Haut du dos", dosage: "x14", dureeMinutes: 1, couleur: "#14b8a6", mouvement: "etirement" },
    ],
  },
  {
    id: "epaules-dos-intermediaire",
    titre: "Épaules et dos Intermédiaire",
    categorie: "Épaules et dos",
    niveau: "Intermédiaire",
    dureeMinutes: 4,
    nbExercices: 17,
    couleur: "#0d9488",
    exercices: [
      { id: "e4", nom: "Jumping jacks", zone: "Échauffement", dosage: "00:30", dureeMinutes: 1, couleur: "#0d9488", mouvement: "debout" },
      { id: "e5", nom: "Kickbacks triceps", zone: "Arrière bras & Dos", dosage: "x14", dureeMinutes: 1, couleur: "#0d9488", mouvement: "squat" },
      { id: "e6", nom: "Pompes avec mains surélevées", zone: "Haut du corps", dosage: "x14", dureeMinutes: 2, couleur: "#0d9488", mouvement: "sol" },
    ],
  },
  {
    id: "epaules-dos-avance",
    titre: "Épaules et dos Avancé",
    categorie: "Épaules et dos",
    niveau: "Avancé",
    dureeMinutes: 5,
    nbExercices: 17,
    couleur: "#0f766e",
    exercices: [
      { id: "e7", nom: "Jumping jacks", zone: "Échauffement", dosage: "00:30", dureeMinutes: 1, couleur: "#0f766e", mouvement: "debout" },
      { id: "e8", nom: "Hyper-extension", zone: "Lombaires & Dos", dosage: "x14", dureeMinutes: 2, couleur: "#0f766e", mouvement: "sol" },
      { id: "e9", nom: "Pompes piquées", zone: "Épaules", dosage: "x14", dureeMinutes: 2, couleur: "#0f766e", mouvement: "sol" },
    ],
  },
  {
    id: "taille-defi-28j",
    titre: "Défi pour gagner en taille (28 jours)",
    categorie: "Augmentation de taille",
    niveau: "Débutant",
    dureeMinutes: 4,
    nbExercices: 22,
    couleur: "#22c55e",
    exercices: [
      { id: "t1", nom: "Étirement du dos", zone: "Posture & Colonne", dosage: "14 min", dureeMinutes: 2, couleur: "#22c55e", mouvement: "etirement" },
      { id: "t2", nom: "Étirement du bas du corps", zone: "Souplesse", dosage: "15 min", dureeMinutes: 2, couleur: "#22c55e", mouvement: "etirement" },
    ],
  },
  {
    id: "objectif-bruler-graisses",
    titre: "HIIT Brûle-graisses & Quadriceps",
    categorie: "Objectifs populaires",
    niveau: "Intermédiaire",
    dureeMinutes: 5,
    nbExercices: 12,
    couleur: "#f97316",
    exercices: [
      { id: "o1", nom: "Chaise contre le mur", zone: "Quadriceps", dosage: "19 min", dureeMinutes: 2, couleur: "#f97316", mouvement: "squat" },
      { id: "o2", nom: "Exercices HIIT brûle-graisses", zone: "Cardio", dosage: "8 min", dureeMinutes: 2, couleur: "#f97316", mouvement: "debout" },
      { id: "o3", nom: "3 exercices pour perdre du ventre", zone: "Sangle abdominale", dosage: "9 min", dureeMinutes: 1, couleur: "#f97316", mouvement: "sol" },
    ],
  },
];

function CartePhotoOriginale({
  programme,
  onAppuyerImage,
}: {
  programme: ProgrammeEntrainement;
  onAppuyerImage: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onAppuyerImage}
      className="group relative w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-950 text-left focus:outline-none focus:ring-2 focus:ring-lime-400"
      aria-label={`Ouvrir et lancer la vidéo dessinée de ${programme.titre}`}
    >
      <div
        className="flex h-44 w-full items-center justify-between px-5 py-4"
        style={{
          background: `linear-gradient(135deg, ${programme.couleur}36 0%, #0f172a 60%, #020617 100%)`,
        }}
      >
        <div className="max-w-[63%] space-y-1.5">
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-950"
            style={{ backgroundColor: programme.couleur }}
          >
            {programme.categorie}
          </span>
          <h2 className="text-lg font-black leading-snug text-white">
            {programme.titre}
          </h2>
          <p className="text-xs font-semibold text-slate-200">
            Appuyer sur l&apos;image · Vidéo auto ({programme.dureeMinutes} min)
          </p>
        </div>

        <svg
          viewBox="0 0 120 120"
          className="h-24 w-24 shrink-0 transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="60" cy="60" r="52" fill={programme.couleur} fillOpacity="0.16" />
          <circle
            cx="60"
            cy="60"
            r="39"
            stroke={programme.couleur}
            strokeWidth="2.5"
            strokeDasharray="7 5"
          />
          <circle cx="60" cy="34" r="9" fill="#f8fafc" />
          <path
            d="M42 56C42 50 50 47 60 47C70 47 78 50 78 56L73 78H47L42 56Z"
            fill={programme.couleur}
          />
          <path
            d="M34 52L46 57M86 52L74 57M51 78L44 102M69 78L76 102"
            stroke="#f8fafc"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>

        <span className="absolute bottom-3 right-3 rounded-xl border border-lime-400/35 bg-black/80 px-3 py-1 text-xs font-bold text-lime-300">
          AUTO · {programme.dureeMinutes} min
        </span>
      </div>
    </button>
  );
}

function VideoDessinAuto({
  exercice,
  index,
  total,
  secondesRestantes,
  enLecture,
  onToggleLecture,
  onSuivant,
}: {
  exercice: ExerciceDessine;
  index: number;
  total: number;
  secondesRestantes: number;
  enLecture: boolean;
  onToggleLecture: () => void;
  onSuivant: () => void;
}) {
  const minutes = Math.floor(secondesRestantes / 60);
  const secondes = secondesRestantes % 60;
  const chrono = `${String(minutes).padStart(2, "0")}:${String(secondes).padStart(2, "0")}`;

  return (
    <div className="rounded-2xl border border-lime-400/40 bg-[#0d1424] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-lime-400">
            Vidéo dessinée auto ({index + 1}/{total}) · {exercice.dureeMinutes} min
          </span>
          <h3 className="text-base font-extrabold text-white">{exercice.nom}</h3>
          <p className="text-xs text-slate-300">
            {exercice.zone} · {exercice.dosage}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-sky-500/20 px-3 py-1 font-mono text-sm font-bold text-sky-300">
            {chrono}
          </span>
          <button
            type="button"
            onClick={onToggleLecture}
            className="rounded-lg bg-lime-400 px-3 py-1.5 text-xs font-bold text-slate-950"
          >
            {enLecture ? "Pause" : "Reprendre"}
          </button>
          <button
            type="button"
            onClick={onSuivant}
            className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5"
          >
            Suivant →
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-slate-950 py-5 px-4">
        <style>{`
          @keyframes fitProBras {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(-6deg); }
          }
          @keyframes fitProSquat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(14px); }
          }
          .fit-pro-anim {
            transform-origin: 90px 95px;
            animation: ${
              exercice.mouvement === "squat"
                ? "fitProSquat 1.6s ease-in-out infinite"
                : "fitProBras 1.4s ease-in-out infinite"
            };
          }
        `}</style>

        <svg
          viewBox="0 0 180 140"
          className="h-32 w-44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={`Démonstration dessinée de ${exercice.nom}`}
        >
          <line
            x1="20"
            y1="124"
            x2="160"
            y2="124"
            stroke="#334155"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <g className={enLecture ? "fit-pro-anim" : ""}>
            <circle
              cx="90"
       
