"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ConfidentialitePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [settingsFound, setSettingsFound] = useState(false);
  const [playerPrefsFound, setPlayerPrefsFound] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [ticketsCount, setTicketsCount] = useState<number>(0);
  const [requestType, setRequestType] = useState<"export" | "deletion" | "privacy">("privacy");
  const [details, setDetails] = useState("");
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

      const [rSettings, rPlayer, rSub, rTickets] = await Promise.all([
        supabase.from("user_settings").select("user_id").eq("user_id", user.id).maybeSingle(),
        supabase
          .from("user_player_preferences")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("user_subscriptions")
          .select("plan_name")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("support_tickets")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);

      if (!active) return;

      setSettingsFound(Boolean(rSettings.data));
      setPlayerPrefsFound(Boolean(rPlayer.data));
      setSubscriptionPlan(rSub.data?.plan_name ?? null);
      setTicketsCount(rTickets.count ?? 0);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [router]);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !details.trim()) return;

    setSubmitting(true);
    setStatusMsg(null);

    const subjectMap = {
      privacy: "[Confidentialité] Question / demande sur mes données",
      export: "[RGPD / Données] Demande d'export de mes données",
      deletion: "[Suppression] Demande de suppression de compte et données",
    } as const;

    const { error } = await supabase.from("support_tickets").insert({
      user_id: userId,
      subject: subjectMap[requestType],
      message: details.trim(),
      status: "open",
    });

    setSubmitting(false);

    if (error) {
      setStatusMsg(`Erreur : ${error.message}`);
      return;
    }

    setDetails("");
    setTicketsCount((c) => c + 1);
    setStatusMsg("Demande enregistrée dans Supabase (support_tickets).");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08040f] text-sm text-purple-200">
        Chargement de vos données de confidentialité...
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
        <h1 className="text-base font-bold">Politique de confidentialité</h1>
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
          <h2 className="text-sm font-bold text-white">État réel de votre compte (Supabase)</h2>
          <p className="text-xs text-purple-200/80">Compte : {userEmail ?? "Session active"}</p>
          <p className="text-xs text-purple-200/80">ID utilisateur : {userId}</p>
          <ul className="space-y-1 pt-1 text-xs text-purple-200/85">
            <li>• Réglages (`user_settings`) : {settingsFound ? "Synchronisé" : "Aucun enregistrement"}</li>
            <li>
              • Préférences lecteur (`user_player_preferences`) :{" "}
              {playerPrefsFound ? "Synchronisé" : "Aucun enregistrement"}
            </li>
            <li>• Abonnement (`user_subscriptions`) : {subscriptionPlan ?? "Aucun plan actif"}</li>
            <li>• Tickets enregistrés (`support_tickets`) : {ticketsCount}</li>
          </ul>
        </section>

        <form
          onSubmit={handleSubmitRequest}
          className="space-y-3 rounded-2xl border border-purple-500/20 bg-[#130b22] p-4"
        >
          <h2 className="text-sm font-bold text-white">Exercer vos droits sur vos données</h2>

          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => setRequestType("privacy")}
              className={`rounded-xl px-3 py-1.5 font-medium ${
                requestType === "privacy" ? "bg-purple-600 text-white" : "bg-white/10 text-purple-200"
              }`}
            >
              Confidentialité
            </button>
            <button
              type="button"
              onClick={() => setRequestType("export")}
              className={`rounded-xl px-3 py-1.5 font-medium ${
                requestType === "export" ? "bg-purple-600 text-white" : "bg-white/10 text-purple-200"
              }`}
            >
              Export données
            </button>
            <button
              type="button"
              onClick={() => setRequestType("deletion")}
              className={`rounded-xl px-3 py-1.5 font-medium ${
                requestType === "deletion" ? "bg-rose-600 text-white" : "bg-white/10 text-purple-200"
              }`}
            >
              Suppression compte
            </button>
          </div>

          <textarea
            rows={3}
            required
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Précisez votre demande liée à vos données ou à votre compte..."
            className="w-full rounded-xl border border-purple-500/25 bg-[#0c0716] px-3 py-2.5 text-sm text-white outline-none"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white disabled:opacity-50"
          >
            {submitting ? "Envoi vers Supabase..." : "Envoyer la demande"}
          </button>
        </form>
      </div>
    </main>
  );
                                                            }
            
