"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const TEXTS: any = {
  fr: { back: "← Retour Dashboard", title: "Nutrition", subtitle: "Mange bien, progresse vite", all: "Tout", breakfast: "Petit-déj", lunch: "Déjeuner", dinner: "Dîner", snack: "Snack", eaten: "Mangés", kcal: "kcal", ate: "J'ai mangé ✅", eat: "Je mange" },
  en: { back: "← Back to Dashboard", title: "Nutrition", subtitle: "Eat well, progress fast", all: "All", breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack", eaten: "Eaten", kcal: "kcal", ate: "I ate ✅", eat: "I eat" },
};

const MEALS = [
  { cat: "breakfast", titleFr: "Petit-déj Protéiné", titleEn: "Protein Breakfast", descFr: "Oeufs + Avoine + Banane", descEn: "Eggs + Oats + Banana", kcal: "420", img: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80" },
  { cat: "lunch", titleFr: "Déjeuner Fit", titleEn: "Fit Lunch", descFr: "Poulet + Riz + Légumes", descEn: "Chicken + Rice + Veggies", kcal: "650", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80" },
  { cat: "dinner", titleFr: "Dîner Léger", titleEn: "Light Dinner", descFr: "Saumon + Salade", descEn: "Salmon + Salad", kcal: "480", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80" },
  { cat: "snack", titleFr: "Snack Santé", titleEn: "Healthy Snack", descFr: "Smoothie + Fruits", descEn: "Smoothie + Fruits", kcal: "220", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80" },
];

export default function NutritionPage() {
  const [lang, setLang] = useState("fr");
  const [filter, setFilter] = useState("all");
  const [eaten, setEaten] = useState<number[]>([]);
  const t = TEXTS[lang];

  useEffect(() => {
    setLang(localStorage.getItem("fitpro-lang") || "fr");
    const saved = localStorage.getItem("fitpro-eaten");
    if (saved) setEaten(JSON.parse(saved));
  }, []);

  const toggle = (i: number) => {
    const next = eaten.includes(i) ? eaten.filter(x => x !== i) : [...eaten, i];
    setEaten(next);
    localStorage.setItem("fitpro-eaten", JSON.stringify(next));
  };

  const filtered = filter === "all" ? MEALS : MEALS.filter(m => m.cat === filter);
  const filters = ["all", "breakfast", "lunch", "dinner", "snack"];

  return (
    <div style={{ padding: 20, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>{t.back}</Link>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setLang("fr"); localStorage.setItem("fitpro-lang", "fr"); }} style={{ padding: "6px 10px", borderRadius: 20, border: "none", backgroundColor: lang === "fr" ? "#00FF88" : "#333", color: lang === "fr" ? "black" : "white", fontWeight: "bold" }}>🇫🇷 FR</button>
          <button onClick={() => { setLang("en"); localStorage.setItem("fitpro-lang", "en"); }} style={{ padding: "6px 10px", borderRadius: 20, border: "none", backgroundColor: lang === "en" ? "#00FF88" : "#333", color: lang === "en" ? "black" : "white", fontWeight: "bold" }}>🇬🇧 EN</button>
        </div>
      </div>

      <h1 style={{ fontSize: 30, margin: "16px 0 4px" }}>🥗 {t.title}</h1>
      <p style={{ color: "#AAA", margin: 0 }}>{t.subtitle} • {eaten.length} {t.eaten}</p>

      <div style={{ display: "flex", gap: 8, marginTop: 16, overflowX: "auto" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 20, border: "none", whiteSpace: "nowrap", backgroundColor: filter === f ? "#00FF88" : "#1A1A1A", color: filter === f ? "black" : "white", fontWeight: "bold" }}>{t[f === "all" ? "all" : f]}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
        {filtered.map((m) => {
          const realIndex = MEALS.indexOf(m);
          return (
            <div key={realIndex} style={{ backgroundColor: "#1A1A1A", borderRadius: 18, overflow: "hidden" }}>
              <img src={m.img} style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
              <div style={{ padding: 16 }}>
                <h3 style={{ margin: 0 }}>{lang === "fr" ? m.titleFr : m.titleEn}</h3>
                <p style={{ color: "#AAA", margin: "6px 0" }}>{lang === "fr" ? m.descFr : m.descEn} • 🔥 {m.kcal} {t.kcal}</p>
                <button onClick={() => toggle(realIndex)} style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", backgroundColor: eaten.includes(realIndex) ? "#00FF88" : "#333", color: eaten.includes(realIndex) ? "black" : "white", fontWeight: "bold" }}>{eaten.includes(realIndex) ? t.ate : t.eat}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
                                                                   }
