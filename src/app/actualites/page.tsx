"use client";
import Link from "next/link";
import { useState } from "react";

export default function ActualitesPage() {
  const [filter, setFilter] = useState("Tout");
  const [liked, setLiked] = useState<number[]>([]);
  const articles = [
    { title: "L'échauffement : prépare ton corps", category: "PRÉPARATION", desc: "Quelques minutes de mobilité pour éviter les blessures.", emoji: "🏃" },
    { title: "Boire de l'eau : pense à t'hydrater", category: "HYDRATATION", desc: "Garde de l'eau à portée pendant toute ta séance.", emoji: "💧" },
    { title: "Protéines : pourquoi c'est important", category: "NUTRITION", desc: "Les protéines aident tes muscles à récupérer après l'effort.", emoji: "🥩" },
    { title: "Dormir pour progresser", category: "RÉCUPÉRATION", desc: "Le sommeil c'est là que tes muscles grandissent vraiment.", emoji: "😴" },
  ];
  const filtered = filter === "Tout" ? articles : articles.filter(a => a.category === filter);
  return (
    <div style={{ padding: 16, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>← Retour Dashboard</Link>
      <h1 style={{ marginTop: 12 }}>Actualités 📰</h1>
      <p style={{ color: "#AAA" }}>Conseils, nutrition et motivation</p>

      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {["Tout", "PRÉPARATION", "HYDRATATION", "NUTRITION", "RÉCUPÉRATION"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 12px", borderRadius: 20, border: "none", backgroundColor: filter === f ? "#00FF88" : "#222", color: filter === f ? "black" : "white", fontWeight: "bold", fontSize: 12 }}>{f}</button>
        ))}
      </div>

      {filtered.map((a, i) => (
        <div key={i} style={{ marginTop: 14, padding: 16, backgroundColor: "#1A1A1A", borderRadius: 16 }}>
          <div style={{ fontSize: 40 }}>{a.emoji}</div>
          <span style={{ backgroundColor: "#00FF88", color: "black", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: "bold" }}>{a.category}</span>
          <h3 style={{ margin: "10px 0 5px" }}>{a.title}</h3>
          <p style={{ color: "#AAA", margin: 0 }}>{a.desc}</p>
          <button onClick={() => setLiked(liked.includes(i) ? liked.filter(l => l !== i) : [...liked, i])} style={{ marginTop: 10, backgroundColor: "transparent", border: "1px solid #00FF88", color: liked.includes(i) ? "#00FF88" : "white", padding: "8px 14px", borderRadius: 20, fontWeight: "bold" }}>{liked.includes(i) ? "❤️ Aimé" : "🤍 J'aime"}</button>
        </div>
      ))}
    </div>
  );
                                                                                                                                                              }
