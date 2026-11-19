"use client";
import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
  const [period, setPeriod] = useState("Semaine");
  const stats = [
    { icon: "🔥", label: "Calories", value: period === "Semaine" ? "2 450" : "10 200" },
    { icon: "🏋️", label: "Entraînements", value: period === "Semaine" ? "5" : "18" },
    { icon: "⚖️", label: "Poids", value: "75 kg" },
    { icon: "⏱️", label: "Temps", value: period === "Semaine" ? "4h 20" : "18h 10" },
  ];
  return (
    <div style={{ padding: 16, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ margin: 0 }}>Salut Diallo 👋</h1><p style={{ color: "#A7F3D0" }}>Prêt à t'entraîner aujourd'hui ?</p></div>
        <Link href="/profile" style={{ fontSize: 32, textDecoration: "none" }}>👤</Link>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {["Semaine", "Mois"].map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{ padding: "8px 16px", borderRadius: 20, border: "none", backgroundColor: period === p ? "#00FF88" : "#222", color: period === p ? "black" : "white", fontWeight: "bold" }}>{p}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16 }}>
            <div style={{ fontSize: 26 }}>{s.icon}</div>
            <h2 style={{ margin: "6px 0 0", color: "#00FF88" }}>{s.value}</h2>
            <p style={{ margin: 0, color: "#AAA" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: "#00FF88", padding: 16, borderRadius: 16, marginTop: 14, color: "black" }}>
        <h3 style={{ margin: 0 }}>🎯 Objectif du jour</h3>
        <p style={{ margin: "5px 0" }}>Séance Full Body - 45 min</p>
        <Link href="/workouts" style={{ backgroundColor: "black", color: "white", padding: "10px 16px", borderRadius: 20, fontWeight: "bold", textDecoration: "none", display: "inline-block" }}>Commencer →</Link>
      </div>

      <h3 style={{ marginTop: 18 }}>Accès rapide</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Link href="/workouts" style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16, color: "white", textDecoration: "none", textAlign: "center" }}>🏋️<br /><b>Entraînements</b></Link>
        <Link href="/nutrition" style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16, color: "white", textDecoration: "none", textAlign: "center" }}>🥗<br /><b>Nutrition</b></Link>
        <Link href="/programs" style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16, color: "white", textDecoration: "none", textAlign: "center" }}>📋<br /><b>Programmes</b></Link>
        <Link href="/actualites" style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16, color: "white", textDecoration: "none", textAlign: "center" }}>📰<br /><b>Actualités</b></Link>
      </div>
    </div>
  );
                                       }
