"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { playClick, playSuccess } from "../../lib/sound";

type SettingsState = {
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

const DEFAULT_SETTINGS: SettingsState = {
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
  const [planName, setPlanName] = useState("Premium");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);

  useEffect(() => {
    let isMounted = true;

    async function loadUserAndSettings() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!isMounted) return;

      if (!currentUser) {
        setLoading(false);
        router.replace("/login");
        return;
      }

      setUser(currentUser);

      const [settingsRes, playerRes, subRes] = await Promise.all([
        supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", currentUser.id)
          .maybeSingle(),
        supabase
          .from("user_player_preferences")
          .select("*")
          .eq("user_id", currentUser.id)
          .maybeSingle(),
        supabase
          .from("user_subscriptions")
          .select("plan_name, status")
          .eq("user_id", currentUser.id)
          .maybeSingle(),
      ]);

      if (!isMounted) return;

      if (subRes.data?.plan_name) {
        setPlanName(subRes.data.plan_name);
      }

      const fallbackName =
        currentUser.user_metadata?.full_name ||
        currentUser.user_metadata?.name ||
        currentUser.email?.split("@")[0] ||
        "Membre FIT PRO";

      setSettings({
        display_name: settingsRes.data?.display_name || fallbackName,
        avatar_url: settingsRes.data?.avatar_url || "",
        language: settingsRes.data?.language || "Français",
        dark_mode: settingsRes.data?.dark_mode ?? true,
        autoplay_videos: playerRes.data?.autoplay_videos ?? true,
        video_quality: playerRes.data?.video_quality || "Haute qualité",
        notifications_enabled: settingsRes.data?.notifications_enabled ?? true,
        sound_enabled: playerRes.data?.sound_enabled ?? true,
        power_saver: settingsRes.data?.power_saver ?? false,
      });

      setLoading(false);
    }

    loadUserAndSettings();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const syncSettingsToSupabase = async (
    nextSettings: SettingsState,
    successText = "Paramètres enregistrés"
  ) => {
    if (!user) return;
    setSaving(true);
    setStatusMessage(null);

    const now = new Date().toISOString();

    const { error: userSettingsError } = await supabase
      .from("user_settings")
      .upsert(
        {
          user_id: user.id,
          display_name: nextSettings.display_name,
          avatar_url: nextSettings.avatar_url,
          language: nextSettings.language,
          dark_mode: nextSettings.dark_mode,
          notifications_enabled: nextSettings.notifications_enabled,
          power_saver: nextSettings.power_saver,
          updated_at: now,
        },
        { onConflict: "user_id" }
      );

    const { error: playerPrefsError } = await supabase
      .from("user_player_preferences")
      .upsert(
        {
          user_id: user.id,
          autoplay_videos: nextSettings.autoplay_videos,
          video_quality: nextSettings.video_quality,
          sound_enabled: nextSettings.sound_enabled,
          updated_at: now,
        },
        { onConflict: "user_id" }
      );

    setSaving(false);

    if (userSettingsError || playerPrefsError) {
      setStatusMessage(
        `Erreur : ${
          userSettingsError?.message ||
          playerPrefsError?.message ||
          "Impossible d'enregistrer"
        }`
      );
      return;
    }

    if (nextSettings.sound_enabled) {
      playSuccess();
    }
    setStatusMessage(successText);
  };

  const handleToggle = async (
    key:
      | "dark_mode"
      | "autoplay_videos"
      | "notifications_enabled"
      | "sound_enabled"
      | "power_saver"
  ) => {
    if (settings.sound_enabled) {
      playClick();
    }
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    await syncSettingsToSupabase(next);
  };

  const handleCycleLanguage = async () => {
    if (settings.sound_enabled) {
      playClick();
    }
    const languages = ["Français", "English", "العربية"];
    const currentIndex = languages.indexOf(settings.language);
    const nextLanguage = languages[(currentIndex + 1) % languages.length];
    const next = { ...settings, language: nextLanguage };
    setSettings(next);
    await syncSettingsToSupabase(next, `Langue : ${nextLanguage}`);
  };

  const handleCycleVideoQuality = async () => {
    if (settings.sound_enabled) {
      playClick();
    }
    const qualities = ["Haute qualité", "Moyenne (1080p)", "Économie (720p)"];
    const currentIndex = qualities.indexOf(settings.video_quality);
    const nextQuality = qualities[(currentIndex + 1) % qualities.length];
    const next = { ...settings, video_quality: nextQuality };
    setSettings(next);
    await syncSettingsToSupabase(next, `Qualité vidéo : ${nextQuality}`);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (settings.sound_enabled) {
      playClick();
    }

    setSaving(true);
    setStatusMessage(null);

    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const filePath = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setSaving(false);
      setStatusMessage(`Upload avatar échoué : ${uploadError.message}`);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const cacheBustedUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
    const next = { ...settings, avatar_url: cacheBustedUrl };
    setSettings(next);
    await syncSettingsToSupabase(next, "Photo de profil mise à jour");
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !ticketSubject.trim() || !ticketMessage.trim()) return;

    if (settings.sound_enabled) {
      playClick();
    }

    setSaving(true);
    const { error } = await supabase.from("support_tickets").insert({
      user_id: user.id,
      subject: ticketSubject.trim(),
      message: ticketMessage.trim(),
      status: "open",
    });
    setSaving(false);

    if (error) {
      setStatusMessage(`Envoi impossible : ${error.message}`);
      return;
    }

    if (settings.sound_enabled) {
      playSuccess();
    }
    setTicketSubject("");
    setTicketMessage("");
    setShowSupportModal(false);
    setStatusMessage("Ticket envoyé au support FIT PRO");
  };

  const handleDeleteAccountRequest = async () => {
    if (!user) return;
    if (settings.sound_enabled) {
      playClick();
    }

    setSaving(true);
    const { error } = await supabase.from("support_tickets").insert({
      user_id: user.id,
      subject: "Demande de suppression de compte",
      message: `L'utilisateur ${user.email || user.id} demande la suppression définitive de son compte et de ses données.`,
      status: "open",
    });
    setSaving(false);

    setShowDeleteConfirm(false);
    if (error) {
      setStatusMessage(`Erreur : ${error.message}`);
      return;
    }

    if (settings.sound_enabled) {
      playSuccess();
    }
    setStatusMessage("Demande de suppression enregistrée auprès du support");
  };

  const handleSignOut = async () => {
    if (settings.sound_enabled) {
      playClick();
    }
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08040f] text-sm text-purple-200">
        Chargement de tes paramètres...
      </main>
    );
  }

  const shortMemberId = user?.id
    ? `FIT-${user.id.slice(0, 8).toUpperCase()}`
    : "FIT-MEMBRE";

  return (
    <main className="min-h-screen bg-[#08040f] pb-24 text-white">
      {/* En-tête */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-purple-500/20 bg-[#0b0615]/95 px-4 py-3.5 backdrop-blur">
        <button
          type="button"
          onClick={() => {
            if (settings.sound_enabled) playClick();
            router.back();
          }}
          aria-label="Retour"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-950/70 text-lg text-purple-200 transition hover:bg-purple-900/70"
        >
          ‹
        </button>

        <h1 className="text-base font-bold tracking-wide text-white">
          Paramètres
        </h1>

        <button
          type="button"
          onClick={() => {
            if (settings.sound_enabled) playClick();
            setStatusMessage(
              settings.notifications_enabled
                ? "Notifications actives pour ton compte"
                : "Notifications désactivées"
            );
          }}
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-purple-950/70 text-purple-200 transition hover:bg-purple-900/70"
        >
          <span>🔔</span>
          {settings.notifications_enabled && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              3
            </span>
          )}
        </button>
      </header>

      <div className="mx-auto max-w-xl space-y-5 px-4 pt-4">
        {statusMessage && (
          <div className="flex items-center justify-between rounded-2xl border border-purple-400/35 bg-purple-600/20 px-4 py-3 text-xs text-purple-100">
            <span>{saving ? "Synchronisation en cours..." : statusMessage}</span>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="ml-3 text-purple-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Carte profil */}
        <section className="flex items-center justify-between rounded-2xl border border-purple-500/30 bg-gradient-to-r from-[#1e1038] via-[#170c2b] to-[#120922] p-4 shadow-lg shadow-purple-950/50">
          <div className="flex items-center gap-3.5">
            <label className="relative cursor-pointer">
              <img
                src={
                  settings.avatar_url ||
                  "https://placehold.co/72x72/2b1652/d8b4fe?text=FP"
                }
                alt={settings.display_name}
                className="h-16 w-16 rounded-full border-2 border-purple-400/70 object-cover"
              />
              <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white shadow">
                ✎
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white">
                  {settings.display_name}
                </h2>
                <span className="text-sm text-amber-400">👑</span>
              </div>

              <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-purple-400/35 bg-purple-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-purple-200">
                ♦ {planName}
              </span>

              <p className="mt-1 text-[11px] tracking-wide text-purple-300/75">
                ID : {shortMemberId}
              </p>
            </div>
          </div>

          <span className="text-xl text-purple-300/70">›</span>
        </section>

        {/* Paramètres de l'application */}
        <section className="space-y-1.5">
          <h3 className="px-1 text-xs font-semibold uppercase tracking-wider text-purple-300/85">
            ⚙ Paramètres de l&apos;application
          </h3>

          <div className="divide-y divide-purple-500/15 overflow-hidden rounded-2xl border border-purple-500/20 bg-[#130b22]">
            <button
              type="button"
              onClick={handleCycleLanguage}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-purple-900/20"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/15 text-base">
                  🌐
                </span>
                <div>
                  <p className="text-sm font-medium text-white">Langue</p>
                  <p className="text-xs text-purple-300/70">{settings.language}</p>
                </div>
              </div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>

            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-base">
                  🎨
                </span>
                <div>
                  <p className="text-sm font-medium text-white">Thème</p>
                  <p className="text-xs text-purple-300/70">
                    {settings.dark_mode ? "Sombre (Mode Nuit)" : "Sombre profond"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Basculer le thème"
                onClick={() => handleToggle("dark_mode")}
                className={`h-6 w-11 rounded-full p-0.5 transition ${
                  settings.dark_mode ? "bg-purple-600" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white transition ${
                    settings.dark_mode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 text-base">
                  ▶
                </span>
                <div>
                  <p className="text-sm font-medium text-white">
                    Lecture automatique des vidéos
                  </p>
                  <p className="text-xs text-purple-300/70">
                    Wi-Fi et données mobiles
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Basculer la lecture automatique des vidéos"
                onClick={() => handleToggle("autoplay_videos")}
                className={`h-6 w-11 rounded-full p-0.5 transition ${
                  settings.autoplay_videos ? "bg-purple-600" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white transition ${
                    settings.autoplay_videos ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={handleCycleVideoQuality}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-purple-900/20"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-[11px] font-bold text-blue-300">
                  HD
                </span>
                <div>
                  <p className="text-sm font-medium text-white">Qualité vidéo</p>
                  <p className="text-xs text-purple-300/70">
                    {settings.video_quality}
                  </p>
                </div>
              </div>
              <span className="text-lg text-purple-300/60">›</span>
            </button>

            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-500/15 text-base">
                  🔔
                </span>
                <div>
                  <p className="text-sm font-medium text-white">Notifications</p>
                  <p className="text-xs text-purple-300/70">
                    Gérer vos notifications
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Basculer les notifications"
                onClick={() => handleToggle("notifications_enabled")}
                className={`h-6 w-11 rounded-full p-0.5 transition ${
                  settings.notifications_enabled ? "bg-purple-600" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white transition ${
                    settings.notifications_enabled
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-base">
                  🔊
                </span>
                <div>
                  <p className="text-sm font-medium text-white">
                    Sons et vibrations
                  </p>
                  <p className="text-xs text-purple-300/70">Activer les sons</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Basculer les sons et vibrations"
                onClick={() => handleToggle("sound_enabled")}
                className={`h-6 w-11 rounded-full p-0.5 transition ${
                  settings.sound_enabled ? "bg-purple-600" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white transition ${
                    settings.sound_enabled ? "t
