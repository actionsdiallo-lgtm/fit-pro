"use client";

import React, { useEffect, useState, useCallback } from "react";

const LANGS = ["fr", "en", "es", "ar", "pt", "de", "it", "wo"] as const;
type LangCode = (typeof LANGS)[number];

interface ExerciseItem {
  idExercice: string;
  idWorkout: string;
  ordreExercice: number;
  nomLocalise: string;
  instructionsExecution?: string;
  respiration?: string;
  dureeSecondes?: number | null;
  repetitionsCible?: number | null;
  muscleCible?: string;
}

interface WorkoutItem {
  idWorkout: string;
  ordreAffichage: number;
  titreLocalise: string;
  descriptionLocalise: string;
  exercises: ExerciseItem[];
}

interface UserPreferenceData {
  id: number;
  langue: string;
  bipActif: boolean;
  vibrationActive: boolean;
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

const DEMO_COPY: Record<
  LangCode,
  {
    wkTitle: string;
    wkDesc: string;
    ex1Name: string;
    ex1Inst: string;
    ex2Name: string;
    ex2Inst: string;
    muscle1: string;
    muscle2: string;
  }
> = {
  fr: {
    wkTitle: "Full Body Sans Saut (Démo)",
    wkDesc: "Séance complète sans matériel, adaptée à tous les niveaux.",
    ex1Name: "Squats au poids du corps",
    ex1Inst: "Pieds largeur d'épaules, descends les hanches vers l'arrière en gardant le buste droit.",
    ex2Name: "Gainage planche",
    ex2Inst: "Appui sur les avant-bras et pointes de pieds, corps aligné.",
    muscle1: "Jambes & Fessiers",
    muscle2: "Sangle abdominale",
  },
  en: {
    wkTitle: "No-Jump Full Body (Demo)",
    wkDesc: "Complete equipment-free session for all fitness levels.",
    ex1Name: "Bodyweight Squats",
    ex1Inst: "Feet shoulder-width apart, push hips back while keeping chest upright.",
    ex2Name: "Forearm Plank",
    ex2Inst: "Support on forearms and toes, keep body in a straight line.",
    muscle1: "Legs & Glutes",
    muscle2: "Core",
  },
  es: {
    wkTitle: "Cuerpo Completo Sin Saltos (Demo)",
    wkDesc: "Rutina completa sin equipo, ideal para todos los niveles.",
    ex1Name: "Sentadillas con peso corporal",
    ex1Inst: "Pies al ancho de los hombros, lleva la cadera atrás manteniendo el torso firme.",
    ex2Name: "Plancha en antebrazos",
    ex2Inst: "Apoyo en antebrazos y puntas de los pies, cuerpo alineado.",
    muscle1: "Piernas y Glúteos",
    muscle2: "Abdomen",
  },
  ar: {
    wkTitle: "تمرين الجسم كامل بدون قفز (تجريبي)",
    wkDesc: "حصة متكاملة بدون معدات ومناسبة لجميع المستويات.",
    ex1Name: "القرفصاء بوزن الجسم",
    ex1Inst: "القدمان بعرض الكتفين، ادفع الوركين للخلف مع الحفاظ على استقامة الظهر.",
    ex2Name: "تمرين البلانك على الساعدين",
    ex2Inst: "الارتكاز على الساعدين وأطراف القدمين مع استقامة الجسم.",
    muscle1: "الأرجل والمؤخرة",
    muscle2: "عضلات البطن",
  },
  pt: {
    wkTitle: "Corpo Inteiro Sem Salto (Demo)",
    wkDesc: "Treino completo sem equipamentos para todos os níveis.",
    ex1Name: "Agachamento livre",
    ex1Inst: "Pés na largura dos ombros, projete o quadril para trás mantendo a postura.",
    ex2Name: "Prancha nos antebraços",
    ex2Inst: "Apoio nos antebraços e pontas dos pés, corpo alinhado.",
    muscle1: "Pernas e Glúteos",
    muscle2: "Abdômen",
  },
  de: {
    wkTitle: "Ganzkörper ohne Springen (Demo)",
    wkDesc: "Komplettes Training ohne Geräte für jedes Niveau.",
    ex1Name: "Kniebeugen mit Körpergewicht",
    ex1Inst: "Füße schulterbreit, Hüfte nach hinten schieben und Oberkörper aufrecht halten.",
    ex2Name: "Unterarmstütz (Plank)",
    ex2Inst: "Auf Unterarmen und Zehenspitzen abstützen, Körper gerade halten.",
    muscle1: "Beine & Gesäß",
    muscle2: "Rumpf",
  },
  it: {
    wkTitle: "Total Body Senza Salti (Demo)",
    wkDesc: "Allenamento completo a corpo libero per tutti i livelli.",
    ex1Name: "Squat a corpo libero",
    ex1Inst: "Piedi alla larghezza delle spalle, porta il bacino indietro con busto dritto.",
    ex2Name: "Plank sui gomiti",
    ex2Inst: "Appoggio su avambracci e punte dei piedi, corpo allineato.",
    muscle1: "Gambe e Glutei",
    muscle2: "Addominali",
  },
  wo: {
    wkTitle: "Yaram Wépp Amul Tàbb (Demo)",
    wkDesc: "Tàggat bu mat ci biir kër te soxlaul dara, mën na nekk ci koo xam ne.",
    ex1Name: "Squat ci sa yaram",
    ex1Inst: "Téelal sa tànk ci yaatuwaayu mbaam, wàccal sa létt te gëdd sa wàll.",
    ex2Name: "Planche ci sa loxo",
    ex2Inst: "Téelal ci sa loxo ak sa baaraami tànk, sa yaram di jub.",
    muscle1: "Tànk ak Létt",
    muscle2: "Biir",
  },
};

function getFallbackWorkouts(targetLang: LangCode): WorkoutItem[] {
  const c = DEMO_COPY[targetLang] ?? DEMO_COPY.fr;
  return [
    {
      idWorkout: `demo-${targetLang}-1`,
      ordreAffichage: 1,
      titreLocalise: c.wkTitle,
      descriptionLocalise: c.wkDesc,
      exercises: [
        {
          idExercice: `demo-ex-${targetLang}-1`,
          idWorkout: `demo-${targetLang}-1`,
          ordreExercice: 1,
          nomLocalise: c.ex1Name,
          instructionsExecution: c.ex1Inst,
          dureeSecondes: 30,
          muscleCible: c.muscle1,
        },
        {
          idExercice: `demo-ex-${targetLang}-2`,
          idWorkout: `demo-${targetLang}-1`,
          ordreExercice: 2,
          nomLocalise: c.ex2Name,
          instructionsExecution: c.ex2Inst,
          dureeSecondes: 30,
          muscleCible: c.muscle2,
        },
      ],
    },
  ];
}

function NavySilhouette({ isRunning, tick }: { isRunning: boolean; tick: number }) {
  const arm = isRunning ? (tick % 2 === 0 ? -24 : 24) : -8;
  const leg = isRunning ? (tick % 2 === 0 ? 18 : -18) : 6;
  return (
    <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 120 120" className="w-20 h-20 text-[#0B1F3A]" fill="none">
        <circle cx="60" cy="22" r="9" fill="currentColor" />
        <path d="M52 35H68L71 64H49L52 35Z" fill="currentColor" />
        <g transform={`translate(60, 40) rotate(${arm})`}>
          <rect x="-3" y="0" width="6" height="24" rx="3" fill="currentColor" />
        </g>
        <g transform={`translate(60, 64) rotate(${leg})`}>
          <rect x="-4" y="0" width="8" height="32" rx="4" fill="currentColor" />
        </g>
        <line x1="22" y1="100" x2="98" y2="100" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function FitProHome() {
  const [lang, setLang] = useState<LangCode>("fr");
  const [onlySansSaut, setOnlySansSaut] = useState(false);
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutItem | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [prefs, setPrefs] = useState<UserPreferenceData | null>(null);
  const [history, setHistory] = useState<SessionLog[]>([]);
  const [offlineMode, setOfflineMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const isRtl = lang === "ar";

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fpv_history");
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  const addHistory = useCallback((workoutTitle: string, exerciseName: string, durationSec: number) => {
    const entry: SessionLog = {
      id: `${Date.now()}`,
      workoutTitle,
      exerciseName,
      completedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      durationSec,
    };
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 10);
      try {
        localStorage.setItem("fpv_history", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const loadData = useCallback(async (targetLang: LangCode, sansSaut: boolean) => {
    setLoading(true);
    const cacheKey = `fpv_wk_${targetLang}_${sansSaut ? "1" : "0"}`;
    try {
      const pRes = await fetch("/api/preferences", { cache: "no-store" });
      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData?.preferences) setPrefs(pData.preferences);
      }
      const wRes = await fetch(
        `/api/workouts?lang=${targetLang}${sansSaut ? "&sansSaut=true" : ""}`,
        { cache: "no-store" }
      );
      if (!wRes.ok) throw new Error("workouts");
      const wData = await wRes.json();
      const apiList: WorkoutItem[] = Array.isArray(wData?.workouts) ? wData.workouts : [];
      const finalList = apiList.length > 0 ? apiList : getFallbackWorkouts(targetLang);
      setWorkouts(finalList);
      setOfflineMode(false);
      try {
        localStorage.setItem(cacheKey, JSON.stringify(finalList));
      } catch {}
      setSelectedWorkout(
        (prev) => finalList.find((w) => w.idWorkout === prev?.idWorkout) ?? finalList[0] ?? null
      );
      setActiveIdx(0);
    } catch {
      try {
        const cached = localStorage.getItem(cacheKey);
        const list: WorkoutItem[] = cached ? JSON.parse(cached) : getFallbackWorkouts(targetLang);
        setWorkouts(list);
        setSelectedWorkout((prev) => list.find((w) => w.idWorkout === prev?.idWorkout) ?? list[0] ?? null);
        setOfflineMode(true);
      } catch {
        const fallback = getFallbackWorkouts(targetLang);
        setWorkouts(fallback);
        setSelectedWorkout(fallback[0]);
        setOfflineMode(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(lang, onlySansSaut);
  }, [lang, onlySansSaut, loadData]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setSecondsLeft((s) => {
        if (s <= 1) {
          setIsRunning(false);
          const wkTitle = selectedWorkout?.titreLocalise ?? "Séance";
          const ex = selectedWorkout?.exercises?.[activeIdx];
          addHistory(wkTitle,
    return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 text-slate-900 p-4 max-w-4xl mx-auto space-y-6"
    >
      <header className="bg-[#0B1F3A] text-white rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-300 font-semibold">
              FIT PRO VERT • GLOBAL
            </p>
            <h1 className="text-2xl font-bold">Programmes ({workouts.length})</h1>
          </div>
          <div className="flex items-center gap-2">
            {offlineMode && (
              <span className="text-xs px-2 py-1 rounded bg-amber-400/20 text-amber-200">
                Hors ligne
              </span>
            )}
            <button
              type="button"
              onClick={() => setOnlySansSaut((v) => !v)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                onlySansSaut
                  ? "bg-emerald-500 text-slate-950 border-emerald-400"
                  : "bg-slate-900/60 text-white border-slate-700"
              }`}
            >
              {onlySansSaut ? "Sans saut : ON" : "Sans saut : TOUS"}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {LANGS.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                lang === code ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-200"
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#0B1F3A]">Programmes</h2>
        {loading ? (
          <p className="text-sm text-slate-500">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {workouts.map((wk) => (
              <button
                key={wk.idWorkout}
                type="button"
                onClick={() => {
                  setSelectedWorkout(wk);
                  setActiveIdx(0);
                  setIsRunning(false);
                  setSecondsLeft(wk.exercises?.[0]?.dureeSecondes ?? 30);
                }}
                className={`text-start p-4 rounded-xl border bg-white ${
                  selectedWorkout?.idWorkout === wk.idWorkout
                    ? "border-[#0B1F3A] ring-2 ring-[#0B1F3A]/20"
                    : "border-slate-200"
                }`}
              >
                <div className="text-xs font-bold text-emerald-700">
                  #{wk.ordreAffichage} • {wk.exercises?.length ?? 0} ex.
                </div>
                <div className="font-bold text-[#0B1F3A] mt-1">{wk.titreLocalise}</div>
                <div className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {wk.descriptionLocalise}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedWorkout && (
        <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#0B1F3A]">{selectedWorkout.titreLocalise}</h2>
              <p className="text-sm text-slate-600">{selectedWorkout.descriptionLocalise}</p>
            </div>
            <div className="bg-[#0B1F3A] text-white rounded-xl px-4 py-2 flex items-center gap-3 shrink-0">
              <span className="text-xl font-mono font-bold">{secondsLeft}s</span>
              <button
                type="button"
                onClick={() => setIsRunning((r) => !r)}
                className="px-3 py-1 rounded-lg bg-emerald-400 text-slate-950 text-xs font-bold"
              >
                {isRunning ? "Pause" : "Start"}
              </button>
            </div>
          </div>

          {currentEx && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4 items-start">
              <NavySilhouette isRunning={isRunning} tick={tick} />
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[#0B1F3A]">
                  #{currentEx.ordreExercice} • {currentEx.muscleCible ?? ""}
                </div>
                <div className="text-lg font-bold text-[#0B1F3A]">{currentEx.nomLocalise}</div>
                {currentEx.instructionsExecution && (
                  <p className="text-sm text-slate-700">{currentEx.instructionsExecution}</p>
                )}
              </div>
            </div>
          )}

          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl">
            {exercises.map((ex, i) => (
              <button
                key={ex.idExercice}
                type="button"
                onClick={() => {
                  setActiveIdx(i);
                  setSecondsLeft(ex.dureeSecondes ?? 30);
                  setIsRunning(true);
                }}
                className={`w-full text-start px-4 py-3 flex items-center justify-between text-sm ${
                  i === activeIdx ? "bg-emerald-50/70 font-semibold text-[#0B1F3A]" : "bg-white text-slate-800"
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
        </section>
      )}

      <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0B1F3A]">Récupération &amp; Historique</h2>
          <span className="text-xs font-semibold text-emerald-700">
            {history.length >= 4 ? "Récupération conseillée" : "Prêt pour l'entraînement"}
          </span>
        </div>
        {history.length === 0 ? (
          <p className="text-xs text-slate-500">Aucun exercice terminé pour l&apos;instant.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-xs">
            {history.map((h) => (
              <li key={h.id} className="py-2 flex justify-between">
                <span>
                  <strong>{h.exerciseName}</strong> — {h.workoutTitle}
                </span>
                <span className="text-slate-500">
                  {h.durationSec}s • {h.completedAt}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {prefs && (
        <section className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => updatePref("bipActif")}
            className={`px-3 py-2 rounded-lg border ${prefs.bipActif ? "bg-[#0B1F3A] text-white" : "bg-slate-50"}`}
          >
            Bip : {prefs.bipActif ? "ON" : "OFF"}
          </button>
          <button
            type="button"
            onClick={() => updatePref("vibrationActive")}
            className={`px-3 py-2 rounded-lg border ${prefs.vibrationActive ? "bg-[#0B1F3A] text-white" : "bg-slate-50"}`}
          >
            Vibration : {prefs.vibrationActive ? "ON" : "OFF"}
          </button>
          <button
            type="button"
            onClick={() => updatePref("garderEcranAllume")}
            className={`px-3 py-2 rounded-lg border ${prefs.garderEcranAllume ? "bg-[#0B1F3A] text-white" : "bg-slate-50"}`}
          >
            Écran : {prefs.garderEcranAllume ? "ON" : "OFF"}
          </button>
          <button
            type="button"
            onClick={() => updatePref("avertissementSanteAccepte")}
            className={`px-3 py-2 rounded-lg border ${prefs.avertissementSanteAccepte ? "bg-emerald-600 text-white" : "bg-slate-50"}`}
          >
            Santé : {prefs.avertissementSanteAccepte ? "OUI" : "NON"}
          </button>
        </section>
      )}
    </div>
  );
      }
                
