"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Progres() {
  const [weight, setWeight] = useState("");
  const [history, setHistory] = useState<{ date: string; weight: number }[]>([]);
  const [workoutsDone, setWorkoutsDone] = useState(0);
  const [streak, setStreak] = useState(7);

  useEffect(() => {
    const h = localStorage.getItem("weight_history");
    if (h) setHistory(JSON.parse(h));
    const d = localStorage.getItem("done_workouts");
    if (d) setWorkoutsDone(JSON.parse(d).length);
  }, []);

  const addWeight = () => {
    if (!weight) return;
    const newEntry = { date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" }), weight: parseFloat(weight) };
    const newHistory = [...history, newEntry].slice(-7);
    setHistory(newHistory);
    localStorage.setItem("weight_history", JSON.stringify(newHistory));
    setWeight("");
  };

  const totalKcal = workoutsDone * 320;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <Link href="/" className="text-gray-400 text-sm">← Retour</Link>
        <h1 className="text-3xl md:text-5xl font-black mt-4">MES PROGRÈS</h1>
        <p className="text-gray-400 mt-2">Tes efforts, en chiffres. Ne lâche rien.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="bg-[#1A1A1A] rounded-3xl p-5 border border-white/10 text-center">
            <p className="text-3xl">🔥</p><p className="text-2xl font-black mt-1">{streak} jours</p><p className="text-gray-400 text-xs">Série actuelle</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-3xl p-5 border border-white/10 text-center">
            <p className="text-3xl">💪</p><p className="text-2xl font-black mt-1">{workoutsDone}</p><p className="text-gray-400 text-xs">Séances faites</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-3xl p-5 border border-white/10 text-center">
            <p className="text-3xl">⚡</p><p className="text-2xl font-black mt-1">{totalKcal}</p><p className="text-gray-400 text-xs">Kcal brûlées</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-3xl p-5 border border-white/10 text-center">
            <p className="text-3xl">🏆</p><p className="text-2xl font-black mt-1">Niv. {Math.min(10, 1 + workoutsDone)}</p><p className="text-gray-400 text-xs">Ton niveau</p>
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-3xl p-5 border border-white/10 mt-4">
          <h2 className="font-black text-lg">⚖️ Suivi de poids</h2>
          <div className="flex gap-2 mt-4">
            <input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" placeholder="Ex: 72.5" className="flex-1 bg-white/10 rounded-full px-4 py-3 outline-none text-white placeholder:text-gray-500" />
            <button onClick={addWeight} className="bg-lime-400 text-black px-6 rounded-full font-black text-sm">+ AJOUTER</button>
          </div>
          {history.length > 0 ? (
            <div className="mt-5 space-y-2">
              {[...history].reverse().map((h, i) => (
                <div key={i} className="flex justify-between bg-white/5 px-4 py-3 rounded-2xl">
                  <span className="text-gray-300 text-sm">{h.date}</span>
                  <span className="font-black">{h.weight} kg</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mt-4">Pas encore de pesée. Ajoute ton premier poids 👆</p>
          )}
        </div>

        <div className="bg-gradient-to-r from-lime-400 to-emerald-400 text-black rounded-3xl p-6 mt-4">
          <h2 className="font-black text-xl">🎯 Objectif de la semaine</h2>
          <p className="text-sm mt-1 font-medium">Faire 4 séances cette semaine. Tu en as fait {workoutsDone}.</p>
          <div className="h-3 bg-black/20 rounded-full mt-3 overflow-hidden"><div className="h-full bg-black" style={{ width: `${Math.min(100, (workoutsDone / 4) * 100)}%` }} /></div>
          <p className="text-xs font-bold mt-2">{Math.min(100, Math.round((workoutsDone / 4) * 100))}% complété</p>
        </div>
      </div>
    </div>
  );
      }
