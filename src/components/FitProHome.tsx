"use client";

import React, { useEffect, useState, useCallback } from "react";

const LANGS = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "ar", label: "AR" },
  { code: "pt", label: "PT" },
  { code: "de", label: "DE" },
  { code: "it", label: "IT" },
  { code: "wo", label: "WO" },
] as const;

type LangCode = (typeof LANGS)[number]["code"];

const CACHE_KEY_WORKOUTS = "fit_pro_vert_workouts_v1";
const CACHE_KEY_PREFS = "fit_pro_vert_prefs_v1";
const CACHE_KEY_HISTORY = "fit_pro_vert_history_v1";

interface ExerciseItem {
  idExercice: string;
  idWorkout: string;
  ordreExercice: number;
  nomLocalise: string;
  positionDepart?: string;
  instructionsExecution?: string;
  respiration?: string;
  erreursAEviter?: string;
  consignesSecurite?: string;
  varianteDebutant?: string;
  varianteAvancee?: string;
  modeMesure?: string;
  dureeSecondes?: number | null;
  repetitionsCible?: number | null;
  muscleCible?: string;
  isSansSaut?: boolean;
}

interface WorkoutItem {
  idWorkout: string;
  ordreAffichage: number;
  langue: LangCode;
  titreLocalise: string;
  descriptionLocalise: string;
  dureeEstimeeMinutes?: number;
  niveau?: string;
  isSansSaut?: boolean;
  exercises: ExerciseItem[];
}

interface UserPreferenceData {
  id: number;
  langue: string;
  unitePoids: string;
  uniteTaille: string;
  theme: string;
  tailleTexteEchelle: number;
  bipActif: boolean;
  vibrationActive: boolean;
  compteAReboursSonore: boolean;
  garderEcranAllume: boolean;
  avertissementSanteAccepte: boolean;
}

interface SessionLog {
  id: string;
  workoutTitle: string;
  exerciseName: string;
  completedAt: string;
  durationSec: number;
}

