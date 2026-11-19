export default function Statistics() {
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>Statistics</h1>
      <p>Tes progrès en un coup d'oeil.</p>
      <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, padding: 16, background: '#eff6ff', borderRadius: 12, textAlign: 'center' }}>
          <h2>12</h2>
          <p>Séances</p>
        </div>
        <div style={{ flex: 1, padding: 16, background: '#f0fdf4', borderRadius: 12, textAlign: 'center' }}>
          <h2>8.5h</h2>
          <p>Temps total</p>
        </div>
        <div style={{ flex: 1, padding: 16, background: '#fef3c7', borderRadius: 12, textAlign: 'center' }}>
          <h2>320</h2>
          <p>Kcal brûlées</p>
        </div>
      </div>
      <div style={{ marginTop: 20, padding: 16, background: '#f5f5f5', borderRadius: 12 }}>
        <h3>📈 Cette semaine</h3>
        <p>Lun: 45 min - Mar: 30 min - Mer: Repos - Jeu: 60 min</p>
      </div>
    </div>
  );
}
