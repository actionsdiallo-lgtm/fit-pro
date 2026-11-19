"use client";
import { useState, useEffect } from "react";

const TEXTES: any = {
  en: { langue: "Language :", commencer: "START", precedent: "Previous", ecouter: "Listen", suivant: "Next", terminer: "Finish", termine: "WORKOUT FINISHED 🎉", recommencer: "Start Again", exercice: "Exercise", video: "Video in" },
  fr: { langue: "Langue :", commencer: "COMMENCER", precedent: "Précédent", ecouter: "Écouter", suivant: "Suivant", terminer: "Terminer", termine: "SÉANCE TERMINÉE 🎉", recommencer: "Recommencer", exercice: "Exercice", video: "Vidéo en" },
  es: { langue: "Idioma :", commencer: "EMPEZAR", precedent: "Anterior", ecouter: "Escuchar", suivant: "Siguiente", terminer: "Terminar", termine: "SESIÓN TERMINADA 🎉", recommencer: "Empezar de nuevo", exercice: "Ejercicio", video: "Video en" },
  pt: { langue: "Idioma :", commencer: "COMEÇAR", precedent: "Anterior", ecouter: "Ouvir", suivant: "Próximo", terminer: "Terminar", termine: "SESSÃO CONCLUÍDA 🎉", recommencer: "Começar novamente", exercice: "Exercício", video: "Vídeo em" },
  ar: { langue: "اللغة :", commencer: "ابدأ", precedent: "السابق", ecouter: "استمع", suivant: "التالي", terminer: "إنهاء", termine: "تمت الحصة 🎉", recommencer: "ابدأ من جديد", exercice: "تمرين", video: "فيديو بـ" },
  de: { langue: "Sprache :", commencer: "STARTEN", precedent: "Zurück", ecouter: "Anhören", suivant: "Weiter", terminer: "Beenden", termine: "TRAINING BEENDET 🎉", recommencer: "Nochmal starten", exercice: "Übung", video: "Video in" },
  it: { langue: "Lingua :", commencer: "INIZIA", precedent: "Precedente", ecouter: "Ascolta", suivant: "Avanti", terminer: "Finisci", termine: "ALLENAMENTO FINITO 🎉", recommencer: "Ricomincia", exercice: "Esercizio", video: "Video in" },
};

const EXOS: any = [
  { nom: { en: "Push-ups", fr: "Pompes", es: "Flexiones", pt: "Flexões", ar: "تمارين الضغط", de: "Liegestütze", it: "Flessioni" }, reps: "3 x 12", video: "https://www.youtube.com/embed/IODxDxX7oi0", consigne: { en: "Keep your back straight", fr: "Garde le dos droit", es: "Mantén la espalda recta", pt: "Mantenha as costas retas", ar: "حافظ على استقامة ظهرك", de: "Halte den Rücken gerade", it: "Tieni la schiena dritta" } },
  { nom: { en: "Squats", fr: "Squats", es: "Sentadillas", pt: "Agachamentos", ar: "القرفصاء", de: "Kniebeugen", it: "Squat" }, reps: "3 x 15", video: "https://www.youtube.com/embed/YaXPRqUwItQ", consigne: { en: "Go down slowly", fr: "Descends lentement", es: "Baja lentamente", pt: "Desça devagar", ar: "انزل ببطء", de: "Geh langsam runter", it: "Scendi lentamente" } },
  { nom: { en: "Plank", fr: "Gainage", es: "Plancha", pt: "Prancha", ar: "بلانك", de: "Plank", it: "Plank" }, reps: "3 x 30 sec", video: "https://www.youtube.com/embed/pSHjTRCQxIw", consigne: { en: "Tighten your abs", fr: "Serre les abdos", es: "Aprieta el abdomen", pt: "Aperte o abdômen", ar: "شد عضلات بطنك", de: "Spanne den Bauch an", it: "Contrai gli addominali" } },
  { nom: { en: "Lunges", fr: "Fentes", es: "Zancadas", pt: "Avanços", ar: "الاندفاع", de: "Ausfallschritte", it: "Affondi" }, reps: "3 x 10", video: "https://www.youtube.com/embed/QOVaHwm-Q6U", consigne: { en: "Keep your balance", fr: "Garde l'équilibre", es: "Mantén el equilibrio", pt: "Mantenha o equilíbrio", ar: "حافظ على توازنك", de: "Halte das Gleichgewicht", it: "Mantieni l'equilibrio" } },
];

