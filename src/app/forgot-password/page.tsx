"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function send() {
    if (!email) return setMsg("Mets ton email d'abord");
    setMsg("Envoi en cours...");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setMsg(error ? "Erreur: " + error.message : "✅ Mail envoyé ! Vérifie ta boîte Gmail, même dans SPAM.");
  }

  return (
    <div style={{ background: "black", minHeight: "100vh", color: "white", padding: 20, paddingTop: 60 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, textAlign: "center" }}>Mot de passe oublié ?</h1>
      <p style={{ color: "#aaa", textAlign: "center", marginTop: 10 }}>On va t'envoyer un lien pour le changer.</p>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Ton email"
        style={{ width: "100%", background: "#222", border: "1px solid #333", color: "white", borderRadius: 12, padding: 14, marginTop: 25, boxSizing: "border-box" }}
      />
      <button onClick={send} style={{ width: "100%", background: "#22c55e", color: "black", fontWeight: 800, padding: 15, borderRadius: 12, border: "none", marginTop: 15, fontSize: 16 }}>
        ENVOYER LE LIEN
      </button>
      {msg && <p style={{ textAlign: "center", marginTop: 15, color: "#22c55e" }}>{msg}</p>}
      <p style={{ textAlign: "center", marginTop: 20 }}><a href="/login" style={{ color: "#22c55e" }}>← Retour à la connexion</a></p>
    </div>
  );
      }
