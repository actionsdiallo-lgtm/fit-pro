"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const [profil, setProfil] = useState({
    nom_prenom: "",
    email: "",
    telephone: "",
    age: "",
    poids: "",
    taille: "",
    objectif: "Prise de masse"
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfil({
          nom_prenom: data.nom_prenom || "",
          email: data.email || user.email || "",
          telephone: data.telephone || "",
          age: data.age ? String(data.age) : "",
          poids: data.poids ? String(data.poids) : "",
          taille: data.taille || "",
          objectif: data.objectif || "Prise de masse"
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  async function save() {
    setMsg("Enregistrement...");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMsg("Tu dois être connecté"); return; }
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      nom_prenom: profil.nom_prenom,
      email: profil.email,
      telephone: profil.telephone,
      age: profil.age ? parseInt(profil.age) : null,
      poids: profil.poids ? parseFloat(profil.poids) : null,
      taille: profil.taille,
      objectif: profil.objectif
    });
    if (error) setMsg("Erreur: " + error.message);
    else setMsg("✅ Enregistré ! C'est tes vraies données.");
  }

  if (loading) return <p style={{ padding: 20 }}>Chargement de TES données...</p>;

  const input = {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
    background: "#fff",
    color: "#000"
  };

  return (
    <div style={{ padding: 16, maxWidth: 500, margin: "0 auto" }}>
      <Link href="/dashboard">← Retour Dashboard</Link>
      <h1>Mon Profil</h1>
      <p>Gère tes infos</p>

      <input style={input} placeholder="Nom" value={profil.nom_prenom} onChange={(e) => setProfil({ ...profil, nom_prenom: e.target.value })} />
      <input style={input} placeholder="E-mail" value={profil.email} onChange={(e) => setProfil({ ...profil, email: e.target.value })} />
      <input style={input} placeholder="Téléphone" value={profil.telephone} onChange={(e) => setProfil({ ...profil, telephone: e.target.value })} />
      <input style={input} placeholder="Âge" value={profil.age} onChange={(e) => setProfil({ ...profil, age: e.target.value })} />
      <input style={input} placeholder="Poids (kg)" value={profil.poids} onChange={(e) => setProfil({ ...profil, poids: e.target.value })} />
      <input style={input} placeholder="Taille (ex: 1m78)" value={profil.taille} onChange={(e) => setProfil({ ...profil, taille: e.target.value })} />

      <select style={input} value={profil.objectif} onChange={(e) => setProfil({ ...profil, objectif: e.target.value })}>
        <option>Prise de masse</option>
        <option>Perte de poids</option>
        <option>Maintien</option>
        <option>Endurance</option>
      </select>

      <button onClick={save} style={{ width: "100%", padding: 14, background: "#000", color: "#fff", borderRadius: 10, fontWeight: "bold" }}>
        💾 Enregistrer les modifications
      </button>
      <p>{msg}</p>
    </div>
  );
      }
