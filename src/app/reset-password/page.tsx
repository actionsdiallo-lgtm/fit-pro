"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  function setSuccess(text: string) {
    setIsError(false);
    setMsg(text);
  }

  function setFailure(text: string) {
    setIsError(true);
    setMsg(text);
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setIsError(false);

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = otpCode.replace(/\D/g, "").trim();

    if (!cleanEmail) {
      setFailure("Saisis ton adresse e-mail.");
      return;
    }

    if (!/^\d{6}$/.test(cleanCode)) {
      setFailure("Saisis le code de vérification à 6 chiffres reçu par e-mail.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, code: cleanCode }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.verified) {
        setFailure(data?.error || "Code à 6 chiffres invalide ou expiré.");
        return;
      }

      setCodeVerified(true);
      setSuccess(
        data?.message ||
          "Code vérifié. Choisis maintenant ton nouveau mot de passe."
      );
    } catch {
      setFailure("Erreur réseau lors de la vérification du code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    setMsg("");
    setIsError(false);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setFailure("Saisis ton adresse e-mail pour renvoyer un code.");
      return;
    }

    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setFailure(data?.error || "Impossible de renvoyer le code.");
        return;
      }

      setCodeVerified(false);
      setOtpCode("");
      setSuccess(
        data?.message ||
          `Un nouveau code à 6 chiffres a été envoyé à ${cleanEmail} (valable 10 minutes).`
      );
    } catch {
      setFailure("Erreur réseau lors du renvoi du code.");
    } finally {
      setResending(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setIsError(false);

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = otpCode.replace(/\D/g, "").trim();

    if (!cleanEmail || !/^\d{6}$/.test(cleanCode)) {
      setFailure("Vérifie d'abord ton adresse e-mail et ton code à 6 chiffres.");
      setCodeVerified(false);
      return;
    }

    if (password.length < 6) {
      setFailure("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setFailure("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          code: cleanCode,
          newPassword: password,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setFailure(data?.error || "Impossible de mettre à jour le mot de passe.");
        return;
      }

      setOtpCode("");
      setPassword("");
      setConfirmPassword("");
      setSuccess(
        data?.message ||
          "Mot de passe mis à jour ! Toutes tes données sont conservées. Redirection..."
      );

      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 1500);
    } catch {
      setFailure("Impossible de mettre à jour le mot de passe. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    background: "#0A0F0D",
    border: "1px solid #1E2A24",
    borderRadius: 12,
    padding: "14px",
    color: "#fff",
    fontSize: 15,
    width: "100%",
    boxSizing: "border-box" as const,
  };

  const buttonStyle = {
    background: "#00FF88",
    color: "#000",
    border: "none",
    borderRadius: 12,
    padding: "16px",
    fontWeight: 900,
    fontSize: 15,
    marginTop: 6,
    width: "100%",
  };

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
      <div style={{ maxWidth: 440, width: "100%", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>
            Nouveau mot de passe
          </h1>
          <p style={{ margin: "8px 0 0", color: "#8A9A8F", fontSize: 14 }}>
            Récupération par code à 6 chiffres (valable 10 minutes, usage unique).
            Tes données restent inchangées.
          </p>
        </div>

        <div
          style={{
            background: "#101613",
            borderRadius: 20,
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {!codeVerified ? (
            <form
              onSubmit={handleVerifyCode}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <label style={{ fontSize: 13, color: "#8A9A8F" }}>
                Adresse e-mail
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@gmail.com"
                style={inputStyle}
              />

              <label style={{ fontSize: 13, color: "#8A9A8F" }}>
                Code à 6 chiffres
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) =>
                  setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="123456"
                style={{
                  ...inputStyle,
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: 8,
                }}
              />

              <button
                type="submit"
                disabled={loading}
                style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "VÉRIFICATION..." : "VÉRIFIER LE CODE"}
              </button>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <button
                  type="button"
                  disabled={resending}
                  onClick={handleResendCode}
                  style={{
                    flex: 1,
                    background: "#0A0F0D",
                    color: "#00FF88",
                    border: "1px solid #1E2A24",
                    borderRadius: 10,
                    padding: "10px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {resending ? "Renvoi..." : "Renvoyer un code"}
                </button>
                <Link
                  href="/forgot-password"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    background: "#0A0F0D",
                    color: "#b7c7bd",
                    border: "1px solid #1E2A24",
                    borderRadius: 10,
                    padding: "10px 12px",
                    fontSize: 12,
                    textDecoration: "none",
                  }}
                >
                  Demander un code
                </Link>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleUpdatePassword}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <label style={{ fontSize: 13, color: "#8A9A8F" }}>
                Nouveau mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Au moins 6 caractères"
                style={inputStyle}
              />

              <label style={{ fontSize: 13, color: "#8A9A8F" }}>
                Confirmer le mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répète le mot de passe"
                style={inputStyle}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  background: "#0A0F0D",
                  color: "#8A9A8F",
                  border: "1px solid #1E2A24",
                  borderRadius: 10,
                  padding: "8px 12px",
                  fontSize: 12,
                  alignSelf: "flex-start",
                }}
              >
                {showPassword ? "Masquer" : "Afficher les mots de passe"}
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "ENREGISTREMENT..." : "VALIDER LE MOT DE PASSE"}
              </button>
            </form>
          )}

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
        </div>
      </div>
    </main>
  );
        }
        
