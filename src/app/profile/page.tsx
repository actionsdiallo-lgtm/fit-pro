"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function MonProfil() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ full_name: "", phone: "", age: "", poids: "", taille: "", objectif: "Prise de masse" });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUser(user);
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setForm({
        full_name: data.full_name || "",
        phone: data.phone || "",
        age: data.age?.toString() || "",
        poids: data.poids?.toString() || "",
        taille: data.taille?.toString() || "",
        objectif: data.objectif || "Prise de masse",
      });
      setLoading(false);
    }
    load();
  }, []);

  async function save() {
    if (!user) return alert("Connecte-toi d'abord");
    setMsg("Enregistrement...");
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: form.full_name,
      phone: form.phone,
      age: Number(form.age) || null,
      poids: Number(form.poids) || null,
      taille: Number(form.taille) || null,
      objectif: form.objectif,
    });
    setMsg(error ? "Erreur: " + error.message : "✅ Enregistré ! C'est tes données.");
  }

  if (loading) return <div style={{ background: "black", color: "white", minHeight: "100vh", padding: 20 }}>Chargement de ton profil...</div>;
  if (!user) return <div style={{ background: "black", color: "white", minHeight: "100vh", padding: 20 }}>Connecte-toi pour voir TON profil. <a href="/login" style={{ color: "#22c55e" }}>Se connecter</a></div>;

  const inputStyle: any = { width: "100%", background: "#1a1a1a", border: "1px solid #333", color: "white", borderRadius: 10, padding: "12px", marginTop: 4, boxSizing: "border-box" as any };

  return (
    <div style={{ background: "black", minHeight: "100vh", color: "white", padding: 20, paddingBottom: 110 }}>
      <h1 style={{ textAlign: "center", fontSize: 26, fontWeight: 800 }}>Mon profil</h1>
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <div style={{ width: 90, height: 90, borderRadius: 45, background: "#22c55e", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>👤</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 10 }}>{form.full_name || "Champion"} ✅</div>
        <div style={{ color: "#22c55e" }}>Sport Passionné</div>
        <div style={{ display: "inline-block", background: "#332200", color: "#facc15", padding: "6px 14px", borderRadius: 20, marginTop: 8, fontWeight: 700 }}>👑 Premium</div>
      </div>

      <div style={{ background: "#111", border: "1px solid #22c55e", borderRadius: 16, padding: 16, marginTop: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>👤 Informations personnelles</h2>
        <p style={{ fontSize: 13, color: "#888" }}>Nom et prénom</p><input style={inputStyle} value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="Ton nom" />
        <p style={{ fontSize: 13, color: "#888", marginTop: 12 }}>E-mail</p><input style={{ ...inputStyle, opacity: 0.6 }} value={user.email} disabled />
        <p style={{ fontSize: 13, color: "#888", marginTop: 12 }}>Téléphone</p><input style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+221 77 ..." />
        <p style={{ fontSize: 13, color: "#888", marginTop: 12 }}>Âge</p><input style={inputStyle} value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="25" />
        <p style={{ fontSize: 13, color: "#888", marginTop: 12 }}>Poids (kg)</p><input style={inputStyle} value={form.poids} onChange={e => setForm({ ...form, poids: e.target.value })} placeholder="75" />
        <p style={{ fontSize: 13, color: "#888", marginTop: 12 }}>Taille (cm)</p><input style={inputStyle} value={form.taille} onChange={e => setForm({ ...form, taille: e.target.value })} placeholder="178" />
        <p style={{ fontSize: 13, color: "#888", marginTop: 12 }}>Objectif sportif</p>
        <select style={inputStyle} value={form.objectif} onChange={e => setForm({ ...form, objectif: e.target.value })}>
          <option>Prise de masse</option><option>Perte de poids</option><option>Endurance</option><option>Maintien</option>
        </select>
      </div>

      <button onClick={save} style={{ width: "100%", background: "#22c55e", color: "black", fontWeight: 800, fontSize: 17, padding: 16, borderRadius: 14, border: "none", marginTop: 20 }}>💾 Enregistrer les modifications</button>
      {msg && <p style={{ textAlign: "center", marginTop: 10, color: "#22c55e" }}>{msg}</p>}
    </div>
  );
                                          }
