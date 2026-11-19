export default function Programs() {
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>Programs</h1>
      <p>Choisis ton programme d'entraînement.</p>
      <div style={{ marginTop: 20, padding: 16, background: '#f0fdf4', borderRadius: 12 }}>
        <h3>💪 Prise de masse - 12 semaines</h3>
        <p>4 séances / semaine - Niveau intermédiaire</p>
      </div>
      <div style={{ marginTop: 12, padding: 16, background: '#f0fdf4', borderRadius: 12 }}>
        <h3>🔥 Perte de poids - 8 semaines</h3>
        <p>5 séances / semaine - Cardio + Muscu</p>
      </div>
      <div style={{ marginTop: 12, padding: 16, background: '#f0fdf4', borderRadius: 12 }}>
        <h3>🏃 Débutant - 4 semaines</h3>
        <p>3 séances / semaine - Apprendre les bases</p>
      </div>
    </div>
  );
}
