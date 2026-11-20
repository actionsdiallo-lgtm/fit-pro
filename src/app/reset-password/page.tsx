"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  useEffect(() => {
    supabase.auth.getSession();
  }, []);
  async function change() {
    if (password.length < 6) return setMsg("Le mot de passe doit faire 6 caractères minimum");
    setMsg("Changement en cours...");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMsg("Erreur: " + error.message);
    else { setMsg("✅ Mot de passe changé !"); setTimeout(() => { window.location.href = "/login"; }, 1500); }
  }
  return (
    <div style={{ background: "black", minHeight: "100vh", color: "white", padding: 20, paddingTop: 60 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, textAlign: "center" }}>Nouveau mot de passe</h1>
      <p style={{ color: "#aaa", textAlign: "center", marginTop: 10 }}>Choisis ton nouveau mot de passe.</p>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nouveau mot de passe" style={{ width: "100%", background: "#222", border: "1px solid #333", color: "white", borderRadius: 12, padding: 14, marginTop: 25, boxSizing: "border-box" }} />
      <button onClick={change} style={{ width: "100%", background: "#22c55e", color: "black", fontWeight: 800, padding: 15, borderRadius: 12, border: "none", marginTop: 15, fontSize: 16 }}>CHANGER MON MOT DE PASSE</button>
      {msg && <p style={{ textAlign: "center", marginTop: 15, color: "#22c55e" }}>{msg}</p>}
    </div>
  );
}
