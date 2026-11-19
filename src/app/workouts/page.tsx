"use client";
export default function WorkoutsPage() {
  const workouts = [
    { title: "Full Body - Débutant", duration: "30 min", level: "Débutant", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80" },
    { title: "Musculation - Haut du corps", duration: "45 min", level: "Intermédiaire", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80" },
    { title: "Cardio Brûle Graisse", duration: "25 min", level: "Tous niveaux", img: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80" },
    { title: "Abdos - Core", duration: "20 min", level: "Débutant", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80" },
  ];
  return (
    <div style={{ padding: 20, backgroundColor: '#0A0F0A', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>Workouts</h1>
      <p style={{ color: '#A7F3D0' }}>Choisis ton entraînement du jour.</p>
      {workouts.map((w, i) => (
        <div key={i} style={{ marginTop: 16, borderRadius: 16, overflow: 'hidden', backgroundColor: '#1A1A1A' }}>
          <img src={w.img} alt={w.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
          <div style={{ padding: 16 }}>
            <h3 style={{ margin: 0 }}>{w.title}</h3>
            <p style={{ color: '#D1D5DB' }}>{w.duration} • {w.level}</p>
            <button style={{ backgroundColor: '#22C55E', color: 'white', border: 'none', padding: '10px 18px', borderRadius: 20, fontWeight: 'bold', width: '100%' }}>Commencer</button>
          </div>
        </div>
      ))}
    </div>
  );
          }
