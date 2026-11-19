"use client";
import Link from "next/link";
import { useState } from "react";

export default function WorkoutsPage() {
  const [filter, setFilter] = useState("Tout");
  const [done, setDone] = useState<number[]>([]);
  const workouts = [
    { title: "Full Body - Débutant", duration: "45 min", level: "Débutant", cal: "350 kcal", emoji: "🏋️" },
    { title: "Musculation - Haut du corps", duration: "60 min", level: "Intermédiaire", cal: "450 kcal", emoji: "💪" },
    { title: "Cardio Brûle Graisse", duration: "30 min", level: "Débutant", cal: "400 kcal", emoji: "🔥" },
    { title: "HIIT Intense", duration: "25 min", level: "Avancé", cal: "500 kcal", emoji: "⚡" },
  ];
  const filtered = filter === "Tout" ? workouts : workouts.filter(w => w.level === filter);
  return (
    <div style={{ padding: 16, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>← Retour Dashboard</Link>
      <h1 style={{ marginTop: 12 }}>Entraînements 🏋️</h1>
      <p style={{ color: "#AAA" }}>Séances terminées : {done.length} / {workouts.length}</p>

      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {["Tout", "Débutant", "Intermédiaire", "Avancé"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 20, border: "none", backgroundColor: filter === f ? "#00FF88" : "#222", color: filter === f ? "black" : "white", fontWeight: "bold" }}>{f}</button>
        ))}
      </div>

      {filtered.map((w, i) => {
        const isDone = done.includes(i);
        return (
          <div key={i} style={{ marginTop: 14, padding: 16, backgroundColor: isDone ? "#0F3D24" : "#1A1A1A", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: isDone ? 0.7 : 1 }}>
            <div>
              <h3 style={{ margin: 0 }}>{w.emoji} {w.title} {isDone ? "✅" : ""}</h3>
              <p style={{ color: "#A7F3D0", margin: "5px 0" }}>{w.duration} • {w.level} • {w.cal}</p>
            </div>
            <button onClick={() => setDone(isDone ? done.filter(d => d !== i) : [...done, i])} style={{ backgroundColor: isDone ? "#888" : "#00FF88", color: isDone ? "white" : "black", padding: "10px 14px", borderRadius: 20, fontWeight: "bold", border: "none" }}>{isDone ? "Annuler" : "Terminé"}</button>
          </div>
        );
      })}
    </div>
  );
            }
