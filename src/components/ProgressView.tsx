"use client";

import React, { useEffect, useState } from "react";

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

const PHOTO_SOURCES = {
  bgLocal: "/images/progres-bg.jpg",
  bgCommercial:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80",
  heroLocal: "/images/progress-athlete.jpg",
  heroCommercial:
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=80",
  effortLocal: "/images/effort-banner.jpg",
  effortCommercial:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
};

const RANGES: Array<{ key: RangeKey; label: string }> = [
  { key: "7d", label: "7 jours" },
  { key: "30d", label: "30 jours" },
  { key: "3m", label: "3 mois" },
  { key: "1y", label: "1 an" },
];

function formatDeltaPct(delta: number | null): { text: string; negative: boolean } {
  if (delta === null || Number.isNaN(delta) || delta === 0) {
    return { text: "0%", negative: false };
  }
  if (delta > 0) {
    return { text: `↑ +${delta}%`, negative: false };
  }
  return { text: `↓ ${delta}%`, negative: true };
}

function formatWeightDelta(delta: number | null): { text: string; negative: boolean } {
  if (delta === null || Number.isNaN(delta) || delta === 0) {
    return { text: "0 kg", negative: false };
  }
  if (delta > 0) {
    return { text: `↑ +${delta} kg`, negative: false };
  }
  return { text: `↓ ${delta} kg`, negative: true };
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

  const [bgSrc, setBgSrc] = useState<string>(PHOTO_SOURCES.bgLocal);
  const [heroSrc, setHeroSrc] = useState<string>(PHOTO_SOURCES.heroLocal);
  const [effortSrc, setEffortSrc] = useState<string>(PHOTO_SOURCES.effortLocal);

  useEffect(() => {
    let active = true;

    async function loadProgress() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ range });
        if (userEmail) {
          params.set("email", userEmail);
        }
        const res = await fetch(`/api/progress?${params.toString()}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (active && res.ok) {
          setData(json);
        }
      } catch (err) {
        console.error("Erreur chargement /api/progress:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProgress();
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

  const series =
    data?.series && data.series.length > 0
      ? data.series
      : [
          { label: "S1", calories: 0, weightKg: stats.currentWeightKg },
          { label: "S2", calories: 0, weightKg: stats.currentWeightKg },
          { label: "S3", calories: 0, weightKg: stats.currentWeightKg },
          { label: "S4", calories: 0, weightKg: stats.currentWeightKg },
        ];

  const maxCal = Math.max(1, ...series.map((s) => s.calories ?? 0));
  const weights = series
    .map((s) => s.weightKg)
    .filter((w): w is number => typeof w === "number" && !Number.isNaN(w));
  const minW = weights.length > 0 ? Math.min(...weights) - 2 : 0;
  const maxW = weights.length > 0 ? Math.max(...weights) + 2 : 1;
  const weightSpan = Math.max(1, maxW - minW);

  const calCoords = series.map((pt, i) => {
    const x = series.length > 1 ? (i / (series.length - 1)) * 220 + 20 : 130;
    const y = 104 - ((pt.calories ?? 0) / maxCal) * 78;
    return { x, y };
  });

  const weightCoords = series.map((pt, i) => {
    const x = series.length > 1 ? (i / (series.length - 1)) * 220 + 20 : 130;
    const wVal = typeof pt.weightKg === "number" ? pt.weightKg : 0;
    const y =
      weights.length > 0 ? 104 - ((wVal - minW) / weightSpan) * 78 : 104;
    return { x, y };
  });

  const calDelta = formatDeltaPct(stats.caloriesDeltaPct);
  const workoutsDelta = formatDeltaPct(stats.workoutsDeltaPct);
  const durationDelta = formatDeltaPct(stats.durationDeltaPct);
  const weightDelta = formatWeightDelta(stats.weightDeltaKg);
  const goalPct = Math.max(0, Math.min(100, data?.goals?.completionPct ?? 0));

  return (
    <div className="relative min-h-screen bg-[#050a07] text-white pb-24 overflow-x-hidden">
      <img
        src={bgSrc}
        alt=""
        onError={() => {
          if (bgSrc !== PHOTO_SOURCES.bgCommercial) {
            setBgSrc(PHOTO_SOURCES.bgCommercial);
          }
        }}
        className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover opacity-25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#050a07]/85 via-[#06120b]/80 to-[#050a07]/95"
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="Retour"
            className="h-10 w-10 rounded-full border border-emerald-400/50 bg-[#0b1911]/90 flex items-center justify-center text-emerald-300 text-xl font-bold"
          >
            &lt;
          </button>

          <div className="text-center">
            <div className="text-2xl font-black italic tracking-wide text-[#39ff49] leading-none">
              FIT PRO
            </div>
            <div className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
              <span>Progrès</span>
              <span className="inline-block h-3 w-3 rounded-sm bg-[#39ff49]" />
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenDetails}
            aria-label="Calendrier"
            className="h-10 w-10 rounded-xl border border-emerald-400/50 bg-[#0b1911]/90 flex items-center justify-center text-emerald-300 text-base"
          >
            🗓
          </button>
        </div>

        <div className="mx-4 mt-2 relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-[#09180f]/90 min-h-[136px] flex items-center justify-between px-4 py-3">
          <img
            src={heroSrc}
            alt="Athlète FIT PRO"
            onError={() => {
              if (heroSrc !== PHOTO_SOURCES.heroCommercial) {
                setHeroSrc(PHOTO_SOURCES.heroCommercial);
              }
            }}
            className="absolute inset-0 h-full w-full object-cover object-top opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050d08]/90 via-[#07180e]/65 to-[#050d08]/85" />

          <div className="relative z-10 max-w-[68%]">
            <h1 className="text-2xl font-black italic text-white leading-tight">
              {data?.isEmpty ? "Prêt à démarrer !" : "Vous progressez !"}
            </h1>
            <p className="text-xs text-emerald-100/90 mt-1 leading-snug">
              {data?.isEmpty
                ? "Aucune activité enregistrée pour l'instant. Commencez une séance."
                : "Continuez, vous êtes sur la bonne voie."}
            </p>
          </div>

          <div className="relative z-10 h-14 w-14 rounded-2xl border border-amber-400/50 bg-amber-500/15 flex items-center justify-center text-2xl shrink-0">
            🏆
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 px-4 mt-4">
          {RANGES.map((item) => {
            const isActive = range === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setRange(item.key)}
                className={`py-2 rounded-full text-xs font-extrabold transition ${
                  isActive
                    ? "bg-[#39ff49] text-[#051008] shadow-md shadow-[#39ff49]/25"
                    : "bg-[#0d1912]/90 text-white border border-emerald-500/25"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 px-4 mt-4">
          <div className="rounded-2xl border border-emerald-500/35 bg-[#0a160f]/90 p-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-100/85">
              <span>🔥</span>
              <span>Calories brûlées</span>
            </div>
            <div className="text-xl font-black mt-1.5">
              {loading ? "..." : stats.caloriesBurned.toLocaleString("fr-FR")}
            </div>
            <div
              className={`text-xs font-bold mt-1 ${
                calDelta.negative ? "text-amber-400" : "text-[#39ff49]"
              }`}
            >
              {calDelta.text}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/35 bg-[#0a160f]/90 p-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-100/85">
              <span>🏋️</span>
              <span>Entraînements</span>
            </div>
            <div className="text-xl font-black mt-1.5">
              {loading ? "..." : stats.workoutsCount}
            </div>
            <div
              className={`text-xs font-bold mt-1 ${
                workoutsDelta.negative ? "text-amber-400" : "text-[#39ff49]"
              }`}
            >
              {workoutsDelta.text}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/35 bg-[#0a160f]/90 p-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-100/85">
              <span>⏱️</span>
              <span>Temps total</span>
            </div>
            <div className="text-xl font-black mt-1.5">
              {loading ? "..." : stats.totalDurationLabel}
            </div>
            <div
              className={`text-xs font-bold mt-1 ${
                durationDelta.negative ? "text-amber-400" : "text-[#39ff49]"
              }`}
            >
              {durationDelta.text}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/35 bg-[#0a160f]/90 p-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-100/85">
              <span>⚖️</span>
              <span>Poids actuel</span>
            </div>
            <div className="text-xl font-black mt-1.5">
              {loading
                ? "..."
                : stats.currentWeightKg !== null
                ? `${stats.currentWeightKg} kg`
                : "0 kg"}
            </div>
            <div
              className={`text-xs font-bold mt-1 ${
                weightDelta.negative ? "text-amber-400" : "text-[#39ff49]"
              }`}
            >
              {weightDelta.text}
            </div>
          </div>
        </div>

        <div className="mx-4 mt-4 rounded-2xl border border-emerald-500/35 bg-[#0a160f]/90 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3.5 w-3.5 rounded-sm bg-[#39ff49]" />
              <h2 className="text-sm font-extrabold text-white">
                Évolution de votre progression
              </h2>
            </div>
            <button
              type="button"
              onClick={onOpenDetails}
              className="text-xs font-bold text-[#39ff49]"
            >
              Voir détails &gt;
            </button>
          </div>

          <div className="flex items-center gap-5 text-xs mt-2.5">
            <span className="inline-flex items-center gap-1.5 text-emerald-200">
              <span className="h-2.5 w-2.5 rounded-full bg-[#39ff49]" />
              Poids (kg)
            </span>
            <span className="inline-flex items-center gap-1.5 text-sky-300">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
              Calories (kcal)
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <svg viewBox="0 0 260 120" className="w-full h-32">
              <line
                x1="16"
                y1="104"
                x2="248"
                y2="104"
                stroke="#1c3827"
                strokeWidth="1"
              />
              {weights.length > 0 && (
                <polyline
                  fill="none"
                  stroke="#39ff49"
                  strokeWidth="2.5"
                  points={weightCoords.map((p) => `${p.x},${p.y}`).join(" ")}
                />
              )}
              {weightCoords.map((p, idx) => (
                <circle
                  key={`w-${idx}`}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="#0a160f"
                  stroke="#39ff49"
                  strokeWidth="2"
                />
              ))}
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                points={calCoords.map((p) => `${p.x},${p.y}`).join(" ")}
              />
              {calCoords.map((p, idx) => (
                <circle
                  key={`c-${idx}`}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="#0a160f"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />
              ))}
            </svg>

            <div className="flex flex-col gap-2 shrink-0">
              <div className="rounded-lg bg-sky-600/35 border border-sky-400/50 px-2.5 py-1 text-[11px] font-extrabold text-sky-200 leading-tight">
                <div>{stats.caloriesBurned.toLocaleString("fr-FR")}</div>
                <div>kcal</div>
              </div>
              <div className="rounded-lg bg-emerald-600/35 border border-[#39ff49]/50 px-2.5 py-1 text-[11px] font-extrabold text-[#39ff49]">
                {stats.currentWeightKg !== null ? `${stats.currentWeightKg} kg` : "0 kg"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 text-center text-[11px] font-semibold text-emerald-100/75 mt-1">
            {series.map((pt) => (
              <span key={pt.label}>{pt.label}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 px-4 mt-4">
          <div className="rounded-2xl border border-emerald-500/35 bg-[#0a160f]/90 p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-extrabold text-white">
                <span>🎯</span>
                <span>Mes objectifs</span>
              </div>

              <div className="my-3 flex items-center justify-center">
                <div
                  className="h-16 w-16 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(#39ff49 ${goalPct * 3.6}deg, #16291d 0deg)`,
                  }}
                >
                  <div className="h-12 w-12 rounded-full bg-[#0a160f] flex items-center justify-center text-xs font-black text-white">
                    {goalPct}%
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                {(data?.goals?.items ?? []).length === 0 ? (
                  <p className="text-emerald-200/60 text-[11px]">
                    Aucun objectif enregistré.
                  </p>
                ) : (
                  data!.goals.items.map((g) => (
                    <div key={g.id} className="flex items-center gap-1.5">
                      <span className="text-[#39ff49] shrink-0">
                        {g.completed ? "✓" : "○"}
                      </span>
                      <span className="truncate text-emerald-100/90">{g.title}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenGoals}
              className="mt-3 w-full py-2 rounded-full bg-[#39ff49] text-[#051008] text-xs font-extrabold"
            >
              Voir mes objectifs &gt;
            </button>
          </div>

          <div className="rounded-2xl border border-emerald-500/35 bg-[#0a160f]/90 p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-extrabold text-white">
                <span>🏆</span>
                <span>Mes records</span>
              </div>

              <div className="mt-3 space-y-2.5 text-xs">
                {(data?.records ?? []).length === 0 ? (
                  <p className="text-emerald-200/60 text-[11px]">
                    Aucun record enregistré.
                  </p>
                ) : (
                  data!.records.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between gap-1.5"
                    >
                      <span className="text-emerald-100/85 truncate">{r.label}</span>
                      <span className="font-extrabold text-white shrink-0">
                        {r.value}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenRecords}
              className="mt-3 w-full py-2 rounded-full bg-[#39ff49] text-[#051008] text-xs font-extrabold"
            >
              Voir tous mes records &gt;
            </button>
          </div>
        </div>

        <div className="mx-4 mt-4 relative overflow-hidden rounded-2xl border border-emerald-500/35 bg-[#0a160f]/90 p-4 flex items-center justify-between gap-3">
          <img
            src={effortSrc}
            alt="Effort et progression FIT PRO"
            onError={() => {
              if (effortSrc !== PHOTO_SOURCES.effortCommercial) {
                setEffortSrc(PHOTO_SOURCES.effortCommercial);
              }
            }}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06110a]/90 via-[#091b10]/70 to-[#06110a]/85" />

          <div className="relative z-10 flex items-center gap-3">
            <span className="inline-block h-6 w-6 rounded-md bg-[#39ff49] shrink-0" />
            <div>
              <div className="text-sm font-extrabold text-white">
                Chaque effort compte !
              </div>
              <div className="text-xs text-emerald-100/85 mt
