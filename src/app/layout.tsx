import type { Metadata } from "next";
import Link from "next/link";
import { LanguageProvider } from "../lib/LanguageContext";
import LanguageSwitcher from "../lib/LanguageSwitcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIT PRO - Coaching Sportif",
  description: "Transformez votre corps",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <LanguageProvider>
          <div className="min-h-screen bg-black text-white pb-24">
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
              <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                  FIT<span className="text-yellow-400">PRO</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm">
                  <Link href="/" className="hover:text-yellow-400">Accueil</Link>
                  <Link href="/programs" className="hover:text-yellow-400">Programmes</Link>
                  <Link href="/entrainement" className="hover:text-yellow-400">Entraînement</Link>
                  <Link href="/nutrition" className="hover:text-yellow-400">Nutrition</Link>
                </nav>
                <div className="flex items-center gap-3">
                  <LanguageSwitcher />
                  <Link href="/programs" className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold">
                    Commencer
                  </Link>
                </div>
              </div>
            </header>

            <main className="pt-16">{children}</main>

            <nav className="fixed bottom-0 left-0 right-0 z-50 flex bg-black border-t-2 border-[#00ff88] rounded-t-[20px] pt-2 pb-4 shadow-[0_-2px_20px_rgba(0,255,136,0.4)]">
              <Link href="/" className="flex-1 text-center text-sm text-white">
                <div className="text-2xl">🏠</div>Accueil
              </Link>
              <Link href="/entrainement" className="flex-1 text-center text-sm text-white">
                <div className="text-2xl">🏋️</div>Entraînement
              </Link>
              <Link href="/nutrition" className="flex-1 text-center text-sm text-white">
                <div className="text-2xl">🍎</div>Nutrition
              </Link>
              <Link href="/progres" className="flex-1 text-center text-sm text-white">
                <div className="text-2xl">📊</div>Progrès
              </Link>
              <Link href="/profile" className="flex-1 text-center text-sm text-white">
                <div className="text-2xl">⚙️</div>Paramètres
              </Link>
            </nav>

          </div>
        </LanguageProvider>
      </body>
    </html>
  );
      }
