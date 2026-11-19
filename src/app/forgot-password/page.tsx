"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) setMessage("Erreur : " + error.message);
    else setMessage("✅ Vérifie ta boîte mail, on t'a envoyé le lien !");
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form onSubmit={handleReset} className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">Mot de passe oublié ?</h1>
        <p className="text-white/60 text-sm mb-6">Entre ton email, on t'envoie un lien pour en créer un nouveau.</p>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
          className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 mb-4 outline-none"
        />
        <button className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl">
          {loading ? "Envoi..." : "Envoyer le lien"}
        </button>
        {message && <p className="mt-4 text-sm text-center">{message}</p>}
        <Link href="/login" className="block text-center text-sm text-white/50 mt-4">
          Retour à la connexion
        </Link>
      </form>
    </div>
  );
}
