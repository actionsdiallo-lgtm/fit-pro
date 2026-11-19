"use client";
import { useState, useEffect, useRef } from "react";

type Exercice = { nom: string; reps: string; video: string; consigne: string; };

const EXERCICES: Exercice[] = [
  { nom: "Pompes", reps: "12 reps", video: "https://www.youtube.com/embed/IODxDxX7oi0", consigne: "Dos droit, gainage actif." },
  { nom: "Squats", reps: "15 reps", video: "https://www.youtube.com/embed/YaXPRqUwItQ", consigne: "Genoux vers l'extérieur." },
  { nom: "Gainage", reps: "30 sec", video: "https://www.youtube.com/embed/pSHjTRCQxIw", consigne: "Ne creuse pas le dos." },
  { nom: "Fentes", reps: "10 par jambe", video: "https://www.youtube.com/embed/QOVaHwm-Q6U", consigne: "Buste droit." },
];

function format(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r < 10 ? "0" : ""}${r}`;
}

export default function WorkoutPlayer() {
  const [index, setIndex] = useState(0);
  const [secondes, setSecondes] = useState(0);
  const [enCours, setEnCours] = useState(false);
  const [repos, setRepos] = useState(false);
  const [reposSecondes, setReposSecondes] = useState(30);
  const timer = useRef<any>(null);

  useEffect(() => {
    if (enCours && !repos) {
      timer.current = setInterval(() => setSecondes((v) => v + 1), 1000);
    } else if (repos) {
      timer.current = setInterval(() => setReposSecondes((v) => {
        if (v <= 1) {
          setRepos(false);
          setReposSecondes(30);
          return 30;
        }
        return v - 1;
      }), 1000);
    }
    return () => clearInterval(timer.current);
  }, [enCours, repos]);

  const exo = EXERCICES[index];

  const suivant = () => {
    if (index < EXERCICES.length - 1) {
      setIndex(index + 1);
      setSecondes(0);
      setEnCours(false);
      setRepos(true);
    } else {
      setEnCours(false);
      setRepos(false);
      alert("Séance terminée ! Bravo !");
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 16 }}>
      <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden", background: "#000" }}>
        <iframe src={exo.video} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} allowFullScreen title={exo.nom} />
      </div>
      <h2 style={{ fontSize: 24, margin: "14px 0 4px" }}>{exo.nom} - {exo.reps}</h2>
      <p style={{ opacity: 0.85, fontSize: 14 }}>{exo.consigne}</p>
      {repos ? (
        <div style={{ background: "#f59e0b", color: "#000", padding: 12, borderRadius: 12, textAlign: "center", fontWeight: "bold", marginTop: 12 }}>⏸ REPOS : {reposSecondes}s</div>
      ) : (
        <div style={{ fontSize: 42, fontWeight: "bold", textAlign: "center", margin: "10px 0" }}>⏱ {format(secondes)}</div>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {!enCours ? (
          <button onClick={() => setEnCours(true)} style={{ flex: 1, background: "#22c55e", color: "#fff", padding: 14, borderRadius: 12, border: 0, fontWeight: "bold" }}>▶ Démarrer</button>
        ) : (
          <button onClick={() => setEnCours(false)} style={{ flex: 1, background: "#ef4444", color: "#fff", padding: 14, borderRadius: 12, border: 0, fontWeight: "bold" }}>⏸ Pause</button>
        )}
        <button onClick={suivant} style={{ flex: 1, background: "#111", color: "#fff", padding: 14, borderRadius: 12, border: 0, fontWeight: "bold" }}>Suivant →</button>
      </div>
      <p style={{ textAlign: "center", opacity: 0.7, marginTop: 12 }}>Exercice {index + 1} / {EXERCICES.length}</p>
    </div>
  );
          }
