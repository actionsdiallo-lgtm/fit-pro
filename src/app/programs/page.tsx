"use client";
import Link from "next/link";
import { useState } from "react";

export default function ProgramsPage() {
  const [filter, setFilter] = useState("Tout");
  const programs = [
    { title: "Prise de Masse", desc: "8 semaines - Musculation", level: "Intermédiaire", emoji: "💪", weeks: "8 sem" },
    { title: "Perte de Poids", desc: "6 semaines - Cardio + HIIT", level: "Débutant", emoji: "🔥", weeks: "6 sem" },
    { title: "Force & Performance", desc: "12 semaines - Avancé", level: "Avancé", emoji: "🏋️", weeks: "12 sem" },
    { title: "Débutant Total", desc: "4 semaines - Découverte", level: "Débutant", emoji: "🌱", weeks: "4 sem" },
  ];
  const filtered = filter === "Tout" ? programs : programs.filter(p => p.level === filter);
  return (
    <div style={{ padding: 16, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>← Retour Dashboard</Link>
      <h1 style={{ marginTop: 12 }}>Programmes 📋</h1>
      <p style={{ color: "#AAA" }}>Choisis ton programme et progresse</p>

      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {["Tout", "Débutant", "Intermédiaire", "Avancé"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 20, border: "none", backgroundColor: filter === f ? "#00FF88" : "#222", color: filter === f ? "black" : "white", fontWeight: "bold" }}>{f}</button>
        ))}
      </div>

      {filtered.map((p, i) => (
        <div key={i} style={{ marginTop: 14, padding: 16, backgroundColor: "#1A1A1A", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0 }}>{p.emoji} {p.title}</h3>
            <p style={{ color: "#A7F3D0", margin: "5px 0" }}>{p.desc}</p>
            <b>{p.weeks} • {p.level}</b>
          </div>
          <Link href="/workouts" style={{ backgroundColor: "#00FF88", color: "black", padding: "10px 16px", borderRadius: 20, fontWeight: "bold", textDecoration: "none" }}>Voir →</Link>
        </div>
      ))}

      <Link href="/workouts" style={{ display: "block", textAlign: "center", marginTop: 20, backgroundColor: "#00FF88", color: "black", padding: 14, borderRadius: 14, fontWeight: "bold", textDecoration: "none" }}>Voir les entraînements</Link>
    </div>
  );
                       }
