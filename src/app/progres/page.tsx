export default function Progres() {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">📊 Mes Progrès</h1>
      <p className="text-white/70 mb-6">Suis ton évolution semaine après semaine.</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-[#00ff88]">12</div>
          <div className="text-sm text-white/70">Séances</div>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">-2.5 kg</div>
          <div className="text-sm text-white/70">Poids perdu</div>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold">85%</div>
          <div className="text-sm text-white/70">Régularité</div>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold">🔥 7</div>
          <div className="text-sm text-white/70">Jours d'affilée</div>
        </div>
      </div>
      <div className="bg-white/10 rounded-2xl p-4">
        <h2 className="font-bold mb-2">Cette semaine</h2>
        <p className="text-sm text-white/70">Lundi : Full Body ✅<br/>Mercredi : Cardio ✅<br/>Vendredi : Muscu - à faire</p>
      </div>
    </div>
  );
}
