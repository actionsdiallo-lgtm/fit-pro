"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const TEXTS: any = {
  fr: { back: "← Retour Dashboard", title: "Actualités", subtitle: "Conseils & actus fitness", all: "Tout", tips: "Conseils", nutrition: "Nutrition", training: "Entraînement", liked: "Aimés", like: "❤️ J'aime", unlike: "❤️ Aimé" },
  en: { back: "← Back to Dashboard", title: "News", subtitle: "Fitness tips & news", all: "All", tips: "Tips", nutrition: "Nutrition", training: "Training", liked: "Liked", like: "❤️ Like", unlike: "❤️ Liked" },
};

const ARTICLES = [
  { cat: "tips", titleFr: "L'échauffement : prépare ton corps", titleEn: "Warm-up: prepare your body", descFr: "5 minutes qui changent tout avant ta séance.", descEn: "5 minutes that change everything before your workout.", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80" },
  { cat: "nutrition", titleFr: "Boire de l'eau : pense à t'hydrater", titleEn: "Drink water: stay hydrated", descFr: "2L par jour minimum pour progresser.", descEn: "At least 2L per day to progress.", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80" },
  { cat: "nutrition", titleFr: "Protéines : pourquoi c'est essentiel", titleEn: "Protein: why it's essential", descFr: "Construis du muscle avec les bonnes protéines.", descEn: "Build muscle with the right protein.", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80" },
  { cat: "training", titleFr: "Dormir pour progresser", titleEn: "Sleep to progress", descFr: "Le muscle se construit pendant le sommeil.", descEn: "Muscle is built while you sleep.", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80" },
];

export default function ActualitesPage() {
  const [lang, setLang] = useState("fr");
  const [filter, setFilter] = useState("all");
  const [liked, setLiked] = useState<number[]>([]);
  const t = TEXTS[lang];

  useEffect(() => {
    setLang(localStorage.getItem("fitpro-lang") || "fr");
    const saved = localStorage.getItem("fitpro-liked-news");
    if (saved) setLiked(JSON.parse(saved));
  }, []);

  const toggleLike = (i: number) => {
    const next = liked.includes(i) ? liked.filter(x => x !== i) : [...liked, i];
    setLiked(next);
    localStorage.setItem("fitpro-liked-news", JSON.stringify(next));
  };

  const filtered = filter === "all" ? ARTICLES : ARTICLES.filter(a => a.cat === filter);
  const filters = ["all", "tips", "nutrition", "training"];

  return (
    <div style={{ padding: 20, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>{t.back}</Link>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setLang("fr"); localStorage.setItem("fitpro-lang", "fr"); }} style={{ padding: "6px 10px", borderRadius: 20, border: "none", backgroundColor: lang === "fr" ? "#00FF88" : "#333", color: lang === "fr" ? "black" : "white", fontWeight: "bold" }}>🇫🇷 FR</button>
          <button onClick={() => { setLang("en"); localStorage.setItem("fitpro-lang", "en"); }} style={{ padding: "6px 10px", borderRadius: 20, border: "none", backgroundColor: lang === "en" ? "#00FF88" : "#333", color: lang === "en" ? "black" : "white", fontWeight: "bold" }}>🇬🇧 EN</button>
        </div>
      </div>

      <h1 style={{ fontSize: 30, margin: "16px 0 4px" }}>📰 {t.title}</h1>
      <p style={{ color: "#AAA", margin: 0 }}>{t.subtitle} • ❤️ {liked.length} {t.liked}</p>

      <div style={{ display: "flex", gap: 8, marginTop: 16, overflowX: "auto" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 20, border: "none", whiteSpace: "nowrap", backgroundColor: filter === f ? "#00FF88" : "#1A1A1A", color: filter === f ? "black" : "white", fontWeight: "bold" }}>{t[f]}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
        {filtered.map((a) => {
          const realIndex = ARTICLES.indexOf(a);
          const isLiked = liked.includes(realIndex);
          return (
            <div key={realIndex} style={{ backgroundColor: "#1A1A1A", borderRadius: 18, overflow: "hidden" }}>
              <img src={a.img} style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
              <div style={{ padding: 16 }}>
                <h3 style={{ margin: 0 }}>{lang === "fr" ? a.titleFr : a.titleEn}</h3>
                <p style={{ color: "#AAA", margin: "6px 0" }}>{lang === "fr" ? a.descFr : a.descEn}</p>
                <button onClick={() => toggleLike(realIndex)} style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", backgroundColor: isLiked ? "#FF3366" : "#333", color: "white", fontWeight: "bold" }}>{isLiked ? t.unlike : t.like}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
      }
