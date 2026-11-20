"use client";
import Link from "next/link";
import { useState } from "react";
export default function Forgot() {
  const [email, setEmail] = useState("actionsdiallo@gmail.com");
  const [ok, setOk] = useState(false);
  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: 20, fontFamily: "Arial" }}>
      <Link href="/" style={{ color: "#22FF00", fontWeight: "bold", textDecoration: "none" }}>← Retour</Link>
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <div style={{ fontSize: 42, fontWeight: 900, fontStyle: "italic" }}>FIT <span style={{ color: "#22FF00" }}>PRO</span></div>
        <h1>🔑 Mot de passe oublié ?</h1>
        <p style={{ color: "#AAA" }}>Mets ton email, on te laisse créer un nouveau mot de passe.</p>
      </div>
      {!ok ? (
        <div style={{ background: "#1A1A1A", padding: 20, borderRadius: 16, border: "1px solid #22FF00", marginTop: 20 }}>
          <label>E-mail</label>
          <input value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: 14, borderRadius: 10, border: "none", background: "#333", color: "#fff", marginTop: 8, boxSizing: "border-box" }} />
          <button onClick={() => setOk(true)} style={{ width: "100%", background: "#22FF00", color: "#000", padding: 16, borderRadius: 25, fontWeight: 900, border: "none", marginTop: 16, fontSize: 16 }}>📩 Envoyer le lien</button>
        </div>
      ) : (
        <div style={{ background: "#1A1A1A", padding: 20, borderRadius: 16, border: "1px solid #22FF00", textAlign: "center", marginTop: 20 }}>
          <div style={{ fontSize: 50 }}>✅</div>
          <h2>C'est bon !</h2>
          <p style={{ color: "#AAA" }}>Va dans ton Gmail <b style={{ color: "#fff" }}>{email}</b> et crée un nouveau mot de passe.</p>
          <Link href="/" style={{ background: "#22FF00", color: "#000", padding: "12px 20px", borderRadius: 25, display: "inline-block", textDecoration: "none", fontWeight: 900, marginTop: 10 }}>Retour Connexion</Link>
        </div>
      )}
    </div>
  );
}
