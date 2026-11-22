"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = (searchParams.get("token") || "").trim();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!token) {
      setError(
        "Lien de réinitialisation manquant ou invalide. Veuillez demander un nouveau lien."
      );
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Impossible de réinitialiser le mot de passe."
        );
        return;
      }

      setSuccessMessage(
        typeof data?.message === "string"
          ? data.message
          : "Votre mot de passe a bien été mis à jour."
      );
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "48px auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        Nouveau mot de passe — FIT PRO
      </h1>
      <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 24 }}>
        Choisissez un nouveau mot de passe pour votre compte. Votre identifiant,
        vos programmes, votre historique et votre abonnement restent inchangés.
      </p>

      {!token ? (
        <div
          style={{
            padding: 16,
            borderRadius: 8,
            border: "1px solid #d97706",
            background: "#fffbeb",
            color: "#92400e",
            marginBottom: 16,
          }}
        >
          Aucun jeton valide détecté dans le lien. Ouvrez le lien reçu par
          e-mail ou demandez-en un nouveau.
        </div>
      ) : null}

      {error ? (
        <div
          style={{
            padding: 14,
            borderRadius: 8,
            border: "1px solid #dc2626",
            background: "#fef2f2",
            color: "#991b1b",
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div
          style={{
            padding: 16,
            borderRadius: 8,
            border: "1px solid #16a34a",
            background: "#f0fdf4",
            color: "#166534",
            marginBottom: 16,
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>{successMessage}</p>
          <p style={{ marginTop: 12, marginBottom: 0 }}>
            <Link href="/" style={{ fontWeight: 700, textDecoration: "underline" }}>
              Retourner à FIT PRO
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label
              htmlFor="new-password"
              style={{ display: "block", fontSize: 14, marginBottom: 6 }}
            >
              Nouveau mot de passe (8 caractères minimum)
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                fontSize: 15,
              }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label
              htmlFor="confirm-password"
              style={{ display: "block", fontSize: 14, marginBottom: 6 }}
            >
              Confirmer le nouveau mot de passe
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                fontSize: 15,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 8,
              border: "none",
              background: "#111827",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 600,
              cursor: loading || !token ? "not-allowed" : "pointer",
              opacity: loading || !token ? 0.6 : 1,
            }}
          >
            {loading ? "Mise à jour..." : "Enregistrer le mot de passe"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div style={{ maxWidth: 420, margin: "48px auto", padding: 24 }}>
          Chargement...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
  
