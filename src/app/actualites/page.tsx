const articles = [
  {
    category: "PRÉPARATION",
    title: "L’échauffement : prépare ton corps à l’effort",
    description: "Quelques minutes de mouvements progressifs aident à préparer le corps avant une séance. Adapte l’intensité à ton activité et à tes sensations.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Athlète en préparation avant son entraînement",
  },
  {
    category: "HYDRATATION",
    title: "Boire de l’eau : pense à t’hydrater",
    description: "Garde de l’eau à portée de main pendant ta journée et tes entraînements. Tes besoins varient selon l’effort, la durée et les conditions.",
    image: "https://images.unsplash.com/photo-1536935338788846bb9981813?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Gourde d’eau prête pour une séance sportive",
  },
  {
    category: "DÉFI",
    title: "Défi 30 jours : avance à ton rythme",
    description: "Choisis une habitude réaliste et note chaque séance pour observer ta régularité. Le défi est personnel : progresse à ton rythme, sans comparaison.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Sportive réalisant un exercice au sol",
  },
];

export const metadata = {
  title: "Actualité | FIT PRO",
  description: "Conseils et idées pour accompagner tes entraînements avec FIT PRO.",
};

export default function ActualitesPage() {
  return (
    <main className="news-page">
      <style>{`
        .news-page{min-height:calc(100vh - 70px);padding:clamp(38px,7vw,84px) clamp(20px,6vw,88px) 90px;background:radial-gradient(ellipse at 85% 0%,rgba(164,243,74,.08),transparent 34%),#080b09;color:#f2f6f2}
        .news-shell{max-width:1180px;margin:0 auto}
        .news-kicker{display:flex;align-items:center;gap:10px;margin:0 0 14px;color:#a4f34a;font-size:11px;font-weight:700;letter-spacing:.16em}
        .news-kicker:before{content:'';width:22px;height:1px;background:#a4f34a}
        .news-heading{max-width:680px;margin:0;font-size:clamp(38px,6vw,68px);line-height:.98;letter-spacing:-.065em}
        .news-heading span{color:#a4f34a}
        .news-intro{max-width:560px;margin:20px 0 38px;color:#9aa79d;font-size:15px;line-height:1.75}
        .news-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
        .news-card{overflow:hidden;border:1px solid #263129;border-radius:18px;background:linear-gradient(145deg,#141b16,#0e130f);transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease}
        .news-card:hover{transform:translateY(-5px);border-color:rgba(164,243,74,.55);box-shadow:0 18px 48px rgba(0,0,0,.24)}
        .news-image{display:block;width:100%;height:220px;object-fit:cover;background:#141b16}
        .news-content{padding:22px}
        .news-category{margin:0 0 12px;color:#a4f34a;font-size:10px;font-weight:700;letter-spacing:.14em}
        .news-title{margin:0 0 12px;font-size:21px;line-height:1.22;letter-spacing:-.035em}
        .news-description{margin:0;color:#9aa79d;font-size:13px;line-height:1.75}
        @media(max-width:850px){.news-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.news-card:last-child{grid-column:span 2}.news-card:last-child .news-image{height:260px}}
        @media(max-width:560px){.news-page{padding-top:40px}.news-grid{grid-template-columns:1fr;gap:15px}.news-card:last-child{grid-column:auto}.news-image,.news-card:last-child .news-image{height:210px}.news-content{padding:19px}}
        @media(prefers-reduced-motion:reduce){.news-card{transition:none}.news-card:hover{transform:none}}
      `}</style>
      <div className="news-shell">
        <p className="news-kicker">LE MAGAZINE FIT PRO</p>
        <h1 className="news-heading">Conseils pour <span>mieux bouger.</span></h1>
        <p className="news-intro">Des idées simples pour accompagner ta préparation, ton hydratation et tes objectifs sportifs.</p>
        <section className="news-grid" aria-label="Articles d’actualité">
          {articles.map((article) => (
            <article className="news-card" key={article.title}>
              {/* Photos Unsplash intégrées via leur CDN ; aucune statistique sportive fictive. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="news-image" src={article.image} alt={article.imageAlt} loading="lazy" />
              <div className="news-content">
                <p className="news-category">{article.category}</p>
                <h2 className="news-title">{article.title}</h2>
                <p className="news-description">{article.description}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
