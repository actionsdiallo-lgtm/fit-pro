"use client";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("Diallo");
  const [goal, setGoal] = useState("Prise de Masse");
  const [weight, setWeight] = useState("75");
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ padding: 16, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>← Retour Dashboard</Link>
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <div style={{ fontSize: 70 }}>👤</div>
        <h1 style={{ margin: "10px 0 5px" }}>{name}</h1>
        <p style={{ color: "#AAA", margin: 0 }}>Membre FitPro • {goal}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 16 }}>
        <div style={{ backgroundColor: "#1A1A1A", padding: 12, borderRadius: 14, textAlign: "center" }}><b style={{ color: "#00FF88", fontSize: 20 }}>42</b><p style={{ margin: 0, color: "#AAA", fontSize: 12 }}>Séances</p></div>
        <div style={{ backgroundColor: "#1A1A1A", padding: 12, borderRadius: 14, textAlign: "center" }}><b style={{ color: "#00FF88", fontSize: 20 }}>12</b><p style={{ margin: 0, color: "#AAA", fontSize: 12 }}>Semaines</p></div>
        <div style={{ backgroundColor: "#1A1A1A", padding: 12, borderRadius: 14, textAlign: "center" }}><b style={{ color: "#00FF88", fontSize: 20 }}>🔥 7</b><p style={{ margin: 0, color: "#AAA", fontSize: 12 }}>Série</p></div>
      </div>

      <div style={{ marginTop: 16, backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16 }}>
        <h3 style={{ marginTop: 0 }}>Modifier mon profil</h3>
        <label>Nom</label>
        <input value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", margin: "6px 0 12px", backgroundColor: "#333", color: "white" }} />
        <label>Poids (kg)</label>
        <input value={weight} onChange={e => setWeight(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", margin: "6px 0 12px", backgroundColor: "#333", color: "white" }} />
        <label>Objectif</label>
        <select value={goal} onChange={e => setGoal(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", margin: "6px 0 12px", backgroundColor: "#333", color: "white" }}>
          <option>Prise de Masse</option>
          <option>Perte de Poids</option>
          <option>Force & Performance</option>
          <option>Débutant Total</option>
        </select>
        <button onClick={() => setSaved(true)} style={{ width: "100%", backgroundColor: "#00FF88", color: "black", padding: 14, borderRadius: 12, fontWeight: "bold", border: "none" }}>Enregistrer</button>
        {saved && <p style={{ color: "#00FF88", textAlign: "center", marginTop: 10 }}>✅ Profil enregistré ! Poids : {weight} kg • Objectif : {goal}</p>}
      </div>
    </div>
  );
        }
