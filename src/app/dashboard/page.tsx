"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const TEXTS: any = {
  fr: { hello: "Salut", goal: "OBJECTIF DU JOUR", start: "▶ Commencer l'entraînement", workouts: "Séances", programs: "Programmes", nutrition: "Nutrition", statistics: "Statistiques", news: "Actualités", profile: "Mon Profil", progress: "Progression semaine", today: "Aujourd'hui : Full Body - 45 min", kcal: "Kcal brûlées", streak: "Jours consécutifs" },
  en: { hello: "Hi", goal: "TODAY'S GOAL", start: "▶ Start workout", workouts: "Workouts", programs: "Programs", nutrition: "Nutrition", statistics: "Statistics", news: "News", profile: "My Profile", progress: "Week progress", today: "Today: Full Body - 45 min", kcal: "Kcal burned", streak: "Day streak" },
};

export default function DashboardPage() {
  const [lang, setLang] = useState("fr");
  const [name, setName] = useState("Diallo");
  const [photo, setPhoto] = useState("");
  const [goal, setGoal] = useState("Prise de masse");
  const t = TEXTS[lang];

  useEffect(() => {
    const load = () => {
      setLang(localStorage.getItem("fitpro-lang") || "fr");
      setName(localStorage.getItem("fitpro-name") || "Diallo");
      setPhoto(localStorage.getItem("fitpro-photo") || "");
      setGoal(localStorage.getItem("fitpro-goal") || "Prise de masse");
    };
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  const menu = [
    { href: "/workouts", icon: "🏋️", label: t.workouts, color: "#00FF88" },
    { href: "/programs", icon: "📋", label: t.programs, color: "#FFAA00" },
    { href: "/nutrition", icon: "🥗", label: t.nutrition, color: "#00CCFF" },
    { href: "/statistics", icon: "📊", label: t.statistics, color: "#FF3366" },
    { href: "/actualites", icon: "📰", label: t.news, color: "#AA66FF" },
    { href: "/profile", icon: "👤", label: t.profile, color: "#FFFFFF" },
  ];

  return (
    <div style={{ padding: 20, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#333", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
            {photo ? <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
          </div>
          <div><b style={{ fontSize: 18 }}>{t.hello} {name} 💪</b><br /><span style={{ color: "#00FF88", fontSize: 13 }}>{goal}</span></div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setLang("fr"); localStorage.setItem("fitpro-lang", "fr"); }} style={{ padding: "6px 10px", borderRadius: 20, border: "none", backgroundColor: lang === "fr" ? "#00FF88" : "#333", color: lang === "fr" ? "black" : "white", fontWeight: "bold" }}>🇫🇷 FR</button>
          <button onClick={() => { setLang("en"); localStorage.setItem("fitpro-lang", "en"); }} style={{ padding: "6px 10px", borderRadius: 20, border: "none", backgroundColor: lang === "en" ? "#00FF88" : "#333", color: lang === "en" ? "black" : "white", fontWeight: "bold" }}>🇬🇧 EN</button>
        </div>
      </div>

      <div style={{ backgroundColor: "#1A1A1A", padding: 18, borderRadius: 18, marginTop: 18 }}>
        <span style={{ color: "#00FF88", fontSize: 12, fontWeight: "bold" }}>{t.goal}</span>
        <h2 style={{ margin: "6px 0" }}>{t.today}</h2>
        <p style={{ color: "#AAA", margin: "0 0 12px" }}>{t.progress} : 5/7 • 🔥 7 {t.streak}</p>
        <div style={{ height: 10, backgroundColor: "#333", borderRadius: 5, overflow: "hidden" }}><div style={{ width: "71%", height: "100%", backgroundColor: "#00FF88" }} /></div>
        <Link href="/workouts" style={{ display: "block", textAlign: "center", marginTop: 14, padding: 14, borderRadius: 12, backgroundColor: "#00FF88", color: "black", fontWeight: "bold", textDecoration: "none" }}>{t.start}</Link>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <div style={{ flex: 1, backgroundColor: "#1A1A1A", padding: 14, borderRadius: 14, textAlign: "center" }}><b style={{ fontSize: 20 }}>🔥 420</b><br /><span style={{ color: "#AAA", fontSize: 12 }}>{t.kcal}</span></div>
        <div style={{ flex: 1, backgroundColor: "#1A1A1A", padding: 14, borderRadius: 14, textAlign: "center" }}><b style={{ fontSize: 20 }}>24</b><br /><span style={{ color: "#AAA", fontSize: 12 }}>{t.workouts}</span></div>
        <div style={{ flex: 1, backgroundColor: "#1A1A1A", padding: 14, borderRadius: 14, textAlign: "center" }}><b style={{ fontSize: 20 }}>⭐ Pro</b><br /><span style={{ color: "#AAA", fontSize: 12 }}>Level</span></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
        {menu.map(m => (
          <Link key={m.href} href={m.href} style={{ backgroundColor: "#1A1A1A", padding: 18, borderRadius: 16, textDecoration: "none", color: "white", textAlign: "center" }}>
            <div style={{ fontSize: 28 }}>{m.icon}</div><b style={{ color: m.color }}>{m.label}</b>
          </Link>
        ))}
      </div>
    </div>
  );
    }
