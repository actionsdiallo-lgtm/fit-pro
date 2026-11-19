"use client";
import Link from "next/link";
import { useState } from "react";

export default function StatisticsPage() {
  const [week, setWeek] = useState("Cette semaine");
  const stats = week === "Cette semaine"
    ? [{ label: "Séances", value: 5, max: 7 }, { label: "Calories", value: 3200, max: 5000 }, { label: "Minutes", value: 240, max: 400 }]
    : [{ label: "Séances", value: 18, max: 30 }, { label: "Calories", value: 12500, max: 20000 }, { label: "Minutes", value: 980, max: 1600 }];

  return (
    <div style={{ padding: 16, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>← Retour Dashboard</Link>
      <h1 style={{ marginTop: 12 }}>Statistiques 📊</h1>
      <p style={{ color: "#AAA" }}>Tes progrès en un coup d'oeil</p>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {["Cette semaine", "Ce mois"].map(w => (
          <button key={w} onClick={() => setWeek(w)} style={{ padding: "8px 14px", borderRadius: 20, border: "none", backgroundColor: week === w ? "#00FF88" : "#222", color: week === w ? "black" : "white", fontWeight: "bold" }}>{w}</button>
        ))}
      </div>

      <div style={{ marginTop: 16, backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16 }}>
        <h3 style={{ marginTop: 0 }}>Poids : 75 kg → 78 kg 💪</h3>
        <p style={{ color: "#00FF88" }}>+3 kg de masse en 12 semaines</p>
        <div style={{ backgroundColor: "#333", height: 12, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ backgroundColor: "#00FF88", height: "100%", width: "70%" }} />
        </div>
        <p style={{ color: "#AAA", fontSize: 13 }}>Objectif : 80 kg - 70% atteint</p>
      </div>

      {stats.map((s, i) => (
        <div key={i} style={{ marginTop: 12, backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><b>{s.label}</b><b style={{ color: "#00FF88" }}>{s.value} / {s.max}</b></div>
          <div style={{ backgroundColor: "#333", height: 10, borderRadius: 10, overflow: "hidden", marginTop: 8 }}>
            <div style={{ backgroundColor: "#00FF88", height: "100%", width: `${Math.round((s.value / s.max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
