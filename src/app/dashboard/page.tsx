"use client";
import Link from "next/link";
import { useState } from "react";

const green = "#00FF88";

export default function Dashboard() {
  const [period, setPeriod] = useState("Semaine");

  const stats = [
    { icon: "🔥", label: "Calories", value: "2,450", sub: "Aujourd'hui" },
    { icon: "🏋️", label: "Entraînements", value: "12", sub: "Ce mois" },
    { icon: "⚖️", label: "Poids", value: "75 kg", sub: "-2 kg" },
    { icon: "⏱️", label: "Temps", value: "8.5h", sub: "Cette semaine" },
  ];

  const workouts = [
    { title: "Full Body - Débutant", time: "45 min", level: "Débutant", cal: "320 kcal" },
    { title: "HIIT Brûle Graisse", time: "30 min", level: "Intermédiaire", cal: "450 kcal" },
    { title: "Musculation Haut du corps", time: "50 min", level: "Avancé", cal: "380 kcal" },
  ];

  return (
    <div style={{ padding: 16, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <h1 style={{ fontSize: 28 }}>Bonjour Diallo 👋</h1>
      <p style={{ color: "#AAA" }}>Prêt pour ton entraînement d'aujourd'hui ?</p>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        {["Jour", "Semaine", "Mois"].map((p) => (
          <button key={p} onClick={() => setPeriod(p)} style={{ padding: "8px 16px", borderRadius: 20, border: "none", backgroundColor: period === p ? green : "#222", color: period === p ? "black" : "white", fontWeight: "bold" }}>{p}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16 }}>
            <div style={{ fontSize: 24 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: "bold", marginTop: 8 }}>{s.value}</div>
            <div style={{ color: "#AAA", fontSize: 13 }}>{s.label} • {s.sub}</div>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 24 }}>Entraînements du jour</h2>
      {workouts.map((w) => (
        <div key={w.title} style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16, marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: "bold" }}>{w.title}</div>
            <div style={{ color: "#AAA", fontSize: 13 }}>{w.time} • {w.level} • {w.cal}</div>
          </div>
          <Link href="/workouts" style={{ backgroundColor: green, color: "black", padding: "10px 16px", borderRadius: 20, textDecoration: "none", fontWeight: "bold" }}>GO →</Link>
        </div>
      ))}

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <Link href="/workouts" style={{ flex: 1, textAlign: "center", backgroundColor: green, color: "black", padding: 14, borderRadius: 14, textDecoration: "none", fontWeight: "bold" }}>Voir Entraînements</Link>
        <Link href="/nutrition" style={{ flex: 1, textAlign: "center", backgroundColor: "#222", color: "white", padding: 14, borderRadius: 14, textDecoration: "none", fontWeight: "bold" }}>Nutrition</Link>
      </div>
    </div>
  );
}
