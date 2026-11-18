import Link from "next/link";

export default function Home() {
  return (
    <main style={{ background: "#080B0A", minHeight: "100vh", color: "#fff", fontFamily: "system-ui", paddingBottom: 90 }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
        <Link href="/" style={{ fontWeight: 900, fontSize: 22, color: "#fff", textDecoration: "none" }}>
          FIT<span style={{ color: "#00E676" }}> PRO</span>
        </Link>
        <Link href="/login" style={{ background: "#151A18", color: "#fff", padding: "8px 16px", borderRadius: 20, textDecoration: "none", fontSize: 14 }}>
          Connexion
        </Link>
      </nav>
      <div style={{ padding: "0 20px", maxWidth: 480, margin: "0 auto" }}>
        <p style={{ color: "#00E676", fontWeight: 700, margin: "10px 0 4px" }}>Bonjour, Kindima 👋</p>
        <h1 style={{ fontSize: 28, lineHeight: 1.2, margin: "0 0 16px" }}>Prêt pour<br />ton entraînement ?</h1>
        <div style={{ background: "#00E676", borderRadius: 22, padding: 18, color: "#080B0A" }}>
          <p style={{ fontSize: 12, fontWeight: 800, opacity: 0.7 }}>DAILY CHALLENGE</p>
          <h2 style={{ fontSize: 22, margin: "6px 0" }}>Défi du jour 🔥</h2>
          <p style={{ fontSize: 14, margin: "0 0 12px" }}>30 min Full Body • 120 kcal estimées</p>
          <div style={{ background: "rgba(0,0,0,0.15)", height: 8, borderRadius: 99 }}>
            <div style={{ background: "#080B0A", width: "65%", height: 8, borderRadius: 99 }} />
          </div>
          <p style={{ fontSize: 12, marginTop: 8 }}>65% - Tu y es presque !</p>
          <Link href="/dashboard" style={{ display: "block", textAlign: "center", background: "#080B0A", color: "#fff", padding: "12px", borderRadius: 14, textDecoration: "none", fontWeight: 800, marginTop: 12 }}>
            Commencer
          </Link>
        </div>
        <h3 style={{ margin: "22px 0 10px" }}>Cette semaine</h3>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].map((d,i)=>(
            <div key={d} style={{ width: 38, height: 52, borderRadius: 14, background: i===2 ? "#00E676" : "#151A18", color: i===2 ? "#080B0A" : "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>
              {d}<span>{16+i}</span>
            </div>
          ))}
        </div>
        <h3 style={{ margin: "22px 0 10px" }}>Tes programmes</h3>
        {[
          { t: "Full Body - 7 jours", s: "Débutant • 30 min" },
          { t: "Bras & Épaules", s: "Intermédiaire • 25 min" },
          { t: "Cardio Brûle Graisse", s: "Tous niveaux • 20 min" },
        ].map((p)=>(
          <div key={p.t} style={{ background: "#151A18", borderRadius: 16, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div><b>{p.t}</b><br/><span style={{ fontSize: 12, color: "#aaa" }}>{p.s}</span></div>
            <span style={{ background: "#00E676", color: "#080B0A", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>▶</span>
          </div>
        ))}
        <Link href="/register" style={{ display: "block", textAlign: "center", background: "#00E676", color: "#080B0A", padding: "14px", borderRadius: 14, textDecoration: "none", fontWeight: 900, marginTop: 16 }}>
          Créer un compte gratuit
        </Link>
        <p style={{ textAlign: "center", fontSize: 12, color: "#888", marginTop: 10 }}>Tes données sont sauvegardées. Pas de fausses stats.</p>
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#151A18", display: "flex", justifyContent: "space-around", padding: "12px 0", borderTop: "1px solid #222" }}>
        <Link href="/" style={{ color: "#00E676", textDecoration: "none", fontSize: 12, fontWeight: 800 }}>🏠 Accueil</Link>
        <Link href="/dashboard" style={{ color: "#fff", textDecoration: "none", fontSize: 12 }}>💪 Entraînements</Link>
        <Link href="/dashboard" style={{ color: "#fff", textDecoration: "none", fontSize: 12 }}>📊 Stats</Link>
        <Link href="/login" style={{ color: "#fff", textDecoration: "none", fontSize: 12 }}>👤 Profil</Link>
      </div>
    </main>
  );
                                          }
