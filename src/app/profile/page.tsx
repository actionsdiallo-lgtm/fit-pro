"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const TEXTS: any = {
  fr: { back: "← Retour Dashboard", title: "Mon Profil", subtitle: "Gère tes infos", name: "Nom", weight: "Poids (kg)", goal: "Objectif", save: "💾 Enregistrer les modifications", saved: "✅ Enregistré !", changePhoto: "Changer la photo", workouts: "Séances", level: "Niveau" },
  en: { back: "← Back Dashboard", title: "My Profile", subtitle: "Manage your info", name: "Name", weight: "Weight (kg)", goal: "Goal", save: "💾 Save changes", saved: "✅ Saved !", changePhoto: "Change photo", workouts: "Workouts", level: "Level" }
};

export default function Profile() {
  const [lang, setLang] = useState("fr");
  const [name, setName] = useState("Jack Daniel");
  const [weight, setWeight] = useState("75");
  const [goal, setGoal] = useState("Prise de masse");
  const [photo, setPhoto] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const t = TEXTS[lang];

  useEffect(() => {
    const savedLang = localStorage.getItem("fitpro-lang");
    if (savedLang) setLang(savedLang);
    const savedName = localStorage.getItem("fitpro-name");
    if (savedName) setName(savedName);
    const savedWeight = localStorage.getItem("fitpro-weight");
    if (savedWeight) setWeight(savedWeight);
    const savedPhoto = localStorage.getItem("fitpro-photo");
    if (savedPhoto) setPhoto(savedPhoto);
  }, []);

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

  const save = () => {
    localStorage.setItem("fitpro-name", name);
    localStorage.setItem("fitpro-weight", weight);
    localStorage.setItem("fitpro-goal", goal);
    alert(t.saved);
  };

  return (
    <div style={{ padding: 20, backgroundColor: "#000", minHeight: "100vh", color: "white", paddingBottom: 100, fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/dashboard" style={{ color: "#22FF00", textDecoration: "none", fontWeight: "bold" }}>{t.back}</Link>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { setLang("fr"); localStorage.setItem("fitpro-lang", "fr"); }} style={{ padding: "6px 10px", borderRadius: 20, border: "none", backgroundColor: lang === "fr" ? "#22FF00" : "#333", color: lang === "fr" ? "black" : "white", fontWeight: "bold" }}>🇫🇷 FR</button>
          <button onClick={() => { setLang("en"); localStorage.setItem("fitpro-lang", "en"); }} style={{ padding: "6px 10px", borderRadius: 20, border: "none", backgroundColor: lang === "en" ? "#22FF00" : "#333", color: lang === "en" ? "black" : "white", fontWeight: "bold" }}>🇬🇧 EN</button>
        </div>
      </div>

      <h1 style={{ fontSize: 30, margin: "16px 0 4px", fontStyle: "italic" }}>👤 {t.title}</h1>
      <p style={{ color: "#AAA", margin: 0 }}>{t.subtitle}</p>

      <div style={{ backgroundColor: "#1A1A1A", padding: 20, borderRadius: 18, marginTop: 18, textAlign: "center", border: "1px solid #22FF00" }}>
        <div style={{ fontSize: 42, fontWeight: 900, fontStyle: "italic" }}>FIT <span style={{ color: "#22FF00" }}>PRO</span></div>
        <div style={{ fontSize: 13, color: "#AAA", marginBottom: 12 }}>Plus fort. Plus sain. Plus heureux.</div>

        <div onClick={() => fileRef.current?.click()} style={{ width: 130, height: 130, borderRadius: 65, backgroundColor: "#333", margin: "0 auto", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, cursor: "pointer", border: "3px solid #22FF00" }}>
          {photo ? <img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} style={{ display: "none" }} />
        <button onClick={() => fileRef.current?.click()} style={{ marginTop: 10, padding: "8px 14px", borderRadius: 20, border: "none", backgroundColor: "#333", color: "white", fontWeight: "bold" }}>{t.changePhoto}</button>

        <h2 style={{ margin: "12px 0 0" }}>{name} ✅</h2>
        <p style={{ color: "#22FF00", margin: "4px 0" }}>{goal} • {weight} kg</p>
        <div style={{ border: "2px solid #ffcc00", color: "#ffcc00", padding: "6px 14px", borderRadius: 20, display: "inline-block", marginTop: 8, fontWeight: "bold" }}>👑 Premium</div>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <div style={{ flex: 1, backgroundColor: "#222", padding: 12, borderRadius: 12 }}><b>850 kcal</b><br /><span style={{ color: "#AAA", fontSize: 13 }}>Calories</span></div>
          <div style={{ flex: 1, backgroundColor: "#222", padding: 12, borderRadius: 12 }}><b>1h 20min</b><br /><span style={{ color: "#AAA", fontSize: 13 }}>Temps</span></div>
          <div style={{ flex: 1, backgroundColor: "#222", padding: 12, borderRadius: 12 }}><b>24</b><br /><span style={{ color: "#AAA", fontSize: 13 }}>{t.workouts}</span></div>
          <div style={{ flex: 1, backgroundColor: "#222", padding: 12, borderRadius: 12 }}><b>92%</b><br /><span style={{ color: "#AAA", fontSize: 13 }}>Progression</span></div>
        </div>
      </div>

      <div style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16, marginTop: 14, display: "flex", flexDirection: "column", gap: 12, border: "1px solid #22FF00" }}>
        <label>{t.name}<input value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", backgroundColor: "#333", color: "white", marginTop: 6, boxSizing: "border-box" }} /></label>
        <label>{t.weight}<input value={weight} onChange={e => setWeight(e.target.value)} inputMode="numeric" style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", backgroundColor: "#333", color: "white", marginTop: 6, boxSizing: "border-box" }} /></label>
        <label>{t.goal}
          <select value={goal} onChange={e => setGoal(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", backgroundColor: "#333", color: "white", marginTop: 6 }}>
            <option>Prise de masse</option><option>Perte de poids</option><option>Force</option><option>Endurance</option>
          </select>
        </label>
        <button onClick={save} style={{ width: "100%", backgroundColor: "#22FF00", color: "#000", padding: 16, borderRadius: 25, fontSize: 18, fontWeight: 900, border: "none", marginTop: 4 }}>{t.save}</button>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#111", borderTop: "2px solid #22FF00", display: "flex", justifyContent: "space-around", padding: "10px 0", textAlign: "center", fontSize: 12 }}>
        <Link href="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>🏠<br />Accueil</Link>
        <Link href="/entrainement" style={{ color: "#fff", textDecoration: "none" }}>🏋️<br />Entraînement</Link>
        <Link href="/nutrition" style={{ color: "#fff", textDecoration: "none" }}>🍎<br />Nutrition</Link>
        <Link href="/progres" style={{ color: "#fff", textDecoration: "none" }}>📊<br />Progrès</Link>
        <Link href="/profile" style={{ color: "#22FF00", textDecoration: "none", fontWeight: "bold" }}>⚙️<br />Paramètres</Link>
      </div>
    </div>
  );
      }
