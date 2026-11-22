"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  CATEGORIES_LISTE,
  CategorieNom,
  EXERCICES_REELS,
  MouvementAnime2D,
  NiveauProgramme,
  SeanceEnregistree,
  ZoneMuscle,
} from "@/lib/entrainement-data";

function PhotoExercice({ src, alt, titre }: { src: string; alt: string; titre: string }) {
  const [erreur, setErreur] = useState(false);
  return (
    <div className="h-36 w-full overflow-hidden rounded-2xl border border-green-500/25 bg-[#0a120d]">
      {!erreur ? (
        <img src={src} alt={alt} onError={() => setErreur(true)} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full flex-col items-center justify-center px-3 text-center">
          <span className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-[10px] font-bold text-green-300">
            Photo réelle · {titre}
          </span>
          <p className="mt-1 text-[11px] text-slate-400">{src}</p>
        </div>
      )}
    </div>
  );
}

function Animation2D({
  mouvement,
  zones,
  enLecture,
}: {
  mouvement: MouvementAnime2D;
  zones: ZoneMuscle[];
  enLecture: boolean;
}) {
  const anim =
    mouvement === "pompe"
      ? "animP 1.6s ease-in-out infinite"
      : mouvement === "abdos"
      ? "animA 1.5s ease-in-out infinite"
      : mouvement === "squat"
      ? "animQ 1.4s ease-in-out infinite"
      : mouvement === "bras"
      ? "animB 1.5s ease-in-out infinite"
      : mouvement === "etirement"
      ? "animE 1.8s ease-in-out infinite"
      : "animS 1.6s ease-in-out infinite";
  const c = (z: ZoneMuscle) => (zones.includes(z) ? "#22c55e" : "#475569");

  return (
    <div className="grid grid-cols-12 gap-2 rounded-2xl border border-green-500/30 bg-[#07110b] p-2.5 items-center">
      <div className="col-span-8 overflow-hidden rounded-xl border border-white/10 bg-[#0d1812] p-2">
        <style>{`@keyframes animS{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes animP{0%,100%{transform:translateY(0)}50%{transform:translateY(7px)}}@keyframes animA{0%,100%{transform:rotate(0)}50%{transform:rotate(-6deg)}}@keyframes animQ{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}@keyframes animB{0%,100%{transform:rotate(0)}50%{transform:rotate(-7deg)}}@keyframes animE{0%,100%{transform:scaleX(1)}50%{transform:scaleX(1.03)}}.fp2d{transform-origin:140px 72px;animation:${anim};animation-play-state:${enLecture ? "running" : "paused"}}`}</style>
        <svg viewBox="0 0 280 110" className="h-24 w-full" fill="none">
          <line x1="20" y1="96" x2="260" y2="96" stroke="#1e293b" strokeWidth="3" />
          <g className="fp2d">
            <circle cx="195" cy="48" r="9" fill="#e2e8f0" />
            <path d="M110 62L185 56L186 70L112 76Z" fill={c("dos")} />
            <path d="M110 62L65 50L68 58L112 70Z" fill={c("fessiers")} />
            <path d="M112 70L62 82L64 89L114 77Z" fill={c("jambes")} />
            <path d="M182 58L240 42L242 50L185 66Z" fill={c("bras")} />
            <path d="M182 66L238 74L237 81L181 73Z" fill={c("avant-bras")} />
          </g>
        </svg>
      </div>
      <div className="col-span-4 flex flex-col items-center justify-center rounded-xl border border-white/10 bg-[#0d1812] p-1.5">
        <span className="text-[10px] font-bold uppercase text-green-400">Muscles</span>
        <svg viewBox="0 0 60 80" className="h-20 w-12" fill="none">
          <circle cx="30" cy="9" r="5.5" fill="#64748b" />
          <path d="M18 19C18 16 24 15 30 15C36 15 42 16 42 19L39 39H21L18 19Z" fill={c("pectoraux")} />
          <rect x="23" y="29" width="14" height="10" rx="2" fill={c("abdos")} />
          <path d="M18 20L10 36L14 38L21 25M42 20L50 36L46 38L39 25" fill={c("bras")} />
          <path d="M22 40L19 74H26L29 48M38 40L41 74H34L31 48" fill={c("jambes")} />
        </svg>
      </div>
    </div>
  );
}

