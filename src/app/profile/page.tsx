"use client";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("Diallo");
  const [goal, setGoal] = useState("Prise de Masse");
  const [weight, setWeight] = useState("75");
  return (
    <div style={{ padding: 16, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <Link href="/dashboard" style={{ color: "#00FF88", textDecoration: "none" }}>← Retour Dashboard</Link>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <div style={{ fontSize: 70 }}>👤</div>
        <h1 style={{ margin: "10px 0 5px" }}>{name}</h1>
        <p style={{ color: "#A7F3D0" }}>Membre FitPro • Niveau Intermédiaire</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <div style={{ flex: 1, backgroundColor: "#1A1A1A", padding: 14, borderRadius: 16, textAlign: "center" }}><h3 style={{ margin: 0, color: "#00FF88" }}>128</h3><p style={{ margin: 0, color: "#AAA" }}>Séances</p></div>
        <div style={{ flex: 1, backgroundColor: "#1A1A1A", padding: 14, borderRadius: 16, textAlign: "center" }}><h3 style={{ margin: 0, color: "#00FF88" }}>12</h3><p style={{ margin: 0, color: "#AAA" }}>Semaines</p></div>
        <div style={{ flex: 1, backgroundColor: "#1A1A1A", padding: 14, borderRadius: 16, textAlign: "center" }}><h3 style={{ margin: 0, color: "#00FF88" }}>85%</h3><p style={{ margin: 0, color: "#AAA" }}>Régularité</p></div>
      </div>

      <div style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16, marginTop: 16 }}>
        <h3>Modifier mon profil</h3>
        <p style={{ color: "#AAA" }}>Nom</p>
        <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", backgroundColor: "#222", color: "white", marginBottom: 10 }} />
        <p style={{ color: "#AAA" }}>Objectif</p>
        <select value={goal} onChange={(e) => setGoal(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", backgroundColor: "#222", color: "white", marginBottom: 10 }}>
          <option>Prise de Masse</option>
          <option>Perte de Poids</option>
          <option>Force</option>
        </select>
        <p style={{ color: "#AAA" }}>Poids (kg)</p>
        <input value={weight} onChange={(e) => setWeight(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", backgroundColor: "#222", color: "white" }} />
        <p style={{ marginTop: 10 }}>Objectif actuel : <b style={{ color: "#00FF88" }}>{goal} • {weight} kg</b></p>
      </div>

      <Link href="/login" style={{ display: "block", textAlign: "center", marginTop: 16, backgroundColor: "#FF4444", color: "white", padding: 14, borderRadius: 14, fontWeight: "bold", textDecoration: "none" }}>Déconnexion</Link>
    </div>
  );
                                                     }
