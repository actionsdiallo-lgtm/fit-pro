import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIT PRO — Entraîne-toi avec méthode",
  description: "Entraînements et progression sportive, enregistrés à partir de tes données réelles."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/workouts">Entrainements</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
