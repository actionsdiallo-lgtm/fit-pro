"use client";

import React, { useEffect, useState } from "react";
import {
  Flame,
  Dumbbell,
  Clock,
  Scale,
  Trophy,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  Circle,
} from "lucide-react";

type RangeKey = "7d" | "30d" | "3m" | "1y";

interface ProgressData {
  range: RangeKey;
  isEmpty: boolean;
  stats: {
    caloriesBurned: number;
    caloriesDeltaPct: number | null;
    workoutsCount: number;
    workoutsDeltaPct: number | null;
    totalMinutes: number;
    totalDurationLabel: string;
    durationDeltaPct: number | null;
    currentWeightKg: number | null;
    weightDeltaKg: number | null;
  };
  series: Array<{
    label: string;
    calories: number;
    weightKg: number | null;
  }>;
  goals: {
    completionPct: number;
    items: Array<{
      id: string;
      title: string;
      completed: boolean;
      progressPct: number;
    }>;
  };
  records: Array<{
    id: string;
    label: string;
    value: string;
  }>;
}

const RANGES: Array<{ key: RangeKey; label: string }> = [
  { key: "7d", label: "7 jours" },
  { key: "30d", label: "30 jours" },
  { key: "3m", label: "3 mois" },
  { key: "1y", label: "1 an" },
];

function formatDelta(delta: number | null, suffix = "%"): string {
  if (delta === null || Number.isNaN(delta)) return "0" + suffix;
  if (delta > 0) return `↑ +${delta}${suffix}`;
  if (delta < 0) return `↓ ${delta}${suffix}`;
  return `0${suffix}`;
}

