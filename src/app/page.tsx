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
  image: string;
}

interface UserProfileRow {
  id: string;
  first_name?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  goal?: string | null;
  weight_kg?: number | null;
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

const HERO_VIDEO_URL: string | null = null;
const HERO_VIDEO_POSTER =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600";

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

  const [isLogged, setIsLogged] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [weightKg, setWeightKg] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  const [weekWorkouts, setWeekWorkouts] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [recentLogs, setRecentLogs] = useState<WorkoutLogRow[]>([]);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);

  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [heroMuted, setHeroMuted] = useState(true);
  const [heroPlaying, setHeroPlaying] = useState(true);

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
      setErrorMsg(
        "Connexion Internet interrompue. Reconnexion automatique dès le retour du réseau."
      );
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
              <Link
                href="/progres"
                className="flex items-center gap-2 text-sm font-bold"
              >
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
                  <p className="text-3xl font-black text-lime-400">
                    {totalWorkouts}
                  </p>
                  <p className="text-sm text-gray-400">Séances</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-lime-400">
                    {totalCalories}
                  </p>
                  <p className="text-sm text-gray-400">Calories (kcal)</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-lime-400">
                    {totalMinutes}
                  </p>
                  <p className="text-sm text-gray-400">Minutes</p>
                </div>
                
                </div>
                                                                                                          <div>
                    <p className="text-3xl font-bold text-white">
                      {weightKg !== null ? `${weightKg} kg` : "—"}
                    </p>
                    <p className="text-sm text-gray-400">Poids</p>
                  </div>
                </div>
              ) : (
                <p className="mt-10 text-sm text-gray-400">
                  
      
                  
              </p>
            )}
            
            
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-bold uppercase tracking-widest text-lime-400">
              Entraînement
            </p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              Choisis ton entraînement
            </h2>
          </div>
          <Link href="/entrainement" className="text-lime-400">
            Voir tous les exercices →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {workouts.map((w) => (
            <Link
              href={w.href}
              key={w.title}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111923]"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={w.image}
                  alt={w.title}
                  fill
                  unoptimized
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full bg-lime-400 px-3 py-1 text-xs font-bold text-black">
                  {w.duration}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold">{w.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{w.level}</p>
                <p className="mt-4 font-semibold text-lime-400">Découvrir →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="grid overflow-hidden rounded-3xl bg-[#15231c] md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-12">
            <span className="font-bold text-lime-400">PROGRAMME INTELLIGENT</span>
            <h2 className="mt-4 text-4xl font-black">
              Un programme adapté à tes objectifs.
            </h2>
            <p className="mt-5 leading-7 text-gray-300">
              Construis ton programme selon ton niveau, ton âge, ton poids, tes
              disponibilités et tes objectifs.
            </p>
            <Link
              href="/entrainement"
              className="mt-8 w-fit rounded-xl bg-lime-400 px-6 py-3 font-bold text-black"
            >
              Créer mon programme →
            </Link>
          </div>
          <div className="relative min-h-[330px]">
            <Image
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000"
              alt="Programme"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
      </section>      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="mb-10">
          <p className="font-bold uppercase tracking-widest text-lime-400">
            Nutrition
          </p>
          <h2 className="mt-2 text-3xl font-black">Mange mieux. Vis mieux.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {meals.map((meal) => (
            <Link
              href="/nutrition"
              key={meal.name}
              className="group relative h-72 overflow-hidden rounded-2xl"
            >
              <Image
                src={meal.image}
                alt={meal.name}
                fill
                unoptimized
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <h3 className="absolute bottom-6 left-6 text-2xl font-bold">
                {meal.name}
              </h3>
            </Link>
          ))}
        </div>
        <Link
          href="/nutrition"
          className="mt-6 inline-block font-semibold text-lime-400"
        >
          Explorer la nutrition →
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="rounded-3xl border border-white/10 bg-[#111923] p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="font-bold text-lime-400">TES RÉSULTATS</p>
              <h2 className="mt-3 text-3xl font-black">Chaque effort compte.</h2>
              <p className="mt-4 text-gray-400">
                Suis tes entraînements, tes calories, ton poids et tes progrès au fil
                du temps.
              </p>
              {isLogged && recentLogs.length > 0 && (
                <ul className="mt-4 space-y-1.5 text-xs text-gray-300">
                  {recentLogs.slice(0, 3).map((item) => (
                    <li key={item.id}>
                      {item.title || "Séance"} — {item.duration_minutes || 0} min (
                      {item.calories_burned || 0} kcal)
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/progres"
                className="mt-7 inline-block rounded-xl bg-lime-400 px-6 py-3 font-bold text-black"
              >
                Voir ma progression →
              </Link>
            </div>
            <div className="rounded-2xl bg-[#080d13] p-7">
              <p className="text-gray-400">Objectif hebdomadaire</p>
              <p className="mt-3 text-4xl font-black">{weekWorkouts} / 5</p>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-700">
                <div
                  className="h-full rounded-full bg-lime-400"
                  style={{ width: `${weekProgress}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-gray-400">
                {isLogged
                  ? `${weekProgress}% de ton objectif`
                  : "Connecte-toi pour suivre tes résultats."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="rounded-3xl border border-white/10 bg-[#111923] p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
                TON COACH IA FIT PRO · PREMIUM
              </span>
              <h2 className="mt-1 text-2xl font-black">
                Conseils personnalisés à partir de votre profil
              </h2>
            </div>
            {isPremium ? (
              <button
                type="button"
                onClick={() => setCoachOpen((prev) => !prev)}
                className="rounded-xl bg-lime-400 px-6 py-3 font-bold text-black text-sm"
              >
                PARLER À MON COACH IA
              </button>
            ) : (
              <Link
                href="/abonnement"
                className="rounded-xl border border-lime-400/40 px-5 py-3 text-sm font-semibold text-lime-400 text-center"
              >
                Réservé aux membres Premium
              </Link>
            )}
          </div>

          {coachOpen && isPremium && (
            <form onSubmit={handleAskCoach} className="mt-5 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coachQuestion}
                  onChange={(e) => setCoachQuestion(e.target.value)}
                  placeholder="Posez votre question sur l'entraînement ou la nutrition..."
                  className="flex-1 rounded-xl border border-white/15 bg-[#080d13] px-4 py-2.5 text-sm text-white"
                />
                <button
                  type="submit"
                  disabled={coachLoading}
                  className="rounded-xl bg-lime-400 px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50"
                >
                  {coachLoading ? "Envoi..." : "Envoyer"}
                </button>
              </div>
              {coachError && <p className="text-xs text-red-400">{coachError}</p>}
              {coachAnswer && (
                <div className="rounded-2xl border border-white/10 bg-[#080d13] p-4 text-sm text-gray-200 whitespace-pre-line">
                  {coachAnswer}
                </div>
              )}
            </form>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-lime-400/30 bg-gradient-to-br from-[#243c27] to-[#101a13] p-9 md:p-16">
          <div className="relative z-10 max-w-2xl">
            <span className="font-bold text-lime-400">FIT PRO PREMIUM</span>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Passe au niveau supérieur.
            </h2>
            <ul className="mt-7 space-y-3 text-gray-200">
              <li>✓ Assistant IA écrit et vocal</li>
              <li>✓ Programmes personnalisés</li>
              <li>✓ Vidéos d&apos;entraînement</li>
              <li>✓ Suivi avancé des progrès</li>
              <li>✓ Expérience sans publicité</li>
            </ul>
            <Link
              href="/abonnement"
              className="mt-9 inline-block rounded-xl bg-lime-400 px-8 py-4 font-black text-black"
            >
              Découvrir Premium →
            </Link>
          </div>
        </div>
      </section>

      {!isPremium && (
        <section className="mx-auto max-w-7xl px-5 pb-12">
          <div className="rounded-2xl border border-white/10 bg-[#0d131a] px-5 py-3.5 flex items-center justify-between text-xs text-gray-400">
            <span>
              Espace sponsorisé — Passez à FIT PRO Premium pour masquer les publicités.
            </span>
            <Link href="/abonnement" className="font-semibold text-lime-400">
              Sans pub
            </Link>
          </div>
        </section>
      )}

      <footer className="border-t border-white/10 px-5 py-10 text-center">
        <p className="text-2xl font-black">
          FIT <span className="text-lime-400">PRO</span>
        </p>
        <p className="mt-3 text-sm text-gray-400">
          Ton corps. Tes objectifs. Ta transformation.
        </p>
        <p className="mt-8 text-xs text-gray-500">
          © {new Date().getFullYear()} FIT PRO. Tous droits réservés.
        </p>
      </footer>
    </main>
  );
              }
                
                                          
  
