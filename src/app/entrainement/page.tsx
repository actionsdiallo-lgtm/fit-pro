"use client";
import { useState, useEffect } from "react";

const EXERCISES = [
  { name: "Bench Press", img: "🏋️", muscle: "Pectoraux", sets: 4, reps: 10, weight: 29 },
  { name: "Squat", img: "🦵", muscle: "Jambes", sets: 4, reps: 12, weight: 40 },
  { name: "Deadlift", img: "💪", muscle: "Dos", sets: 4, reps: 8, weight: 50 },
  { name: "Pompes", img: "🔥", muscle: "Pectoraux", sets: 3, reps: 15, weight: 0 },
];

export default function Page() {
  const [idx, setIdx] = useState(0);
  const [doneSets, setDoneSets] = useState<number[]>([]);
  const [rest, setRest] = useState(75);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const ex = EXERCISES[idx];

  useEffect(() => {
    const h = localStorage.getItem("fit-pro-workouts");
    if (h) { try { setHistory(JSON.parse(h)); } catch {} }
  }, []);

  useEffect(() => {
    if (!running) return;
    if (rest <= 0) { setRunning(false); setRest(75); return; }
    const t = setTimeout(() => setRest(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [running, rest]);

  const fmt = (s: number) => `0${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const nextEx = () => {
    if (idx < EXERCISES.length - 1) { setIdx(idx + 1); setDoneSets([]); setRest(75); }
    else finishWorkout();
  };

  const finishWorkout = () => {
    const newEntry = { date: new Date().toLocaleDateString("fr-FR"), name: "Séance Full Body", exercises: EXERCISES.length, duration: "45 min" };
    const updated = [newEntry, ...history];
    localStorage.setItem("fit-pro-workouts", JSON.stringify(updated));
    setHistory(updated);
    alert("🎉 Séance terminée ! Elle est enregistrée dans ton historique et ton tableau de bord.");
    setIdx(0); setDoneSets([]);
  };

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', color: 'white', padding: 16, fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: 22 }}>💪 Entraînement du jour</h1>
      <p style={{ textAlign: 'center', color: '#aaa', fontSize: 13 }}>Exercice {idx + 1} / {EXERCISES.length}</p>

      {/* EXERCICE - avec image */}
      <div style={{ background: '#1c1c1c', borderRadius: 20, padding: 16, marginTop: 12, textAlign: 'center' }}>
        <div style={{ fontSize: 60 }}>{ex.img}</div>
        <b style={{ fontSize: 20 }}>{ex.name}</b>
        <div style={{ color: '#aaa', fontSize: 13 }}>{ex.muscle} • {ex.sets} séries x {ex.reps} reps</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
          <button onClick={() => setIdx(Math.max(0, idx - 1))} style={{ background: '#333', color: 'white', border: 'none', padding: '8px 14px', borderRadius: 20 }}>← Précédent</button>
          <button onClick={nextEx} style={{ background: '#333', color: 'white', border: 'none', padding: '8px 14px', borderRadius: 20 }}>Suivant →</button>
        </div>
      </div>

      {/* SETS - comme ta photo */}
      <div style={{ background: '#1c1c1c', borderRadius: 20, padding: 16, marginTop: 12 }}>
        <b>Sets</b>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: 13, marginTop: 12, padding: '0 10px' }}><span></span><span>Reps</span><span>Weight (kg)</span></div>
        {[1, 2, 3, 4].map(n => (
          <div key={n} onClick={() => setDoneSets(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n])} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', cursor: 'pointer' }}>
            <span style={{ width: 32, height: 32, borderRadius: '50%', background: doneSets.includes(n) ? '#c8f542' : '#333', color: doneSets.includes(n) ? 'black' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{doneSets.includes(n) ? '✓' : n}</span>
            <span style={{ fontSize: 18 }}>{ex.reps}</span>
            <span style={{ fontSize: 18 }}>{ex.weight}</span>
          </div>
        ))}
        <div style={{ fontSize: 12, color: '#aaa', textAlign: 'center', marginTop: 6 }}>Appuie sur un rond pour cocher la série terminée</div>

        {/* REST + CHRONO */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, borderTop: '1px solid #333', paddingTop: 12 }}>
          <span style={{ color: '#aaa' }}>Rest</span>
          <b style={{ fontSize: 22 }}>{fmt(rest)}</b>
          <button onClick={() => { if (rest === 0) setRest(75); setRunning(!running); }} style={{ background: 'transparent', color: '#c8f542', border: '1px solid #c8f542', width: 48, height: 48, borderRadius: '50%', fontWeight: 'bold' }}>{running ? 'Stop' : 'Start'}</button>
        </div>

        <button onClick={nextEx} style={{ background: '#2f7bff', color: 'white', border: 'none', width: '100%', padding: 14, borderRadius: 30, fontWeight: 'bold', fontSize: 16, marginTop: 14 }}>Next Exercise</button>
        <button onClick={finishWorkout} style={{ background: '#c8f542', color: 'black', border: 'none', width: '100%', padding: 14, borderRadius: 30, fontWeight: 'bold', fontSize: 16, marginTop: 10 }}>✅ Terminer la séance</button>
      </div>

      {/* HISTORIQUE */}
      <h3 style={{ marginTop: 20 }}>� history - Historique des séances</h3>
      {history.length === 0 ? <p style={{ color: '#aaa', fontSize: 13 }}>Aucune séance encore. Termine ta première séance, elle apparaîtra ici.</p> : history.map((h, i) => (
        <div key={i} style={{ background: '#1c1c1c', borderRadius: 14, padding: 12, marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
          <div><b>{h.name}</b><div style={{ fontSize: 12, color: '#aaa' }}>{h.date} • {h.exercises} exercices</div></div>
          <span style={{ color: '#c8f542', fontWeight: 'bold' }}>✓</span>
        </div>
      ))}
      <div style={{ height: 30 }} />
    </div>
  );
        }
