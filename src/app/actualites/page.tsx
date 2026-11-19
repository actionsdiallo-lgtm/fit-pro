"use client";
import Link from "next/link";
import { useState } from "react";

export default function ActualitesPage() {
  const [filter, setFilter] = useState("Tout");
  const [liked, setLiked] = useState<number[]>([]);
  const articles = [
    { title: "L'échauffement : prépare ton corps", desc: "5 min qui changent tout avant ta séance", cat: "Entraînement", emoji: "🔥" },
    { title: "Boire de l'eau : pense à t'hydrater", desc: "2L par jour pour mieux récupérer", cat: "Santé", emoji: "💧" },
    { title: "Protéines : pourquoi c'est essentiel", desc: "Construis du muscle plus vite", cat: "Nutrition", emoji: "🥩" },
    { title: "Dormir pour progresser", desc: "8h de sommeil = +30% de gains", cat: "Santé", emoji: "😴" },
  ];
  const filtered = filter === "Tout" ? articles : articles.filter(a => a.cat === filter);
  return (
    <div style={{ padding: 16, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>← Retour Dashboard</Link>
      <h1 style={{ marginTop: 12 }}>Actualités 📰</h1>
      <p style={{ color: "#AAA" }}>Conseils, astuces et motivation chaque jour</p>

      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {["Tout", "Entraînement", "Nutrition", "Santé"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 20, border: "none", backgroundColor: filter === f ? "#00FF88" : "#222", color: filter === f ? "black" : "white", fontWeight: "bold" }}>{f}</button>
        ))}
      </div>

      {filtered.map((a, i) => (
        <div key={i} style={{ marginTop: 14, padding: 16, backgroundColor: "#1A1A1A", borderRadius: 16 }}>
          <h3 style={{ margin: 0 }}>{a.emoji} {a.title}</h3>
          <p style={{ color: "#A7F3D0", margin: "5px 0" }}>{a.desc}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#AAA", fontSize: 13 }}>{a.cat}</span>
            <button onClick={() => setLiked(liked.includes(i) ? liked.filter(l => l !== i) : [...liked, i])} style={{ backgroundColor: liked.includes(i) ? "#FF2D55" : "#333", color: "white", padding: "8px 14px", borderRadius: 20, border: "none", fontWeight: "bold" }}>{liked.includes(i) ? "❤️ Aimé" : "🤍 J'aime"}</button>
          </div>
        </div>
      ))}
    </div>
  );
          }
