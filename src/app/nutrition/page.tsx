"use client";
import Link from "next/link";
import { useState } from "react";

export default function NutritionPage() {
  const [filter, setFilter] = useState("Tout");
  const meals = [
    { title: "Petit-déj Protéiné", desc: "Omelette + avoine + banane", cal: "450 kcal", emoji: "🍳", type: "Petit-déj" },
    { title: "Déjeuner Fit", desc: "Poulet grillé + riz + légumes", cal: "650 kcal", emoji: "🍗", type: "Déjeuner" },
    { title: "Dîner Léger", desc: "Saumon + salade", cal: "400 kcal", emoji: "🐟", type: "Dîner" },
    { title: "Snack Santé", desc: "Smoothie protéiné", cal: "250 kcal", emoji: "🥤", type: "Snack" },
  ];
  const filtered = filter === "Tout" ? meals : meals.filter(m => m.type === filter);
  return (
    <div style={{ padding: 16, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>← Retour Dashboard</Link>
      <h1 style={{ marginTop: 12 }}>Nutrition 🥗</h1>
      <p style={{ color: "#AAA" }}>Tes repas pour progresser</p>

      <div style={{ backgroundColor: "#00FF88", color: "black", padding: 16, borderRadius: 16, marginTop: 12 }}>
        <h3 style={{ margin: 0 }}>Aujourd'hui : 1750 / 2200 kcal</h3>
        <div style={{ backgroundColor: "rgba(0,0,0,0.2)", height: 10, borderRadius: 10, marginTop: 10 }}>
          <div style={{ backgroundColor: "black", width: "80%", height: 10, borderRadius: 10 }}></div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        {["Tout", "Petit-déj", "Déjeuner", "Dîner", "Snack"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 20, border: "none", backgroundColor: filter === f ? "#00FF88" : "#222", color: filter === f ? "black" : "white", fontWeight: "bold" }}>{f}</button>
        ))}
      </div>

      {filtered.map((m, i) => (
        <div key={i} style={{ marginTop: 14, padding: 16, backgroundColor: "#1A1A1A", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0 }}>{m.emoji} {m.title}</h3>
            <p style={{ color: "#A7F3D0", margin: "5px 0" }}>{m.desc}</p>
            <b>{m.cal}</b>
          </div>
          <Link href="/nutrition/new" style={{ backgroundColor: "#00FF88", color: "black", padding: "10px 14px", borderRadius: 20, fontWeight: "bold", textDecoration: "none" }}>+ Ajouter</Link>
        </div>
      ))}

      <Link href="/nutrition/new" style={{ display: "block", textAlign: "center", marginTop: 20, backgroundColor: "#00FF88", color: "black", padding: 14, borderRadius: 14, fontWeight: "bold", textDecoration: "none" }}>+ Ajouter un repas</Link>
    </div>
  );
          }
