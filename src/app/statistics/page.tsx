"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Statistics() {
  const [history, setHistory] = useState<any[]>([]);
  const [weight, setWeight] = useState(82);
  const [goalWeight, setGoalWeight] = useState(75);
  const [startWeight, setStartWeight] = useState(88);
  const [view, setView] = useState<"week" | "month">("month");
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    const h = localStorage.getItem("fit-pro-workouts");
    if (h) { try { setHistory(JSON.parse(h)); } catch {} }
    const w = localStorage.getItem("fit-pro-weight"); if (w) setWeight(Number(w));
    const gw = localStorage.getItem("fit-pro-goal-weight"); if (gw) setGoalWeight(Number(gw));
    const sw = localStorage.getItem("fit-pro-start-weight"); if (sw) setStartWeight(Number(sw));
    const c = localStorage.getItem("fit-pro-calories-today"); if (c) setCalories(Number(c));
  }, []);

  const workouts = history.length;
  const totalSets = workouts * 16;
  const trainingTime = (workouts * 0.75).toFixed(1);
  const totalVolume = (workouts * 3.8).toFixed(1);
  const caloriesBurned = workouts * 350 + calories;
  const progress = Math.min(100, Math.round((Math.abs(startWeight - weight) / (Math.abs(startWeight - goalWeight) || 1)) * 100));

  // Points pour la courbe - basés sur tes séances
  const points = workouts === 0 ? "0,90 60,75 120,80 180,60 240,45 300,30" : `0,90 60,${90 - workouts * 8} 120,${85 - workouts * 6} 180,${70 - workouts * 5} 240,${60 - workouts * 4} 300,30`;

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', color: 'white', padding: 16, fontFamily: 'sans-serif' }}>
      <Link href="/dashboard" style={{ color: '#aaa', textDecoration: 'none', fontSize: 13 }}>← Retour Dashboard</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <div><h1 style={{ fontSize: 24, margin: 0 }}>Your Progress</h1><div style={{ color: '#aaa', fontSize: 13 }}>Tes progrès en direct</div></div>
        <Link href="/profil" style={{ background: '#222', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>👤</Link>
      </div>

      {/* 4 CARTES - comme ta photo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
        <div style={{ background: '#1c1c1c', borderRadius: 16, padding: 14 }}><div style={{ color: '#aaa', fontSize: 12 }}>🕐 Training Time</div><b style={{ fontSize: 22 }}>{trainingTime} hrs</b></div>
        <div style={{ background: '#1c1c1c', borderRadius: 16, padding: 14 }}><div style={{ color: '#aaa', fontSize: 12 }}>🏋️ Total Volume</div><b style={{ fontSize: 22 }}>{totalVolume}K kg</b></div>
        <div style={{ background: '#1c1c1c', borderRadius: 16, padding: 14 }}><div style={{ color: '#aaa', fontSize: 12 }}>📅 Workouts</div><b style={{ fontSize: 22 }}>{workouts}</b></div>
        <div style={{ background: '#1c1c1c', borderRadius: 16, padding: 14 }}><div style={{ color: '#aaa', fontSize: 12 }}>📈 Total Sets</div><b style={{ fontSize: 22 }}>{totalSets}</b></div>
      </div>

      {/* SEMAINE / MOIS */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button onClick={() => setView("week")} style={{ background: view === "week" ? "#c8f542" : "#222", color: view === "week" ? "black" : "white", border: 'none', padding: '8px 18px', borderRadius: 20, fontWeight: 'bold' }}>Cette semaine</button>
        <button onClick={() => setView("month")} style={{ background: view === "month" ? "#c8f542" : "#222", color: view === "month" ? "black" : "white", border: 'none', padding: '8px 18px', borderRadius: 20, fontWeight: 'bold' }}>Ce mois</button>
      </div>

      {/* MONTHLY VOLUME - courbe verte comme ta photo */}
      <div style={{ background: '#1c1c1c', borderRadius: 16, padding: 16, marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>{view === "week" ? "Weekly Volume" : "Monthly Volume"}</b><span style={{ color: '#aaa', fontSize: 12 }}>{view === "week" ? "Last 7 days" : "Last 4 weeks"}</span></div>
        <svg viewBox="0 0 300 110" style={{ width: '100%', marginTop: 10 }}>
          <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8f542" stopOpacity="0.4" /><stop offset="100%" stopColor="#c8f542" stopOpacity="0" /></linearGradient></defs>
          <polygon points={`0,110 ${points} 300,110`} fill="url(#g)" />
          <polyline points={points} fill="none" stroke="#c8f542" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: 11 }}><span>Sem 1</span><span>Sem 2</span><span>Sem 3</span><span>Sem 4</span></div>
      </div>

      {/* GRAPHIQUE POIDS + CALORIES */}
      <div style={{ background: '#1c1c1c', borderRadius: 16, padding: 16, marginTop: 12 }}>
        <b>⚖️ Graphique de poids</b>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 13 }}><span style={{ color: '#aaa' }}>Départ<br /><b style={{ color: 'white', fontSize: 18 }}>{startWeight} kg</b></span><span>Actuel<br /><b style={{ color: '#c8f542', fontSize: 18 }}>{weight} kg</b></span><span style={{ textAlign: 'right', color: '#aaa' }}>Objectif<br /><b style={{ color: 'white', fontSize: 18 }}>{goalWeight} kg</b></span></div>
        <div style={{ height: 10, background: '#333', borderRadius: 10, marginTop: 10 }}><div style={{ width: progress + '%', height: 10, background: '#c8f542', borderRadius: 10 }} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 12, color: '#aaa' }}><span>Progression : {progress}%</span><span>{Math.abs(startWeight - weight).toFixed(1)} kg perdus</span></div>
        <div style={{ borderTop: '1px solid #333', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}><span>🔥 Calories brûlées</span><b style={{ color: '#c8f542' }}>{caloriesBurned} kcal</b></div>
      </div>

      {/* RECENT WORKOUTS - comme ta photo */}
      <h3 style={{ marginTop: 20 }}>Recent Workouts</h3>
      {history.length === 0 ? <p style={{ color: '#aaa', fontSize: 13 }}>Aucune séance encore. Va t'entraîner, tes stats vont monter ici.</p> : history.slice(0, 5).map((h, i) => (
        <div key={i} style={{ background: '#1c1c1c', borderRadius: 14, padding: 14, marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ color: '#aaa', fontSize: 12 }}>{h.date}</div><b>{h.name}</b><div style={{ color: '#aaa', fontSize: 12 }}>{h.exercises} exercices • {h.duration}</div></div>
          <span style={{ color: '#aaa' }}>›</span>
        </div>
      ))}
      <div style={{ height: 30 }} />
    </div>
  );
      }
