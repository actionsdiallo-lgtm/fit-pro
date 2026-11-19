"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const input = { width: "100%", padding: 14, borderRadius: 12, border: "1px solid #333", backgroundColor: "#1A1A1A", color: "white", marginBottom: 12, fontSize: 15, boxSizing: "border-box" as const };

  const handleLogin = () => {
    if (!email) { alert("Mets ton email"); return; }
    localStorage.setItem("fitpro-email", email);
    router.push("/dashboard");
  };

  return (
    <div style={{ padding: 20, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white" }}>
      <h1 style={{ fontSize: 28 }}>Bon retour 💪</h1>
      <p style={{ color: "#AAA" }}>Connecte-toi à FitPro</p>
      <label style={{ display: "block", marginBottom: 6, marginTop: 20 }}>Email</label>
      <input style={input} placeholder="Ton email" value={email} onChange={e => setEmail(e.target.value)} />
      <label style={{ display: "block", marginBottom: 6 }}>Mot de passe</label>
      <input style={input} type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin} style={{ width: "100%", padding: 15, borderRadius: 12, border: "none", backgroundColor: "#00FF88", color: "black", fontWeight: "bold", fontSize: 16, marginTop: 10 }}>Se connecter</button>
      <p style={{ textAlign: "center", marginTop: 16 }}>Pas encore de compte ? <Link href="/register" style={{ color: "#00FF88" }}>S&apos;inscrire</Link></p>
    </div>
  );
}
