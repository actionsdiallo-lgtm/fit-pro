import Link from "next/link";

export default function Dashboard() {
  return (
    <main style={{ background: "#080BOA", minHeight: "100vh", color: "#fff", fontFamily: "system-ui", paddingBottom: 90 }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
        <Link href="/" style={{ color: "#00E676", fontWeight: 900, fontSize: 22, textDecoration: "none" }}>FIT PRO</Link>
        <span style={{ background: "#1A1F2E", padding: "8px 14px", borderRadius: 20, fontSize: 13 }}>🔥 5 jours</span>
      </nav>
      <div style={{ padding: "0 20px" }}>
        <h1 style={{ fontSize: 28, margin: "10px 0 4px" }}>Salut Kindima 👋</h1>
        <p style={{ color: "#9AA0B0", margin: 0 }}>Prêt pour ton entraînement d&apos;aujourd&apos;hui ?</p>
        <div style={{ background: "#00E676", color: "#000", borderRadius: 20, padding: 20, marginTop: 20 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>ENTRAÎNEMENT DU JOUR</p>
          <h2 style={{ margin: "8px 0", fontSize: 24 }}>Full Body - 30 min</h2>
          <p style={{ margin: "0 0 16px", opacity: 0.8, fontSize: 14 }}>12 exercices • 320 kcal • Niveau Débutant</p>
          <Link href="/workouts/new" style={{ display: "block", background: "#000", color: "#fff", textAlign: "center", padding: "14px", borderRadius: 12, fontWeight: 800, textDecoration: "none" }}>▶ COMMENCER</Link>
        </div>
        <h3 style={{ marginTop: 24 }}>Tes stats</h3>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, background: "#1A1F2E", borderRadius: 16, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#00E676" }}>12</div>
            <div style={{ fontSize: 12, color: "#9AA0B0" }}>Séances</div>
          </div>
          <div style={{ flex: 1, background: "#1A1F2E", borderRadius: 16, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#00E676" }}>4.2h</div>
            <div style={{ fontSize: 12, color: "#9AA0B0" }}>Temps total</div>
          </div>
          <div style={{ flex: 1, background: "#1A1F2E", borderRadius: 16, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#00E676" }}>3 840</div>
            <div style={{ fontSize: 12, color: "#9AA0B0" }}>Kcal brûlées</div>
          </div>
        </div>
        <h3 style={{ marginTop: 24 }}>Continuer</h3>
        <div style={{ background: "#1A1F2E", borderRadius: 16, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontWeight: 800 }}>🔥 Cardio Brûle-Graisse</div><div style={{ fontSize: 13, color: "#9AA0B0" }}>20 min • Progression 60%</div></div>
          <span style={{ color: "#00E676", fontWeight: 900 }}>→</span>
        </div>
      </div>
    </main>
  );
          }
