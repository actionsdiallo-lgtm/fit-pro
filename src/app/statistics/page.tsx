"use client";
export default function StatisticsPage() {
  return (
    <div style={{ padding: 20, backgroundColor: '#0A0F0A', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>Statistiques</h1>
      <p style={{ color: '#A7F3D0' }}>Tes progrès en un coup d'oeil.</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <div style={{ flex: 1, padding: 16, backgroundColor: '#1A1A1A', borderRadius: 16, textAlign: 'center' }}>
          <h2 style={{ color: '#22C55E', fontSize: 28, margin: 0 }}>12</h2>
          <p style={{ margin: 0 }}>Séances</p>
        </div>
        <div style={{ flex: 1, padding: 16, backgroundColor: '#1A1A1A', borderRadius: 16, textAlign: 'center' }}>
          <h2 style={{ color: '#22C55E', fontSize: 28, margin: 0 }}>8.5h</h2>
          <p style={{ margin: 0 }}>Temps total</p>
        </div>
      </div>
      <div style={{ marginTop: 16, padding: 16, backgroundColor: '#1A1A1A', borderRadius: 16 }}>
        <h3 style={{ margin: 0 }}>Cette semaine</h3>
        <p>Lun ██████ 45 min</p>
        <p>Mar ████ 30 min</p>
        <p>Mer ████████ 60 min</p>
        <p>Jeu ███ 20 min</p>
        <p>Ven ██████ 50 min</p>
      </div>
      <div style={{ marginTop: 16, padding: 16, backgroundColor: '#22C55E', borderRadius: 16 }}>
        <h3 style={{ margin: 0 }}>Objectif : -2kg</h3>
        <p style={{ margin: '8px 0 0' }}>Progression : 65% - Tu es sur la bonne voie !</p>
      </div>
    </div>
  );
}
