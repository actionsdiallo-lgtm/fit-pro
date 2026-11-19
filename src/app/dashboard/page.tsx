"use client";

import Link from "next/link";
import { useState } from "react";

const green = "#00FF88";

export default function Dashboard() {
  const [period, setPeriod] = useState("7 jours");
  const [activeTab, setActiveTab] = useState("Dashboard");

  const stats = [
    { icon: "🔥", label: "Calories", value: "--", unit: "kcal" },
    { icon: "🏋️", label: "Entraînements", value: "--", unit: "séances" },
    { icon: "⏱️", label: "Temps actif", value: "--", unit: "minutes" },
  ];

  const workouts = [
    {
      title: "Push Day - Pectoraux",
      info: "45 min • Intermédiaire • 6 exercices",
      img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    },
    {
      title: "Leg Day - Jambes",
      info: "50 min • Intermédiaire • 7 exercices",
      img: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&q=80",
    },
    {
      title: "Cardio - Endurance",
      info: "20 min • Tous niveaux • 5 exercices",
      img: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80",
    },
  ];

  const menu = ["Dashboard", "Workouts", "Programs", "Statistics", "Profile"];

  return (
    <main className="fitpro">
      <style jsx>{`
        * { box-sizing: border-box; }
        .fitpro { min-height: 100vh; background: #060807; color: white; font-family: Inter, system-ui, sans-serif; padding-bottom: 100px; }
        .topbar { max-width: 1250px; margin: auto; padding: 22px 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #18231d; }
        .logo { font-size: 25px; font-weight: 1000; letter-spacing: 2px; }
        .logo span { color: ${green}; }
        .muted { color: #84948a; }
        .avatar { width: 45px; height: 45px; border-radius: 50%; background: ${green}; color: black; font-weight: 900; display: grid; place-items: center; font-size: 20px; box-shadow: 0 0 20px #00ff8844; }
        .layout { max-width: 1250px; margin: auto; padding: 25px; display: grid; grid-template-columns: 210px minmax(0, 1fr); gap: 25px; }
        .sidebar { background: #0e1511; border: 1px solid #1b2b21; border-radius: 22px; padding: 16px; height: fit-content; position: sticky; top: 15px; }
        .navitem { display: block; width: 100%; text-align: left; padding: 14px 12px; border: 0; border-radius: 12px; background: transparent; color: #a4b2a9; font-size: 14px; font-weight: 700; margin-bottom: 6px; cursor: pointer; transition: .2s; }
        .navitem:hover, .navitem.active { background: #173324; color: ${green}; transform: translateX(3px); }
        .content { min-width: 0; }
        .welcome { display: flex; justify-content: space-between; align-items: center; gap: 15px; margin-bottom: 24px; }
        h1 { font-size: clamp(25px, 4vw, 34px); margin: 5px 0; }
        .subtitle { color: #8c9b91; font-size: 14px; }
        .card { background: linear-gradient(145deg, #111b15, #0b100d); border: 1px solid #1c3023; border-radius: 22px; padding: 22px; animation: appear .6s ease both; }
        .health { display: grid; grid-template-columns: 120px 1fr; gap: 22px; align-items: center; }
        .circle { width: 115px; height: 115px; border-radius: 50%; border: 5px solid #244333; display: grid; place-items: center; text-align: center; box-shadow: 0 0 25px #00ff8815; }
        .circle strong { color: ${green}; font-size: 25px; display: block; }
        .circle small { color: #84948a; font-size: 10px; }
        .progress { height: 9px; background: #26372d; border-radius: 20px; overflow: hidden; margin-top: 15px; }
        .progress span { display: block; width: 0%; height: 100%; background: ${green}; border-radius: 20px; }
        .sectionhead { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin: 28px 0 14px; }
        h2 { font-size: 19px; margin: 0; }
        .periods { display: flex; gap: 6px; flex-wrap: wrap; }
        .period { border: 1px solid #26372d; background: #111b15; color: #a8b7ad; border-radius: 20px; padding: 8px 12px; font-size: 11px; cursor: pointer; }
        .period.selected { color: ${green}; border-color: ${green}; background: #10281b; }
        .metricgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 13px; margin-top: 14px; }
        .metric { padding: 19px; }
        .metric .value { color: ${green}; font-size: 25px; font-weight: 900; margin: 12px 0 4px; }
        .chart { height: 155px; display: flex; justify-content: center; align-items: center; color: #819187; font-size: 13px; border-bottom: 1px solid #24342a; margin-top: 18px; }
        .workout-card { background: #101613; border: 1px solid #203328; border-radius: 18px; overflow: hidden; margin-top: 12px; }
        .workout-card img { width: 100%; height: 160px; object-fit: cover; display: block; background: #1c3526; }
        .workout-info { padding: 14px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .cta { margin-top: 20px; border-radius: 22px; padding: 25px; color: #061009; background: linear-gradient(110deg, #00ff88, #80ffbd); box-shadow: 0 10px 35px #00ff8820; }
        .start { display: inline-block; padding: 13px 20px; border-radius: 12px; background: #07100a; color: white; text-decoration: none; font-weight: 900; font-size: 13px; }
        .empty { color: #87978d; font-size: 13px; line-height: 1.7; }
        .bottomnav { display: none; }
        @keyframes appear { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @media(max-width: 760px) {
          .layout { display: block; padding: 17px; }
          .sidebar { display: none; }
          .topbar { padding: 16px; }
          .health { grid-template-columns: 90px 1fr; gap: 13px; }
          .circle { width: 88px; height: 88px; border-width: 4px; }
          .circle strong { font-size: 20px; }
          .metricgrid { gap: 8px; }
          .metric { padding: 13px 9px; }
          .metric .value { font-size: 20px; }
          .bottomnav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; z-index: 10; background: #0c130f; border-top: 1px solid #26372d; justify-content: space-around; padding: 12px 4px; }
          .bottomnav button { background: none; border: 0; color: #a5b4aa; font-size: 10px; cursor: pointer; }
          .bottomnav button.active { color: ${green}; }
        }
        @media(max-width: 380px) { .metricgrid { grid-template-columns: 1fr; } .welcome { align-items: flex-start; } }
      `}</style>

      <header className="topbar">
        <div>
          <div className="logo">FIT <span>PRO.</span></div>
          <div className="muted" style={{ fontSize: 10, letterSpacing: 2 }}>PERFORMANCE PLATFORM</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <span className="muted" style={{ fontSize: 12 }}>Athlete account</span>
          <div className="avatar">K</div>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <p className="muted" style={{ fontSize: 10, letterSpacing: 2, paddingLeft: 12 }}>MAIN MENU</p>
          {menu.map((item) => (
            <button key={item} className={`navitem ${activeTab === item ? "active" : ""}`} onClick={() => setActiveTab(item)}>
              {item === "Dashboard" ? "◈" : item === "Workouts" ? "✦" : item === "Programs" ? "▤" : item === "Statistics" ? "▥" : "◎"}　{item}
            </button>
          ))}
        </aside>

        <section className="content">
          <div className="welcome">
            <div>
              <p className="subtitle">WELCOME BACK, ATHLETE 👋</p>
              <h1>Train Smarter<span style={{ color: green }}>.</span></h1>
              <p className="subtitle">Chaque séance te rapproche de ton objectif.</p>
            </div>
            <div style={{ color: green, fontSize: 12, fontWeight: 800 }}>● PERFORMANCE MODE</div>
          </div>

          <div className="card health">
            <div className="circle"><div><strong>--</strong><small>STEPS</small></div></div>
            <div>
              <h2>Daily Activity</h2>
              <p className="subtitle">Tes données quotidiennes apparaîtront ici.</p>
              <div className="progress"><span /></div>
              <p style={{ color: green, fontSize: 11, marginBottom: 0 }}>Connecte une source de données pour suivre tes pas.</p>
            </div>
          </div>

          <div className="sectionhead">
            <h2>Performance Overview</h2>
            <div className="periods">
              {["7 jours", "30 jours", "90 jours"].map((p) => (
                <button key={p} className={`period ${period === p ? "selected" : ""}`} onClick={() => setPeriod(p)}>{p}</button>
              ))}
            </div>
          </div>

          <div className="card">
            <p className="subtitle">ÉVOLUTION DES PERFORMANCES · {period.toUpperCase()}</p>
            <h2 style={{ marginTop: 8 }}>Tes progrès</h2>
            <div className="chart">Les graphiques apparaîtront après tes premiers entraînements enregistrés.</div>
          </div>

          <div className="metricgrid">
            {stats.map((stat) => (
              <div className="card metric" key={stat.label}>
                <div style={{ fontSize: 22 }}>{stat.icon}</div>
                <div className="value">{stat.value}</div>
                <div className="subtitle">{stat.label} · {stat.unit}</div>
              </div>
            ))}
          </div>

          <div className="cta">
            <p style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2 }}>YOUR NEXT CHALLENGE</p>
            <h2 style={{ fontSize: 25, margin: "9px 0" }}>Ready to get stronger?</h2>
            <p style={{ fontSize: 13, marginBottom: 20 }}>Lance une nouvelle séance et enregistre tes performances.</p>
            <Link href="/workouts/new" className="start">+ START NEW WORKOUT</Link>
          </div>

          <div className="sectionhead"><h2>Entraînements Populaires</h2></div>

          {workouts.map((w) => (
            <div className="workout-card" key={w.title}>
              <img src={w.img} alt={w.title} />
              <div className="workout-info">
                <div>
                  <p style={{ margin: 0, fontWeight: 800 }}>{w.title}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#8A9A8F" }}>{w.info}</p>
                </div>
                <span style={{ background: green, color: "#000", padding: "8px 12px", borderRadius: 20, fontSize: 12, fontWeight: 800, whiteSpace: "nowrap" }}>COMMENCER</span>
              </div>
            </div>
          ))}

          <div className="sectionhead"><h2>Recent Workout Activity</h2></div>
          <div className="card">
            <div className="empty">
              <div style={{ fontSize: 28, marginBottom: 10 }}>🏋️</div>
              <strong style={{ color: "white" }}>Aucun entraînement récent</strong>
              <p>Termine ta première séance pour retrouver ici ton historique.</p>
            </div>
          </div>
        </section>
      </div>

      <nav className="bottomnav">
  {menu.map((item) => (
    <button key={item} className={activeTab === item ? "active" : ""} onClick={() => {
      setActiveTab(item);
      if (item === "Workouts") window.location.href = "/workouts/new";
      if (item === "Dashboard") window.location.href = "/dashboard";
    }}>
     if(item === "Programs") window.location.href = "/programs";
if (item === "Statistics") window.location.href = "/statistics";
if (item === "Profile") window.location.href = "/profile";
      {item === "Dashboard" ? "🏠" : item === "Workouts" ? "💪" : item === "Programs" ? "📋" : item === "Statistics" ? "📊" : "👤"}
      <br />{item}
    </button>
  ))}
</nav>
    </main>
  );
                     }
