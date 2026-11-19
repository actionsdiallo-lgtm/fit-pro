export default function Nutrition() {
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>Nutrition</h1>
      <p>Ce que tu manges aujourd'hui.</p>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ padding: 16, background: '#fff7ed', borderRadius: 12 }}>
          <h3>🍳 Petit-déjeuner</h3>
          <p>Oeufs + Pain complet - 350 kcal</p>
        </div>
        <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 12 }}>
          <h3>🥗 Déjeuner</h3>
          <p>Poulet + Riz + Légumes - 650 kcal</p>
        </div>
        <div style={{ padding: 16, background: '#eff6ff', borderRadius: 12 }}>
          <h3>🍽️ Dîner</h3>
          <p>Poisson + Salade - 450 kcal</p>
        </div>
      </div>
      <div style={{ marginTop: 20, padding: 16, background: 'black', color: 'white', borderRadius: 12, textAlign: 'center' }}>
        <h2>1450 / 2200 kcal</h2>
        <p>Objectif du jour</p>
      </div>
    </div>
  );
}
