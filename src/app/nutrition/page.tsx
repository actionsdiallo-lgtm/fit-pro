"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const MEALS = [
  { id: "petit", title: "Petit-déjeuner", emoji: "🍳", time: "7h - 9h", items: [
    { name: "Omelette + Pain complet", cal: 350, prot: 22, gluc: 30, lip: 15 },
    { name: "Avocado Toast", cal: 280, prot: 8, gluc: 25, lip: 18 },
    { name: "Bouillie d'avoine + Banane", cal: 320, prot: 10, gluc: 55, lip: 6 },
  ]},
  { id: "dejeuner", title: "Déjeuner", emoji: "🍗", time: "12h - 14h", items: [
    { name: "Riz + Poulet grillé + Légumes", cal: 650, prot: 45, gluc: 70, lip: 18 },
    { name: "Thiéboudienne (light)", cal: 580, prot: 35, gluc: 75, lip: 14 },
    { name: "Salade + Thon + Oeuf", cal: 420, prot: 30, gluc: 20, lip: 22 },
  ]},
  { id: "diner", title: "Dîner", emoji: "🥗", time: "19h - 21h", items: [
    { name: "Soupe + Poisson grillé", cal: 380, prot: 32, gluc: 25, lip: 14 },
    { name: "Salade + Poulet", cal: 350, prot: 28, gluc: 15, lip: 18 },
    { name: "Légumes sautés + Riz", cal: 400, prot: 12, gluc: 55, lip: 10 },
  ]},
  { id: "collation", title: "Collation", emoji: "🍎", time: "16h", items: [
    { name: "Banane + Arachides", cal: 200, prot: 6, gluc: 25, lip: 10 },
    { name: "Yaourt + Fruits", cal: 150, prot: 8, gluc: 20, lip: 4 },
  ]},
];

