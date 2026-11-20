"use client";
import { useState, useEffect, useRef } from "react";

const exercices = [
  { name: "Pompes", muscle: "Pectoraux", sets: 4, reps: 12, level: "Débutant", video: "https://videos.pexels.com/video-files/4763824/4763824-hd_1920_1080_25fps.mp4", poster: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg", desc: "Mains à plat, dos droit, descends lentement, pousse fort.", coach: "Pompes. Mains à plat, dos droit. Descends lentement, pousse fort. Allez !" },
  { name: "Squat", muscle: "Jambes", sets: 4, reps: 12, level: "Débutant", video: "https://videos.pexels.com/video-files/4763800/4763800-hd_1920_1080_25fps.mp4", poster: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg", desc: "Dos droit, genoux alignés, descends à 90°, remonte.", coach: "Squat. Dos droit, descends à 90 degrés, remonte. Allez, on pousse avec les jambes !" },
  { name: "Bench Press", muscle: "Pectoraux", sets: 4, reps: 10, level: "Intermédiaire", video: "https://videos.pexels.com/video-files/6458065/6458065-hd_1920_1080_25fps.mp4", poster: "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg", desc: "Barre au milieu de la poitrine, contrôle la descente.", coach: "Bench Press. Barre au milieu de la poitrine, contrôle la descente. Allez !" },
  { name: "Abdos Crunch", muscle: "Abdos", sets: 3, reps: 15, level: "Débutant", video: "https://videos.pexels.com/video-files/6458053/6458053-hd_1920_1080_25fps.mp4", poster: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg", desc: "Serre les abdos, monte doucement.", coach: "Abdos. Serre le ventre, monte doucement. Allez, on ne lâche rien !" },
];

export default function Entrainement() {
  const [selected, setSelected] = useState(exercices[0]);
  const [musicOn, setMusicOn] = useState(false);
  const [isCoaching, setIsCoaching] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [selected]);

  // VOIX DU COACH
  const parler = (texte: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const voix = new SpeechSynthesisUtterance(texte);
    voix.lang = "fr-FR";
    voix.rate = 1.0;
    voix.pitch = 1.0;
    window.speechSynthesis.speak(voix);
  };

  const demarrerCoach = () => {
    setIsCoaching(true);
    // Musique ON auto
    if (musicRef.current) {
      musicRef.current.volume = 0.15;
      musicRef.current.play().catch(()=>{});
      setMusicOn(true);
    }
    parler(`Allez, on commence ${selected.name}. ${selected.sets} séries de ${selected.reps} répétitions. ${selected.coach} Prêt ? 3, 2, 1, Go !`);
    // Compte les reps après 4 sec
    setTimeout(() => {
      let i = 1;
      const interval = setInterval(() => {
        if (i > selected.reps) {
          clearInterval(interval);
          parler(`Bravo ! Série terminée. Prends 30 secondes de repos.`);
          setIsCoaching(false);
          return;
        }
        if (i === 6) parler(`Allez, plus que la moitié, ${i} !`);
        else if (i % 3 === 0) parler(`${i} !`);
        i++;
      }, 2500);
    }, 5000);
  };

  const toggleMusic = () => {
    if (!musicRef.current) return;
    if (musicOn) { musicRef.current.pause(); setMusicOn(false); }
    else { musicRef.current.volume = 0.15; musicRef.current.play().catch(()=>{}); setMusicOn(true); }
  };

  return (
    <div style={{ padding: 16, background: "#000", color: "#fff", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 26, fontWeight: "bold" }}>Entraînement PRO</h1>
      <p style={{ opacity: 0.7, fontSize: 13 }}>Vidéo + Voix Coach + Musique</p>

      {/* MUSIQUE DE FOND - libre de droit */}
      <audio ref={musicRef} src="https://cdn.pixabay.com/audio/2022/05/27/audio_1c9d8c1b0f.mp3" loop preload="auto" />

      <div style={{ marginTop: 16, borderRadius: 18, overflow: "hidden", background: "#111", border: "1px solid #222" }}>
        <video ref={videoRef} key={selected.video} src={selected.video} poster={selected.poster} autoPlay muted loop playsInline controls preload="auto" style={{ width: "100%", height: 230, objectFit: "cover", display: "block" }} />
        <div style={{ padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 20, fontWeight: "bold" }}>{selected.name}</h2>
            <span style={{ background: "#a855f7", padding: "4px 10px", borderRadius: 20, fontSize: 12 }}>{selected.level}</span>
          </div>
          <p style={{ opacity: 0.8, marginTop: 6, fontSize: 14 }}>{selected.desc}</p>
          <p style={{ marginTop: 10, fontWeight: "bold" }}>{selected.sets} séries x {selected.reps} reps • {selected.muscle}</p>

          <button onClick={demarrerCoach} style={{ marginTop: 12, width: "100%", padding: 14, borderRadius: 12, background: isCoaching ? "#22c55e" : "#a855f7", color: "#fff", border: "none", fontWeight: "bold", fontSize: 15 }}>
            {isCoaching ? "🎙️ Coach en cours..." : "▶ Commencer avec Coach Vocal"}
          </button>

          <button onClick={toggleMusic} style={{ marginTop: 8, width: "100%", padding: 12, borderRadius: 12, background: "#222", color: "#fff", border: "1px solid #333", fontWeight: "bold" }}>
            {musicOn ? "⏸️ Couper la musique" : "🎵 Activer la musique sport"}
          </button>
          <button onClick={() => parler(selected.coach)} style={{ marginTop: 8, width: "100%", padding: 12, borderRadius: 12, background: "#111", color: "#fff", border: "1px solid #333" }}>
            🔊 Écouter l'explication du coach
          </button>
        </div>
      </div>

      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        {exercices.map((ex) => (
          <button key={ex.name} onClick={() => { setSelected(ex); window.speechSynthesis?.cancel(); }} style={{ display: "flex", gap: 12, alignItems: "center", padding: 10, borderRadius: 14, background: selected.name === ex.name ? "#2a0a3a" : "#111", border: selected.name === ex.name ? "1px solid #a855f7" : "1px solid #222", color: "#fff", textAlign: "left" }}>
            <video src={ex.video} poster={ex.poster} autoPlay muted loop playsInline preload="metadata" style={{ width: 90, height: 60, borderRadius: 10, objectFit: "cover" }} />
            <div><div style={{ fontWeight: "bold" }}>{ex.name}</div><div style={{ fontSize: 12, opacity: 0.7 }}>{ex.muscle} • {ex.sets} x {ex.reps} • {ex.level}</div></div>
          </button>
        ))}
      </div>
    </div>
  );
  }
