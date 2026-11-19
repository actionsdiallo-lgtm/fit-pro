"use client";
import Link from "next/link";
import { useState } from "react";

export default function NutritionPage() {
  const [filter, setFilter] = useState("Tout");
  const [eaten, setEaten] = useState<number[]>([]);
  const meals = [
    { title: "Petit-déj Protéiné", desc: "Omelette + avoine + banane", cal: "450 kcal", type: "Petit-déj", emoji: "🍳" },
    { title: "Déjeuner Fit", desc: "Poulet + riz + légumes", cal: "650 kcal", type: "Déjeuner", emoji: "🍗" },
    { title: "Dîner Léger", desc: "Saumon + salade", cal: "400 kcal", type: "Dîner", emoji: "🥗" },
    { title: "Snack Santé", desc: "Smoothie fruits + protéines", cal: "250 kcal", type: "Snack", emoji: "🥤" },
  ];
  const filtered = filter === "Tout" ? meals : meals.filter(m => m.type === filter);
  const totalCal = eaten.reduce((sum, i) => sum + parseInt(meals[i].cal), 0);
  return (
    <div style={{ padding: 16, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>← Retour Dashboard</Link>
      <h1 style={{ marginTop: 12 }}>Nutrition 🥗</h1>
      <p style={{ color: "#AAA" }}>Calories mangées aujourd'hui : <b style={{ color: "#00FF88" }}>{totalCal} kcal</b></p>

      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {["Tout", "Petit-déj", "Déjeuner", "Dîner", "Snack"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 20, border: "none", backgroundColor: filter === f ? "#00FF88" : "#222", color: filter === f ? "black" : "white", fontWeight: "bold" }}>{f}</button>
        ))}
      </div>

      {filtered.map((m, i) => {
        const isEaten = eaten.includes(i);
        return (
          <div key={i} style={{ marginTop: 14, padding: 16, backgroundColor: isEaten ? "#0F3D24" : "#1A1A1A", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0 }}>{m.emoji} {m.title} {isEaten ? "✅" : ""}</h3>
              <p style={{ color: "#A7F3D0", margin: "5px 0" }}>{m.desc}</p>
              <b>{m.cal} • {m.type}</b>
            </div>
            <button onClick={() => setEaten(isEaten ? eaten.filter(e => e !== i) : [...eaten, i])} style={{ backgroundColor: isEaten ? "#888" : "#00FF88", color: isEaten ? "white" : "black", padding: "10px 14px", borderRadius: 20, fontWeight: "bold", border: "none" }}>{isEaten ? "Annuler" : "Mangée"}</button>
          </div>
        );
      })}
    </div>
  );
            }
