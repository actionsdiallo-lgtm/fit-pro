"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Profil() {
  const [name, setName] = useState("Champion");
  const [goal, setGoal] = useState("Prise de masse");
  const [level, setLevel] = useState("Intermédiaire");
  const [editing, setEditing] = useState(false);
  const [workoutsDone, setWorkoutsDone] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("fitpro_profile");
    if (saved) {
      const p = JSON.parse(saved);
      setName(p.name); setGoal(p.goal); setLevel(p.level);
    }
    const d = localStorage.getItem("done_workouts");
    if (d) setWorkoutsDone(JSON.parse(d).length);
  }, []);

  const save = () => {
    localStorage.setItem("fitpro_profile", JSON.stringify({ name, goal, level }));
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <Link href="/" className="text-gray-400 text-sm">← Retour</Link>

        <div className="bg-gradient-to-br from-lime-400 to-emerald-500 text-black rounded-3xl p-6 mt-4 text-center">
          <div className="w-20 h-20 bg-black text-lime-400 rounded-full mx-auto flex items-center justify-center text-3xl font-black">
            {name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-black mt-3">{name}</h1>
          <p className="text-sm font-medium opacity-80">{goal} • {level}</p>
          <div className="flex justify-center gap-6 mt-4">
            <div><p className="font-black text-xl">{workoutsDone}</p><p className="text-xs">Séances</p></div>
            <div><p className="font-black text-xl">{workoutsDone * 320}</p><p className="text-xs">Kcal</p></div>
            <div><p className="font-black text-xl">Niv. {1 + workoutsDone}</p><p className="text-xs">Niveau</p></div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-3xl p-5 border border-white/10 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="font-black text-lg">⚙️ Mon Profil</h2>
            {!editing && <button onClick={() => setEditing(true)} className="bg-white/10 px-4 py-2 rounded-full text-sm font-bold">Modifier</button>}
          </div>

          {editing ? (
            <div className="space-y-3 mt-4">
              <div><label className="text-xs text-gray-400">Ton prénom</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/10 rounded-full px-4 py-3 mt-1 outline-none" /></div>
              <div><label className="text-xs text-gray-400">Ton objectif</label><select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full bg-[#2A2A2A] rounded-full px-4 py-3 mt-1 outline-none"><option>Prise de masse</option><option>Perte de poids</option><option>Maintien / Santé</option></select></div>
              <div><label className="text-xs text-gray-400">Ton niveau</label><select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full bg-[#2A2A2A] rounded-full px-4 py-3 mt-1 outline-none"><option>Débutant</option><option>Intermédiaire</option><option>Avancé</option></select></div>
              <button onClick={save} className="w-full bg-lime-400 text-black py-3 rounded-full font-black text-sm">✅ ENREGISTRER</button>
            </div>
          ) : (
            <div className="space-y-2 mt-4 text-sm">
              <div className="flex justify-between bg-white/5 px-4 py-3 rounded-2xl"><span className="text-gray-400">Prénom</span><b>{name}</b></div>
              <div className="flex justify-between bg-white/5 px-4 py-3 rounded-2xl"><span className="text-gray-400">Objectif</span><b>{goal}</b></div>
              <div className="flex justify-between bg-white/5 px-4 py-3 rounded-2xl"><span className="text-gray-400">Niveau</span><b>{level}</b></div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <Link href="/entrainement" className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-5 text-center"><p className="text-2xl">💪</p><p className="font-bold text-sm mt-1">Entraînement</p></Link>
          <Link href="/nutrition" className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-5 text-center"><p className="text-2xl">🥗</p><p className="font-bold text-sm mt-1">Nutrition</p></Link>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">FitPro v1.0 • Fait pour progresser 💪</p>
      </div>
    </div>
  );
                                                                                }
