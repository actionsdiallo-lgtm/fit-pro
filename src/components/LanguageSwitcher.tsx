'use client';
import { useState, useEffect } from 'react';
import { languages, translations, Lang } from '../lib/translations';

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<Lang>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('fitpro-lang') as Lang | null;
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('fitpro-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const t = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n') as keyof typeof t;
      if (t[key]) el.textContent = t[key];
    });
  }, [lang]);

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as Lang)}
      style={{ background: '#222', color: 'white', border: '1px solid #444', borderRadius: 20, padding: '4px 8px', fontSize: 13, cursor: 'pointer' }}
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
      ))}
    </select>
  );
}
