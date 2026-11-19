"use client";
import { useState, useEffect, useRef } from "react";

type Exercice = { nom: string; reps: string; video: string; consigne: string; };

const EXERCICES: Exercice[] = [
  { nom: "Pompes", reps: "12 reps", video: "https://www.youtube.com/embed/IODxDxX7oi0", consigne: "Dos droit, descends lentement." },
  { nom: "Squats", reps: "15 reps", video: "https://www.youtube.com/embed/YaXPRqUwItQ", consigne: "Pieds largeur épaules, fesses en arrière." },
  { nom: "Gainage", reps: "30 sec", video: "https://www.youtube.com/embed/pSHjTRCQxIw", consigne: "Ventre serré, corps bien droit." },
  { nom: "Abdominaux", reps: "15 reps", video: "https://www.youtube.com/embed/1fbU_MkV7NE", consigne: "Ne tire pas sur ta nuque." },
];

export default function WorkoutPlayer() {
  const [index, setIndex] = useState(0);
  const [serie, setSerie] = useState(1);
  const [secondes, setSecondes] = useState(0);
  const [enCours, setEnCours] = useState(false);
  const [repos, setRepos] = useState(false);
  const [reposSecondes, setReposSecondes] = useState(30);
  const timer = useRef<any>(null);
  const exo = EXERCICES[index];

  useEffect(() => {
    if (enCours) { timer.current = setInterval(() => setSecondes(s => s + 1), 1000); }
    else clearInterval(timer.current);
    return () => clearInterval(timer.current);
  }, [enCours]);

  useEffect(() => {
    if (repos && reposSecondes > 0) {
      const t = setTimeout(() => setReposSecondes(s => s - 1), 1000);
      return () => clearTimeout(t);
    }
    if (repos && reposSecondes === 0) setRepos(false);
  }, [repos, reposSecondes]);

  const format = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const suivant = () => {
    if (index < EXERCICES.length - 1) { setIndex(index + 1); setSecondes(0); setSerie(1); }
    else { setEnCours(false); alert("Bravo ! Séance terminée 💪"); }
  };

  return (
    <div style={{ background: "#111", color: "#fff", borderRadius: 20, padding: 16, maxWidth: 480, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, opacity: 0.8 }}>
        <span>Exercice {index + 1} / {EXERCICES.length}</span>
        <span>Série {serie} / 3</span>
      </div>
      <div style={{ height: 8, background: "#333", borderRadius: 99, margin: "12px 0", overflow: "hidden" }}>
        <div style={{ width: `${((index * 3 + serie) / (EXERCICES.length * 3)) * 100}%`, height: "100%", background: "#22c55e" }} />
      </div>
      <div style={{ borderRadius: 16, overflow: "hidden", background: "#000", aspectRatio: "16/9" }}>
        <iframe src={exo.video} style={{ width: "100%", height: "100%", border: 0 }} allowFullScreen title={exo.nom} />
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
          <button onClick={() => setEnCours(true)} style={{ flex: 1, background: "#22c55e", color: "#fff", padding: 14, borderRadius: 12, border: 0, fontWeight: "bold
