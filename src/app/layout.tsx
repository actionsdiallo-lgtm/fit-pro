"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageProvider } from "../lib/LanguageContext";
import LanguageSwitcher from "../lib/LanguageSwitcher";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Accueil",
      match: (p: string) => p === "/",
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? "#22ff22" : "none"} stroke={active ? "#22ff22" : "#e5e7eb"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 9.5V20h5v-6h4v6h5V9.5" />
        </svg>
      ),
    },
    {
      href: "/entrainement",
      label: "Entraînement",
      match: (p: string) => p.startsWith("/entrainement"),
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? "#22ff22" : "#e5e7eb"}>
          <rect x="2" y="9" width="3" height="6" rx="1" />
          <rect x="5" y="7" width="3" height="10" rx="1" />
          <rect x="8" y="10.5" width="8" height="3" rx="1" />
          <rect x="16" y="7" width="3" height="10" rx="1" />
          <rect x="19" y="9" width="3" height="6" rx="1" />
        </svg>
      ),
    },
    {
      href: "/nutrition",
      label: "Nutrition",
      match: (p: string) => p.startsWith("/nutrition"),
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? "#22ff22" : "#e5e7eb"}>
          <path d="M12 5c.5-2 2-3.5 3.5-3.5.3 1.8-.8 3.5-2.5 4" fill="none" stroke={active ? "#22ff22" : "#e5e7eb"} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 7c-3.8 0-6.5 2.6-6.5 6.8 0 4 2.6 7.2 4.8 7.2.8 0 1.3-.4 1.7-.4s.9.4 1.7.4c2.2 0 4.8-3.2 4.8-7.2C18.5 9.6 15.8 7 12 7z" />
        </svg>
      ),
    },
    {
      href: "/progres",
      label: "Progrès",
      match: (p: string) => p.startsWith("/progres"),
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? "#22ff22" : "#e5e7eb"}>
          <rect x="4" y="13" width="4" height="7" rx="1.2" />
          <rect x="10" y="9" width="4" height="11" rx="1.2" />
          <rect x="16" y="4" width="4" height="16" rx="1.2" />
        </svg>
      ),
    },
    {
      href: "/parametres",
      label: "Paramètres",
      match: (p: string) => p.startsWith("/parametres"),
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? "#22ff22" : "#e5e7eb"}>
          <path d="M19.4 13a7.6 7.6 0 0 0 .05-1l2-1.55a.5.5 0 0 0 .12-.64l-1.9-3.3a.5.5 0 0 0-.6-.22l-2.35.95a7.8 7.8 0 0 0-1.72-1l-.35-2.5a.5.5 0 0 0-.5-.42h-3.8a.5.5 0 0 0-.5.42l-.35 2.5a7.8 7.8 0 0 0-1.72 1l-2.35-.95a.5.5 0 0 0-.6.22l-1.9 3.3a.5.5 0 0 0 .12.64l2 1.55a7.6 7.6 0 0 0 0 2l-2 1.55a.5.5 0 0 0-.12.64l1.9 3.3a.5.5 0 0 0 .6.22l2.35-.95a7.8 7.8 0 0 0 1.72 1l.35 2.5a.5.5 0 0 0 .5.42h3.8a.5.5 0 0 0 .5-.42l.35-2.5a7.8 7.8 0 0 0 1.72-1l2.35.95a.5.5 0 0 0 .6-.22l1.9-3.3a.5.5 0 0 0-.12-.64L19.4 13zm-7.4 2.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5z" />
        </svg>
      ),
    },
  ];

  return (
    <html lang="fr">
      <head>
        <title>FIT PRO - Coaching Sportif</title>
        <meta name="description" content="Transformez votre corps" />
      </head>
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

            <nav
              aria-label="Navigation principale"
              className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-[#050806] border-t border-[#22ff22] rounded-t-[18px] pt-2.5 pb-3.5 px-2 shadow-[0_-4px_22px_rgba(34,255,34,0.28)]"
            >
              {navItems.map((item) => {
                const isActive = item.match(pathname || "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                      isActive ? "text-[#22ff22] font-semibold" : "text-[#e5e7eb] hover:text-white"
                    }`}
                  >
                    <div className={isActive ? "drop-shadow-[0_0_8px_rgba(34,255,34,0.65)]" : ""}>
                      {item.icon(isActive)}
                    </div>
                    <span className="text-[11px] leading-tight tracking-tight">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
        }
      
