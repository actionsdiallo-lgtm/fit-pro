"use client";
import Link from "next/link";
import { useState } from "react";

export default function ProgramsPage() {
  const [filter, setFilter] = useState("Tout");
  const [active, setActive] = useState<number | null>(null);
  const programs = [
    { title: "Prise de Masse", desc: "8 semaines • 5x / semaine", level: "Avancé", emoji: "💪" },
    { title: "Perte de Poids", desc: "6 semaines • 4x / semaine", level: "Intermédiaire", emoji: "🔥" },
    { title: "Force & Performance", desc: "10 semaines • 4x / semaine", level: "Avancé", emoji: "🏋️" },
    { title: "Débutant Total", desc: "4 semaines • 3x / semaine", level: "Débutant", emoji: "🌱" },
  ];
  const filtered = filter === "Tout" ? programs : programs.filter(p => p.level === filter);
  return (
    <div style={{ padding: 16, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>← Retour Dashboard</Link>
      <h1 style={{ marginTop: 12 }}>Programmes 📋</h1>
      <p style={{ color: "#AAA" }}>Choisis ton programme et lance-toi</p>

      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {["Tout", "Débutant", "Intermédiaire", "Avancé"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 20, border: "none", backgroundColor: filter === f ? "#00FF88" : "#222", color: filter === f ? "black" : "white", fontWeight: "bold" }}>{f}</button>
        ))}
      </div>

      {filtered.map((p, i) => (
        <div key={i} style={{ marginTop: 14, padding: 16, backgroundColor: active === i ? "#0F3D24" : "#1A1A1A", borderRadius: 16 }}>
          <h3 style={{ margin: 0 }}>{p.emoji} {p.title} {active === i ? "✅" : ""}</h3>
          <p style={{ color: "#A7F3D0", margin: "5px 0" }}>{p.desc}</p>
          <p style={{ margin: "0 0 10px", color: "#AAA" }}>Niveau : {p.level}</p>
          <button onClick={() => setActive(active === i ? null : i)} style={{ backgroundColor: active === i ? "#888" : "#00FF88", color: active === i ? "white" : "black", padding: "10px 16px", borderRadius: 20, fontWeight: "bold", border: "none" }}>{active === i ? "Programme actif - Annuler" : "Choisir ce programme"}</button>
        </div>
      ))}
    </div>
  );
          }
