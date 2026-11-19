
export default function ActualitesPage() {
  return (
    <>
      <style>{`
        :root {
          --fitpro-dark: #17231f;
          --fitpro-green: #b8f34a;
          --fitpro-muted: #68736d;
          --fitpro-light: #f5f7f3;
          --fitpro-white: #fff;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
        }

        .fitpro-page {
          min-height: 100vh;
          color: var(--fitpro-dark);
          background: var(--fitpro-light);
          line-height: 1.6;
        }

        .fitpro-page a {
          color: inherit;
        }

        .fitpro-container {
          width: min(1120px, calc(100% - 40px));
          margin: 0 auto;
        }

        .fitpro-header {
          color: var(--fitpro-white);
          background: var(--fitpro-dark);
        }

        .fitpro-nav {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .fitpro-logo {
          color: var(--fitpro-green) !important;
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-decoration: none;
        }

        .fitpro-nav ul {
          display: flex;
          gap: 28px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .fitpro-nav nav a {
          color: var(--fitpro-white);
          font-size: 0.95rem;
          text-decoration: none;
        }

        .fitpro-nav nav a:hover,
        .fitpro-nav nav a[aria-current="page"] {
          color: var(--fitpro-green);
        }

        .fitpro-hero {
          padding: 76px 0 68px;
          color: var(--fitpro-white);
          background:
            radial-gradient(ellipse at 85% 20%, #416137 0, transparent 38%),
            var(--fitpro-dark);
        }

        .fitpro-eyebrow {
          margin: 0 0 12px;
          color: var(--fitpro-green);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .fitpro-hero h1 {
          max-width: 720px;
          margin: 0;
          font-size: clamp(2.6rem, 7vw, 5rem);
          line-height: 1.02;
          letter-spacing: -0.04em;
        }

        .fitpro-hero-description {
          max-width: 580px;
          margin: 22px 0 0;
          color: #d3dbd5;
          font-size: 1.1rem;
        }

        .fitpro-main {
          padding: 56px 0 80px;
        }

        .fitpro-section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 26px;
        }

        .fitpro-section-heading h2 {
          margin: 0;
          font-size: clamp(1.7rem, 4vw, 2.3rem);
          letter-spacing: -0.03em;
        }

        .fitpro-section-heading p {
          margin: 0;
          color: var(--fitpro-muted);
        }

        .fitpro-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .fitpro-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-radius: 14px;
          background: var(--fitpro-white);
          box-shadow: 0 8px 26px rgb(23 35 31 / 6%);
        }

        .fitpro-card-image {
          display: block;
          width: 100%;
          height: 210px;
          object-fit: cover;
        }

        .fitpro-card-content {
          flex: 1;
          padding: 22px;
        }

        .fitpro-category {
          color: #4a7424;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .fitpro-card h3 {
          margin: 10px 0;
          font-size: 1.25rem;
          line-height: 1.3;
        }

        .fitpro-card-content > p {
          margin: 0 0 18px;
          color: var(--fitpro-muted);
        }

        .fitpro-meta {
          color: var(--fitpro-muted);
          font-size: 0.85rem;
        }

        .fitpro-read-more {
          display: inline-block;
          margin-top: 16px;
          font-weight: 700;
          text-decoration-color: var(--fitpro-green);
          text-decoration-thickness: 3px;
          text-underline-offset: 4px;
        }

        .fitpro-newsletter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          margin-top: 58px;
          padding: 34px;
          border-radius: 14px;
          background: var(--fitpro-green);
        }

        .fitpro-newsletter h2 {
          margin: 0;
          font-size: 1.7rem;
        }

        .fitpro-newsletter p {
          margin: 6px 0 0;
        }

        .fitpro-newsletter form {
          display: flex;
          width: min(430px, 100%);
          gap: 8px;
        }

        .fitpro-newsletter input {
          min-width: 0;
          flex: 1;
          padding: 13px 14px;
          border: 1px solid rgb(23 35 31 / 25%);
          border-radius: 7px;
          font: inherit;
        }

        .fitpro-newsletter button {
          padding: 13px 18px;
          border: 0;
          border-radius: 7px;
          color: var(--fitpro-white);
          background: var(--fitpro-dark);
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }

        .fitpro-newsletter button:hover {
          background: #2b3b34;
        }

        .fitpro-visually-hidden {
          position: absolute;
          overflow: hidden;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .fitpro-footer {
          padding: 24px 0;
          color: #d3dbd5;
          background: var(--fitpro-dark);
          font-size: 0.9rem;
        }

        .fitpro-footer-content {
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }

        @media (max-width: 760px) {
          .fitpro-nav {
            align-items: flex-start;
            flex-direction: column;
            padding: 18px 0;
          }

          .fitpro-nav ul {
            flex-wrap: wrap;
            gap: 12px 20px;
          }

          .fitpro-hero {
            padding: 56px 0;
          }

          .fitpro-grid {
            grid-template-columns: 1fr;
          }

          .fitpro-section-heading,
          .fitpro-newsletter {
            align-items: flex-start;
            flex-direction: column;
          }

          .fitpro-newsletter form {
            flex-direction: column;
          }

          .fitpro-footer-content {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="fitpro-page">
        <header className="fitpro-header">
          <div className="fitpro-container fitpro-nav">
            <a className="fitpro-logo" href="#" aria-label="FIT PRO, accueil">
              FIT PRO
            </a>

            <nav aria-label="Navigation principale">
              <ul>
                <li><a href="#">Accueil</a></li>
                <li><a href="#" aria-current="page">Actualités</a></li>
                <li><a href="#">Nos programmes</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </nav>
          </div>
        </header>

        <section className="fitpro-hero">
          <div className="fitpro-container">
            <p className="fitpro-eyebrow">Le journal FIT PRO</p>
            <h1>
              En mouvement.
              <br />
              En pleine forme.
            </h1>
            <p className="fitpro-hero-description">
              Conseils, tendances et actualités pour vous aider à progresser
              et à prendre soin de vous, chaque jour.
            </p>
          </div>
        </section>

        <main className="fitpro-container fitpro-main">
          <section aria-labelledby="latest-title">
            <div className="fitpro-section-heading">
              <h2 id="latest-title">À la une</h2>
              <p>Les dernières nouvelles de FIT PRO</p>
            </div>

            <div className="fitpro-grid">
              <article className="fitpro-card">
                <img
                  className="fitpro-card-image"
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&amp;fit=crop&amp;w=1200&amp;q=85"
                  alt="Espace d’entraînement avec du matériel de musculation"
                  loading="lazy"
                />
                <div className="fitpro-card-content">
                  <span className="fitpro-category">Entraînement</span>
                  <h3>Reprendre le sport : les bons réflexes pour durer</h3>
                  <p>
                    Une reprise progressive, des objectifs réalistes et une
                    routine adaptée : les clés pour retrouver le rythme sans
                    brûler les étapes.
                  </p>
                  <span className="fitpro-meta">12 juin 2025 · 5 min de lecture</span>
                  <br />
                  <a className="fitpro-read-more" href="#">Lire l’article →</a>
                </div>
              </article>

              <article className="fitpro-card">
                <img
                  className="fitpro-card-image"
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&amp;fit=crop&amp;w=1200&amp;q=85"
                  alt="Sportive en plein entraînement"
                  loading="lazy"
                />
                <div className="fitpro-card-content">
                  <span className="fitpro-category">Bien-être</span>
                  <h3>Nutrition et énergie : que manger avant une séance ?</h3>
                  <p>
                    Quelques repères simples pour préparer votre entraînement
                    et soutenir votre énergie, sans compliquer votre quotidien.
                  </p>
                  <span className="fitpro-meta">4 juin 2025 · 4 min de lecture</span>
                  <br />
                  <a className="fitpro-read-more" href="#">Lire l’article →</a>
                </div>
              </article>

              <article className="fitpro-card">
                <img
                  className="fitpro-card-image"
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&amp;fit=crop&amp;w=1200&amp;q=85"
                  alt="Séance de yoga et de mobilité"
                  loading="lazy"
                />
                <div className="fitpro-card-content">
                  <span className="fitpro-category">Récupération</span>
                  <h3>Pourquoi la récupération fait partie de l’entraînement</h3>
                  <p>
                    Le repos, le sommeil et la mobilité sont des alliés essentiels
                    pour progresser et garder le plaisir de bouger.
                  </p>
                  <span className="fitpro-meta">28 mai 2025 · 6 min de lecture</span>
                  <br />
                  <a className="fitpro-read-more" href="#">Lire l’article →</a>
                </div>
              </article>
            </div>
          </section>

          <section className="fitpro-newsletter" aria-labelledby="newsletter-title">
            <div>
              <h2 id="newsletter-title">Du nouveau dans votre boîte mail</h2>
              <p>Recevez nos conseils et les actualités FIT PRO.</p>
            </div>

            <form action="#" method="post">
              <label className="fitpro-visually-hidden" htmlFor="email">
                Votre adresse e-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Votre adresse e-mail"
                required
              />
              <button type="submit">S’inscrire</button>
            </form>
          </section>
        </main>

        <footer className="fitpro-footer">
          <div className="fitpro-container fitpro-footer-content">
            <span>© 2025 FIT PRO — Tous droits réservés.</span>
            <span>Bougez mieux. Vivez fort.</span>
          </div>
        </footer>
      </div>
    </>
  );
}
```
