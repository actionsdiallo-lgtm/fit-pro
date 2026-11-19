"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const TEXTS: any = {
  fr: { back: "← Retour Dashboard", title: "Mon Profil", subtitle: "Gère tes infos", name: "Nom", weight: "Poids (kg)", goal: "Objectif", save: "💾 Enregistrer", saved: "✅ Enregistré !", changePhoto: "📸 Changer photo", workouts: "Séances", level: "Niveau", edit: "Modifier" },
  en: { back: "← Back to Dashboard", title: "My Profile", subtitle: "Manage your info", name: "Name", weight: "Weight (kg)", goal: "Goal", save: "💾 Save", saved: "✅ Saved !", changePhoto: "📸 Change photo", workouts: "Workouts", level: "Level", edit: "Edit" },
};

export default function ProfilePage() {
  const [lang, setLang] = useState("fr");
  const [name, setName] = useState("Diallo");
  const [weight, setWeight] = useState("78");
  const [goal, setGoal] = useState("Prise de masse");
  const [photo, setPhoto] = useState("");
  const [savedMsg, setSavedMsg] = useState(false);
  const fileRef = useRef<any>(null);
  const t = TEXTS[lang];

  useEffect(() => {
    setLang(localStorage.getItem("fitpro-lang") || "fr");
    setName(localStorage.getItem("fitpro-name") || "Diallo");
    setWeight(localStorage.getItem("fitpro-weight") || "78");
    setGoal(localStorage.getItem("fitpro-goal") || "Prise de masse");
    setPhoto(localStorage.getItem("fitpro-photo") || "");
  }, []);

  const save = () => {
    localStorage.setItem("fitpro-name", name);
    localStorage.setItem("fitpro-weight", weight);
    localStorage.setItem("fitpro-goal", goal);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const onPhoto = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setPhoto(url);
      localStorage.setItem("fitpro-photo", url);
    };
    reader.readAsDataURL(file);
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

      <h1 style={{ fontSize: 30, margin: "16px 0 4px" }}>👤 {t.title}</h1>
      <p style={{ color: "#AAA", margin: 0 }}>{t.subtitle}</p>

      <div style={{ backgroundColor: "#1A1A1A", padding: 20, borderRadius: 18, marginTop: 18, textAlign: "center" }}>
        <div onClick={() => fileRef.current?.click()} style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: "#333", margin: "0 auto", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, cursor: "pointer" }}>
          {photo ? <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} style={{ display: "none" }} />
        <button onClick={() => fileRef.current?.click()} style={{ marginTop: 10, padding: "8px 14px", borderRadius: 20, border: "none", backgroundColor: "#333", color: "white", fontWeight: "bold" }}>{t.changePhoto}</button>
        <h2 style={{ margin: "12px 0 0" }}>{name} 💪</h2>
        <p style={{ color: "#00FF88", margin: "4px 0 0" }}>{goal} • {weight} kg</p>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <div style={{ flex: 1, backgroundColor: "#222", padding: 12, borderRadius: 12 }}><b>24</b><br /><span style={{ color: "#AAA", fontSize: 13 }}>{t.workouts}</span></div>
          <div style={{ flex: 1, backgroundColor: "#222", padding: 12, borderRadius: 12 }}><b>⭐ Pro</b><br /><span style={{ color: "#AAA", fontSize: 13 }}>{t.level}</span></div>
        </div>
      </div>

      <div style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16, marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
        <label>{t.name}<input value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", backgroundColor: "#333", color: "white", marginTop: 6, boxSizing: "border-box" }} /></label>
        <label>{t.weight}<input value={weight} onChange={e => setWeight(e.target.value)} inputMode="numeric" style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", backgroundColor: "#333", color: "white", marginTop: 6, boxSizing: "border-box" }} /></label>
        <label>{t.goal}
          <select value={goal} onChange={e => setGoal(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", backgroundColor: "#333", color: "white", marginTop: 6 }}>
            <option>Prise de masse</option><option>Perte de poids</option><option>Force</option><option>Endurance</option>
          </select>
        </label>
        <button onClick={save} style={{ padding: 14, borderRadius: 12, border: "none", backgroundColor: "#00FF88", color: "black", fontWeight: "bold", fontSize: 16 }}>{savedMsg ? t.saved : t.save}</button>
      </div>
    </div>
  );
        }
