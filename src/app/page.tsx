"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const workouts = [
  { title: "Musculation", level: "Tous niveaux", duration: "30 min", image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900", href: "/entrainement" },
  { title: "Cardio", level: "Intermédiaire", duration: "20 min", image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=900", href: "/entrainement" },
  { title: "Yoga", level: "Débutant", duration: "25 min", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900", href: "/entrainement" },
];

const meals = [
  { name: "Petit-déjeuner équilibré", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=700" },
  { name: "Repas protéiné", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700" },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [weekWorkouts, setWeekWorkouts] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setIsLogged(true);
      const start = new Date(); start.setDate(start.getDate() - 7);
      const { data } = await supabase.from("workouts").select("id").eq("user_id", user.id).gte("created_at", start.toISOString());
      setWeekWorkouts(data?.length || 0);
    }
    load();
  }, []);

  const weekProgress = Math.min(100, Math.round((weekWorkouts / 5) * 100));

  return (
    <main className="min-h-screen bg-[#080d13] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080d13]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-2xl font-black tracking-wider">FIT <span className="text-lime-400">PRO</span></Link>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            <Link href="/" className="text-lime-400">Accueil</Link>
            <Link href="/entrainement">Entraînement</Link>
            <Link href="/nutrition">Nutrition</Link>
            <Link href="/progres">Progression</Link>
            <Link href="/ai-coach">Assistant IA</Link>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {isLogged ? <span className="text-sm font-bold">Connecté 👋</span> : <Link href="/login" className="text-sm">Connexion</Link>}
            <Link href="/abonnement" className="rounded-full bg-lime-400 px-5 py-2.5 font-bold text-black">Premium</Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl md:hidden" aria-label="Ouvrir le menu">☰</button>
        </div>
        {menuOpen && (
          <nav className="flex flex-col gap-4 border-t border-white/10 p-5 md:hidden">
            <Link href="/">Accueil</Link><Link href="/entrainement">Entraînement</Link><Link href="/nutrition">Nutrition</Link><Link href="/progres">Progression</Link><Link href="/ai-coach">Assistant IA</Link><Link href="/abonnement">Premium</Link><Link href="/login">Connexion</Link>
          </nav>
        )}
      </header>

      <section className="relative min-h-[570px] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600" alt="" fill unoptimized className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080d13] via-[#080d13]/80 to-black/30" />
        <div className="relative mx-auto flex min-h-[570px] max-w-7xl items-center px-6 py-20">
          <div className="max-w-2xl">
            <span className="mb-5 inline-block rounded-full border border-lime-400/40 bg-lime-400/10 px-4 py-2 text-sm font-semibold text-lime-400">TON COACH FITNESS INTELLIGENT</span>
            <h1 className="text-5xl font-black leading-tight md:text-7xl">TRANSFORME<br />TON CORPS.<br /><span className="text-lime-400">CHANGE TA VIE.</span></h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-300">Entraînements personnalisés, nutrition intelligente et accompagnement pour atteindre tes objectifs.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/entrainement" className="rounded-xl bg-lime-400 px-7 py-4 font-bold text-black">Commencer maintenant →</Link>
              <Link href="/abonnement" className="rounded-xl border border-white/30 px-7 py-4 font-semibold">Découvrir Premium</Link>
            </div>
            <div className="mt-12 flex gap-10">
              <div><p className="text-3xl font-black text-lime-400">100+</p><p className="text-sm text-gray-400">Exercices</p></div>
              <div><p className="text-3xl font-black text-lime-400">50+</p><p className="text-sm text-gray-400">Programmes</p></div>
              <div><p className="text-3xl font-black text-lime-400">24/7</p><p className="text-sm text-gray-400">Accompagnement</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div><p className="font-bold uppercase tracking-widest text-lime-400">Entraînement</p><h2 className="mt-2 text-3xl font-black md:text-4xl">Choisis ton entraînement</h2></div>
          <Link href="/entrainement" className="text-lime-400">Voir tous les exercices →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {workouts.map((w) => (
            <Link href={w.href} key={w.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111923]">
              <div className="relative h-64 overflow-hidden">
                <Image src={w.image} alt={w.title} fill unoptimized className="object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full bg-lime-400 px-3 py-1 text-xs font-bold text-black">{w.duration}</span>
              </div>
              <div className="p-5"><h3 className="text-xl font-bold">{w.title}</h3><p className="mt-2 text-sm text-gray-400">{w.level}</p><p className="mt-4 font-semibold text-lime-400">Découvrir →</p></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="grid overflow-hidden rounded-3xl bg-[#15231c] md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-12">
            <span className="font-bold text-lime-400">PROGRAMME INTELLIGENT</span>
            <h2 className="mt-4 text-4xl font-black">Un programme adapté à tes objectifs.</h2>
            <p className="mt-5 leading-7 text-gray-300">Construis ton programme selon ton niveau, ton âge, ton poids, tes disponibilités et tes objectifs.</p>
            <Link href="/entrainement" className="mt-8 w-fit rounded-xl bg-lime-400 px-6 py-3 font-bold text-black">Créer mon programme →</Link>
          </div>
          <div className="relative min-h-[330px]"><Image src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000" alt="Programme" fill unoptimized className="object-cover" /></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="mb-10"><p className="font-bold uppercase tracking-widest text-lime-400">Nutrition</p><h2 className="mt-2 text-3xl font-black">Mange mieux. Vis mieux.</h2></div>
        <div className="grid gap-6 md:grid-cols-2">
          {meals.map((meal) => (
            <Link href="/nutrition" key={meal.name} className="group relative h-72 overflow-hidden rounded-2xl">
              <Image src={meal.image} alt={meal.name} fill unoptimized className="object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <h3 className="absolute bottom-6 left-6 text-2xl font-bold">{meal.name}</h3>
            </Link>
          ))}
        </div>
        <Link href="/nutrition" className="mt-6 inline-block font-semibold text-lime-400">Explorer la nutrition →</Link>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="rounded-3xl border border-white/10 bg-[#111923] p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="font-bold text-lime-400">TES RÉSULTATS</p>
              <h2 className="mt-3 text-3xl font-black">Chaque effort compte.</h2>
              <p className="mt-4 text-gray-400">Suis tes entraînements, tes calories, ton poids et tes progrès au fil du temps.</p>
              <Link href="/progres" className="mt-7 inline-block rounded-xl bg-lime-400 px-6 py-3 font-bold text-black">Voir ma progression →</Link>
            </div>
            <div className="rounded-2xl bg-[#080d13] p-7">
              <p className="text-gray-400">Objectif hebdomadaire</p>
              <p className="mt-3 text-4xl font-black">{weekWorkouts} / 5</p>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-700"><div className="h-full rounded-full bg-lime-400" style={{ width: `${weekProgress}%` }} /></div>
              <p className="mt-3 text-sm text-gray-400">{isLogged ? `${weekProgress}% de ton objectif` : "Connecte-toi pour suivre tes résultats."}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-lime-400/30 bg-gradient-to-br from-[#243c27] to-[#101a13] p-9 md:p-16">
          <div className="relative z-10 max-w-2xl">
            <span className="font-bold text-lime-400">FIT PRO PREMIUM</span>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">Passe au niveau supérieur.</h2>
            <ul className="mt-7 space-y-3 text-gray-200"><li>✓ Assistant IA écrit et vocal</li><li>✓ Programmes personnalisés</li><li>✓ Vidéos d&apos;entraînement</li><li>✓ Suivi avancé des progrès</li><li>✓ Expérience sans publicité</li></ul>
            <Link href="/abonnement" className="mt-9 inline-block rounded-xl bg-lime-400 px-8 py-4 font-black text-black">Découvrir Premium →</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-10 text-center">
        <p className="text-2xl font-black">FIT <span className="text-lime-400">PRO</span></p>
        <p className="mt-3 text-sm text-gray-400">Ton corps. Tes objectifs. Ta transformation.</p>
        <p className="mt-8 text-xs text-gray-500">© {new Date().getFullYear()} FIT PRO. Tous droits réservés.</p>
      </footer>
    </main>
  );
              }
