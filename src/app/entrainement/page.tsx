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
              cy="30"
              r="10"
              stroke="#f8fafc"
              strokeWidth="3.5"
              fill={exercice.couleur}
              fillOpacity="0.35"
            />
            <line
              x1="90"
              y1="40"
              x2="90"
              y2="82"
              stroke="#f8fafc"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M90 50L58 64M90 50L122 64"
              stroke={exercice.couleur}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M90 82L68 120M90 82L112 120"
              stroke="#f8fafc"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        </svg>

        <p className="mt-2 text-center text-xs text-slate-300">
          Vidéo automatique sur{" "}
          <strong className="text-white">{exercice.dureeMinutes} minute(s)</strong>{" "}
          avec passage automatique au mouvement suivant.
        </p>
      </div>
    </div>
  );
       }
       export default function EntrainementPage() {
  const { data: session, status } = useSession();
  const [categorieActive, setCategorieActive] =
    useState<CategorieEntrainement>("Tous");
  const [programmeId, setProgrammeId] = useState<string>(PROGRAMMES[0].id);
  const [indexExercice, setIndexExercice] = useState<number>(0);
  const [secondesRestantes, setSecondesRestantes] = useState<number>(
    PROGRAMMES[0].exercices[0].dureeMinutes * 60
  );
  const [enLecture, setEnLecture] = useState<boolean>(true);

  const filtered = useMemo(() => {
    if (categorieActive === "Tous") return PROGRAMMES;
    return PROGRAMMES.filter((p) => p.categorie === categorieActive);
  }, [categorieActive]);

  const programmeActuel =
    PROGRAMMES.find((p) => p.id === programmeId) ?? PROGRAMMES[0];

  const exerciceActuel =
    programmeActuel.exercices[indexExercice] ?? programmeActuel.exercices[0];

  const demarrerAutomatique = useCallback(
    (prog: ProgrammeEntrainement, idx = 0) => {
      const indexValide = Math.max(0, Math.min(idx, prog.exercices.length - 1));
      const exo = prog.exercices[indexValide];
      setProgrammeId(prog.id);
      setIndexExercice(indexValide);
      setSecondesRestantes((exo?.dureeMinutes ?? 1) * 60);
      setEnLecture(true);
    },
    []
  );

  const passerExerciceSuivant = useCallback(() => {
    const suivant = indexExercice + 1;
    if (suivant < programmeActuel.exercices.length) {
      const exoSuivant = programmeActuel.exercices[suivant];
      setIndexExercice(suivant);
      setSecondesRestantes(exoSuivant.dureeMinutes * 60);
      setEnLecture(true);
    } else {
      setEnLecture(false);
    }
  }, [indexExercice, programmeActuel]);

  useEffect(() => {
    if (!enLecture) return;

    const interval = window.setInterval(() => {
      setSecondesRestantes((prev) => {
        if (prev > 1) return prev - 1;
        window.setTimeout(() => {
          passerExerciceSuivant();
        }, 0);
        return 0;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [enLecture, passerExerciceSuivant]);

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white pb-24">
      <div className="mx-auto max-w-5xl px-4 pt-5 space-y-6">
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-lime-400">
                FIT PRO · Entraînement en cours
              </p>
              <h1 className="text-2xl font-black">{programmeActuel.titre}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-xl border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/5"
              >
                Accueil
              </Link>
              {status !== "authenticated" && (
                <Link
                  href="/login"
                  className="rounded-xl bg-lime-400 px-3 py-1.5 text-xs font-bold text-slate-950"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <CartePhotoOriginale
              programme={programmeActuel}
              onAppuyerImage={() => demarrerAutomatique(programmeActuel, 0)}
            />

            <VideoDessinAuto
              exercice={exerciceActuel}
              index={indexExercice}
              total={programmeActuel.exercices.length}
              secondesRestantes={secondesRestantes}
              enLecture={enLecture}
              onToggleLecture={() => setEnLecture((prev) => !prev)}
              onSuivant={passerExerciceSuivant}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-4 space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Enchaînement automatique des exercices
            </p>
            {programmeActuel.exercices.map((exo, idx) => {
              const courant = idx === indexExercice;
              return (
                <button
                  key={exo.id}
                  type="button"
                  onClick={() => demarrerAutomatique(programmeActuel, idx)}
                  className={`w-full rounded-xl border p-3 text-left flex items-center justify-between transition ${
                    courant
                      ? "border-lime-400 bg-lime-400/10"
                      : "border-white/10 bg-[#0b0f19] hover:border-lime-400/50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {idx + 1}. {exo.nom}
                    </p>
                    <p className="text-xs text-slate-400">
                      {exo.zone} · {exo.dosage}
                    </p>
                  </div>
                  <span className="rounded-md bg-lime-400/15 px-2.5 py-1 text-xs font-bold text-lime-300">
                    {exo.dureeMinutes} min
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Autres programmes d&apos;entraînement</h2>
            <span className="text-xs text-slate-400">
              {status === "authenticated"
                ? session?.user?.name || session?.user?.email
                : "Mode invité"}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => {
              const actif = categorieActive === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategorieActive(cat);
                    const liste =
                      cat === "Tous"
                        ? PROGRAMMES
                        : PROGRAMMES.filter((p) => p.categorie === cat);
                    if (liste[0]) demarrerAutomatique(liste[0], 0);
                  }}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                    actif
                      ? "bg-lime-400 text-slate-950"
                      : "border border-white/10 bg-[#111827] text-slate-200 hover:border-white/25"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((w) => {
              const countForW = Array.isArray(w.exercices) ? w.exercices.length : 0;
              const dureeMin = Math.max(3, w.dureeMinutes || countForW);
              const actif = w.id === programmeActuel.id;

              return (
                <article
                  key={w.id}
                  className={`rounded-2xl border p-3.5 transition ${
                    actif
                      ? "border-lime-400 bg-[#172033]"
                      : "border-white/10 bg-[#111827] hover:border-white/25"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => demarrerAutomatique(w, 0)}
                    className="w-full text-left flex items-center justify-between gap-3"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-white">{w.titre}</h3>
                      <p className="mt-0.5 text-xs text-slate-300">
                        {dureeMin} min vidéo auto · {w.nbExercices} Exercices · {w.niveau}
                      </p>
                    </div>
                    <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold">
                      {dureeMin} min
                    </span>
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
    }
      
