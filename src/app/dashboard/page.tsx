"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const TEXTS: any = {
  fr: { hello: "Salut", goal: "OBJECTIF DU JOUR", workout: "Séance Full Body - 30 min", start: "▶ Commencer", calories: "Calories", sessions: "Séances", weight: "Poids", time: "Temps", quick: "Accès rapide", workouts: "Entraînements", nutrition: "Nutrition", programs: "Programmes", stats: "Statistiques", news: "Actualités", profile: "Profil" },
  en: { hello: "Hi", goal: "TODAY'S GOAL", workout: "Full Body Workout - 30 min", start: "▶ Start", calories: "Calories", sessions: "Workouts", weight: "Weight", time: "Time", quick: "Quick access", workouts: "Workouts", nutrition: "Nutrition", programs: "Programs", stats: "Statistics", news: "News", profile: "Profile" },
};

export default function DashboardPage() {
  const [lang, setLang] = useState("fr");
  const [name, setName] = useState("Diallo");
  const [photo, setPhoto] = useState("");
  const t = TEXTS[lang];

  useEffect(() => {
    setLang(localStorage.getItem("fitpro-lang") || "fr");
    setName(localStorage.getItem("fitpro-name") || "Diallo");
    setPhoto(localStorage.getItem("fitpro-photo") || "");
  }, []);

  const card = { backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16, textDecoration: "none", color: "white", display: "block" } as const;

  return (
    <div style={{ padding: 20, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#00FF88", fontSize: 28, margin: 0 }}>FIT PRO</h1>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setLang("fr"); localStorage.setItem("fitpro-lang", "fr"); }} style={{ padding: "6px 10px", borderRadius: 20, border: "none", backgroundColor: lang === "fr" ? "#00FF88" : "#333", color: lang === "fr" ? "black" : "white", fontWeight: "bold" }}>🇫🇷 FR</button>
          <button onClick={() => { setLang("en"); localStorage.setItem("fitpro-lang", "en"); }} style={{ padding: "6px 10px", borderRadius: 20, border: "none", backgroundColor: lang === "en" ? "#00FF88" : "#333", color: lang === "en" ? "black" : "white", fontWeight: "bold" }}>🇬🇧 EN</button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18 }}>
        <Link href="/profile">
          <div style={{ width: 60, height: 60, borderRadius: "50%", overflow: "hidden", backgroundColor: "#222", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #00FF88" }}>
            {photo ? <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 28 }}>👤</span>}
          </div>
        </Link>
        <div>
          <h2 style={{ margin: 0, fontSize: 24 }}>{t.hello} {name} 👋</h2>
          <p style={{ color: "#AAA", margin: 0 }}>Prêt à t'entraîner ?</p>
        </div>
      </div>

      <div style={{ marginTop: 18, borderRadius: 18, overflow: "hidden", backgroundColor: "#1A1A1A" }}>
        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
        <div style={{ padding: 16 }}>
          <p style={{ color: "#00FF88", margin: 0, fontSize: 13, fontWeight: "bold" }}>{t.goal}</p>
          <h3 style={{ margin: "6px 0" }}>{t.workout}</h3>
          <div style={{ backgroundColor: "#00FF88", color: "black", padding: 12, borderRadius: 12, textAlign: "center", fontWeight: "bold", marginTop: 10 }}>{t.start}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
        <div style={card}><div style={{ color: "#00FF88", fontSize: 22, fontWeight: "bold" }}>1,240</div><div style={{ color: "#AAA" }}>{t.calories}</div></div>
        <div style={card}><div style={{ color: "#00FF88", fontSize: 22, fontWeight: "bold" }}>5/7</div><div style={{ color: "#AAA" }}>{t.sessions}</div></div>
        <div style={card}><div style={{ color: "#00FF88", fontSize: 22, fontWeight: "bold" }}>78 kg</div><div style={{ color: "#AAA" }}>{t.weight}</div></div>
        <div style={card}><div style={{ color: "#00FF88", fontSize: 22, fontWeight: "bold" }}>4h 10</div><div style={{ color: "#AAA" }}>{t.time}</div></div>
      </div>

      <h3 style={{ marginTop: 20 }}>{t.quick}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Link href="/workouts" style={card}>💪 {t.workouts}</Link>
        <Link href="/nutrition" style={card}>🥗 {t.nutrition}</Link>
        <Link href="/programs" style={card}>📋 {t.programs}</Link>
        <Link href="/statistics" style={card}>📊 {t.stats}</Link>
        <Link href="/actualites" style={card}>📰 {t.news}</Link>
        <Link href="/profile" style={card}>👤 {t.profile}</Link>
      </div>
    </div>
  );
          }
