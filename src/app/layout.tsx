import type { Metadata } from "next";
import Link from "next/link";
import { LanguageProvider } from "../lib/LanguageContext";
import LanguageSwitcher from "../lib/LanguageSwitcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIT PRO - Coaching Sportif",
  description: "Transformez votre corps avec FIT PRO",
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
          <div className="min-h-screen bg-black text-white">
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
              <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                  FIT<span className="text-yellow-400">PRO</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm">
                  <Link href="/" className="hover:text-yellow-400">Accueil</Link>
                  <Link href="/programmes" className="hover:text-yellow-400">Programmes</Link>
                  <Link href="/tarifs" className="hover:text-yellow-400">Tarifs</Link>
                  <Link href="/contact" className="hover:text-yellow-400">Contact</Link>
                </nav>

                <div className="flex items-center gap-3">
                  <LanguageSwitcher />
                  <Link href="/tarifs" className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold">
                    Commencer
                  </Link>
                </div>
              </div>
            </header>

            <main className="pt-16">{children}</main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
