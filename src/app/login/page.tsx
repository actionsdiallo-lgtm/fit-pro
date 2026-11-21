"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setResetMessage("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("E-mail ou mot de passe incorrect. Vérifie tes identifiants ou crée un compte.");
      return;
    }

    router.push("/dashboard");
  };

  const openForgotPassword = () => {
    setError("");
    setResetMessage("");
    setResetEmail((prev) => prev || email.trim());
    setForgotOpen((prev) => !prev);
  };

  const handleSendResetLink = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setResetMessage("");

    const targetEmail = resetEmail.trim();
    if (!targetEmail) {
      setError("Entre l'adresse e-mail du compte pour recevoir le lien de réinitialisation.");
      return;
    }

    setResetLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(targetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setResetMessage(
      "Si un compte existe avec cette adresse, un lien de réinitialisation a été envoyé dans ta boîte Gmail (pense à vérifier les Spams)."
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-black text-white">
      <div className="w-full max-w-md rounded-2xl p-6 bg-zinc-900 border border-zinc-800 space-y-5">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold tracking-wide">
            FIT <span className="text-emerald-400">PRO</span>
          </h1>
          <p className="text-sm text-zinc-400">Bon retour, connecte-toi</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-700 text-sm text-red-200">
            {error}
          </div>
        )}

        {resetMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700 text-sm text-emerald-200">
            {resetMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ton@email.com"
              className="w-full rounded-xl px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-1">Mot de passe</label>
            <div className="flex gap-2">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex-1 rounded-xl px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 text-white"
              />
              <button
                type="button"
                onClick={() => setShow((prev) => !prev)}
                className="px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm font-medium text-zinc-200"
              >
                {show ? "Masquer" : "Voir"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold bg-emerald-500 text-black disabled:opacity-50"
          >
            {loading ? "Connexion..." : "SE CONNECTER"}
          </button>

          <div className="flex items-center justify-between text-sm pt-1">
            <Link href="/register" className="text-zinc-400 hover:text-white">
              Créer un compte
            </Link>
            <button
              type="button"
              onClick={openForgotPassword}
              className="text-sky-400 hover:underline"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </form>

        {forgotOpen && (
          <form
            onSubmit={handleSendResetLink}
            className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3"
          >
            <p className="text-xs text-zinc-300 font-medium">
              Réinitialisation du mot de passe (sans mot de passe requis)
            </p>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Entre ton adresse Gmail"
              className="w-full rounded-xl px-3 py-2 bg-zinc-800 border border-zinc-700 text-sm text-white"
            />
            <button
              type="submit"
              disabled={resetLoading}
              className="w-full py-2.5 rounded-xl font-bold bg-sky-500 text-black text-sm disabled:opacity-50"
            >
              {resetLoading ? "Envoi..." : "Envoyer le lien dans Gmail"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
      }
          
