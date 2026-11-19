export default function Programs() {
  return (
    <div style={{ padding: 20, backgroundColor: '#0A0F0A', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>Programs</h1>
      <p style={{ color: '#A7F3D0' }}>Choisis ton programme d'entrainement.</p>

      <div style={{ marginTop: 20, borderRadius: 16, overflow: 'hidden', backgroundColor: '#1A1A1A' }}>
        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80" alt="Prise de masse" style={{ width: '100%', height: 180, objectFit: 'cover' }} />
        <div style={{ padding: 16 }}>
          <h3 style={{ margin: 0 }}>💪 Prise de masse - 12 semaines</h3>
          <p style={{ color: '#D1D5DB' }}>4 séances / semaine - Niveau intermédiaire</p>
          <button style={{ backgroundColor: '#22C55E', color: 'white', border: 'none', padding: '10px 18px', borderRadius: 20, fontWeight: 'bold', width: '100%' }}>Commencer</button>
        </div>
      </div>

      <div style={{ marginTop: 16, borderRadius: 16, overflow: 'hidden', backgroundColor: '#1A1A1A' }}>
        <img src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80" alt="Perte de poids" style={{ width: '100%', height: 180, objectFit: 'cover' }} />
        <div style={{ padding: 16 }}>
          <h3 style={{ margin: 0 }}>🔥 Perte de poids - 8 semaines</h3>
          <p style={{ color: '#D1D5DB' }}>5 séances / semaine - Cardio + Muscu</p>
          <button style={{ backgroundColor: '#22C55E', color: 'white', border: 'none', padding: '10px 18px', borderRadius: 20, fontWeight: 'bold', width: '100%' }}>Commencer</button>
        </div>
      </div>

      <div style={{ marginTop: 16, borderRadius: 16, overflow: 'hidden', backgroundColor: '#1A1A1A' }}>
        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80" alt="Debutant" style={{ width: '100%', height: 180, objectFit: 'cover' }} />
        <div style={{ padding: 16 }}>
          <h3 style={{ margin: 0 }}>⭐ Débutant - 4 semaines</h3>
          <p style={{ color: '#D1D5DB' }}>3 séances / semaine - Facile et guidé</p>
          <button style={{ backgroundColor: '#22C55E', color: 'white', border: 'none', padding: '10px 18px', borderRadius: 20, fontWeight: 'bold', width: '100%' }}>Commencer</button>
        </div>
      </div>

    </div>
  );
                          }
