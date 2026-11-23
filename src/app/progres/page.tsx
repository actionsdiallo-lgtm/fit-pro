"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { SeanceEnregistree } from "@/lib/entrainement-data";

function formatDuree(totalSec: number): string {
  const safe = Math.max(0, Math.floor(totalSec));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hours}h ${String(remMins).padStart(2, "0")}m`;
  }
  return `${mins}m ${String(secs).padStart(2, "0")}s`;
}

export default function ProgresPage() {
  const { data: session, status } = useSession();
  const [sessions, setSessions] = useState<SeanceEnregistree[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");

  const chargerSeances = useCallback(async () => {
    setLoading(true);
    setErreur("");
    try {
      const res = await fetch("/api/entrainement/seances", { cache: "no-store" });
      if (!res.ok) {
        setSessions([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data.sessions)) {
        setSessions(data.sessions);
      } else {
        setSessions([]);
      }
    } catch {
      setErreur("Impossible de charger l'historique pour le moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void chargerSeances();
  }, [chargerSeances, status]);

  const stats = useMemo(() => {
    const totalSeances = sessions.length;
    const totalSecondes = sessions.reduce(
      (acc, s) => acc + (Number(s.dureeSecondes) || 0),
      0
    );
    const totalCalories = sessions.reduce(
      (acc, s) => acc + (Number(s.caloriesEstimees) || 0),
      0
    );
    const totalFaits = sessions.reduce(
      (acc, s) => acc + (Number(s.exercicesFaits) || 0),
      0
    );
    const totalPrevus = sessions.reduce(
      (acc, s) => acc + (Number(s.totalExercices) || 0),
      0
    );
    const completionPct =
      totalPrevus > 0 ? Math.min(100, Math.round((totalFaits / totalPrevus) * 100)) : 0;

    return {
      totalSeances,
      totalSecondes,
      totalCalories,
      completionPct,
    };
  }, [sessions]);

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      <div className="mx-auto max-w-2xl px-4 pt-4 space-y-5">
        <header className="flex items-center justify-between border-b border-green-500/25 pb-3">
          <div>
            <p className="text-xs font-black text-green-400">FIT PRO · PROGRÈS</p>
            <p className="text-[11px] text-slate-400">
              {status === "authenticated"
                ? session?.user?.name || session?.user?.email
                : "Mode invité · Connectez-vous pour synchroniser vos séances"}
            </p>
          </div>
          <Link
            href="/entrainement"
            className="rounded-xl bg-green-500 px-3.5 py-2 text-xs font-black text-black"
          >
            ← Entraînement
          </Link>
        </header>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-green-500/25 bg-[#0b130e] p-3.5 text-center">
            <p className="text-xl font-black text-white">{stats.totalSeances}</p>
            <p className="text-[11px] text-slate-400">Séances</p>
          </div>
          <div className="rounded-2xl border border-green-500/25 bg-[#0b130e] p-3.5 text-center">
            <p className="text-xl font-black text-green-400">
              {formatDuree(stats.totalSecondes)}
            </p>
            <p className="text-[11px] text-slate-400">Temps total</p>
          </div>
          <div className="rounded-2xl border border-green-500/25 bg-[#0b130e] p-3.5 text-center">
            <p className="text-xl font-black text-amber-300">{stats.totalCalories}</p>
            <p className="text-[11px] text-slate-400">Calories (kcal)</p>
          </div>
          <div className="rounded-2xl border border-green-500/25 bg-[#0b130e] p-3.5 text-center">
            <p className="text-xl font-black text-emerald-300">{stats.completionPct}%</p>
            <p className="text-[11px] text-slate-400">Complétion</p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#0e1511] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-black uppercase tracking-wider text-green-400">
              Historique des séances
            </h1>
            <button
              type="button"
              onClick={() => void chargerSeances()}
              className="rounded-lg border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-bold text-slate-200"
            >
              Actualiser
            </button>
          </div>

          {loading ? (
            <p className="py-6 text-center text-xs text-slate-400">
              Chargement de vos progrès...
            </p>
          ) : erreur ? (
            <p className="py-6 text-center text-xs font-semibold text-amber-400">
              {erreur}
            </p>
          ) : sessions.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center space-y-3">
              <p className="text-sm font-bold text-slate-200">
                Aucune séance enregistrée pour le moment.
              </p>
              <p className="text-xs text-slate-400">
                Lancez une séance depuis l&apos;onglet Entraînement et cliquez sur Enregistrer pour voir apparaître vos statistiques ici.
              </p>
              <Link
                href="/entrainement"
                className="inline-block rounded-xl bg-green-500 px-4 py-2 text-xs font-black text-black"
              >
                Démarrer une séance
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/50 p-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-white">{s.programmeTitre}</p>
                    <p className="text-[11px] text-slate-400">
                      {s.categorie} · {s.niveau} · {formatDuree(s.dureeSecondes)}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {s.exercicesFaits}/{s.totalExercices} exercices
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-black text-green-400">
                      {s.caloriesEstimees} kcal
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
  
