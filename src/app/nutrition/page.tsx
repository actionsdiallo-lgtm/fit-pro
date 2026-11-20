"use client";
import { useState } from "react";
import Link from "next/link";

const MEALS = [
  { id: 1, name: "Poulet + Riz + Légumes", cat: "Prise de masse", kcal: 650, protein: "45g", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80" },
  { id: 2, name: "Salade Avocat Poulet", cat: "Perte de poids", kcal: 380, protein: "32g", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80" },
  { id: 3, name: "Smoothie Protéiné Banane", cat: "Petit-déj", kcal: 320, protein: "28g", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80" },
  { id: 4, name: "Saumon + Patate Douce", cat: "Prise de masse", kcal: 580, protein: "40g", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80" },
  { id: 5, name: "Bowl Quinoa Légumes", cat: "Perte de poids", kcal: 420, protein: "18g", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80" },
  { id: 6, name: "Omelette + Pain Complet", cat: "Petit-déj", kcal: 450, protein: "30g", img: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80" },
];

export default function Nutrition() {
  const [filter, setFilter] = useState("Tous");
  const [water, setWater] = useState(3);
  const [calories, setCalories] = useState(0);

  const filtered = filter === "Tous" ? MEALS : MEALS.filter(m => m.cat === filter);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <Link href="/" className="text-gray-400 text-sm">← Retour</Link>
        <h1 className="text-3xl md:text-5xl font-black mt-4">NUTRITION</h1>
        <p className="text-gray-400 mt-2">Mange bien, progresse 2x plus vite.</p>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-[#1A1A1A] rounded-3xl p-5 border border-white/10">
            <p className="text-gray-400 text-sm">Eau aujourd'hui</p>
            <p className="text-3xl font-black mt-1">{water} / 8 verres 💧</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setWater(Math.max(0, water - 1))} className="flex-1 bg-white/10 py-2 rounded-full font-bold">-</button>
              <button onClick={() => setWater(Math.min(8, water + 1))} className="flex-1 bg-cyan-400 text-black py-2 rounded-full font-black">+ 1 verre</button>
            </div>
            <div className="flex gap-1 mt-4">{[...Array(8)].map((_, i) => (<div key={i} className={`h-2 flex-1 rounded-full ${i < water ? "bg-cyan-400" : "bg-white/10"}`} />))}</div>
          </div>
          <div className="bg-[#1A1A1A] rounded-3xl p-5 border border-white/10">
            <p className="text-gray-400 text-sm">Calories ajoutées</p>
            <p className="text-3xl font-black mt-1">{calories} kcal 🔥</p>
            <p className="text-xs text-gray-400 mt-1">Objectif : 2200 kcal / jour</p>
            <div className="h-2 bg-white/10 rounded-full mt-4 overflow-hidden"><div className="h-full bg-lime-400" style={{ width: `${Math.min(100, (calories / 2200) * 100)}%` }} /></div>
            <button onClick={() => setCalories(0)} className="mt-4 text-xs bg-white/10 px-4 py-2 rounded-full">Réinitialiser</button>
          </div>
        </div>

        <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
          {["Tous", "Prise de masse", "Perte de poids", "Petit-déj"].map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap ${filter === c ? "bg-lime-400 text-black" : "bg-white/10"}`}>{c}</button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {filtered.map(m => (
            <div key={m.id} className="bg-[#1A1A1A] rounded-3xl overflow-hidden border border-white/10">
              <img src={m.img} className="w-full h-44 object-cover" alt={m.name} />
              <div className="p-5">
                <span className="text-xs bg-lime-400/20 text-lime-300 px-2 py-1 rounded-full font-bold">{m.cat}</span>
                <h3 className="font-black text-lg mt-2">{m.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{m.kcal} kcal • Protéines {m.protein}</p>
                <button onClick={() => setCalories(calories + m.kcal)} className="w-full mt-4 bg-lime-400 text-black py-3 rounded-full font-black text-sm">+ AJOUTER AU JOURNAL</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
                  }
