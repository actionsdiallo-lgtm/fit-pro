"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface WorkoutCard {
  title: string;
  level: string;
  duration: string;
  image: string;
  href: string;
}

interface MealCard {
  name: string;
  calories?: number;
  image: string;
}

interface UserProfileRow {
  id: string;
  first_name?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  goal?: string | null;
  weight_kg?: number | null;
  daily_workout_minutes?: number | null;
  is_premium?: boolean | null;
  subscription_expires_at?: string | null;
}

interface WorkoutLogRow {
  id: string;
  title?: string | null;
  duration_minutes?: number | null;
  calories_burned?: number | null;
  created_at: string;
}

interface NotificationRow {
  id: string;
  title: string;
  message: string;
  read?: boolean | null;
  created_at?: string;
}

const workouts: WorkoutCard[] = [
  {
    title: "Musculation",
    level: "Tous niveaux",
    duration: "30 min",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900",
    href: "/entrainement",
  },
  {
    title: "Cardio",
    level: "Intermédiaire",
    duration: "20 min",
    image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=900",
    href: "/entrainement",
  },
  {
    title: "Yoga",
    level: "Débutant",
    duration: "25 min",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900",
    href: "/entrainement",
  },
];

const meals: MealCard[] = [
  {
    name: "Petit-déjeuner équilibré",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=700",
  },
  {
    name: "Repas protéiné",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700",
  },
];

