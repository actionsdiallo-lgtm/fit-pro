export default function Profile() {
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>Profile</h1>
      <div style={{ marginTop: 20, padding: 20, background: '#f5f5f5', borderRadius: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 60 }}>👤</div>
        <h2>Diallo</h2>
        <p>Niveau: Intermédiaire</p>
      </div>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ padding: 16, background: 'white', border: '1px solid #eee', borderRadius: 12 }}>⚙️ Paramètres</div>
        <div style={{ padding: 16, background: 'white', border: '1px solid #eee', borderRadius: 12 }}>🎯 Mes objectifs</div>
        <div style={{ padding: 16, background: 'white', border: '1px solid #eee', borderRadius: 12 }}>🔔 Notifications</div>
      </div>
    </div>
  );
}
