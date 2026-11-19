"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const TEXTS: any = {
  fr: { back: "← Retour Dashboard", title: "Programmes", subtitle: "Choisis ton programme", all: "Tout", muscle: "Masse", fatloss: "Perte", strength: "Force", beginner: "Débutant", active: "Actif ✅", activate: "Activer ce programme", weeks: "semaines" },
  en: { back: "← Back to Dashboard", title: "Programs", subtitle: "Choose your program", all: "All", muscle: "Muscle", fatloss: "Fat Loss", strength: "Strength", beginner: "Beginner", active: "Active ✅", activate: "Activate this program", weeks: "weeks" },
};

const PROGRAMS = [
  { cat: "muscle", titleFr: "Prise de Masse", titleEn: "Muscle Gain", descFr: "8 semaines • 5 séances / semaine", descEn: "8 weeks • 5 sessions / week", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
  { cat: "fatloss", titleFr: "Perte de Poids", titleEn: "Weight Loss", descFr: "6 semaines • 4 séances / semaine", descEn: "6 weeks • 4 sessions / week", img: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80" },
  { cat: "strength", titleFr: "Force & Performance", titleEn: "Strength & Performance", descFr: "10 semaines • 4 séances / semaine", descEn: "10 weeks • 4 sessions / week", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80" },
  { cat: "beginner", titleFr: "Débutant Total", titleEn: "Total Beginner", descFr: "4 semaines • 3 séances / semaine", descEn: "4 weeks • 3 sessions / week", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80" },
];

export default function ProgramsPage() {
  const [lang, setLang] = useState("fr");
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<number | null>(null);
  const t = TEXTS[lang];

  useEffect(() => {
    setLang(localStorage.getItem("fitpro-lang") || "fr");
    const saved = localStorage.getItem("fitpro-program");
    if (saved) setActive(Number(saved));
  }, []);

  const activate = (i: number) => {
    setActive(i);
    localStorage.setItem("fitpro-program", String(i));
  };

  const filtered = filter === "all" ? PROGRAMS : PROGRAMS.filter(p => p.cat === filter);
  const filters = ["all", "muscle", "fatloss", "strength", "beginner"];

  return (
    <div style={{ padding: 20, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>{t.back}</Link>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setLang("fr"); localStorage.setItem("fitpro-lang", "fr"); }} style={{ padding: "6px 10px", borderRadius: 20, border: "none", backgroundColor: lang === "fr" ? "#00FF88" : "#333", color: lang === "fr" ? "black" : "white", fontWeight: "bold" }}>🇫🇷 FR</button>
          <button onClick={() => { setLang("en"); localStorage.setItem("fitpro-lang", "en"); }} style={{ padding: "6px 10px", borderRadius: 20, border: "none", backgroundColor: lang === "en" ? "#00FF88" : "#333", color: lang === "en" ? "black" : "white", fontWeight: "bold" }}>🇬🇧 EN</button>
        </div>
      </div>

      <h1 style={{ fontSize: 30, margin: "16px 0 4px" }}>📋 {t.title}</h1>
      <p style={{ color: "#AAA", margin: 0 }}>{t.subtitle}</p>

      <div style={{ display: "flex", gap: 8, marginTop: 16, overflowX: "auto" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 20, border: "none", whiteSpace: "nowrap", backgroundColor: filter === f ? "#00FF88" : "#1A1A1A", color: filter === f ? "black" : "white", fontWeight: "bold" }}>{t[f]}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
        {filtered.map((p) => {
          const realIndex = PROGRAMS.indexOf(p);
          const isActive = active === realIndex;
          return (
            <div key={realIndex} style={{ backgroundColor: "#1A1A1A", borderRadius: 18, overflow: "hidden", border: isActive ? "2px solid #00FF88" : "none" }}>
              <img src={p.img} style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
              <div style={{ padding: 16 }}>
                <h3 style={{ margin: 0 }}>{lang === "fr" ? p.titleFr : p.titleEn} {isActive ? "⭐" : ""}</h3>
                <p style={{ color: "#AAA", margin: "6px 0" }}>{lang === "fr" ? p.descFr : p.descEn}</p>
                <button onClick={() => activate(realIndex)} style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", backgroundColor: isActive ? "#00FF88" : "#333", color: isActive ? "black" : "white", fontWeight: "bold" }}>{isActive ? t.active : t.activate}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
