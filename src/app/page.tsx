import Link from "next/link";

export default function Home() {
  return <main className="landing">
    <nav className="topbar"><Link className="brand" href="/">FIT<span>PRO</span></Link><Link className="button button-quiet" href="/login">Connexion</Link></nav>
    <section className="hero">
      <p className="eyebrow">TON ENTRAÎNEMENT. TES DONNÉES. TA PROGRESSION.</p>
      <h1>Construis ta<br /><span>force réelle.</span></h1>
      <p className="lead">Planifie tes séances, consigne tes entraînements et suis ta progression avec des données que tu as réellement enregistrées.</p>
      <div className="actions"><Link className="button" href="/register">Créer mon compte <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/login">J’ai déjà un compte</Link></div>
      <div className="hero-note"><span className="pulse" /> Un espace personnel synchronisé après connexion</div>
    </section>
    <section className="feature-row" aria-label="Fonctionnalités prévues">
      <article><span>01</span><h2>Entraîne-toi</h2><p>Enregistre tes séances et leurs détails.</p></article>
      <article><span>02</span><h2>Observe</h2><p>Les indicateurs apparaissent à partir de tes données.</p></article>
      <article><span>03</span><h2>Progresse</h2><p>Fixe des objectifs et suis leur évolution.</p></article>
    </section>
  </main>;
}