export default function ProgressView({
  userEmail,
  onBack,
  onOpenGoals,
  onOpenRecords,
  onOpenDetails,
}: {
  userEmail?: string | null;
  onBack?: () => void;
  onOpenGoals?: () => void;
  onOpenRecords?: () => void;
  onOpenDetails?: () => void;
}) {
  const [range, setRange] = useState<RangeKey>("30d");
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const query = new URLSearchParams({ range });
        if (userEmail) query.set("email", userEmail);
        const res = await fetch(`/api/progress?${query.toString()}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (active && res.ok) {
          setData(json);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [range, userEmail]);

  const stats = data?.stats ?? {
    caloriesBurned: 0,
    caloriesDeltaPct: null,
    workoutsCount: 0,
    workoutsDeltaPct: null,
    totalMinutes: 0,
    totalDurationLabel: "0 min",
    durationDeltaPct: null,
    currentWeightKg: null,
    weightDeltaKg: null,
  };

  const series = data?.series ?? [];
  const maxCal = Math.max(1, ...series.map((s) => s.calories));

  const calPoints = series
    .map((pt, i) => {
      const x = series.length > 1 ? (i / (series.length - 1)) * 260 + 20 : 150;
      const y = 110 - (pt.calories / maxCal) * 80;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="min-h-screen bg-[#060b08] text-white pb-24">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Retour"
          className="h-9 w-9 rounded-full border border-emerald-500/40 bg-emerald-950/40 flex items-center justify-center text-emerald-300"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="text-xl font-black italic tracking-wide text-emerald-400">
            FIT PRO
          </div>
          <div className="text-sm font-semibold text-white">Progrès</div>
        </div>

        <button
          type="button"
          onClick={onOpenDetails}
          aria-label="Calendrier"
          className="h-9 w-9 rounded-lg border border-emerald-500/40 bg-emerald-950/40 flex items-center justify-center text-emerald-300"
        >
          <Calendar className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-4 mt-2 relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#0b1710] h-36 flex items-center justify-between px-4">
        <img
          src="/images/progress-athlete.jpg"
          alt="Séance d'entraînement FIT PRO"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="relative z-10 max-w-[68%]">
          <h1 className="text-2xl font-extrabold italic text-white">
            {data?.isEmpty ? "Prêt à démarrer !" : "Vous progressez !"}
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1">
            {data?.isEmpty
              ? "Aucune donnée enregistrée pour le moment. Ajoutez une séance réelle."
              : "Suivi en temps réel de vos séances, objectifs et records."}
          </p>
        </div>
        <div className="relative z-10 h-12 w-12 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400">
          <Trophy className="h-6 w-6" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 px-4 mt-4">
        {RANGES.map((item) => {
          const active = range === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setRange(item.key)}
              className={`py-2 rounded-xl text-xs font-bold transition ${
                active
                  ? "bg-lime-400 text-black shadow-md shadow-lime-400/20"
                  : "bg-[#111c15] text-emerald-100/80 border border-emerald-500/20"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 mt-4">
        <div className="rounded-2xl border border-emerald-500/25 bg-[#0d1912] p-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-100/80">
            <Flame className="h-4 w-4 text-orange-400" />
            <span>Calories brûlées</span>
          </div>
          <div className="text-xl font-extrabold mt-1">
            {loading ? "..." : stats.caloriesBurned.toLocaleString("fr-FR")}
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-0.5">
            {formatDelta(stats.caloriesDeltaPct)}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/25 bg-[#0d1912] p-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-100/80">
            <Dumbbell className="h-4 w-4 text-emerald-400" />
            <span>Entraînements</span>
          </div>
          <div className="text-xl font-extrabold mt-1">
            {loading ? "..." : stats.workoutsCount}
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-0.5">
            {formatDelta(stats.workoutsDeltaPct)}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/25 bg-[#0d1912] p-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-100/80">
            <Clock className="h-4 w-4 text-lime-400" />
            <span>Temps total</span>
          </div>
          <div className="text-xl font-extrabold mt-1">
            {loading ? "..." : stats.totalDurationLabel}
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-0.5">
            {formatDelta(stats.durationDeltaPct)}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/25 bg-[#0d1912] p-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-100/80">
            <Scale className="h-4 w-4 text-cyan-400" />
            <span>Poids actuel</span>
          </div>
          <div className="text-xl font-extrabold mt-1">
            {loading
              ? "..."
              : stats.currentWeightKg !== null
              ? `${stats.currentWeightKg} kg`
              : "0 kg"}
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-0.5">
            {stats.weightDeltaKg !== null ? `${stats.weightDeltaKg} kg` : "0 kg"}
          </div>
        </div>
      </div>

      <div className="mx-4 mt-4 rounded-2xl border border-emerald-500/30 bg-[#0d1912] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Évolution de votre progression</h2>
          <button
            type="button"
            onClick={onOpenDetails}
            className="text-xs font-semibold text-emerald-400"
          >
            Voir détails &gt;
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs mt-2">
          <span className="inline-flex items-center gap-1.5 text-emerald-300">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            Poids (kg)
          </span>
          <span className="inline-flex items-center gap-1.5 text-sky-300">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
            Calories (kcal)
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <svg viewBox="0 0 300 130" className="w-full h-32">
            <line x1="20" y1="110" x2="280" y2="110" stroke="#1f3a2b" strokeWidth="1" />
            {series.length > 0 && (
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                points={calPoints}
              />
            )}
          </svg>

          <div className="flex flex-col gap-2 shrink-0">
            <div className="rounded-lg bg-sky-600/30 border border-sky-400/50 px-2.5 py-1 text-xs font-bold text-sky-200">
              {stats.caloriesBurned.toLocaleString("fr-FR")} kcal
            </div>
            <div className="rounded-lg bg-emerald-600/30 border border-emerald-400/50 px-2.5 py-1 text-xs font-bold text-emerald-200">
              {stats.currentWeightKg !== null ? `${stats.currentWeightKg} kg` : "0 kg"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 text-center text-[11px] text-emerald-200/70 mt-1">
          {(series.length > 0 ? series : [{ label: "S1" }, { label: "S2" }, { label: "S3" }, { label: "S4" }]).map(
            (pt) => (
              <span key={pt.label}>{pt.label}</span>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 mt-4">
        <div className="rounded-2xl border border-emerald-500/25 bg-[#0d1912] p-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Mes objectifs</h3>
            <div className="my-2 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-lime-400 flex items-center justify-center text-sm font-extrabold text-white">
                {data?.goals.completionPct ?? 0}%
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              {(data?.goals.items ?? []).length === 0 ? (
                <p className="text-emerald-200/60 text-[11px]">Aucun objectif défini.</p>
              ) : (
                data!.goals.items.map((g) => (
                  <div key={g.id} className="flex items-center gap-1.5">
                    {g.completed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-lime-400 shrink-0" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-emerald-400/60 shrink-0" />
                    )}
                    <span className="truncate">{g.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenGoals}
            className="mt-3 w-full py-1.5 rounded-xl bg-lime-400 text-black text-xs font-bold"
          >
            Voir mes objectifs &gt;
          </button>
        </div>

        <div className="rounded-2xl border border-emerald-500/25 bg-[#0d1912] p-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Mes records</h3>
            <div className="mt-2 space-y-2 text-xs">
              {(data?.records ?? []).length === 0 ? (
                <p className="text-emerald-200/60 text-[11px]">Aucun record enregistré.</p>
              ) : (
                data!.records.map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-1">
                    <span className="text-emerald-100/80 truncate">{r.label}</span>
                    <span className="font-bold text-white shrink-0">{r.value}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenRecords}
            className="mt-3 w-full py-1.5 rounded-xl bg-lime-400 text-black text-xs font-bold"
          >
            Voir tous mes records &gt;
          </button>
        </div>
      </div>

      <div className="mx-4 mt-4 relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#0b1710] p-4 flex items-center justify-between">
        <img
          src="/images/effort-banner.jpg"
          alt="Motivation sportive FIT PRO"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="relative z-10">
          <div className="text-sm font-bold text-white">Chaque effort compte !</div>
          <div className="text-xs text-emerald-100/80 mt-0.5">
            {data?.isEmpty
              ? "Enregistrez vos premières séances pour suivre votre progression."
              : "Poursuivez vos séances pour faire évoluer vos statistiques."}
          </div>
        </div>
      </div>
    </div>
  );
  }
