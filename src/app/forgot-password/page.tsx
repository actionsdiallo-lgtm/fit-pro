"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function send() {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setIsError(true);
      setMsg("Mets ton email d'abord.");
      return;
    }

    setLoading(true);
    setIsError(false);
    setMsg("Envoi en cours...");

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: origin ? `${origin}/reset-password` : undefined,
      });

      if (error) {
        setIsError(true);
        setMsg("Erreur : " + error.message);
        return;
      }

      setIsError(false);
      setMsg(
        "✅ Demande envoyée ! Vérifie ta boîte mail, l'onglet Promotions et le dossier SPAM."
      );
    } catch {
      setIsError(true);
      setMsg("Erreur réseau ou configuration Supabase manquante.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: "black",
        minHeight: "100vh",
        color: "white",
        padding: 20,
        paddingTop: 60,
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 800, textAlign: "center" }}>
        Mot de passe oublié ?
      </h1>
      <p style={{ color: "#aaa", textAlign: "center", marginTop: 10 }}>
        On va t&apos;envoyer un lien pour le changer.
      </p>

      <input
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Ton email"
        style={{
          width: "100%",
          background: "#222",
          border: "1px solid #333",
          color: "white",
          borderRadius: 12,
          padding: 14,
          marginTop: 25,
          boxSizing: "border-box",
        }}
      />

      <button
        type="button"
        disabled={loading}
        onClick={send}
        style={{
          width: "100%",
          background: "#22c55e",
          color: "black",
          fontWeight: 800,
          padding: 15,
          borderRadius: 12,
          border: "none",
          marginTop: 15,
          fontSize: 16,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "ENVOI..." : "ENVOYER LE LIEN"}
      </button>

      {msg && (
        <p
          style={{
            textAlign: "center",
            marginTop: 15,
            color: isError ? "#f87171" : "#22c55e",
          }}
        >
          {msg}
        </p>
      )}

      <p style={{ textAlign: "center", marginTop: 20 }}>
        <a href="/login" style={{ color: "#22c55e" }}>
          ← Retour à la connexion
        </a>
      </p>
    </div>
  );
      }
        
