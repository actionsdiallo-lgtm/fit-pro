"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (active && data.session) {
        setReady(true);
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setReady(true);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setIsError(false);

    if (password.length < 6) {
      setIsError(true);
      setMsg("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setIsError(true);
      setMsg("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setIsError(true);
        setMsg("Erreur : " + error.message);
        return;
      }

      setIsError(false);
      setMsg("✅ Mot de passe mis à jour ! Redirection vers la connexion...");
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 1500);
    } catch {
      setIsError(true);
      setMsg("Impossible de mettre à jour le mot de passe. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        background: "#040706",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "system-ui",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>
          Nouveau mot de passe
        </h1>
        <p style={{ margin: "8px 0 0", color: "#8A9A8F", fontSize: 14 }}>
          Choisis un nouveau mot de passe pour ton compte FIT PRO.
        </p>
      </div>

      <form
        onSubmit={handleUpdatePassword}
        style={{
          background: "#101613",
          borderRadius: 20,
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {!ready && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid #26332c",
              borderRadius: 12,
              padding: "10px 12px",
              fontSize: 13,
              color: "#b7c7bd",
            }}
          >
            Ouvre cette page directement depuis le lien reçu par e-mail pour activer la réinitialisation.
          </div>
        )}

        <label style={{ fontSize: 13, color: "#8A9A8F" }}>Nouveau mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Au moins 6 caractères"
          style={{
            background: "#0A0F0D",
            border: "1px solid #1E2A24",
            borderRadius: 12,
            padding: "14px",
            color: "#fff",
            fontSize: 15,
            width: "100%",
            boxSizing: "border-box",
          }}
        />

        <label style={{ fontSize: 13, color: "#8A9A8F" }}>Confirmer le mot de passe</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Répète le mot de passe"
          style={{
            background: "#0A0F0D",
            border: "1px solid #1E2A24",
            borderRadius: 12,
            padding: "14px",
            color: "#fff",
            fontSize: 15,
            width: "100%",
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#00FF88",
            color: "#000",
            border: "none",
            borderRadius: 12,
            padding: "16px",
            fontWeight: 900,
            fontSize: 15,
            marginTop: 6,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "ENREGISTREMENT..." : "VALIDER LE MOT DE PASSE"}
        </button>

        {msg && (
          <p
            style={{
              textAlign: "center",
              marginTop: 8,
              fontSize: 13,
              color: isError ? "#f87171" : "#22c55e",
            }}
          >
            {msg}
          </p>
        )}

        <Link
          href="/login"
          style={{
            textAlign: "center",
            display: "block",
            marginTop: 8,
            color: "#00FF88",
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          ← Retour à la connexion
        </Link>
      </form>
    </main>
  );
          }
