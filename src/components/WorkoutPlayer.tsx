"use client";
import { useState, useEffect } from "react";
type Videos = { [key: string]: string };
type Exo = { nom: { [key: string]: string }; reps: string; consigne: { [key: string]: string }; videos: Videos; };
const TEXTES: any = {
en: { langue: "Language :", precedent: "Previous", ecouter: "Listen", suivant: "Next", exercice: "Exercise", videoEn: "Video in" },
fr: { langue: "Langue :", precedent: "Precedent", ecouter: "Ecouter", suivant: "Suivant", exercice: "Exercice", videoEn: "Video en" },
es: { langue: "Idioma :", precedent: "Anterior", ecouter: "Escuchar", suivant: "Siguiente", exercice: "Ejercicio", videoEn: "Video en" },
pt: { langue: "Lingua :", precedent: "Anterior", ecouter: "Ouvir", suivant: "Proximo", exercice: "Exercicio", videoEn: "Video em" },
ar: { langue: "Language :", precedent: "Previous", ecouter: "Listen", suivant: "Next", exercice: "Exercise", videoEn: "Video in" },
de: { langue: "Sprache :", precedent: "Zuruck", ecouter: "Horen", suivant: "Weiter", exercice: "Ubung", videoEn: "Video in" },
it: { langue: "Lingua :", precedent: "Precedente", ecouter: "Ascolta", suivant: "Avanti", exercice: "Esercizio", videoEn: "Video in" },
};
const EXOS: Exo[] = [
{ nom: { en: "Push-ups", fr: "Pompes", es: "Flexiones", pt: "Flexoes", ar: "Push-ups", de: "Liegestutze", it: "Flessioni" }, reps: "12 reps", consigne: { en: "Come on push-ups! Straight back, go down, push hard!", fr: "Allez les pompes ! Dos droit, descends, pousse !", es: "Vamos flexiones! Espalda recta, baja, empuja!", pt: "Vamos flexoes! Costas retas, desce, empurra!", ar: "Come on push-ups!", de: "Los Liegestutze! Rucken gerade, runter, hoch!", it: "Dai flessioni! Schiena dritta, scendi, spingi!" }, videos: { en: "https://www.youtube.com/embed/IODxDxX7oi0", fr: "https://www.youtube.com/embed/IODxDxX7oi0", es: "https://www.youtube.com/embed/9rTq5W1w6zE", pt: "https://www.youtube.com/embed/IODxDxX7oi0", ar: "https://www.youtube.com/embed/IODxDxX7oi0", de: "https://www.youtube.com/embed/IODxDxX7oi0", it: "https://www.youtube.com/embed/IODxDxX7oi0" } },
{ nom: { en: "Squats", fr: "Squats", es: "Sentadillas", pt: "Agachamentos", ar: "Squats", de: "Kniebeugen", it: "Squat" }, reps: "15 reps", consigne: { en: "Come on squats! Go down slowly, come up!", fr: "Allez les squats ! Descends doucement, remonte !", es: "Vamos sentadillas! Baja despacio, sube!", pt: "Vamos agachamentos! Desce devagar, sobe!", ar: "Come on squats!", de: "Los Kniebeugen! Langsam runter, hoch!", it: "Dai squat! Scendi piano, sali!" }, videos: { en: "https://www.youtube.com/embed/YaXPRqUwItQ", fr: "https://www.youtube.com/embed/YaXPRqUwItQ", es: "https://www.youtube.com/embed/YaXPRqUwItQ", pt: "https://www.youtube.com/embed/YaXPRqUwItQ", ar: "https://www.youtube.com/embed/YaXPRqUwItQ", de: "https://www.youtube.com/embed/YaXPRqUwItQ", it: "https://www.youtube.com/embed/YaXPRqUwItQ" } },
{ nom: { en: "Plank", fr: "Gainage", es: "Plancha", pt: "Prancha", ar: "Plank", de: "Plank", it: "Plank" }, reps: "30 sec", consigne: { en: "Plank! Stay strong, don't bend your back!", fr: "Gainage ! Reste fort, ne creuse pas le dos !", es: "Plancha! Mantente fuerte, no dobles la espalda!", pt: "Prancha! Fica forte, nao dobre as costas!", ar: "Plank! Stay strong!", de: "Plank! Bleib stark, Rucken gerade!", it: "Plank! Resta forte, non piegare la schiena!" }, videos: { en: "https://www.youtube.com/embed/pSHjTRCQxIw", fr: "https://www.youtube.com/embed/pSHjTRCQxIw", es: "https://www.youtube.com/embed/pSHjTRCQxIw", pt: "https://www.youtube.com/embed/pSHjTRCQxIw", ar: "https://www.youtube.com/embed/pSHjTRCQxIw", de: "https://www.youtube.com/embed/pSHjTRCQxIw", it: "https://www.youtube.com/embed/pSHjTRCQxIw" } },
{ nom: { en: "Lunges", fr: "Fentes", es: "Zancadas", pt: "Avancos", ar: "Lunges", de: "Ausfallschritte", it: "Affondi" }, reps: "10 each leg", consigne: { en: "Lunges! Straight chest, go down slowly!", fr: "Les fentes ! Buste droit, descends doucement !", es: "Zancadas! Pecho recto, baja despacio!", pt: "Avancos! Peito reto, desce devagar!", ar: "Lunges!", de: "Ausfallschritte! Brust gerade, langsam runter!", it: "Affondi! Petto dritto, scendi piano!" }, videos: { en: "https://www.youtube.com/embed/Q0VaHwm-Q6U", fr: "https://www.youtube.com/embed/Q0VaHwm-Q6U", es: "https://www.youtube.com/embed/Q0VaHwm-Q6U", pt: "https://www.youtube.com/embed/Q0VaHwm-Q6U", ar: "https://www.youtube.com/embed/Q0VaHwm-Q6U", de: "https://www.youtube.com/embed/Q0VaHwm-Q6U", it: "https://www.youtube.com/embed/Q0VaHwm-Q6U" } },
];
const LANGUES = [
{ code: "en", nom: "English", voix: "en-US" },
{ code: "fr", nom: "Francais", voix: "fr-FR" },
{ code: "es", nom: "Espanol", voix: "es-ES" },
{ code: "pt", nom: "Portugues", voix: "pt-PT" },
{ code: "ar", nom: "Arabic", voix: "ar-SA" },
{ code: "de", nom: "Deutsch", voix: "de-DE" },
{ code: "it", nom: "Italiano", voix: "it-IT" },
];
export default function WorkoutPlayer() {
const [index, setIndex] = useState(0);
const [langue, setLangue] = useState("en");
const exo = EXOS[index];
const t = TEXTES[langue] || TEXTES["en"];
const langueChoisie = LANGUES.find(l => l.code === langue) || LANGUES[0];
const videoActuelle = exo.videos[langue] || exo.videos["en"];
function parler(texte: string) { if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); const v = new SpeechSynthesisUtterance(texte); v.lang = langueChoisie.voix; window.speechSynthesis.speak(v); } }
useEffect(() => { parler(exo.consigne[langue] || exo.consigne["en"]); }, [index, langue]);
function suivant() { if (index < EXOS.length - 1) setIndex(index + 1); else { parler(langue === "fr" ? "Seance terminee. Bravo !" : "Workout finished. Great job!"); alert(langue === "fr" ? "Seance terminee !" : "Workout finished!"); } }
return (
<div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
<div style={{ display: "flex", gap: 8, alignItems: "center", background: "#111", color: "#fff", padding: 10, borderRadius: 12 }}>
<span>{t.langue}</span>
<select value={langue} onChange={(e) => setLangue(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 8, border: 0, fontWeight: "bold" }}>
{LANGUES.map((l) => (<option key={l.code} value={l.code}>{l.nom}</option>))}
</select>
</div>
<h2 style={{ fontSize: 22, margin: "14px 0 4px" }}>{exo.nom[langue] || exo.nom["en"]} - {exo.reps}</h2>
<p>{t.exercice} {index + 1} / {EXOS.length} - {t.videoEn} {langueChoisie.nom}</p>
<div style={{ position: "relative", paddingTop: "56.25%", background: "#000", borderRadius: 16, overflow: "hidden" }}>
<iframe key={langue + index} src={videoActuelle} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} allowFullScreen title={exo.nom["en"]} />
</div>
<p style={{ marginTop: 10 }}>{exo.consigne[langue] || exo.consigne["en"]}</p>
<div style={{ display: "flex", gap: 8, marginTop: 12 }}>
<button onClick={() => index > 0 && setIndex(index - 1)} style={{ flex: 1, background: "#eee", padding: 14, borderRadius: 12, border: 0, fontWeight: "bold" }}>{t.precedent}</button>
<button onClick={() => parler(exo.consigne[langue] || exo.consigne["en"])} style={{ flex: 1, background: "#22c55e", color: "#fff", padding: 14, borderRadius: 12, border: 0, fontWeight: "bold" }}>{t.ecouter}</button>
<button onClick={suivant} style={{ flex: 1, background: "#111", color: "#fff", padding: 14, borderRadius: 12, border: 0, fontWeight: "bold" }}>{t.suivant}</button>
</div>
</div>
);
  }