export default function WorkoutPlayer() {
  const [langue, setLangue] = useState("fr");
  const [index, setIndex] = useState(0);
  const [demarre, setDemarre] = useState(false);
  const [termine, setTermine] = useState(false);
  const t = TEXTES[langue];
  const exo = EXOS[index];

  const parler = (texte: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(texte);
      u.lang = langue === "ar" ? "ar-SA" : langue === "en" ? "en-US" : langue + "-" + langue.toUpperCase();
      window.speechSynthesis.speak(u);
    }
  };

  useEffect(() => {
    if (demarre && !termine) parler(exo.nom[langue] + ". " + exo.consigne[langue]);
  }, [index, langue, demarre]);

  const suivant = () => {
    if (index < EXOS.length - 1) setIndex(index + 1);
    else setTermine(true);
  };

  // ECRAN 1 : PAS ENCORE COMMENCÉ
  if (!demarre) {
    return (
      <div style={{ padding: 16 }}>
        <label>{t.langue} </label>
        <select value={langue} onChange={(e) => setLangue(e.target.value)} style={{ padding: 8, fontSize: 16 }}>
          <option value="fr">Français</option><option value="en">English</option><option value="es">Español</option><option value="pt">Português</option><option value="ar">العربية</option><option value="de">Deutsch</option><option value="it">Italiano</option>
        </select>
        <h2 style={{ marginTop: 20 }}>Entraînement du jour</h2>
        {EXOS.map((e: any, i: number) => (<p key={i}>• {e.nom[langue]} - {e.reps}</p>))}
        <button onClick={() => { setDemarre(true); setIndex(0); setTermine(false); }} style={{ background: "#16a34a", color: "white", padding: "14px 28px", fontSize: 20, border: "none", borderRadius: 10, width: "100%", marginTop: 16 }}>{t.commencer}</button>
      </div>
    );
  }

  // ECRAN 3 : TERMINÉ
  if (termine) {
    return (
      <div style={{ padding: 16, textAlign: "center" }}>
        <h2>{t.termine}</h2>
        <button onClick={() => { setDemarre(false); setTermine(false); setIndex(0); }} style={{ background: "#16a34a", color: "white", padding: "14px 28px", fontSize: 18, border: "none", borderRadius: 10, marginTop: 16 }}>{t.recommencer}</button>
      </div>
    );
  }

  // ECRAN 2 : EN COURS
  return (
    <div style={{ padding: 16 }}>
      <label>{t.langue} </label>
      <select value={langue} onChange={(e) => setLangue(e.target.value)} style={{ padding: 8, fontSize: 16 }}>
        <option value="fr">Français</option><option value="en">English</option><option value="es">Español</option><option value="pt">Português</option><option value="ar">العربية</option><option value="de">Deutsch</option><option value="it">Italiano</option>
      </select>
      <h2 style={{ marginTop: 12 }}>{t.exercice} {index + 1}/{EXOS.length} : {exo.nom[langue]}</h2>
      <p>{exo.reps}</p>
      <iframe width="100%" height="220" src={exo.video} allowFullScreen style={{ border: "none", borderRadius: 10 }}></iframe>
      <p>{t.video} {langue} : {exo.consigne[langue]}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => index > 0 && setIndex(index - 1)} style={{ flex: 1, padding: 12 }}>{t.precedent}</button>
        <button onClick={() => parler(exo.consigne[langue])} style={{ flex: 1, padding: 12 }}>🔊 {t.ecouter}</button>
        <button onClick={suivant} style={{ flex: 1, padding: 12, background: "#16a34a", color: "white", border: "none", borderRadius: 8 }}>{index === EXOS.length - 1 ? t.terminer : t.suivant}</button>
      </div>
    </div>
  );
  }
