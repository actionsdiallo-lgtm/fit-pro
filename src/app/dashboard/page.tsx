"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [weight, setWeight] = useState(82);
  const [goalWeight, setGoalWeight] = useState(75);
  const [startWeight, setStartWeight] = useState(88);
  const [calories, setCalories] = useState(0);
  const [workoutsDone, setWorkoutsDone] = useState(0);
  const [water, setWater] = useState(0);

  useEffect(() => {
    const w = localStorage.getItem("fit-pro-weight");
    const gw = localStorage.getItem("fit-pro-goal-weight");
    const sw = localStorage.getItem("fit-pro-start-weight");
    const c = localStorage.getItem("fit-pro-calories-today");
    const wo = localStorage.getItem("fit-pro-workouts");
    const wat = localStorage.getItem("fit-pro-water");
    if (w) setWeight(Number(w));
    if (gw) setGoalWeight(Number(gw));
    if (sw) setStartWeight(Number(sw));
    if (c) setCalories(Number(c));
    if (wo) { try { setWorkoutsDone(JSON.parse(wo).length); } catch {} }
    if (wat) setWater(Number(wat));
  }, []);

  const save = (k: string, v: number, fn: any) => { localStorage.setItem(k, String(v)); fn(v); };

  // Progression réelle : de poids de départ vers objectif
  const totalToLose = Math.abs(startWeight - goalWeight) || 1;
  const lost = Math.abs(startWeight - weight);
  const progress = Math.min(100, Math.round((lost / totalToLose) * 100));
  const calorieGoal = 2500;
  const caloriePct = Math.min(100, Math.round((calories / calorieGoal) * 100));
  const planPct = Math.round((progress + caloriePct + Math.min(100, workoutsDone * 33)) / 3);

  return (
    <div style={{ minHeight: '100vh', backgroundImage: 'linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', color: 'white', padding: '20px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><div style={{ fontSize: 12, color: '#aaa' }}>Salut 👋</div><div style={{ fontSize: 22, fontWeight: 'bold' }}>RO-VERT</div></div>
        <Link href="/profil" style={{ background: '#222', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>👤</Link>
      </div>

      {/* CARTE VIOLETTE - comme photo 1 */}
      <div style={{ background: 'linear-gradient(135deg,#7b2ff7,#b44dff)', borderRadius: 20, padding: 20, marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>MY PLAN FOR TODAY</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', marginTop: 6 }}>Ton plan du jour<br />est prêt 💪</div>
          <Link href="/entrainement" style={{ background: 'white', color: 'black', padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', marginTop: 12 }}>▶ Commencer</Link>
        </div>
        <div style={{ width: 78, height: 78, borderRadius: '50%', background: 'conic-gradient(#c8f542 ' + planPct * 3.6 + 'deg, rgba(255,255,255,0.3) 0deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 60, height: 60, background: '#7b2ff7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{planPct}%</div>
        </div>
      </div>

      {/* DAILY PLAN - comme photo 2 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22 }}><b>Daily Plan</b><span style={{ color: '#aaa', fontSize: 13 }}>Aujourd'hui ▾</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <div style={{ background: '#1c1c1c', borderRadius: 16, padding: 14 }}><div>🔥 Calories</div><b style={{ fontSize: 20 }}>{calories} <span style={{ fontSize: 12, color: '#aaa' }}>/ {calorieGoal}</span></b><div style={{ height: 6, background: '#333', borderRadius: 10, marginTop: 8 }}><div style={{ width: caloriePct + '%', height: 6, background: '#c8f542', borderRadius: 10 }} /></div></div>
        <div style={{ background: '#1c1c1c', borderRadius: 16, padding: 14 }}><div>💪 Entraînements</div><b style={{ fontSize: 20 }}>{workoutsDone}</b><div style={{ fontSize: 12, color: '#aaa' }}>séances enregistrées</div></div>
        <div style={{ background: '#1c1c1c', borderRadius: 16, padding: 14 }}><div>⚖️ Poids actuel</div><b style={{ fontSize: 20 }}>{weight} kg</b><div style={{ fontSize: 12, color: '#aaa' }}>Objectif : {goalWeight} kg</div></div>
        <div style={{ background: '#1c1c1c', borderRadius: 16, padding: 14 }}><div>💧 Eau</div><b style={{ fontSize: 20 }}>{water} / 8 verres</b><button onClick={() => save("fit-pro-water", water + 1, setWater)} style={{ background: '#c8f542', border: 'none', padding: '6px 10px', borderRadius: 10, marginTop: 6, fontWeight: 'bold' }}>+ 1 verre</button></div>
      </div>

      {/* GOAL IN PROGRESS - comme photo 2 */}
      <div style={{ background: '#1c1c1c', borderRadius: 16, padding: 16, marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>Goal in progress</b><span style={{ color: '#c8f542', fontWeight: 'bold' }}>{progress}%</span></div>
        <div style={{ fontSize: 13, color: '#aaa', marginTop: 6 }}>Départ : {startWeight} kg → Objectif : {goalWeight} kg • Actuel : {weight} kg</div>
        <div style={{ height: 10, background: '#333', borderRadius: 10, marginTop: 10 }}><div style={{ width: progress + '%', height: 10, background: 'linear-gradient(90deg,#7b2ff7,#c8f542)', borderRadius: 10 }} /></div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          <label style={{ fontSize: 12 }}>Poids actuel : <input type="number" value={weight} onChange={e => save("fit-pro-weight", Number(e.target.value), setWeight)} style={{ width: 60, background: '#222', color: 'white', border: '1px solid #444', borderRadius: 8, padding: 6 }} /> kg</label>
          <label style={{ fontSize: 12 }}>Objectif : <input type="number" value={goalWeight} onChange={e => save("fit-pro-goal-weight", Number(e.target.value), setGoalWeight)} style={{ width: 60, background: '#222', color: 'white', border: '1px solid #444', borderRadius: 8, padding: 6 }} /> kg</label>
          <label style={{ fontSize: 12 }}>Départ : <input type="number" value={startWeight} onChange={e => save("fit-pro-start-weight", Number(e.target.value), setStartWeight)} style={{ width: 60, background: '#222', color: 'white', border: '1px solid #444', borderRadius: 8, padding: 6 }} /> kg</label>
        </div>
      </div>

      {/* CALORIES DETAILS - comme photo 3 */}
      <div style={{ background: '#1c1c1c', borderRadius: 16, padding: 16, marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><b>Calories Details</b><div style={{ fontSize: 13, color: '#aaa', marginTop: 8 }}>🍗 Protéines : {Math.round(calories * 0.3)} kcal</div><div style={{ fontSize: 13, color: '#aaa' }}>🍞 Glucides : {Math.round(calories * 0.45)} kcal</div><div style={{ fontSize: 13, color: '#aaa' }}>🧈 Lipides : {Math.round(calories * 0.25)} kcal</div></div>
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'conic-gradient(#7b2ff7 ' + caloriePct * 3.6 + 'deg, #333 0deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 68, height: 68, background: '#1c1c1c', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><b>{calories}</b><span style={{ fontSize: 10, color: '#aaa' }}>kcal</span></div></div>
      </div>

      <div style={{ textAlign: 'center', color: '#aaa', fontSize: 12, marginTop: 20, paddingBottom: 20 }}>Si les chiffres sont à 0, c'est que tu n'as pas encore enregistré d'entraînement ou de repas aujourd'hui. Dès que tu enregistres, ça monte tout seul ici.</div>
    </div>
  );
}
