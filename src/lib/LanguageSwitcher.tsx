"use client";
import { useLanguage } from './LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <div style={{ display: 'flex', gap: 4, background: '#222', borderRadius: 20, padding: 3 }}>
      {(['fr','en','ar'] as const).map(l => (
        <button key={l} onClick={() => setLang(l)} style={{ border: 'none', cursor: 'pointer', background: lang === l ? '#c8f542' : 'transparent', color: lang === l ? '#000' : '#fff', borderRadius: 16, padding: '4px 10px', fontWeight: 'bold', fontSize: 12 }}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
