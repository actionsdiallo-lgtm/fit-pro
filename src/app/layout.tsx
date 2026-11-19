import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FIT PRO - Entraîne-toi avec méthode",
  description: "Entraînements et progrès",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: '#0a0a0a', color: 'white' }}>

        {/* MENU ORDINATEUR - en haut, compact */}
        <header className="desktop-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#111', position: 'sticky', top: 0, zIndex: 50 }}>
          <Link href="/" style={{ color: '#c8f542', fontWeight: 'bold', fontSize: 20, textDecoration: 'none' }}>PRO-VERT 💪</Link>
          <nav style={{ display: 'flex', gap: 20 }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>Accueil</Link>
            <Link href="/entrainements" style={{ color: 'white', textDecoration: 'none' }}>Entraînements</Link>
            <Link href="/nutrition" style={{ color: 'white', textDecoration: 'none' }}>Nutrition</Link>
            <Link href="/statistiques" style={{ color: 'white', textDecoration: 'none' }}>Stats</Link>
            <Link href="/profil" style={{ color: 'white', textDecoration: 'none' }}>Profil</Link>
          </nav>
        </header>

        <main style={{ paddingBottom: 60 }}>{children}</main>

        {/* MENU TÉLÉPHONE - en bas, compact */}
        <nav className="mobile-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#1a1a1a', borderTop: '1px solid #333', display: 'flex', justifyContent: 'space-around', padding: '6px 0 8px', zIndex: 100 }}>
          <Link href="/" style={{ textDecoration: 'none', textAlign: 'center' }}><div style={{ fontSize: 18 }}>🏠</div><div style={{ fontSize: 10, color: '#aaa' }}>Accueil</div></Link>
          <Link href="/entrainements" style={{ textDecoration: 'none', textAlign: 'center' }}><div style={{ fontSize: 18 }}>💪</div><div style={{ fontSize: 10, color: '#aaa' }}>Entrain.</div></Link>
          <Link href="/nutrition" style={{ textDecoration: 'none', textAlign: 'center' }}><div style={{ fontSize: 18 }}>🥗</div><div style={{ fontSize: 10, color: '#aaa' }}>Nutrition</div></Link>
          <Link href="/statistiques" style={{ textDecoration: 'none', textAlign: 'center' }}><div style={{ fontSize: 18 }}>📊</div><div style={{ fontSize: 10, color: '#aaa' }}>Stats</div></Link>
          <Link href="/profil" style={{ textDecoration: 'none', textAlign: 'center' }}><div style={{ fontSize: 18 }}>👤</div><div style={{ fontSize: 10, color: '#aaa' }}>Profil</div></Link>
        </nav>

        <style>{`
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
          }
          @media (min-width: 769px) {
            .mobile-nav { display: none !important; }
            main { padding-bottom: 0 !important; }
          }
        `}</style>
      </body>
    </html>
  );
              }
