"use client";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div style={{ padding: 16, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>Salut Diallo 👋</h1>
          <p style={{ color: "#AAA", margin: "4px 0" }}>Prêt à transpirer aujourd'hui ?</p>
        </div>
        <Link href="/profile" style={{ backgroundColor: "#222", color: "white", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, textDecoration: "none" }}>👤</Link>
      </div>

      <div style={{ marginTop: 16, padding: 20, backgroundColor: "#00FF88", borderRadius: 20, color: "black" }}>
        <p style={{ margin: 0, fontWeight: "bold" }}>🔥 OBJECTIF DU JOUR</p>
        <h2 style={{ margin: "8px 0" }}>Séance Full Body - 30 min</h2>
        <Link href="/workouts" style={{ backgroundColor: "black", color: "white", padding: "10px 18px", borderRadius: 20, textDecoration: "none", fontWeight: "bold", display: "inline-block" }}>Commencer →</Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <div style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16 }}><p style={{ margin: 0 }}>🔥 Calories</p><h2 style={{ margin: "4px 0", color: "#00FF88" }}>1,240</h2><p style={{ color: "#AAA", margin: 0, fontSize: 13 }}>Objectif 2,500</p></div>
        <div style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16 }}><p style={{ margin: 0 }}>🏋️ Séances</p><h2 style={{ margin: "4px 0", color: "#00FF88" }}>5 / 7</h2><p style={{ color: "#AAA", margin: 0, fontSize: 13 }}>Cette semaine</p></div>
        <div style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16 }}><p style={{ margin: 0 }}>⚖️ Poids</p><h2 style={{ margin: "4px 0", color: "#00FF88" }}>78 kg</h2><p style={{ color: "#AAA", margin: 0, fontSize: 13 }}>+3 kg 💪</p></div>
        <div style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16 }}><p style={{ margin: 0 }}>⏱ Temps</p><h2 style={{ margin: "4px 0", color: "#00FF88" }}>4h 10</h2><p style={{ color: "#AAA", margin: 0, fontSize: 13 }}>Cette semaine</p></div>
      </div>

      <h3 style={{ marginTop: 20 }}>Accès rapide</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Link href="/workouts" style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16, color: "white", textDecoration: "none" }}>🏋️<br /><b>Entraînements</b></Link>
        <Link href="/nutrition" style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16, color: "white", textDecoration: "none" }}>🥗<br /><b>Nutrition</b></Link>
        <Link href="/programs" style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16, color: "white", textDecoration: "none" }}>📋<br /><b>Programmes</b></Link>
        <Link href="/statistics" style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16, color: "white", textDecoration: "none" }}>📊<br /><b>Statistiques</b></Link>
        <Link href="/actualites" style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16, color: "white", textDecoration: "none" }}>📰<br /><b>Actualités</b></Link>
        <Link href="/profile" style={{ backgroundColor: "#1A1A1A", padding: 16, borderRadius: 16, color: "white", textDecoration: "none" }}>👤<br /><b>Profil</b></Link>
      </div>
    </div>
  );
          }
