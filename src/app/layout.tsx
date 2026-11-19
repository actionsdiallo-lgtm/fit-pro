import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIT PRO - Entraîne-toi avec méthode",
  description: "Entraînements et progrès",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: 'sans-serif', backgroundColor: '#0A0F0A' }}>
        <nav style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: '14px 16px', backgroundColor: '#111111', position: 'sticky', top: 0, zIndex: 50 }}>
          <a href="/" style={{ color: '#22C55E', fontWeight: 'bold', textDecoration: 'none' }}>🏋️ FIT PRO</a>
          <a href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</a>
          <a href="/workouts" style={{ color: 'white', textDecoration: 'none' }}>Entraînements</a>
          <a href="/programs" style={{ color: 'white', textDecoration: 'none' }}>Programs</a>
          <a href="/nutrition" style={{ color: 'white', textDecoration: 'none' }}>Nutrition</a>
          <a href="/statistics" style={{ color: 'white', textDecoration: 'none' }}>Stats</a>
          <a href="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profil</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
