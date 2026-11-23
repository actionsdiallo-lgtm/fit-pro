"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  function handleContinueAsGuest() {
    if (typeof window !== "undefined") {
      localStorage.setItem("fitpro_guest_mode", "true");
    }
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center space-y-6">
        <p className="text-xl font-semibold leading-snug">
          Entraîne-toi à la maison, sans matériel.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/register"
            className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-3 px-4 transition"
          >
            Créer un compte
          </Link>

          <Link
            href="/login"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 transition"
          >
            Se connecter
          </Link>

          <button
            type="button"
            onClick={handleContinueAsGuest}
            className="w-full rounded-xl border border-dashed border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-medium py-3 px-4 transition"
          >
            Continuer sans compte
          </button>
        </div>
      </div>
    </main>
  );
