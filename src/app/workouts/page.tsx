"use client";
export default function WorkoutsPage() {
  const workouts = [
    { title: "Full Body - Débutant", duration: "30 min", level: "Débutant", emoji: "💪" },
    { title: "Musculation - Haut du corps", duration: "45 min", level: "Intermédiaire", emoji: "🏋️" },
    { title: "Cardio Brûle Graisse", duration: "25 min", level: "Tous niveaux", emoji: "🔥" },
    { title: "Abdos - Core", duration: "15 min", level: "Intermédiaire", emoji: "🎯" },
  ];
  return (
    <div style={{ padding: 20, backgroundColor: '#0A0F0A', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>Entraînements</h1>
      <p style={{ color: '#A7F3D0' }}>Choisis ton entraînement du jour.</p>
      {workouts.map((w, i) => (
        <div key={i} style={{ marginTop: 16, padding: 16, backgroundColor: '#1A1A1A', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0 }}>{w.emoji} {w.title}</h3>
            <p style={{ color: '#A7F3D0', margin: '5px 0 0' }}>{w.duration} • {w.level}</p>
          </div>
          <button style={{ backgroundColor: '#22C55E', color: 'white', border: 'none', padding: '10px 16px', borderRadius: 20, fontWeight: 'bold' }}>Go</button>
        </div>
      ))}
    </div>
  );
}
