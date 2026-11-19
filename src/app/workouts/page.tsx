"use client";

export default function WorkoutsPage() {
  const workouts = [
    { title: "Full Body - Débutant", duration: "30 min", level: "Débutant" },
    { title: "Musculation - Haut du corps", duration: "45 min", level: "Intermédiaire" },
    { title: "Cardio Brûle Graisse", duration: "20 min", level: "Tous niveaux" },
    { title: "Abdos Intenses", duration: "15 min", level: "Avancé" },
  ];

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>Mes Entraînements</h1>
      <p style={{ color: "#666", marginTop: 8 }}>Choisis ton entraînement du jour.</p>

      <div style={{ display: "grid", gap: 16, marginTop: 24 }}>
        {workouts.map((w) => (
          <div key={w.title} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: "bold" }}>{w.title}</h2>
            <p style={{ color: "#666", marginTop: 4 }}>{w.duration} • {w.level}</p>
            <button style={{ marginTop: 12, background: "black", color: "white", padding: "8px 16px", borderRadius: 8, border: "none" }}>
              Commencer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
              }