// À renseigner uniquement avec une URL vidéo réelle et autorisée lorsque disponible
const HERO_VIDEO_URL: string | null = null;
const HERO_VIDEO_POSTER = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  // Données réelles de l'utilisateur connecté
  const [isLogged, setIsLogged] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [weightKg, setWeightKg] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  // Statistiques calculées uniquement depuis les activités enregistrées
  const [weekWorkouts, setWeekWorkouts] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [recentLogs, setRecentLogs] = useState<WorkoutLogRow[]>([]);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);

  // Bannière vidéo (uniquement si HERO_VIDEO_URL est défini et connexion adaptée)
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [heroMuted, setHeroMuted] = useState(true);
  const [heroPlaying, setHeroPlaying] = useState(true);

  // Coach IA (Premium uniquement, appel serveur /api/coach-ia)
  const [coachOpen, setCoachOpen] = useState(false);
  const [coachQuestion, setCoachQuestion] = useState("");
  const [coachAnswer, setCoachAnswer] = useState<string | null>(null);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState<string | null>(null);

  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    };
    if (nav.connection) {
      setIsSlowConnection(
        Boolean(nav.connection.saveData) ||
          nav.connection.effectiveType === "slow-2g" ||
          nav.connection.effectiveType === "2g"
      );
    }

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const loadHomeData = useCallback(async (isRefresh = false) => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setIsOffline(true);
      setLoading(false);
      setErrorMsg("Connexion Internet perdue. Reconnexion automatique dès le retour du réseau.");
      return;
    }

    if (isRefresh) {
      setSyncing(true);
    } else {
      setLoading(true);
    }
    setErrorMsg(null);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setIsLogged(false);
        setFirstName(null);
        setAvatarUrl(null);
        setGoal(null);
        setWeightKg(null);
        setIsPremium(false);
        setWeekWorkouts(0);
        setTotalWorkouts(0);
        setTotalCalories(0);
        setTotalMinutes(0);
        setRecentLogs([]);
        setNotifications([]);
        return;
      }

      setIsLogged(true);

      // Profil privé de l'utilisateur connecté uniquement
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle<UserProfileRow>();

      const derivedName =
        profileData?.first_name?.trim() ||
        profileData?.full_name?.trim()?.split(" ")[0] ||
        (typeof user.user_metadata?.first_name === "string"
          ? user.user_metadata.first_name
          : null);

      setFirstName(derivedName);
      setAvatarUrl(
        profileData?.avatar_url ||
          (typeof user.user_metadata?.avatar_url === "string"
            ? user.user_metadata.avatar_url
            : null)
      );
      setGoal(profileData?.goal ?? null);
      setWeightKg(
        typeof profileData?.weight_kg === "number" ? profileData.weight_kg : null
      );

      const expiresAt = profileData?.subscription_expires_at
        ? new Date(profileData.subscription_expires_at)
        : null;
      const activePremium =
        Boolean(profileData?.is_premium) && (!expiresAt || expiresAt > new Date());
      setIsPremium(activePremium);

      // Séances réelles de l'utilisateur connecté (filtrage strict par user_id)
      const { data: allWorkouts, error: workoutsError } = await supabase
        .from("workouts")
        .select("id, title, duration_minutes, calories_burned, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (workoutsError) {
        throw new Error(workoutsError.message);
      }

      const logs = allWorkouts ?? [];
      const startWeek = new Date();
      startWeek.setDate(startWeek.getDate() - 7);

      const weeklyCount = logs.filter(
        (w) => new Date(w.created_at) >= startWeek
      ).length;
      const caloriesSum = logs.reduce(
        (sum, w) => sum + (Number(w.calories_burned) || 0),
        0
      );
      const minutesSum = logs.reduce(
        (sum, w) => sum + (Number(w.duration_minutes) || 0),
        0
      );

      setWeekWorkouts(weeklyCount);
      setTotalWorkouts(logs.length);
      setTotalCalories(caloriesSum);
      setTotalMinutes(minutesSum);
      setRecentLogs(logs.slice(0, 5));

      // Notifications privées de l'utilisateur connecté (si table présente)
      const { data: notifRows } = await supabase
        .from("notifications")
        .select("id, title, message, read, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      setNotifications(notifRows ?? []);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des données utilisateur."
      );
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData(false);
  }, [loadHomeData]);

  useEffect(() => {
    if (!isOffline && !loading) {
      loadHomeData(true);
    }
  }, [isOffline, loading, loadHomeData]);

  const weekProgress = Math.min(100, Math.round((weekWorkouts / 5) * 100));

  const formattedLocalDateTime = useMemo(() => {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(now);
  }, [now]);

  const toggleHeroMute = () => {
    const next = !heroMuted;
    setHeroMuted(next);
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = next;
    }
  };

  const toggleHeroPlay = async () => {
    const el = heroVideoRef.current;
    if (!el) return;
    if (el.paused) {
      try {
        await el.play();
        setHeroPlaying(true);
      } catch {
        setHeroPlaying(false);
      }
    } else {
      el.pause();
      setHeroPlaying(false);
    }
  };

  const handleAskCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachQuestion.trim()) return;
    if (!isPremium) {
      setCoachError("L'Assistant IA FIT PRO est réservé aux membres Premium.");
      return;
    }

    setCoachLoading(true);
    setCoachError(null);

    try {
      const res = await fetch("/api/coach-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: coachQuestion.trim() }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.error || "Impossible de contacter l'Assistant IA.");
      }
      setCoachAnswer(body.reply ?? "");
    } catch (err) {
      setCoachError(
        err instanceof Error ? err.message : "Erreur de communication avec l'IA."
      );
    } finally {
      setCoachLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080d13] text-white">
      {(isOffline || errorMsg) && (
        <div className="bg-amber-950/90 border-b border-amber-500/40 px-4 py-2.5 text-xs text-amber-200 flex items-center justify-between gap-3">
          <span>
            {isOffline
              ? "Connexion Internet interrompue. Reconnexion automatique en attente..."
              : errorMsg}
          </span>
          <button
            type="button"
            onClick={() => loadHomeData(true)}
            className="rounded-lg bg-amber-500/20 border border-amber-400/40 px-3 py-1 font-semibold text-amber-100"
          >
            Actualiser
          </button>
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080d13]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-2xl font-black tracking-wider">
            FIT <span className="text-lime-400">PRO</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <Link href="/" className="text-lime-400">
              Accueil
            </Link>
            <Link href="/entrainement">Entraînement</Link>
            <Link href="/nutrition">Nutrition</Link>
            <Link href="/progres">Progression</Link>
            <Link href="/ai-coach">Assistant IA</Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => loadHomeData(true)}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-gray-200 hover:border-lime-400"
            >
              {syncing ? "Sync..." : "Synchroniser"}
            </button>

            <button
              type="button"
              onClick={() => setNotificationsOpen((prev) => !prev)}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-gray-200 hover:border-lime-400"
            >
              Notifications ({notifications.filter((n) => !n.read).length})
            </button>

            {isLogged ? (
              <Link href="/progres" className="flex items-center gap-2 text-sm font-bold">
                {avatarUrl && (
                  <Image
                    src={avatarUrl}
                    alt={firstName || "Profil"}
                    width={28}
                    height={28}
                    unoptimized
                    className="h-7 w-7 rounded-full object-cover border border-lime-400/60"
                  />
                )}
                <span>{firstName || "Compte"}</span>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-lime-400">
                  {isPremium ? "Premium" : "Standard"}
                </span>
              </Link>
            ) : (
              <Link href="/login" className="text-sm">
                Connexion
              </Link>
            )}

            <Link
              href="/abonnement"
              className="rounded-full bg-lime-400 px-5 py-2.5 font-bold text-black"
            >
              Premium
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl md:hidden"
            aria-label="Ouvrir le menu"
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-4 border-t border-white/10 p-5 md:hidden">
            <Link href="/">Accueil</Link>
            <Link href="/entrainement">Entraînement</Link>
            <Link href="/nutrition">Nutrition</Link>
            <Link href="/progres">Progression</Link>
            <Link href="/ai-coach">Assistant IA</Link>
            <Link href="/abonnement">Premium</Link>
            <Link href="/login">Connexion</Link>
          </nav>
        )}
      </header>

      {notificationsOpen && (
        <section className="mx-auto max-w-7xl px-5 pt-4">
          <div className="rounded-2xl border border-white/10 bg-[#111923] p-4">
            <h2 className="text-sm font-bold text-lime-400 mb-2">
              Mes notifications
            </h2>
            {!isLogged ? (
              <p className="text-xs text-gray-400">
                Connectez-vous pour consulter vos notifications personnelles.
              </p>
            ) : notifications.length === 0 ? (
              <p className="text-xs text-gray-400">Aucune notification enregistrée.</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="rounded-xl bg-[#080d13] border border-white/10 p-3 text-xs"
                  >
                    <p className="font-bold text-white">{n.title}</p>
                    <p className="text-gray-400 mt-0.5">{n.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      <section className="relative min-h-[570px] overflow-hidden">
        {HERO_VIDEO_URL && !isSlowConnection ? (
          <video
            ref={heroVideoRef}
            src={HERO_VIDEO_URL}
            poster={HERO_VIDEO_POSTER}
            autoPlay
            loop
            muted={heroMuted}
            playsInline
            preload="metadata"
            onPlay={() => setHeroPlaying(true)}
            onPause={() => setHeroPlaying(false)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={HERO_VIDEO_POSTER}
            alt="FIT PRO"
            fill
            unoptimized
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080d13] via-[#080d13]/80 to-black/30" />

        {HERO_VIDEO_URL && !isSlowConnection && (
          <div className="relative z-10 mx-auto max-w-7xl px-6 pt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={toggleHeroPlay}
              className="rounded-lg bg-black/65 border border-white/20 px-3 py-1.5 text-xs font-semibold"
            >
              {heroPlaying ? "Pause" : "Lecture"}
            </button>
            <button
              type="button"
              onClick={toggleHeroMute}
              className="rounded-lg bg-black/65 border border-white/20 px-3 py-1.5 text-xs font-semibold"
            >
              {heroMuted ? "Activer le son" : "Couper le son"}
            </button>
          </div>
        )}

        <div className="relative mx-auto flex min-h-[570px] max-w-7xl items-center px-6 py-20">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-medium text-lime-400 capitalize">
              {formattedLocalDateTime}
            </p>
            <span className="mb-5 inline-block rounded-full border border-lime-400/40 bg-lime-400/10 px-4 py-2 text-sm font-semibold text-lime-400">
              {isLogged && firstName
                ? `Bonjour ${firstName}`
                : "TON COACH FITNESS INTELLIGENT"}
            </span>
            <h1 className="text-5xl font-black leading-tight md:text-7xl">
              TRANSFORME
              <br />
              TON CORPS.
              <br />
              <span className="text-lime-400">CHANGE TA VIE.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-300">
              {goal
                ? `Objectif actif : ${goal}. Entraînements et suivi basés sur vos activités enregistrées.`
                : "Entraînements personnalisés, nutrition et suivi basés sur vos activités enregistrées."}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/entrainement"
                className="rounded-xl bg-lime-400 px-7 py-4 font-bold text-black"
              >
                Commencer maintenant →
              </Link>
              <Link
                href="/abonnement"
                className="rounded-xl border border-white/30 px-7 py-4 font-semibold"
              >
                Découvrir Premium
              </Link>
            </div>

            {loading ? (
              <p className="mt-10 text-sm text-gray-400">
                Chargement de vos statistiques...
              </p>
            ) : isLogged ? (
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <p className="text-3xl font-black text-lime-400">{totalWorkouts}</p>
                  <p className="text-sm text-gray-400">Séances</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-lime-400">{totalCalories}</p>
                  <p className="text-sm text-gray-400">Calories (kcal)</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-lime-400">{totalMinutes}</p>
                  <p className="text-sm text-gray-400">Minutes</p>
                </div>
                <div>
