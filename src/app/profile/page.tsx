"use client";
export default function ProfilePage() {
  return (
    <div style={{ padding: 20, backgroundColor: '#0A0F0A', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>Mon Profil</h1>
      <div style={{ marginTop: 20, padding: 20, backgroundColor: '#1A1A1A', borderRadius: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 60 }}>👤</div>
        <h2 style={{ margin: '10px 0 5px' }}>Diallo</h2>
        <p style={{ color: '#22C55E', margin: 0 }}>Niveau : Intermédiaire</p>
        <p style={{ color: '#A7F3D0' }}>Membre depuis Janvier 2026</p>
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, padding: 16, backgroundColor: '#1A1A1A', borderRadius: 16, textAlign: 'center' }}>
          <h3 style={{ color: '#22C55E', margin: 0 }}>75 kg</h3>
          <p style={{ margin: 0 }}>Poids</p>
        </div>
        <div style={{ flex: 1, padding: 16, backgroundColor: '#1A1A1A', borderRadius: 16, textAlign: 'center' }}>
          <h3 style={{ color: '#22C55E', margin: 0 }}>180 cm</h3>
          <p style={{ margin: 0 }}>Taille</p>
        </div>
        <div style={{ flex: 1, padding: 16, backgroundColor: '#1A1A1A', borderRadius: 16, textAlign: 'center' }}>
          <h3 style={{ color: '#22C55E', margin: 0 }}>22 ans</h3>
          <p style={{ margin: 0 }}>Âge</p>
        </div>
      </div>
      <div style={{ marginTop: 16, padding: 16, backgroundColor: '#1A1A1A', borderRadius: 16 }}>
        <p>⚙️ Paramètres</p>
        <p>🔔 Notifications</p>
        <p>❓ Aide</p>
        <p style={{ color: '#EF4444' }}>🚪 Déconnexion</p>
      </div>
    </div>
  );
}
