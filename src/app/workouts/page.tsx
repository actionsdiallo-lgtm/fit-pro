"use client";
import Link from "next/link";
import { useState } from "react";

export default function WorkoutsPage() {
  const [done, setDone] = useState<number[]>([]);
  const workouts = [
    { title: "Full Body Débutant", time: "30 min", level: "Débutant", emoji: "💪", exos: "Pompes • Squats • Gainage" },
    { title: "HIIT Brûle-Graisse", time: "20 min", level: "Intermédiaire", emoji: "🔥", exos: "Burpees • Mountain Climbers • Jump Squats" },
    { title: "Muscu Pectoraux", time: "45 min", level: "Avancé", emoji: "🏋️", exos: "Développé couché • Dips • Écartés" },
    { title: "Jambes Puissantes", time: "40 min", level: "Intermédiaire", emoji: "🦵", exos: "Squats • Fentes • Mollets" },
  ];
  return (
    <div style={{ padding: 16, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>← Retour Dashboard</Link>
      <h1 style={{ marginTop: 12 }}>Entraînements 🏋️</h1>
      <p style={{ color: "#AAA" }}>{done.length} / {workouts.length} séances terminées aujourd'hui</p>

      <div style={{ backgroundColor: "#333", height: 12, borderRadius: 10, overflow: "hidden", marginTop: 8 }}>
        <div style={{ backgroundColor: "#00FF88", height: "100%", width: `${(done.length / workouts.length) * 100}%` }} />
      </div>

      {workouts.map((w, i) => (
        <div key={i} style={{ marginTop: 14, padding: 16, backgroundColor: "#1A1A1A", borderRadius: 16, opacity: done.includes(i) ? 0.6 : 1 }}>
          <h3 style={{ margin: 0 }}>{w.emoji} {w.title}</h3>
          <p style={{ color: "#AAA", margin: "5px 0" }}>{w.exos}</p>
          <p style={{ color: "#00FF88", margin: "5px 0" }}>⏱ {w.time} • {w.level}</p>
          <button onClick={() => setDone(done.includes(i) ? done.filter(d => d !== i) : [...done, i])} style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", backgroundColor: done.includes(i) ? "#00FF88" : "white", color: "black", fontWeight: "bold", marginTop: 8 }}>
            {done.includes(i) ? "✅ Terminé !" : "▶ Commencer"}
          </button>
        </div>
      ))}
    </div>
  );
                                         }
