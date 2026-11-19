"use client";
export default function NutritionPage() {
  const meals = [
    { title: "Petit-déj Protéiné", desc: "Oeufs, avoine, banane - 450 kcal", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80" },
    { title: "Déjeuner Fit", desc: "Poulet, riz, légumes - 650 kcal", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80" },
    { title: "Dîner Léger", desc: "Saumon, salade, avocat - 520 kcal", img: "https://images.unsplash.com/photo-1540189549336-e6e99c4299bd?w=800&q=80" },
    { title: "Snack Santé", desc: "Smoothie protéiné - 280 kcal", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80" },
  ];
  return (
    <div style={{ padding: 20, backgroundColor: '#0A0F0A', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>Nutrition</h1>
      <p style={{ color: '#A7F3D0' }}>Ce que tu manges aujourd'hui.</p>
      <div style={{ marginTop: 16, padding: 16, backgroundColor: '#22C55E', borderRadius: 16, color: 'white' }}>
        <h3 style={{ margin: 0 }}>Total du jour</h3>
        <p style={{ fontSize: 24, fontWeight: 'bold', margin: '8px 0 0' }}>1 900 / 2 200 kcal</p>
      </div>
      {meals.map((m, i) => (
        <div key={i} style={{ marginTop: 16, borderRadius: 16, overflow: 'hidden', backgroundColor: '#1A1A1A', display: 'flex' }}>
          <img src={m.img} alt={m.title} style={{ width: 110, height: 110, objectFit: 'cover' }} />
          <div style={{ padding: 12 }}>
            <h3 style={{ margin: 0 }}>{m.title}</h3>
            <p style={{ color: '#D1D5DB' }}>{m.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