export default function EntrainementPage() {
  const { data: session, status } = useSession();
  const [categorie, setCategorie] = useState<CategorieNom>("Tous");
  const [niveau, setNiveau] = useState<NiveauProgramme>("Débutant");
  const [idx, setIdx] = useState(0);
  const [serie, setSerie] = useState(1);
  const [seriesFaites, setSeriesFaites] = useState(0);
  const [repsFaites, setRepsFaites] = useState(0);
  const [secRestantes, setSecRestantes] = useState(30);
  const [enRepos, setEnRepos] = useState(false);
  const [lecture, setLecture] = useState(true);
  const [dureeSec, setDureeSec] = useState(0);
  const [faits, setFaits] = useState<Record<string, boolean>>({});
  const [langue, setLangue] = useState<"fr" | "en" | "ar">("fr");
  const [voixUri, setVoixUri] = useState("");
  const [voixList, setVoixList] = useState<SpeechSynthesisVoice[]>([]);
  const [historique, setHistorique] = useState<SeanceEnregistree[]>([]);
  const [msg, setMsg] = useState("");
  const sauveRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const maj = () => setVoixList(window.speechSynthesis.getVoices());
    maj();
    window.speechSynthesis.onvoiceschanged = maj;
  }, []);

  const chargerHistorique = useCallback(async () => {
    try {
      const r = await fetch("/api/entrainement/seances", { cache: "no-store" });
      if (!r.ok) return;
      const d = await r.json();
      if (Array.isArray(d.sessions)) setHistorique(d.sessions);
    } catch {}
  }, []);

  useEffect(() => {
    void chargerHistorique();
  }, [chargerHistorique, status]);

  const liste = useMemo(() => {
    const base = categorie === "Tous" ? EXERCICES_REELS : EXERCICES_REELS.filter((e) => e.categorie === categorie);
    const parNiv = base.filter((e) => e.niveau === niveau);
    return parNiv.length > 0 ? parNiv : base;
  }, [categorie, niveau]);

  const courant = liste[idx] ?? liste[0] ?? EXERCICES_REELS[0];
  const calories = useMemo(() => Math.max(0, Math.round((dureeSec / 60) * courant.metEstime)), [dureeSec, courant.metEstime]);

  const parler = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(courant.vocal[langue]);
    u.lang = { fr: "fr-FR", en: "en-US", ar: "ar-SA" }[langue];
    const v = voixList.find((item) => item.voiceURI === voixUri);
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }, [courant, langue, voixList, voixUri]);

  const enregistrer = useCallback(async () => {
    if (sauveRef.current || (dureeSec < 5 && repsFaites === 0)) return;
    sauveRef.current = true;
    try {
      const r = await fetch("/api/entrainement/seances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categorie: courant.categorie,
          programmeTitre: `${categorie} — ${niveau}`,
          niveau,
          dureeSecondes: Math.max(5, dureeSec),
          caloriesEstimees: calories,
          exercicesFaits: Math.max(1, Object.values(faits).filter(Boolean).length),
          totalExercices: liste.length,
        }),
      });
      if (r.ok) {
        setMsg("Séance enregistrée dans votre compte et synchronisée avec Progrès.");
        await chargerHistorique();
      } else {
        sauveRef.current = false;
        setMsg("Connectez-vous pour enregistrer votre séance.");
      }
    } catch {
      sauveRef.current = false;
    }
  }, [calories, categorie, chargerHistorique, courant.categorie, dureeSec, faits, liste.length, niveau, repsFaites]);

  const suivant = useCallback(() => {
    setFaits((p) => ({ ...p, [courant.id]: true }));
    if (idx + 1 < liste.length) {
      setIdx(idx + 1);
      setSerie(1);
      setEnRepos(false);
      setSecRestantes(liste[idx + 1].dureeSecondes);
      setLecture(true);
    } else {
      setLecture(false);
      void enregistrer();
    }
  }, [courant.id, enregistrer, idx, liste]);

  useEffect(() => {
    if (!lecture) return;
    const t = window.setInterval(() => {
      setDureeSec((d) => d + 1);
      if (!enRepos) setRepsFaites((r) => r + 1);
      setSecRestantes((prev) => {
        if (prev > 1) return prev - 1;
        if (!enRepos) {
          setSeriesFaites((s) => s + 1);
          if (serie < courant.seriesCibles) {
            setEnRepos(true);
            return courant.reposSecondes;
          }
          window.setTimeout(() => suivant(), 0);
          return 0;
        }
        setEnRepos(false);
        setSerie((s) => s + 1);
        return courant.dureeSecondes;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [courant.dureeSecondes, courant.reposSecondes, courant.seriesCibles, enRepos, lecture, serie, suivant]);

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      <div className="mx-auto max-w-2xl px-4 pt-3 space-y-4">
        <header className="flex items-center justify-between border-b border-green-500/25 pb-3">
          <div>
            <p className="text-xs font-black text-green-400">FIT PRO · ENTRAÎNEMENT</p>
            <p className="text-[11px] text-slate-400">
              {status === "authenticated" ? session?.user?.name || session?.user?.email : "Compte invité"}
            </p>
          </div>
          <Link href="/progres" className="rounded-xl bg-green-500 px-3 py-1.5 text-xs font-black text-black">
            Progrès
          </Link>
        </header>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES_LISTE.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => {
                setCategorie(c.nom);
                setIdx(0);
                setSerie(1);
                setEnRepos(false);
                sauveRef.current = false;
              }}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                c.nom === categorie ? "bg-green-500 text-black" : "border border-white/15 bg-[#0e1511] text-slate-200"
              }`}
            >
              {c.nom}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(["Débutant", "Intermédiaire", "Avancé"] as NiveauProgramme[]).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setNiveau(n);
                setIdx(0);
                setSerie(1);
                setEnRepos(false);
              }}
              className={`rounded-xl border py-2 text-xs font-black ${
                n === niveau ? "border-green-400 bg-green-500 text-black" : "border-white/15 bg-[#0e1511] text-slate-200"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <section className="rounded-3xl border border-green-500/30 bg-[#0b130e] p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase text-green-400">
                {courant.categorie} · {enRepos ? `Repos ${courant.reposSecondes}s` : `Série ${serie}/${courant.seriesCibles}`}
              </p>
              <h1 className="text-lg font-black">{courant.nom}</h1>
              <p className="text-xs text-slate-300">{courant.musclesPrincipaux.join(" · ")}</p>
            </div>
            <span className="rounded-xl bg-green-500/15 px-3 py-1.5 font-mono text-sm font-black text-green-300">
              00:{String(secRestantes).padStart(2, "0")}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <PhotoExercice src={courant.photoUrl} alt={courant.photoAlt} titre={courant.nom} />
            <Animation2D mouvement={courant.mouvement2D} zones={courant.zonesCiblees} enLecture={lecture && !enRepos} />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button type="button" onClick={() => setLecture((p) => !p)} className="rounded-xl bg-green-500 py-2 text-xs font-black text-black">
              {lecture ? "Pause" : "Reprendre"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEnRepos(false);
                setSecRestantes(courant.dureeSecondes);
                setLecture(true);
                parler();
              }}
              className="rounded-xl border border-green-400/40 bg-green-500/10 py-2 text-xs font-bold text-green-300"
            >
              Répéter
            </button>
            <button type="button" onClick={suivant} className="rounded-xl border border-white/15 py-2 text-xs font-bold">
              Suivant →
            </button>
            <button type="button" onClick={parler} className="rounded-xl border border-green-400/40 bg-[#122017] py-2 text-xs font-bold text-green-300">
              Voix
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex gap-1.5">
              {(["fr", "en", "ar"] as const).map((lg) => (
                <button
                  key={lg}
                  type="button"
                  onClick={() => setLangue(lg)}
                  className={`rounded-md px-2 py-0.5 font-bold uppercase ${langue === lg ? "bg-green-500 text-black" : "bg-white/10"}`}
                >
                  {lg}
                </button>
              ))}
            </div>
            {voixList.length > 0 && (
              <select
                value={voixUri}
                onChange={(e) => setVoixUri(e.target.value)}
                aria-label="Voix"
                className="max-w-[180px] rounded-lg border border-white/15 bg-[#0e1511] px-2 py-1 text-[11px]"
              >
                <option value="">Voix par défaut</option>
                {voixList.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-2 text-xs">
            <div className="rounded-2xl border border-white/10 bg-black/50 p-3 space-y-1">
              <p className="font-bold text-green-400">Bonne posture</p>
              <p className="text-slate-200">{courant.bonnePosture.join(" · ")}</p>
              <p className="pt-1 font-bold text-amber-400">Erreurs à éviter</p>
              <p className="text-slate-300">{courant.erreursAEviter.join(" · ")}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 p-3 space-y-1">
              <p className="font-bold text-green-400">Étapes</p>
              <ol className="list-decimal pl-4 space-y-1 text-slate-200">
                {courant.etapes.map((et) => <li key={et}>{et}</li>)}
              </ol>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0e1511] p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase text-green-400">Suivi réel</h2>
            <button type="button" onClick={() => void enregistrer()} className="rounded-lg bg-green-500 px-3 py-1 text-[11px] font-black text-black">
              Enregistrer
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="rounded-xl bg-black/50 p-2">
              <p className="text-sm font-black">{Math.floor(dureeSec / 60)}m {dureeSec % 60}s</p>
              <p className="text-[10px] text-slate-400">Durée</p>
            </div>
            <div className="rounded-xl bg-black/50 p-2">
              <p className="text-sm font-black text-green-400">{repsFaites}</p>
              <p className="text-[10px] text-slate-400">Répétitions</p>
            </div>
            <div className="rounded-xl bg-black/50 p-2">
              <p className="text-sm font-black">{seriesFaites}</p>
              <p className="text-[10px] text-slate-400">Séries</p>
            </div>
            <div className="rounded-xl bg-black/50 p-2">
              <p className="text-sm font-black text-amber-300">{calories} kcal</p>
              <p className="text-[10px] text-slate-400">Calories</p>
            </div>
          </div>
          {msg && <p className="text-xs font-semibold text-green-400">{msg}</p>}
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0e1511] p-3.5 space-y-2">
          <h2 className="text-xs font-bold uppercase text-green-400">Historique ({historique.length})</h2>
          {historique.slice(0, 5).map((h) => (
            <div key={h.id} className="flex items-center justify-between rounded-xl bg-black/50 p-2.5 text-xs">
              <div>
                <p className="font-bold">{h.programmeTitre}</p>
                <p className="text-[11px] text-slate-400">{h.categorie} · {h.niveau}</p>
              </div>
              <span className="font-bold text-green-400">{h.caloriesEstimees} kcal</span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
            }
  
