"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const TEXTS: any = {
  fr: { back: "← Retour Dashboard", title: "Statistiques", subtitle: "Tes progrès en direct", week: "Cette semaine", month: "Ce mois", workouts: "Séances", calories: "Calories brûlées", weight: "Poids", time: "Temps d'entraînement", goal: "Objectif semaine", progress: "Progression" },
  en: { back: "← Back to Dashboard", title: "Statistics", subtitle: "Your progress live", week: "This week", month: "This month", workouts: "Workouts", calories: "Calories burned", weight: "Weight", time: "Training time", goal: "Week goal", progress: "Progress" },
};

export default function StatisticsPage() {
  const [lang, setLang] = useState("fr");
  const [period, setPeriod] = useState("week");
  const t = TEXTS[lang];

  useEffect(() => {
    setLang(localStorage.getItem("fitpro-lang") || "fr");
  }, []);

  const stats = period === "week"
    ? [{ label: t.workouts, value: 5, max: 7, unit: "/7", color: "#00FF88" }, { label: t.calories, value: 1240, max: 2000, unit: " kcal", color: "#FFAA00" }, { label: t.weight, value: 78, max: 100, unit: " kg", color: "#00AAFF" }, { label: t.time, value: 4.1, max: 7, unit: "h", color: "#FF55AA" }]
    : [{ label: t.workouts, value: 18, max: 25, unit: "/25", color: "#00FF88" }, { label: t.calories, value: 5200, max: 8000, unit: " kcal", color: "#FFAA00" }, { label: t.weight, value: 78, max: 100, unit: " kg", color: "#00AAFF" }, { label: t.time, value: 16.5, max: 28, unit: "h", color: "#FF55AA" }];

  return (
    <div style={{ padding: 20, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>{t.back}</Link>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setLang("fr"); localStorage.setItem("fitpro-lang", "fr"); }} style={{ padding: "6px 10px", borderRadius: 20, border: "none", backgroundColor: lang === "fr" ? "#00FF88" : "#333", color: lang === "fr" ? "black" : "white", fontWeight: "bold" }}>🇫🇷 FR</button>
          <button onClick={() => { setLang("en"); localStorage.setItem("fitpro-lang", "en"); }} style={{ padding: "6px 10px", borderRadius: 20, border: "none", backgroundColor: lang === "en" ? "#00FF88" : "#333", color: lang === "en" ? "black" : "white", fontWeight: "bold" }}>🇬🇧 EN</button>
        </div>
      </div>

      <h1 style={{ fontSize: 30, margin: "16px 0 4px" }}>📊 {t.title}</h1>
      <p style={{ color: "#AAA", margin: 0 }}>{t.subtitle}</p>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button onClick={() => setPeriod("week")} style={{ padding: "10px 18px", borderRadius: 20, border: "none", backgroundColor: period === "week" ? "#00FF88" : "#1A1A1A", color: period === "week" ? "black" : "white", fontWeight: "bold" }}>{t.week}</button>
        <button onClick={() => setPeriod("month")} style={{ padding: "10px 18px", borderRadius: 20, border: "none", backgroundColor: period === "month" ? "#00FF88" : "#1A1A1A", color: period === "month" ? "black" : "white", fontWeight: "bold" }}>{t.month}</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{s.label}</span>
              <b style={{ color: s.color }}>{s.value}{s.unit}</b>
            </div>
            <div style={{ backgroundColor: "#333", height: 10, borderRadius: 10, marginTop: 10, overflow: "hidden" }}>
              <div style={{ width: `${Math.min(100, (s.value / s.max) * 100)}%`, height: "100%", backgroundColor: s.color, borderRadius: 10 }} />
            </div>
            <p style={{ color: "#AAA", fontSize: 13, margin: "8px 0 0" }}>{Math.round((s.value / s.max) * 100)}% {t.progress}</p>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: "#00FF88", color: "black", padding: 16, borderRadius: 16, marginTop: 16, textAlign: "center", fontWeight: "bold" }}>
        🎯 {t.goal}: {period === "week" ? "5/7" : "18/25"} {t.workouts.toLowerCase()} 💪
      </div>
    </div>
  );
                                                                               }