export default function Nutrition() {
  const [eaten, setEaten] = useState<any[]>([]);
  const [tab, setTab] = useState("petit");

  useEffect(() => {
    const saved = localStorage.getItem("fit-pro-meals-today");
    if (saved) { try { setEaten(JSON.parse(saved)); } catch {} }
  }, []);

  const totalCal = eaten.reduce((s, m) => s + m.cal, 0);
  const totalProt = eaten.reduce((s, m) => s + m.prot, 0);
  const totalGluc = eaten.reduce((s, m) => s + m.gluc, 0);
  const totalLip = eaten.reduce((s, m) => s + m.lip, 0);
  const goalCal = 2500;
  const pct = Math.min(100, Math.round((totalCal / goalCal) * 100));

  const addMeal = (meal: any, cat: string) => {
    const updated = [...eaten, { ...meal, cat, time: new Date().toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' }) }];
    setEaten(updated);
    localStorage.setItem("fit-pro-meals-today", JSON.stringify(updated));
    localStorage.setItem("fit-pro-calories-today", String(updated.reduce((s, m) => s + m.cal, 0)));
  };

  const resetDay = () => { setEaten([]); localStorage.setItem("fit-pro-meals-today", "[]"); localStorage.setItem("fit-pro-calories-today", "0"); };
  const current = MEALS.find(m => m.id === tab)!;

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', color: 'white', padding: 16, fontFamily: 'sans-serif' }}>
      <Link href="/dashboard" style={{ color: '#aaa', textDecoration: 'none', fontSize: 13 }}>← Retour Dashboard</Link>
      <h1 style={{ fontSize: 24, margin: '8px 0 0' }}>🍎 Nutrition</h1>
      <p style={{ color: '#aaa', fontSize: 13, marginTop: 4 }}>Mange bien, progresse vite</p>

      {/* TODAY'S KCAL - comme ta photo */}
      <div style={{ background: '#1c1c1c', borderRadius: 20, padding: 16, marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><div style={{ color: '#aaa', fontSize: 12 }}>Today's Kcal</div><b style={{ fontSize: 22 }}>{totalCal} / {goalCal} kcal</b>
          <div style={{ fontSize: 12, color: '#aaa', marginTop: 8 }}>🍗 Protéines : {totalProt}g / 150g</div>
          <div style={{ fontSize: 12, color: '#aaa' }}>🍞 Glucides : {totalGluc}g / 280g</div>
          <div style={{ fontSize: 12, color: '#aaa' }}>🧈 Lipides : {totalLip}g / 80g</div>
        </div>
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: `conic-gradient(#c8f542 ${pct * 3.6}deg, #333 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 68, height: 68, background: '#1c1c1c', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><b>{pct}%</b><span style={{ fontSize: 10, color: '#aaa' }}>objectif</span></div>
        </div>
      </div>

      {/* OBJECTIFS */}
      <div style={{ background: '#1c1c1c', borderRadius: 16, padding: 14, marginTop: 12 }}>
        <b style={{ fontSize: 13 }}>🎯 Objectifs nutritionnels</b>
        {[{ l: "Protéines", v: totalProt, g: 150, c: "#ff6b6b" }, { l: "Glucides", v: totalGluc, g: 280, c: "#ffb84d" }, { l: "Lipides", v: totalLip, g: 80, c: "#4dc2ff" }].map(x => (
          <div key={x.l} style={{ marginTop: 8 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span>{x.l}</span><span>{x.v}g / {x.g}g</span></div><div style={{ height: 6, background: '#333', borderRadius: 10, marginTop: 4 }}><div style={{ width: Math.min(100, (x.v / x.g) * 100) + '%', height: 6, background: x.c, borderRadius: 10 }} /></div></div>
        ))}
      </div>

      {/* TODAY'S SUGGESTION */}
      <div style={{ background: 'linear-gradient(135deg,#ff9a3d,#ff6b6b)', borderRadius: 20, padding: 16, marginTop: 12 }}>
        <div style={{ fontSize: 12, opacity: 0.9 }}>⭐ Today's Suggestion</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <div><b style={{ fontSize: 18 }}>Avocado Toast</b><div style={{ fontSize: 12 }}>280 kcal • 10 min • Facile</div></div>
          <div style={{ fontSize: 40 }}>🥑</div>
        </div>
        <button onClick={() => addMeal({ name: "Avocado Toast", cal: 280, prot: 8, gluc: 25, lip: 18 }, "Suggestion")} style={{ background: 'white', color: 'black', border: 'none', padding: '8px 14px', borderRadius: 20, fontWeight: 'bold', marginTop: 10 }}>+ Ajouter ce repas</button>
      </div>

      {/* MEAL PLANNER - onglets */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16, overflowX: 'auto' }}>
        {MEALS.map(m => <button key={m.id} onClick={() => setTab(m.id)} style={{ background: tab === m.id ? "#c8f542" : "#222", color: tab === m.id ? "black" : "white", border: 'none', padding: '8px 14px', borderRadius: 20, fontWeight: 'bold', whiteSpace: 'nowrap' }}>{m.emoji} {m.title}</button>)}
      </div>

      <div style={{ marginTop: 12 }}>
        <b>{current.emoji} {current.title} • {current.time}</b>
        {current.items.map((it, i) => (
          <div key={i} style={{ background: '#1c1c1c', borderRadius: 14, padding: 12, marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><b style={{ fontSize: 14 }}>{it.name}</b><div style={{ fontSize: 12, color: '#aaa' }}>{it.cal} kcal • Prot {it.prot}g • Gluc {it.gluc}g • Lip {it.lip}g</div></div>
            <button onClick={() => addMeal(it, current.title)} style={{ background: '#c8f542', border: 'none', width: 36, height: 36, borderRadius: '50%', fontSize: 20, fontWeight: 'bold' }}>+</button>
          </div>
        ))}
      </div>

      {/* CE QUE J'AI MANGÉ */}
      <h3 style={{ marginTop: 20 }}>✅ Ce que j'ai mangé aujourd'hui ({eaten.length})</h3>
      {eaten.length === 0 ? <p style={{ color: '#aaa', fontSize: 13 }}>Rien encore. Appuie sur + pour ajouter un repas.</p> : eaten.map((m, i) => (
        <div key={i} style={{ background: '#1c1c1c', borderRadius: 12, padding: 10, marginTop: 6, display: 'flex', justifyContent: 'space-between' }}><span>{m.name} <span style={{ color: '#aaa', fontSize: 11 }}>• {m.cat}</span></span><b>{m.cal} kcal</b></div>
      ))}
      {eaten.length > 0 && <button onClick={resetDay} style={{ background: '#333', color: 'white', border: 'none', width: '100%', padding: 12, borderRadius: 20, marginTop: 12 }}>🔄 Recommencer la journée</button>}
      <div style={{ height: 30 }} />
    </div>
  );
                                       }