function NavySilhouette({ isRunning, stepIndex }: { isRunning: boolean; stepIndex: number }) {
  const armAngle = isRunning ? (stepIndex % 2 === 0 ? -24 : 24) : -8;
  const legAngle = isRunning ? (stepIndex % 2 === 0 ? 18 : -18) : 6;

  return (
    <div className="w-28 h-28 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
      <svg
        viewBox="0 0 120 120"
        className="w-24 h-24 text-[#0B1F3A]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Silhouette minimaliste bleu marine"
      >
        {/* Tête */}
        <circle cx="60" cy="22" r="9" fill="currentColor" />
        {/* Buste */}
        <path
          d="M52 35H68L71 64H49L52 35Z"
          fill="currentColor"
        />
        {/* Bras animé */}
        <g transform={`translate(60, 40) rotate(${armAngle})`}>
          <rect x="-3" y="0" width="6" height="24" rx="3" fill="currentColor" />
        </g>
        {/* Jambe animée */}
        <g transform={`translate(60, 64) rotate(${legAngle})`}>
          <rect x="-4" y="0" width="8" height="32" rx="4" fill="currentColor" />
        </g>
        {/* Sol minimaliste */}
        <line
          x1="22"
          y1="100"
          x2="98"
          y2="100"
          stroke="#10B981"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function FitProHome() {
  const [lang, setLang] = useState<LangCode>("fr");
  const [onlySansSaut, setOnlySansSaut] = useState<boolean>(false);
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutItem | null>(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [animTick, setAnimTick] = useState<number>(0);
  const [preferences, setPreferences] = useState<UserPreferenceData | null>(null);
  const [history, setHistory] = useState<SessionLog[]>([]);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingPref, setSavingPref] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Charger l'historique local au démarrage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(CACHE_KEY_HISTORY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) setHistory(parsed);
      }
    } catch {
      // Ignorer si localStorage indisponible
    }
  }, []);

  const recordCompletedExercise = useCallback(
    (wkTitle: string, exName: string, durationSec: number) => {
      const entry: SessionLog = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        workoutTitle: wkTitle,
        exerciseName: exName,
        completedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        durationSec,
      };
      setHistory((prev) => {
        const next = [entry, ...prev].slice(0, 12);
        try {
          localStorage.setItem(CACHE_KEY_HISTORY, JSON.stringify(next));
        } catch {
          // Ignorer
        }
        return next;
      });
    },
    []
  );

  const loadPreferences = useCallback(async () => {
    try {
      const res = await fetch("/api/preferences", { cache: "no-store" });
      if (!res.ok) throw new Error("pref fetch failed");
      const data = await res.json();
      if (data?.preferences) {
        setPreferences(data.preferences);
        const prefLang = data.preferences.langue as LangCode;
        if (LANGS.some((l) => l.code === prefLang)) {
          setLang(prefLang);
        }
        try {
          localStorage.setItem(CACHE_KEY_PREFS, JSON.stringify(data.preferences));
        } catch {
          // Ignorer
        }
      }
    } catch {
      try {
        const cached = localStorage.getItem(CACHE_KEY_PREFS);
        if (cached) {
          const parsed = JSON.parse(cached) as UserPreferenceData;
          setPreferences(parsed);
          setOfflineMode(true);
        }
      } catch {
        // Ignorer
      }
    }
  }, []);

  const loadWorkouts = useCallback(async (targetLang: LangCode, sansSaut: boolean) => {
    setLoading(true);
    setErrorMsg(null);
    const cacheSlot = `${CACHE_KEY_WORKOUTS}_${targetLang}_${sansSaut ? "noskip" : "all"}`;
    try {
      const params = new URLSearchParams({
        lang: targetLang,
        ...(sansSaut ? { sansSaut: "true" } : {}),
      });
      const res = await fetch(`/api/workouts?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Impossible de charger les programmes");
      }
      const data = await res.json();
      const list: WorkoutItem[] = Array.isArray(data?.workouts) ? data.workouts : [];
      setWorkouts(list);
      setOfflineMode(false);
      try {
        localStorage.setItem(cacheSlot, JSON.stringify(list));
      } catch {
        // Ignorer
      }
      if (list.length > 0) {
        setSelectedWorkout((prev) => {
          if (!prev) return list[0];
          const found = list.find((w) => w.idWorkout === prev.idWorkout);
          return found ?? list[0];
        });
      } else {
        setSelectedWorkout(null);
      }
    } catch (err) {
      try {
        const cached = localStorage.getItem(cacheSlot);
        if (cached) {
          const list = JSON.parse(cached) as WorkoutItem[];
          setWorkouts(list);
          setSelectedWorkout((prev) => prev ?? list[0] ?? null);
          setOfflineMode(true);
          return;
        }
      } catch {
        // Ignorer
      }
      setErrorMsg(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  useEffect(() => {
    loadWorkouts(lang, onlySansSaut);
  }, [lang, onlySansSaut, loadWorkouts]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setAnimTick((t) => t + 1);
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          const wkTitle = selectedWorkout?.titreLocalise ?? "Séance";
          const exName =
            selectedWorkout?.exercises?.[activeExerciseIndex]?.nomLocalise ?? "Exercice";
          const dur =
            selectedWorkout?.exercises?.[activeExerciseIndex]?.dureeSecondes ?? 30;
          recordCompletedExercise(wkTitle, exName, dur || 30);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, selectedWorkout, activeExerciseIndex, recordCompletedExercise]);

  const handleSelectLang = async (nextLang: LangCode) => {
    setLang(nextLang);
    setSavingPref(true);
    try {
      const res = await fetch("/api/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ langue: nextLang }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.preferences) setPreferences(data.preferences);
      }
    } catch {
      setOfflineMode(true);
    } finally {
      setSavingPref(false);
    }
  };

  const handleTogglePreference = async (
    key: "bipActif" | "vibrationActive" | "garderEcranAllume" | "avertissementSanteAccepte"
  ) => {
    if (!preferences) return;
    const nextVal = !preferences[key];
    const nextPrefs = { ...preferences, [key]: nextVal };
    setPreferences(nextPrefs);
    try {
      localStorage.setItem(CACHE_KEY_PREFS, JSON.stringify(nextPrefs));
    } catch {
      // Ignorer
    }
    setSavingPref(true);
    try {
      const res = await fetch("/api/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: nextVal }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.preferences) setPreferences(data.preferences);
      }
    } catch {
      setOfflineMode(true);
    } finally {
      setSavingPref(false);
    }
  };

  const exercises = selectedWorkout?.exercises ?? [];
  const currentExercise = exercises[activeExerciseIndex] ?? null;

  const startExercise = (idx: number) => {
    const ex = exercises[idx];
    setActiveExerciseIndex(idx);
    setSecondsLeft(ex?.dureeSecondes && ex.dureeSecondes > 0 ? ex.dureeSecondes : 30);
    setIsRunning(true);
  };

  const recoveryStatus =
    history.length === 0
      ? "Prêt pour une première séance"
      : history.length >= 4
      ? "Récupération conseillée (charge élevée)"
      : "Bonne récupération — prêt à s'entraîner";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 max-w-4xl mx-auto space-y-6">
      <header className="bg-[#0B1F3A] text-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-300 font-semibold">
              FIT PRO VERT • HOME WORKOUT
            </p>
            <h1 className="text-2xl font-bold tracking-tight">
              Programmes &amp; Exercices ({workouts.length})
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {offlineMode && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-400/20 text-amber-200 border border-amber-400/40">
                Mode hors ligne
              </span>
            )}
            <button
              type="button"
              onClick={() => setOnlySansSaut((v) => !v)}
              className={`px-3 py-2 rounded-xl text-sm font-medium border transition ${
                onlySansSaut
                  ? "bg-emerald-500 text-slate-950 border-emerald-400"
                  : "bg-slate-900/60 text-white border-slate-700"
              }`}
            >
              {onlySansSaut ? "Sans saut : ACTIF" : "Sans saut : TOUS"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {LANGS.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => handleSelectLang(item.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                lang === item.code
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              {item.label}
            </button>
          ))}
          {savingPref && (
            <span className="text-xs text-emerald-300 ml-2">Sauvegarde...</span>
          )}
        </div>
      </header>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          {errorMsg}
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#0B1F3A]">Programmes disponibles</h2>
        {loading ? (
          <p className="text-sm text-slate-500">Chargement des programmes...</p>
        ) : workouts.length === 0 ? (
          <p className="text-sm text-slate-500">
            Aucun programme trouvé pour ce filtre (vérifie que le seed a bien été exécuté).
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {workouts.map((wk) => {
              const isSelected = selectedWorkout?.idWorkout === wk.idWorkout;
              return (
                <button
                  key={wk.idWorkout}
                  type="button"
                  onClick={() => {
                    setSelectedWorkout(wk);
                    setActiveExerciseIndex(0);
                    setIsRunning(false);
                    const firstDur = wk.exercises?.[0]?.dureeSecondes;
                    setSecondsLeft(firstDur && firstDur > 0 ? firstDur : 30);
                  }}
                  className={`text-left p-4 rounded-xl border transition ${
                    isSelected
                      ? "bg-white border-[#0B1F3A] ring-2 ring-[#0B1F3A]/20"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      #{wk.ordreAffichage}
                    </span>
                    <span className="text-xs text-slate-500">
                      {wk.exercises?.length ?? 0} ex.
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#0B1F3A] mt-2">
                    {wk.titreLocalise}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {wk.descriptionLocalise}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {selectedWorkout && (
        <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#0B1F3A]">
                {selectedWorkout.titreLocalise}
              </h2>
              <p className="text-sm text-slate-600">{selectedWorkout.descriptionLocalise}</p>
            </div>

            <div className="bg-[#0B1F3A] text-white rounded-xl px-4 py-3 flex items-center gap-3 self-start">
              <div>
                <div className="text-[11px] uppercase text-emerald-300">Timer</div>
                <div className="text-xl font-mono font-bold">{secondsLeft}s</div>
              </div>
              <button
                type="button"
                onClick={() => setIsRunning((r) => !r)}
                className="px-3 py-1.5 rounded-lg bg-emerald-400 text-slate-950 text-xs font-bold"
              >
                {isRunning ? "Pause" : "Start"}
              </button>
            </div>
          </div>

          {currentExercise && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start">
              <NavySilhouette isRunning={isRunning} stepIndex={animTick} />
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-[#0B1F3A]">
                    Exercice actif #{currentExercise.ordreExercice}
                  </span>
                  {currentExercise.muscleCible && (
                    <span className="text-xs text-slate-500">{currentExercise.muscleCible}</span>
                  )}
                </div>
                <p className="text-lg font-bold text-[#0B1F3A]">
                  {currentExercise.nomLocalise}
                </p>
                {currentExercise.instructionsExecution && (
                  <p className="text-sm text-slate-700">
                    {currentExercise.instructionsExecution}
                  </p>
                )}
                <div className="text-xs text-slate-600 flex flex-wrap gap-3 pt-1">
                  {currentExercise.repetitionsCible ? (
                    <span>Cible : {currentExercise.repetitionsCible} reps</span>
                  ) : (
                    <span>Durée : {currentExercise.dureeSecondes ?? 30}s</span>
                  )}
                  {currentExercise.respiration && (
                    <span>Respiration : {currentExercise.respiration}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">
              Exercices du programme ({exercises.length})
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {exercises.map((ex, idx) => (
                <button
                  key={ex.idExercice}
                  type="button"
                  onClick={() => startExercise(idx)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between text-sm transition ${
                    idx === activeExerciseIndex
                      ? "bg-emerald-50/70 font-semibold text-[#0B1F3A]"
                      : "bg-white hover:bg-slate-50 text-slate-800"
                  }`}
                >
                  <span>
                    {ex.ordreExercice}. {ex.nomLocalise}
                  </span>
                  <span className="text-xs text-slate-500">
                    {ex.repetitionsCible ? `${ex.repetitionsCible} reps` : `${ex.dureeSecondes ?? 30}s`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Récupération & Historique récent */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-base font-bold text-[#0B1F3A]">Récupération &amp; Historique</h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800">
            {recoveryStatus}
          </span>
        </div>
        {history.length === 0 ? (
          <p className="text-xs text-slate-500">
            Lance un timer d&apos;exercice et laisse-le arriver à 0s pour enregistrer ton historique local.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 text-xs">
            {history.map((item) => (
              <li key={item.id} className="py-2 flex items-center justify-between">
                <div>
            
