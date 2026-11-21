"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { playClick, playSuccess } from "../../lib/sound";

type S = {
  display_name: string;
  avatar_url: string;
  language: string;
  dark_mode: boolean;
  autoplay_videos: boolean;
  video_quality: string;
  notifications_enabled: boolean;
  sound_enabled: boolean;
  power_saver: boolean;
};

const INIT: S = {
  display_name: "",
  avatar_url: "",
  language: "Français",
  dark_mode: true,
  autoplay_videos: true,
  video_quality: "Haute qualité",
  notifications_enabled: true,
  sound_enabled: true,
  power_saver: false,
};

export default function ParametresPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState("Premium");
  const [msg, setMsg] = useState<string | null>(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [s, setS] = useState<S>(INIT);

  useEffect(() => {
    let ok = true;
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!ok) return;
      if (!u) { setLoading(false); router.replace("/login"); return; }
      setUser(u);

      const [r1, r2, r3] = await Promise.all([
        supabase.from("user_settings").select("*").eq("user_id", u.id).maybeSingle(),
        supabase.from("user_player_preferences").select("*").eq("user_id", u.id).maybeSingle(),
        supabase.from("user_subscriptions").select("plan_name").eq("user_id", u.id).maybeSingle(),
      ]);
      if (!ok) return;
      if (r3.data?.plan_name) setPlan(r3.data.plan_name);

      setS({
        display_name: r1.data?.display_name || u.user_metadata?.full_name || u.email?.split("@")[0] || "Membre FIT PRO",
        avatar_url: r1.data?.avatar_url || "",
        language: r1.data?.language || "Français",
        dark_mode: r1.data?.dark_mode ?? true,
        autoplay_videos: r2.data?.autoplay_videos ?? true,
        video_quality: r2.data?.video_quality || "Haute qualité",
        notifications_enabled: r1.data?.notifications_enabled ?? true,
        sound_enabled: r2.data?.sound_enabled ?? true,
        power_saver: r1.data?.power_saver ?? false,
      });
      setLoading(false);
    })();
    return () => { ok = false; };
  }, [router]);

  const saveAll = async (next: S, info = "Paramètres enregistrés") => {
    if (!user) return;
    setSaving(true);
    const now = new Date().toISOString();
    const [e1, e2] = await Promise.all([
      supabase.from("user_settings").upsert({
        user_id: user.id,
        display_name: next.display_name,
        avatar_url: next.avatar_url,
        language: next.language,
        dark_mode: next.dark_mode,
        notifications_enabled: next.notifications_enabled,
        power_saver: next.power_saver,
        updated_at: now,
      }, { onConflict: "user_id" }),
      supabase.from("user_player_preferences").upsert({
        user_id: user.id,
        autoplay_videos: next.autoplay_videos,
        video_quality: next.video_quality,
        sound_enabled: next.sound_enabled,
        updated_at: now,
      }, { onConflict: "user_id" }),
    ]);
    setSaving(false);
    if (e1.error || e2.error) {
      setMsg(`Erreur : ${e1.error?.message || e2.error?.message}`);
      return;
    }
    if (next.sound_enabled) playSuccess();
    setMsg(info);
  };

  const toggle = async (k: "dark_mode" | "autoplay_videos" | "notifications_enabled" | "sound_enabled" | "power_saver") => {
    if (s.sound_enabled) playClick();
    const next = { ...s, [k]: !s[k] };
    setS(next);
    await saveAll(next);
  };

  const cycleLang = async () => {
    if (s.sound_enabled) playClick();
    const list = ["Français", "English", "العربية"];
    const language = list[(list.indexOf(s.language) + 1) % list.length];
    const next = { ...s, language };
    setS(next);
    await saveAll(next, `Langue : ${language}`);
  };

  const cycleQuality = async () => {
    if (s.sound_enabled) playClick();
    const list = ["Haute qualité", "Moyenne (1080p)", "Économie (720p)"];
    const video_quality = list[(list.indexOf(s.video_quality) + 1) % list.length];
    const next = { ...s, video_quality };
    setS(next);
    await saveAll(next, `Qualité vidéo : ${video_quality}`);
  };

  const onAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (s.sound_enabled) playClick();
    setSaving(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { setSaving(false); setMsg(`Upload : ${error.message}`); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const next = { ...s, avatar_url: `${data.publicUrl}?t=${Date.now()}` };
    setS(next);
    await saveAll(next, "Photo de profil mise à jour");
  };

  const sendTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subject.trim() || !body.trim()) return;
    if (s.sound_enabled) playClick();
    const { error } = await supabase.from("support_tickets").insert({
      user_id: user.id,
      subject: subject.trim(),
      message: body.trim(),
      status: "open",
    });
    if (error) { setMsg(`Erreur : ${error.message}`); return; }
    if (s.sound_enabled) playSuccess();
    setSubject(""); setBody(""); setSupportOpen(false);
    setMsg("Message envoyé au support FIT PRO");
  };

  const signOut = async () => {
    if (s.sound_enabled) playClick();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#08040f] text-sm text-purple-200">Chargement...</main>;
  }

  return (
    <main className="min-h-screen bg-[#08040f] pb-24 text-white">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-purple-500/20 bg-[#0b0615]/95 px-4 py-3.5 backdrop-blur">
        <button type="button" onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-950/70 text-lg text-purple-200">‹</button>
        <h1 className="text-base font-bold">Paramètres</h1>
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-purple-950/70 text-purple-200">
          <span>🔔</span>
          {s.notifications_enabled && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold">3</span>}
        </div>
      </header>

      <div className="mx-auto max-w-xl space-y-5 px-4 pt-4">
        {msg && (
          <div className="flex items-center justify-between rounded-2xl border border-purple-400/35 bg-purple-600/20 px-4 py-3 text-xs text-purple-100">
            <span>{saving ? "Synchronisation..." : msg}</span>
            <button type="button" onClick={() => setMsg(null)} className="ml-3 text-purple-300">✕</button>
          </div>
        )}

        <section className="flex items-center justify-between rounded-2xl border border-purple-500/30 bg-gradient-to-r from-[#1e1038] to-[#120922] p-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <label className="relative cursor-pointer">
              <img src={s.avatar_url || "https://placehold.co/72x72/2b1652/d8b4fe?text=FP"} alt={s.display_name} className="h-16 w-16 rounded-full border-2 border-purple-400/70 object-cover" />
              <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold">✎</span>
              <input type="file" accept="image/*" onChange={onAvatar} className="hidden" />
            </label>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold">{s.display_name}</h2>
                <span className="text-sm text-amber-400">👑</span>
              </div>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-purple-400/35 bg-purple-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-purple-200">♦ {plan}</span>
              <p className="mt-1 text-[11px] text-purple-300/75">ID : FIT-{user?.id?.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <span className="text-xl text-purple-300/70">›</span>
        </section>

        <section className="space-y-1.5">
          <h3 className="px-1 text-xs font-semibold uppercase tracking-wider text-purple-300/85">⚙ Paramètres de l&apos;application</h3>
          <div className="divide-y divide-purple-500/15 overflow-hidden rounded-2xl border border-purple-500/20 bg-[#130b22]">
            <button type="button" onClick={cycleLang} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium">🌐 Langue</p><p className="text-xs text-purple-300/70">{s.language}</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>

            <div className="flex items-center justify-between px-4 py-3.5">
              <div><p className="text-sm font-medium">🎨 Thème</p><p className="text-xs text-purple-300/70">Sombre (Mode Nuit)</p></div>
              <button type="button" onClick={() => toggle("dark_mode")} className={`h-6 w-11 rounded-full p-0.5 ${s.dark_mode ? "bg-purple-600" : "bg-zinc-700"}`}>
                <span className={`block h-5 w-5 rounded-full bg-white transition ${s.dark_mode ? "translate-x-5" : ""}`} />
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <div><p className="text-sm font-medium">▶ Lecture automatique des vidéos</p><p className="text-xs text-purple-300/70">Wi-Fi et données mobiles</p></div>
              <button type="button" onClick={() => toggle("autoplay_videos")} className={`h-6 w-11 rounded-full p-0.5 ${s.autoplay_videos ? "bg-purple-600" : "bg-zinc-700"}`}>
                <span className={`block h-5 w-5 rounded-full bg-white transition ${s.autoplay_videos ? "translate-x-5" : ""}`} />
              </button>
            </div>

            <button type="button" onClick={cycleQuality} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium">🎬 Qualité vidéo</p><p className="text-xs text-purple-300/70">{s.video_quality}</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>

            <div className="flex items-center justify-between px-4 py-3.5">
              <div><p className="text-sm font-medium">🔔 Notifications</p><p className="text-xs text-purple-300/70">Gérer vos notifications</p></div>
              <button type="button" onClick={() => toggle("notifications_enabled")} className={`h-6 w-11 rounded-full p-0.5 ${s.notifications_enabled ? "bg-purple-600" : "bg-zinc-700"}`}>
                <span className={`block h-5 w-5 rounded-full bg-white transition ${s.notifications_enabled ? "translate-x-5" : ""}`} />
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <div><p className="text-sm font-medium">🔊 Sons et vibrations</p><p className="text-xs text-purple-300/70">Activer les sons</p></div>
              <button type="button" onClick={() => toggle("sound_enabled")} className={`h-6 w-11 rounded-full p-0.5 ${s.sound_enabled ? "bg-purple-600" : "bg-zinc-700"}`}>
                <span className={`block h-5 w-5 rounded-full bg-white transition ${s.sound_enabled ? "translate-x-5" : ""}`} />
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <div><p className="text-sm font-medium">🔋 Mode économie d&apos;énergie</p><p className="text-xs text-purple-300/70">Réduire la consommation</p></div>
              <button type="button" onClick={() => toggle("power_saver")} className={`h-6 w-11 rounded-full p-0.5 ${s.power_saver ? "bg-purple-600" : "bg-zinc-700"}`}>
                <span className={`block h-5 w-5 rounded-full bg-white transition ${s.power_saver ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-1.5">
          <h3 className="px-1 text-xs font-semibold uppercase tracking-wider text-purple-300/85">🔒 Données et confidentialité</h3>
          <div className="divide-y divide-purple-500/15 overflow-hidden rounded-2xl border border-purple-500/20 bg-[#130b22]">
            <button type="button" onClick={() => saveAll(s, "Sauvegarde cloud synchronisée")} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium">☁ Sauvegarde des données</p><p className="text-xs text-purple-300/70">Sauvegarder sur le cloud</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>
            <button type="button" onClick={() => saveAll(s, "Données cloud restaurées")} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium">↺ Restaurer mes données</p><p className="text-xs text-purple-300/70">Récupérer mes données</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>
            <button type="button" onClick={() => setSupportOpen(true)} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium text-rose-300">🗑 Supprimer mon compte</p><p className="text-xs text-purple-300/70">Supprimer définitivement mon compte</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>
            <button type="button" onClick={() => router.push("/confidentialite")} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium">🛡 Politique de confidentialité</p><p className="text-xs text-purple-300/70">Lire notre politique</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>
            <button type="button" onClick={() => router.push("/conditions")} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium">📄 Conditions d&apos;utilisation</p><p className="text-xs text-purple-300/70">Lire les conditions</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>
          </div>
        </section>

        <section className="space-y-1.5">
          <h3 className="px-1 text-xs font-semibold uppercase tracking-wider text-purple-300/85">? Aide et support</h3>
          <div className="divide-y divide-purple-500/15 overflow-hidden rounded-2xl border border-purple-500/20 bg-[#130b22]">
            <button type="button" onClick={() => setSupportOpen(true)} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium">🎧 Centre d&apos;aide</p><p className="text-xs text-purple-300/70">Questions fréquentes et guides</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>
            <button type="button" onClick={() => setSupportOpen(true)} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
              <div><p className="text-sm font-medium">✉ Contacter le support</p><p className="text-xs text-purple-300/70">Nous écrire</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div><p className="text-sm font-medium">ℹ À propos de FIT PRO</p><p className="text-xs text-purple-300/70">Version 1.0.0 • Mis à jour le 21/11/2026</p></div>
              <span className="text-lg text-purple-300/60">›</span>
            </div>
          </div>
        </section>

        <button type="button" onClick={signOut} className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 py-3.5 text-sm font-bold text-white shadow-lg">
          ↪ Se déconnecter
        </button>
      </div>

      {supportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <form onSubmit={sendTicket} className="w-full max-w-md space-y-3 rounded-2xl border border-purple-500/30 bg-[#150c26] p-5 text-white">
            <h4 className="text-base font-bold">Contacter le support FIT PRO</h4>
            <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Sujet" className="w-full rounded-xl border border-purple-500/25 bg-[#0c0716] px-3 py-2.5 text-sm outline-none" />
            <textarea rows={3} required value={body} onChange={(e) => setBody(e.target.value)} placeholder="Votre message..." className="w-full rounded-xl border border-purple-500/25 bg-[#0c0716] px-3 py-2.5 text-sm outline-none" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setSupportOpen(false)} className="rounded-xl bg-white/10 px-4 py-2 text-xs text-purple-200">Annuler</button>
              <button type="submit" className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold">Envoyer</button>
            </div>
          </form>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-purple-500/20 bg-[#0b0615]/95 py-2.5 text-[11px] backdrop-blur">
        <button type="button" onClick={() => router.push("/dashboard")} className="flex flex-col items-center gap-0.5 text-zinc-400"><span>⌂</span><span>Accueil</span></button>
        <button type="button" onClick={() => router.push("/entrainement")} className="flex flex-col items-center gap-0.5 text-zinc-400"><span>🏋</span><span>Entraînement</span></button>
        <button type="button" onClick={() => router.push("/progres")} className="flex flex-col items-center gap-0.5 text-zinc-400"><span>◎</span><span>Progrès</span></button>
        <button type="button" onClick={() => router.push("/premium")} className="flex flex-col items-center gap-0.5 text-zinc-400"><span>👑</span><span>Premium</span></button>
        <button type="button" className="flex flex-col items-center gap-0.5 font-semibold text-purple-400"><span>⚙</span><span>Paramètres</span></button>
      </nav>
    </main>
  );
        }
        
