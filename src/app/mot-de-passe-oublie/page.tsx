"use client";

import React, { useState } from "react";
import Link from "next/link";

type Step = "request" | "verify" | "reset" | "done";

export default function MotDePasseOubliePage() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function clearMessages() {
    setStatusMessage(null);
    setErrorMessage(null);
  }

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    clearMessages();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage("Veuillez saisir votre adresse Gmail.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setErrorMessage(
          data?.error || "Impossible d'envoyer le code de vérification."
        );
        return;
      }

      setOtpCode("");
      setStatusMessage(
        data?.message ||
          `Un code à 6 chiffres a été envoyé à ${cleanEmail} (valable 10 minutes).`
      );
      setStep("verify");
    } catch {
      setErrorMessage("Erreur réseau lors de l'envoi du code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    clearMessages();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage("Veuillez saisir votre adresse Gmail.");
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
        setErrorMessage(
          data?.error || "Impossible de renvoyer le code de vérification."
        );
        return;
      }

      setOtpCode("");
      setStatusMessage(
        data?.message ||
          `Un nouveau code à 6 chiffres a été envoyé à ${cleanEmail} (valable 10 minutes).`
      );
    } catch {
      setErrorMessage("Erreur réseau lors du renvoi du code.");
    } finally {
      setResending(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    clearMessages();

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = otpCode.replace(/\D/g, "").trim();

    if (!cleanEmail) {
      setErrorMessage("Veuillez saisir votre adresse e-mail.");
      return;
    }

    if (!/^\d{6}$/.test(cleanCode)) {
      setErrorMessage("Veuillez saisir le code de vérification à 6 chiffres.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          code: cleanCode,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.verified) {
        setErrorMessage(
          data?.error || "Le code à 6 chiffres est invalide ou expiré."
        );
        return;
      }

      setStatusMessage(
        data?.message ||
          "Code vérifié. Vous pouvez maintenant définir votre nouveau mot de passe."
      );
      setStep("reset");
    } catch {
      setErrorMessage("Erreur réseau lors de la vérification du code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    clearMessages();

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = otpCode.replace(/\D/g, "").trim();

    if (!/^\d{6}$/.test(cleanCode)) {
      setErrorMessage("Code à 6 chiffres manquant.");
      setStep("verify");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage(
        "Le nouveau mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Les deux mots de passe ne correspondent pas.");
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
          newPassword,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setErrorMessage(
          data?.error || "Impossible de réinitialiser le mot de passe."
        );
        return;
      }

      setOtpCode("");
      setNewPassword("");
      setConfirmPassword("");
      setStatusMessage(
        data?.message ||
          "Votre mot de passe a bien été mis à jour. Toutes vos données sont conservées."
      );
      setStep("done");
    } catch {
      setErrorMessage("Erreur réseau lors de la réinitialisation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
        <div className="text-center mb-6">
          <div className="text-2xl font-extrabold tracking-wide">
            FIT <span className="text-emerald-400">PRO</span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Récupération de mot de passe par code à 6 chiffres
          </p>
        </div>

        {statusMessage && (
          <div className="mb-4 rounded-xl border border-emerald-700/60 bg-emerald-950/60 p-3.5 text-sm text-emerald-200">
            {statusMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-red-700/60 bg-red-950/60 p-3.5 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        {step === "request" && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Adresse Gmail
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@gmail.com"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <p className="text-xs text-zinc-400">
              Un code à 6 chiffres valable 10 minutes et à usage unique sera
              envoyé dans votre boîte Gmail. Aucune donnée de votre compte ne
              sera supprimée.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 py-3 font-bold text-black hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? "Envoi du code..." : "ENVOYER LE CODE À 6 CHIFFRES"}
            </button>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Adresse Gmail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
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
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-center text-xl font-bold tracking-[0.4em] text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 py-3 font-bold text-black hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? "Vérification..." : "VÉRIFIER LE CODE"}
            </button>

            <div className="flex items-center justify-between gap-2 text-xs">
              <button
                type="button"
                disabled={resending}
                onClick={handleResendCode}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 font-medium text-emerald-400 hover:bg-zinc-800 disabled:opacity-60"
              >
                {resending ? "Renvoi..." : "Renvoyer le code"}
              </button>

              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setStep("request");
                }}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 font-medium text-zinc-300 hover:bg-zinc-800"
              >
                Changer d&apos;e-mail
              </button>
            </div>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Nouveau mot de passe
              </label>
              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Au moins 6 caractères"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
                >
                  {showPassword ? "Masquer" : "Voir"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répéter le mot de passe"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 py-3 font-bold text-black hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading
                ? "Enregistrement..."
                : "ENREGISTRER LE NOUVEAU MOT DE PASSE"}
            </button>
          </form>
        )}

        {step === "done" && (
          <div className="space-y-4 text-center">
            <Link
              href="/login"
              className="block w-full rounded-xl bg-emerald-500 py-3 font-bold text-black hover:bg-emerald-400"
            >
              SE CONNECTER
            </Link>
          </div>
        )}

        <div className="mt-5 text-center text-sm text-zinc-400">
          <Link href="/login" className="text-emerald-400 hover:underline">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
    }
    
