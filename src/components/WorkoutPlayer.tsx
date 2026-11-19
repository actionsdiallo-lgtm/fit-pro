"use client";
import { useState, useEffect, useRef } from "react";
type Exercice = { nom: string; reps: string; video: string; consigne: string; };
const EXERCICES: Exercice[] = [
  { nom: "Pompes", reps: "12 reps", video: "https://www.youtube.com/embed/IODxDxX7oi0", consigne: "Dos droit, gainage actif." },
  { nom: "Squats", reps: "15 reps", video: "https://www.youtube.com/embed/YaXPRqUwItQ", consigne: "Genoux vers l'extérieur." },
  { nom: "Gainage", reps: "30 sec", video: "https://www.youtube.com/embed/pSHjTRCQxIw", consigne: "Ne creuse pas le dos." },
  { nom: "Fentes", reps: "10 par jambe", video: "https://www.youtube.com/embed/Q0VaHwm-Q6U", consigne: "Buste droit." },
];
function format(s: number) { const m = Math.floor(s / 60); const r = s % 60; return `${m}:${r < 10 ? "0" : ""}${r}`; }
export default function WorkoutPlayer() {
  const [index, setIndex] = useState(0);
  const [secondes, setSecondes] = useState(0);
  const [enCours, setEnCours] = useState(false);
  const [repos, setRepos] = useState(false);
  const [reposSecondes, setReposSecondes] = useState(30);
  const timer = useRef<any>(null);
  const exo = EXERCICES[index];
  const progress = ((index + 1) / EXERCICES.length) * 100;
  useEffect(() => { if (enCours && !repos) { timer.current = setInterval(() => setSecondes((s) => s + 1), 1000); } else { clearInterval(timer.current); } return () => clearInterval(timer.current); }, [enCours, repos]);
  useEffect(() => { if (!repos) return; if (reposSecondes <= 0) { setRepos(false); setReposSecondes(30); return; } const t = setTimeout(() => setReposSecondes((s) => s - 1), 1000); return () => clearTimeout(t); }, [repos, reposSecondes]);
  function suivant() { if (index < EXERCICES.length - 1) { setIndex(index + 1); setSecondes(0); setRepos(true); setReposSecondes(30); setEnCours(false); } else { setEnCours(false); alert("Séance terminée ! Bravo !"); } }
  function precedent() { if (index > 0) { setIndex(index - 1); setSecondes(0); setRepos(false); setEnCours(false); } }
  function allerA(i: number) { setIndex(i); setSecondes(0); setRepos(false); setEnCours(false); }
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <div style={{ background: "#eee", borderRadius: 99, height: 10, overflow: "hidden" }}><div style={{ width: `${progress}%`, background: "#22c55e", height: "100%" }} /></div>
      <p style={{ textAlign: "center", fontSize: 13, opacity: 0.7 }}>Exercice {index + 1} / {EXERCICES.length} - {Math.round(progress)}%</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>{EXERCICES.map((e, i) => (<button key={i} onClick={() => allerA(i)} style={{ padding: "6px 10px", borderRadius: 99, border: 0, background: i === index ? "#111" : "#e5e5e5", color: i === index ? "#fff" : "#111", fontSize: 12, fontWeight: "bold" }}>{i + 1}. {e.nom}</button>))}</div>
      <div style={{ position: "relative", paddingTop: "56.25%", background: "#000", borderRadius: 16, overflow: "hidden" }}><iframe src={exo.video} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} allowFullScreen title={exo.nom} /></div>
      <h2 style={{ fontSize: 24, margin: "14px 0 4px" }}>{exo.nom} - {exo.reps}</h2>
      <p style={{ opacity: 0.85, fontSize: 14 }}>{exo.consigne}</p>
      {repos ? (<div style={{ background: "#f59e0b", color: "#000", padding: 12, borderRadius: 12, textAlign: "center", fontWeight: "bold", marginTop: 12 }}>REPOS : {reposSecondes}s</div>) : (<div style={{ fontSize: 42, fontWeight: "bold", textAlign: "center", margin: "10px 0" }}>{format(secondes)}</div>)}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={precedent} style={{ flex: 1, background: "#eee", color: "#111", padding: 14, borderRadius: 12, border: 0, fontWeight: "bold" }}>Precedent</button>
        {!enCours ? (<button onClick={() => setEnCours(true)} style={{ flex: 1, background: "#22c55e", color: "#fff", padding: 14, borderRadius: 12, border: 0, fontWeight: "bold" }}>Demarrer</button>) : (<button onClick={() => setEnCours(false)} style={{ flex: 1, background: "#ef4444", color: "#fff", padding: 14, borderRadius: 12, border: 0, fontWeight: "bold" }}>Pause</button>)}
        <button onClick={suivant} style={{ flex: 1, background: "#111", color: "#fff", padding: 14, borderRadius: 12, border: 0, fontWeight: "bold" }}>Suivant</button>
      </div>
    </div>
  );
    }
