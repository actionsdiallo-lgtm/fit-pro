"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [goal, setGoal] = useState("Prise de masse");
  const router = useRouter();

  const input = { width: "100%", padding: 14, borderRadius: 12, border: "1px solid #333", backgroundColor: "#1A1A1A", color: "white", marginBottom: 12, fontSize: 15, boxSizing: "border-box" as const };

  const handleRegister = () => {
    if (!name || !email) { alert("Remplis ton nom et email"); return; }
    localStorage.setItem("fitpro-name", name);
    localStorage.setItem("fitpro-email", email);
    localStorage.setItem("fitpro-goal", goal);
    router.push("/dashboard");
  };

  return (
    <div style={{ padding: 20, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <h1 style={{ fontSize: 28 }}>Créer un compte 💪</h1>
      <p style={{ color: "#AAA" }}>Rejoins FitPro</p>
      <input style={input} placeholder="Ton nom - ex: Diallo" value={name} onChange={e => setName(e.target.value)} />
      <input style={input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input style={input} type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
      <p style={{ fontWeight: "bold" }}>Ton objectif :</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["Prise de masse", "Perte de poids", "Forme"].map(g => (
          <button key={g} onClick={() => setGoal(g)} style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", backgroundColor: goal === g ? "#00FF88" : "#333", color: goal === g ? "black" : "white", fontWeight: "bold" }}>{g}</button>
        ))}
      </div>
      <button onClick={handleRegister} style={{ width: "100%", padding: 15, borderRadius: 12, border: "none", backgroundColor: "#00FF88", color: "black", fontWeight: "bold", fontSize: 16 }}>S&apos;inscrire</button>
      <p style={{ textAlign: "center", marginTop: 16 }}>Déjà un compte ? <Link href="/login" style={{ color: "#00FF88" }}>Se connecter</Link></p>
    </div>
  );
            }
