"use client";
import { useState } from "react";

const exercices = [
  {
    name: "Pompes",
    muscle: "Pectoraux",
    sets: 4,
    reps: 12,
    level: "Débutant",
    // Vidéo commerciale Pexels - tu changes le lien par ta vidéo Pexels
    video: "https://videos.pexels.com/video-files/4763824/4763824-hd_1920_1080_25fps.mp4",
    poster: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg",
    desc: "Mains à plat, dos droit, descends lentement, pousse fort.",
  },
  {
    name: "Squat",
    muscle: "Jambes",
    sets: 4,
    reps: 12,
    level: "Débutant",
    video: "https://videos.pexels.com/video-files/4763800/4763800-hd_1920_1080_25fps.mp4",
    poster: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg",
    desc: "Dos droit, genoux alignés, descends à 90°, remonte.",
  },
  {
    name: "Bench Press",
    muscle: "Pectoraux",
    sets: 4,
    reps: 10,
    level: "Intermédiaire",
    video: "https://videos.pexels.com/video-files/6458065/6458065-hd_1920_1080_25fps.mp4",
    poster: "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg",
    desc: "Barre au milieu de la poitrine, contrôle la descente.",
  },
  {
    name: "Tractions",
    muscle: "Dos",
    sets: 3,
    reps: 8,
    level: "Avancé",
    video: "https://videos.pexels.com/video-files/6458053/6458053-hd_1920_1080_25fps.mp4",
    poster: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg",
    desc: "Tire avec le dos, menton au-dessus de la barre.",
  },
];

export default function Entrainement() {
  const [selected, setSelected] = useState(exercices[0]);

  return (
    <div style={{ padding: 16, background: "#000", color: "#fff", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 26, fontWeight: "bold" }}>Entraînement PRO</h1>
      <p style={{ opacity: 0.7, fontSize: 13 }}>Vidéos HD - Qualité Commerciale</p>

      {/* LECTEUR VIDÉO PRO */}
      <div style={{ marginTop: 16, borderRadius: 18, overflow: "hidden", background: "#111", border: "1px solid #222" }}>
        <video
          key={selected.video}
          src={selected.video}
          poster={selected.poster}
          controls
          autoPlay
          loop
          muted
          playsInline
          style={{ width: "100%", height: 230, objectFit: "cover", display: "block" }}
        />
        <div style={{ padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: 20, fontWeight: "bold" }}>{selected.name}</h2>
            <span style={{ background: "#a855f7", padding: "4px 10px", borderRadius: 20, fontSize: 12 }}>{selected.level}</span>
          </div>
          <p style={{ opacity: 0.8, marginTop: 6, fontSize: 14 }}>{selected.desc}</p>
          <p style={{ marginTop: 10, fontWeight: "bold" }}>💪 {selected.sets} séries x {selected.reps} reps • {selected.muscle}</p>
          <button style={{ marginTop: 12, width: "100%", padding: 14, borderRadius: 12, background: "#a855f7", color: "#fff", border: "none", fontWeight: "bold" }}>
            ▶ Commencer l'exercice
          </button>
        </div>
      </div>

      {/* LISTE VIDÉOS */}
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        {exercices.map((ex) => (
          <button
            key={ex.name}
            onClick={() => setSelected(ex)}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              padding: 10,
              borderRadius: 14,
              background: selected.name === ex.name ? "#2a0a3a" : "#111",
              border: selected.name === ex.name ? "1px solid #a855f7" : "1px solid #222",
              color: "#fff",
              textAlign: "left",
            }}
          >
            <video src={ex.video} poster={ex.poster} muted playsInline style={{ width: 90, height: 60, borderRadius: 10, objectFit: "cover" }} />
            <div>
              <div style={{ fontWeight: "bold" }}>▶️ {ex.name}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{ex.muscle} • {ex.sets} x {ex.reps} • {ex.level}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
          }
