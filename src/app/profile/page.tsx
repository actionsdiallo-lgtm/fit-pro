"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const TEXTS: any = {
  fr: { back: "← Retour Dashboard", changePhoto: "📸 Changer ma photo", member: "Membre FitPro", sessions: "Séances", weeks: "Semaines", streak: "Série", edit: "Modifier mon profil", name: "Nom", weight: "Poids (kg)", goal: "Objectif", saved: "✅ Profil sauvegardé automatiquement", lang: "Langue" },
  en: { back: "← Back to Dashboard", changePhoto: "📸 Change my photo", member: "FitPro Member", sessions: "Workouts", weeks: "Weeks", streak: "Streak", edit: "Edit my profile", name: "Name", weight: "Weight (kg)", goal: "Goal", saved: "✅ Profile saved automatically", lang: "Language" },
};

export default function ProfilePage() {
  const [name, setName] = useState("Diallo");
  const [weight, setWeight] = useState("75");
  const [goal, setGoal] = useState("Prise de Masse");
  const [photo, setPhoto] = useState("");
  const [lang, setLang] = useState("fr");
  const fileRef = useRef<HTMLInputElement>(null);
  const t = TEXTS[lang];

  useEffect(() => {
    const saved = localStorage.getItem("fitpro-photo");
    const savedName = localStorage.getItem("fitpro-name");
    const savedLang = localStorage.getItem("fitpro-lang");
    if (saved) setPhoto(saved);
    if (savedName) setName(savedName);
    if (savedLang) setLang(savedLang);
  }, []);

  const handlePhoto = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhoto(result);
      localStorage.setItem("fitpro-photo", result);
    };
    reader.readAsDataURL(file);
  };

  const changeLang = (l: string) => {
    setLang(l);
    localStorage.setItem("fitpro-lang", l);
  };

  const input = { width: "100%", padding: 14, borderRadius: 12, border: "1px solid #333", backgroundColor: "#1A1A1A", color: "white", marginTop: 8, boxSizing: "border-box" as const };

  return (
    <div style={{ padding: 20, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>{t.back}</Link>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <div onClick={() => fileRef.current?.click()} style={{ width: 120, height: 120, borderRadius: "50%", backgroundColor: "#222", margin: "0 auto", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #00FF88", cursor: "pointer" }}>
          {photo ? <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 50 }}>👤</span>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
        <button onClick={() => fileRef.current?.click()} style={{ marginTop: 10, backgroundColor: "#00FF88", color: "black", border: "none", padding: "8px 16px", borderRadius: 20, fontWeight: "bold" }}>{t.changePhoto}</button>
        <h1 style={{ fontSize: 32, margin: "12px 0 0" }}>{name}</h1>
        <p style={{ color: "#AAA" }}>{t.member} • {goal}</p>
      </div>
      <div style={{ backgroundColor: "#1A1A1A", padding: 14, borderRadius: 14, marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>🌍 {t.lang}</span>
        <div style={{ display: "flex", gap: 6 }}>
          {["fr", "en"].map(l => (
            <button key={l} onClick={() => changeLang(l)} style={{ padding: "8px 12px", borderRadius: 20, border: "none", backgroundColor: lang === l ? "#00FF88" : "#333", color: lang === l ? "black" : "white", fontWeight: "bold" }}>{l === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <div style={{ flex: 1, backgroundColor: "#1A1A1A", padding: 14, borderRadius: 14, textAlign: "center" }}><div style={{ color: "#00FF88", fontSize: 22, fontWeight: "bold" }}>42</div><div style={{ color: "#AAA" }}>{t.sessions}</div></div>
        <div style={{ flex: 1, backgroundColor: "#1A1A1A", padding: 14, borderRadius: 14, textAlign: "center" }}><div style={{ color: "#00FF88", fontSize: 22, fontWeight: "bold" }}>12</div><div style={{ color: "#AAA" }}>{t.weeks}</div></div>
        <div style={{ flex: 1, backgroundColor: "#1A1A1A", padding: 14, borderRadius: 14, textAlign: "center" }}><div style={{ color: "#00FF88", fontSize: 22, fontWeight: "bold" }}>🔥 7</div><div style={{ color: "#AAA" }}>{t.streak}</div></div>
      </div>
      <div style={{ backgroundColor: "#1A1A1A", padding: 18, borderRadius: 16, marginTop: 16 }}>
        <h2 style={{ margin: 0 }}>{t.edit}</h2>
        <label style={{ marginTop: 16, display: "block" }}>{t.name}</label>
        <input style={input} value={name} onChange={e => { setName(e.target.value); localStorage.setItem("fitpro-name", e.target.value); }} />
        <label style={{ marginTop: 14, display: "block" }}>{t.weight}</label>
        <input style={input} value={weight} onChange={e => setWeight(e.target.value)} />
        <label style={{ marginTop: 14, display: "block" }}>{t.goal}</label>
        <input style={input} value={goal} onChange={e => setGoal(e.target.value)} />
        <div style={{ marginTop: 16, backgroundColor: "#00FF88", color: "black", padding: 14, borderRadius: 12, textAlign: "center", fontWeight: "bold" }}>{t.saved}</div>
      </div>
    </div>
  );
                 }
