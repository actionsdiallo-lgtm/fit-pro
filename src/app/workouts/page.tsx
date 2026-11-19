"use client";
import Link from "next/link";
import { useState } from "react";

export default function WorkoutsPage() {
  const [filter, setFilter] = useState("Tout");
  const workouts = [
    { title: "Full Body - Débutant", duration: "30 min", level: "Débutant", emoji: "💪", cal: "320 kcal" },
    { title: "Musculation - Haut du corps", duration: "45 min", level: "Intermédiaire", emoji: "🏋️", cal: "380 kcal" },
    { title: "Cardio Brûle Graisse", duration: "25 min", level: "Débutant", emoji: "🔥", cal: "450 kcal" },
    { title: "HIIT Intense", duration: "20 min", level: "Avancé", emoji: "⚡", cal: "500 kcal" },
  ];
  const filtered = filter === "Tout" ? workouts : workouts.filter(w => w.level === filter);
  return (
    <div style={{ padding: 16, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>← Retour Dashboard</Link>
      <h1 style={{ marginTop: 12 }}>Entraînements 🏋️</h1>
      <p style={{ color: "#AAA" }}>Choisis ton entraînement du jour</p>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {["Tout", "Débutant", "Intermédiaire", "Avancé"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 20, border: "none", backgroundColor: filter === f ? "#00FF88" : "#222", color: filter === f ? "black" : "white", fontWeight: "bold" }}>{f}</button>
        ))}
      </div>
      {filtered.map((w, i) => (
        <div key={i} style={{ marginTop: 16, padding: 16, backgroundColor: "#1A1A1A", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0 }}>{w.emoji} {w.title}</h3>
            <p style={{ color: "#A7F3D0", margin: "5px 0" }}>{w.duration} • {w.level} • {w.cal}</p>
          </div>
          <Link href="/workouts/new" style={{ backgroundColor: "#00FF88", color: "black", padding: "10px 16px", borderRadius: 20, fontWeight: "bold", textDecoration: "none" }}>GO →</Link>
        </div>
      ))}
      <Link href="/workouts/new" style={{ display: "block", textAlign: "center", marginTop: 20, backgroundColor: "#00FF88", color: "black", padding: 14, borderRadius: 14, fontWeight: "bold", textDecoration: "none" }}>+ Créer un entraînement</Link>
    </div>
  );
      }
