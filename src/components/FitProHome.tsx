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

export default function FitProHome() {
  const [lang, setLang] = useState<LangCode>("fr");
  const [onlySansSaut, setOnlySansSaut] = useState<boolean>(false);
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutItem | null>(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<UserPreferenceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingPref, setSavingPref] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadPreferences = useCallback(async () => {
    try {
      const res = await fetch("/api/preferences", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.preferences) {
        setPreferences(data.preferences);
        const prefLang = data.preferences.langue as LangCode;
        if (LANGS.some((l) => l.code === prefLang)) {
          setLang(prefLang);
        }
      }
    } catch {
      // Silencieux en cas de premier chargement hors ligne
    }
  }, []);

  const loadWorkouts = useCallback(async (targetLang: LangCode, sansSaut: boolean) => {
    setLoading(true);
    setErrorMsg(null);
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
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

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
    } finally {
      setSavingPref(false);
    }
  };

  const handleTogglePreference = async (
    key: "bipActif" | "vibrationActive" | "garderEcranAllume" | "avertissementSanteAccepte"
  ) => {
    if (!preferences) return;
    const nextVal = !preferences[key];
    setPreferences({ ...preferences, [key]: nextVal });
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
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
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

      {preferences && (
        <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-bold text-[#0B1F3A]">Préférences &amp; Sécurité</h2>
          <div className="flex flex-wrap gap-3 text-xs">
            <button
              type="button"
              onClick={() => handleTogglePreference("bipActif")}
              className={`px-3 py-2 rounded-lg border font-medium ${
                preferences.bipActif
                  ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              Bip sonore : {preferences.bipActif ? "ON" : "OFF"}
            </button>
            <button
              type="button"
              onClick={() => handleTogglePreference("vibrationActive")}
              className={`px-3 py-2 rounded-lg border font-medium ${
                preferences.vibrationActive
                  ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              Vibration : {preferences.vibrationActive ? "ON" : "OFF"}
            </button>
            <button
              type="button"
              onClick={() => handleTogglePreference("garderEcranAllume")}
              className={`px-3 py-2 rounded-lg border font-medium ${
                preferences.garderEcranAllume
                  ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              Écran allumé : {preferences.garderEcranAllume ? "ON" : "OFF"}
            </button>
            <button
              type="button"
              onClick={() => handleTogglePreference("avertissementSanteAccepte")}
              className={`px-3 py-2 rounded-lg border font-medium ${
                preferences.avertissementSanteAccepte
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              Santé acceptée : {preferences.avertissementSanteAccepte ? "OUI" : "NON"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
  }
    
