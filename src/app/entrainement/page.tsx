"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const WORKOUTS = [
  { id: 1, title: "Full Body Débutant", cat: "Musculation", level: "Débutant", time: "30 min", kcal: "280 kcal", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80", desc: "Tout le corps, sans matériel. Parfait pour commencer." },
  { id: 2, title: "HIIT Brûle-Graisse", cat: "Cardio", level: "Intermédiaire", time: "25 min", kcal: "350 kcal", img: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80", desc: "Intervalles intenses pour brûler un maximum." },
  { id: 3, title: "Push - Pecs / Épaules", cat: "Musculation", level: "Avancé", time: "45 min", kcal: "420 kcal", img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80", desc: "Poussée, développé, dips. Pour prendre du volume." },
  { id: 4, title: "Yoga Flow Matin", cat: "Yoga", level: "Débutant", time: "20 min", kcal: "120 kcal", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80", desc: "Réveil en douceur, mobilité et respiration." },
  { id: 5, title: "Leg Day Puissance", cat: "Musculation", level: "Avancé", time: "50 min", kcal: "500 kcal", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80", desc: "Squats, fentes, mollets. Jambes en feu." },
  { id: 6, title: "Cardio Danse Fun", cat: "Cardio", level: "Débutant", time: "30 min", kcal: "300 kcal", img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80", desc: "Cardio en musique, sans s'ennuyer." },
];

export default function Entrainement() {
  const [filter, setFilter] = useState("Tous");
  const [done, setDone] = useState<number[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const saved = localStorage.getItem("done_workouts");
    if (saved) setDone(JSON.parse(saved));
  }, []);

  const toggleDone = async (id: number, title: string) => {
    const isDone = done.includes(id);
    const newDone = isDone ? done.filter(d => d !== id) : [...done, id];
    setDone(newDone);
    localStorage.setItem("done_workouts", JSON.stringify(newDone));

    if (!isDone && user) {
      await supabase.from("workouts").insert({ user_id: user.id, title, duration: 30 });
    }
  };

  const filtered = filter === "Tous" ? WORKOUTS : WORKOUTS.filter(w => w.cat === filter);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <Link href="/" className="text-gray-400 text-sm">← Retour</Link>
        <h1 className="text-3xl md:text-5xl font-black mt-4">ENTRAÎNEMENT</h1>
        <p className="text-gray-400 mt-2">{done.length} séance(s) terminée(s) • Continue comme ça 💪</p>

        <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
          {["Tous", "Musculation", "Cardio", "Yoga"].map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap ${filter === c ? "bg-lime-400 text-black" : "bg-white/10 text-white"}`}>{c}</button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {filtered.map(w => {
            const isDone = done.includes(w.id);
            return (
              <div key={w.id} className="bg-[#1A1A1A] rounded-3xl overflow-hidden border border-white/10">
                <div className="relative h-48">
                  <img src={w.img} className="w-full h-full object-cover" alt={w.title} />
                  <span className="absolute top-3 left-3 bg-black/70 px-3 py-1 rounded-full text-xs font-bold">{w.cat}</span>
                  {isDone && <span className="absolute top-3 right-3 bg-lime-400 text-black px-3 py-1 rounded-full text-xs font-black">✓ FAIT</span>}
                </div>
                <div className="p-5">
                  <h3 className="font-black text-lg">{w.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{w.desc}</p>
                  <div className="flex gap-2 mt-3 text-xs text-gray-300">
                    <span className="bg-white/10 px-2 py-1 rounded-full">{w.level}</span>
                    <span className="bg-white/10 px-2 py-1 rounded-full">{w.time}</span>
                    <span className="bg-white/10 px-2 py-1 rounded-full">{w.kcal}</span>
                  </div>
                  <button onClick={() => toggleDone(w.id, w.title)} className={`w-full mt-4 py-3 rounded-full font-black text-sm ${isDone ? "bg-white/10 text-gray-300" : "bg-lime-400 text-black"}`}>
                    {isDone ? "Annuler" : "▶ COMMENCER"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
                            }
