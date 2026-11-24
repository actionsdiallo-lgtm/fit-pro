"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      const isGuest =
        typeof window !== "undefined" &&
        window.localStorage.getItem("fitpro_guest_mode") === "true";

      if (isGuest) {
        router.replace("/dashboard");
        return;
      }

      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            if (typeof window !== "undefined") {
              window.localStorage.removeItem("fitpro_guest_mode");
            }
            router.replace("/dashboard");
            return;
          }
        }
      } catch {
        // En cas d'erreur réseau, on laisse l'utilisateur choisir sur l'écran d'accueil
      }

      if (active) {
        setCheckingSession(false);
      }
    }

    checkAccess();

    return () => {
      active = false;
    };
  }, [router]);

  function handleContinueAsGuest() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("fitpro_guest_mode", "true");
    }
    router.replace("/dashboard");
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-4 text-sm text-slate-300">
          Chargement de ton espace...
        </div>
      </main>
    );
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
        }
