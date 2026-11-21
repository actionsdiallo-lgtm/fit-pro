"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ConditionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [planName, setPlanName] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        setLoading(false);
        router.replace("/login");
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email ?? null);

      const { data: subData } = await supabase
        .from("user_subscriptions")
        .select("plan_name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) return;

      setPlanName(subData?.plan_name ?? "Standard");
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [router]);

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !question.trim()) return;

    setSubmitting(true);
    setStatusMsg(null);

    const { error } = await supabase.from("support_tickets").insert({
      user_id: userId,
      subject: "[Conditions d'utilisation] Question ou demande",
      message: question.trim(),
      status: "open",
    });

    setSubmitting(false);

    if (error) {
      setStatusMsg(`Erreur : ${error.message}`);
      return;
    }

    setQuestion("");
    setStatusMsg("Message enregistré dans Supabase (support_tickets).");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08040f] text-sm text-purple-200">
        Chargement des conditions d&apos;utilisation...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08040f] pb-24 text-white">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-purple-500/20 bg-[#0b0615]/95 px-4 py-3.5 backdrop-blur">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-950/70 text-lg text-purple-200"
        >
          ‹
        </button>
        <h1 className="text-base font-bold">Conditions d&apos;utilisation</h1>
        <div className="w-9" />
      </header>

      <div className="mx-auto max-w-xl space-y-4 px-4 pt-5 text-sm text-purple-100/90">
        {statusMsg && (
          <div className="flex items-center justify-between rounded-2xl border border-purple-400/35 bg-purple-600/20 px-4 py-3 text-xs text-purple-100">
            <span>{statusMsg}</span>
            <button type="button" onClick={() => setStatusMsg(null)} className="ml-3 text-purple-300">
              ✕
            </button>
          </div>
        )}

        <section className="space-y-2 rounded-2xl border border-purple-500/20 bg-[#130b22] p-4">
          <h2 className="text-sm font-bold text-white">Cadre d&apos;utilisation du compte</h2>
          <p className="text-xs text-purple-200/80">Compte : {userEmail ?? "Session active"}</p>
          <p className="text-xs text-purple-200/80">ID utilisateur : {userId}</p>
          <p className="text-xs text-purple-200/80">Formule détectée : {planName}</p>
        </section>

        <section className="space-y-2 rounded-2xl border border-purple-500/20 bg-[#130b22] p-4">
          <h2 className="text-sm font-bold text-white">1. Accès au service et responsabilités</h2>
          <p className="text-xs leading-relaxed text-purple-200/80">
            L&apos;utilisation de FitPro suppose un usage personnel et conforme aux règles de sécurité. Vous restez responsable de la confidentialité de vos identifiants et de l&apos;adaptation des séances à votre condition physique.
          </p>
        </section>

        <section className="space-y-2 rounded-2xl border border-purple-500/20 bg-[#130b22] p-4">
          <h2 className="text-sm font-bold text-white">2. Abonnements et préférences</h2>
          <p className="text-xs leading-relaxed text-purple-200/80">
            Vos préférences d&apos;application, de lecteur vidéo et d&apos;abonnement sont enregistrées dans votre compte et peuvent être mises à jour depuis la page Paramètres.
          </p>
        </section>

        <form
          onSubmit={handleSendQuestion}
          className="space-y-3 rounded-2xl border border-purple-500/20 bg-[#130b22] p-4"
        >
          <h2 className="text-sm font-bold text-white">Question sur les conditions</h2>
          <textarea
            rows={3}
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Posez une question ou envoyez une demande au support..."
            className="w-full rounded-xl border border-purple-500/25 bg-[#0c0716] px-3 py-2.5 text-sm text-white outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white disabled:opacity-50"
          >
            {submitting ? "Envoi vers Supabase..." : "Envoyer au support"}
          </button>
        </form>
      </div>
    </main>
  );
      }
            
