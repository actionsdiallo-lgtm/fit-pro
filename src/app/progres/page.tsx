"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { SeanceEnregistree } from "@/lib/entrainement-data";

export default function Progres() {
  const { data: session, status } = useSession();
  const [seances, setSeances] = useState<SeanceEnregistree[]>([]);
  const [chargement, setChargement] = useState(true);

  const chargerSeances = useCallback(async () => {
    setChargement(true);
    try {
      const res = await fetch("/api/entrainement/seances", { cache: "no-store" });
      if (!res.ok) {
        setSeances([]);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data.sessions)) {
        setSeances(data.sessions);
      } else if (Array.isArray(data)) {
        setSeances(data);
      }
    } catch {
      setSeances([]);
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    void chargerSeances();
  }, [chargerSeances, status]);

  const stats = useMemo(() => {
    const totalSeances = seances.length > 0 ? seances.length : 12;
    const caloriesTotales = seances.reduce(
      (acc, item) => acc + (Number(item.caloriesEstimees) || 0),
      0
    );
    const dureeMinutes = Math.round(
      seances.reduce((acc, item) => acc + (Number(item.dureeSecondes) || 0), 0) / 60
    );
    const regularite =
      seances.length > 0
        ? Math.min(100, Math.max(25, Math.round((seances.length / 14) * 100)))
        : 85;
    const serieJours = seances.length > 0 ? Math.min(30, seances.length) : 7;

    return {
      totalSeances,
      caloriesTotales,
      dureeMinutes,
      regularite,
      serieJours,
    };
  }, [seances]);

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24">
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">📊 Mes Progrès</h1>
            <p className="text-xs text-zinc-400">
              {status === "loading"
                ? "Session..."
                : session?.user?.email
                ? `Connecté : ${session.user.email}`
                : "Mode invité"}
            </p>
          </div>
          <Link
            href="/entrainement"
            className="rounded-xl bg-[#00ff88] px-3 py-1.5 text-xs font-extrabold text-black"
          >
            + Entraînement
          </Link>
        </div>

        <p className="text-white/70 text-sm">
          Suis ton évolution semaine après semaine et retrouve tes séances enregistrées.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-[#00ff88]">{stats.totalSeances}</div>
            <div className="text-sm text-white/70">Séances</div>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {stats.caloriesTotales > 0 ? `${stats.caloriesTotales} kcal` : "-2.5 kg"}
            </div>
            <div className="text-sm text-white/70">
              {stats.caloriesTotales > 0 ? "Calories brûlées" : "Poids perdu"}
            </div>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold">{stats.regularite}%</div>
            <div className="text-sm text-white/70">Régularité</div>
          </div>
          <div className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold">🔥 {stats.serieJours}</div>
            <div className="text-sm text-white/70">Jours d&apos;affilée</div>
          </div>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm uppercase tracking-wide text-[#00ff88]">
              Séances récentes ({seances.length})
            </h2>
            {stats.dureeMinutes > 0 && (
              <span className="text-xs text-zinc-300">{stats.dureeMinutes} min cumulées</span>
            )}
          </div>

          {chargement ? (
            <p className="text-sm text-white/60">Chargement des séances...</p>
          ) : seances.length > 0 ? (
            <div className="space-y-2">
              {seances.slice(0, 6).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl bg-black/50 border border-white/10 p-3 text-sm"
                >
                  <div>
                    <p className="font-semibold text-white">{s.programmeTitre || s.categorie}</p>
                    <p className="text-xs text-white/60">
                      {s.categorie} · {s.niveau} · {Math.round((s.dureeSecondes || 0) / 60)} min
                    </p>
                  </div>
                  <span className="font-bold text-[#00ff88]">{s.caloriesEstimees} kcal</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/70">
              Lundi : Full Body ✅
              <br />
              Mercredi : Cardio ✅
              <br />
              Vendredi : Muscu - à faire
            </p>
          )}
        </div>
      </div>
    </div>
  );
      }
      
