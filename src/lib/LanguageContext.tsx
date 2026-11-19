"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Lang, translations } from './translations';

type ContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations.fr;
};

const LanguageContext = createContext<ContextType>(null as any);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr');
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
