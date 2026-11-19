"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const TEXTS: any = {
  fr: { back: "← Retour Dashboard", title: "Entraînements", subtitle: "Choisis ta séance du jour", done: "Terminé ✅", start: "▶ Commencer" },
  en: { back: "← Back to Dashboard", title: "Workouts", subtitle: "Choose your workout for today", done: "Done ✅", start: "▶ Start" },
};

const WORKOUTS = [
  { titleFr: "Full Body Débutant", titleEn: "Full Body Beginner", time: "30 min", kcal: "250 kcal", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80" },
  { titleFr: "HIIT Brûle-Graisse", titleEn: "HIIT Fat Burn", time: "20 min", kcal: "320 kcal", img: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80" },
  { titleFr: "Muscu Pectoraux", titleEn: "Chest Workout", time: "45 min", kcal: "380 kcal", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
  { titleFr: "Jambes Puissantes", titleEn: "Power Legs", time: "40 min", kcal: "350 kcal", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80" },
];

export default function WorkoutsPage() {
  const [lang, setLang] = useState("fr");
  const [done, setDone] = useState<number[]>([]);
  const t = TEXTS[lang];

  useEffect(() => {
    setLang(localStorage.getItem("fitpro-lang") || "fr");
    const saved = localStorage.getItem("fitpro-done");
    if (saved) setDone(JSON.parse(saved));
  }, []);

  const toggleDone = (i: number) => {
    const next = done.includes(i) ? done.filter(x => x !== i) : [...done, i];
    setDone(next);
    localStorage.setItem("fitpro-done", JSON.stringify(next));
  };

  return (
    <div style={{ padding: 20, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>{t.back}</Link>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setLang("fr"); localStorage.setItem("fitpro-lang", "fr"); }} style={{ padding: "6px 10px", borderRadius: 20, border: "none", backgroundColor: lang === "fr" ? "#00FF88" : "#333", color: lang === "fr" ? "black" : "white", fontWeight: "bold" }}>🇫🇷 FR</button>
          <button onClick={() => { setLang("en"); localStorage.setItem("fitpro-lang", "en"); }} style={{ padding: "6px 10px", borderRadius: 20, border: "none", backgroundColor: lang === "en" ? "#00FF88" : "#333", color: lang === "en" ? "black" : "white", fontWeight: "bold" }}>🇬🇧 EN</button>
        </div>
      </div>

      <h1 style={{ fontSize: 30, margin: "16px 0 4px" }}>💪 {t.title}</h1>
      <p style={{ color: "#AAA", margin: 0 }}>{t.subtitle} • {done.length}/{WORKOUTS.length}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
        {WORKOUTS.map((w, i) => (
          <div key={i} style={{ backgroundColor: "#1A1A1A", borderRadius: 18, overflow: "hidden", opacity: done.includes(i) ? 0.7 : 1 }}>
            <img src={w.img} style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
            <div style={{ padding: 16 }}>
              <h3 style={{ margin: 0, fontSize: 19 }}>{lang === "fr" ? w.titleFr : w.titleEn}</h3>
              <p style={{ color: "#AAA", margin: "6px 0" }}>⏱ {w.time} • 🔥 {w.kcal}</p>
              <button onClick={() => toggleDone(i)} style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", backgroundColor: done.includes(i) ? "#00FF88" : "#333", color: done.includes(i) ? "black" : "white", fontWeight: "bold", fontSize: 15 }}>
                {done.includes(i) ? t.done : t.start}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
      }
