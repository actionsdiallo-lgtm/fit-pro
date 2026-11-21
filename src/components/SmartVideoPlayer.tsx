"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type {
  NarrationLanguage,
  VoiceProfileId,
} from "@/app/api/narration/route";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type ExerciseStepPhase =
  | "presentation"
  | "start_position"
  | "movement"
  | "breathing"
  | "reps"
  | "rest"
  | "safety";

export interface SynchronizedVideoStep {
  id: string;
  phase: ExerciseStepPhase;
  label: string;
  startSec: number;
  endSec: number;
  captions: Record<NarrationLanguage, string>;
}

export interface SmartVideoPlayerProps {
  title: string;
  videoUrl: string | null;
  posterUrl: string;
  steps: SynchronizedVideoStep[];
  userId: string | null;
}

interface PlayerPreferences {
  voiceId: VoiceProfileId;
  language: NarrationLanguage;
  videoVolume: number;
  voiceVolume: number;
  narrationEnabled: boolean;
  narrationRate: number;
  subtitlesEnabled: boolean;
  autoplayEnabled: boolean;
  loopEnabled: boolean;
}

const VOICE_OPTIONS: { id: VoiceProfileId; label: string }[] = [
  { id: "male_natural", label: "Voix masculine naturelle" },
  { id: "female_natural", label: "Voix féminine naturelle" },
  { id: "male_energetic", label: "Voix masculine énergique" },
  { id: "female_soft", label: "Voix féminine douce" },
  { id: "coach_pro", label: "Voix professionnelle de coach sportif" },
];

const LANGUAGE_OPTIONS: { id: NarrationLanguage; label: string }[] = [
  { id: "fr", label: "Français" },
  { id: "en", label: "Anglais" },
  { id: "es", label: "Espagnol" },
  { id: "pt", label: "Portugais" },
  { id: "ar", label: "Arabe" },
  { id: "de", label: "Allemand" },
  { id: "it", label: "Italien" },
];

const DEFAULT_PREFS: PlayerPreferences = {
  voiceId: "coach_pro",
  language: "fr",
  videoVolume: 0.8,
  voiceVolume: 1.0,
  narrationEnabled: true,
  narrationRate: 1.0,
  subtitlesEnabled: true,
  autoplayEnabled: true,
  loopEnabled: false,
};

export default function SmartVideoPlayer({
  title,
  videoUrl,
  posterUrl,
  steps,
  userId,
}: SmartVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const narrationAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const lastSpokenStepIdRef = useRef<string | null>(null);

  const [prefs, setPrefs] = useState<PlayerPreferences>(DEFAULT_PREFS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [previewingVoice, setPreviewingVoice] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsStatus, setPrefsStatus] = useState<string | null>(null);

  useEffect(() => {
    setVideoError(null);
    setVoiceError(null);
    lastSpokenStepIdRef.current = null;
    setCurrentTime(0);
  }, [videoUrl, title]);

  useEffect(() => {
    let active = true;
    if (!userId) {
      setPrefs(DEFAULT_PREFS);
      return;
    }

    (async () => {
      const { data } = await supabase
        .from("user_player_preferences")
        .select(
          "voice_id, narration_lang, video_volume, voice_volume, narration_enabled, narration_rate, subtitles_enabled, autoplay_enabled, loop_enabled"
        )
        .eq("user_id", userId)
        .maybeSingle();

      if (!active || !data) return;

      setPrefs({
        voiceId: (data.voice_id as VoiceProfileId) || DEFAULT_PREFS.voiceId,
        language:
          (data.narration_lang as NarrationLanguage) || DEFAULT_PREFS.language,
        videoVolume:
          typeof data.video_volume === "number"
            ? data.video_volume
            : DEFAULT_PREFS.videoVolume,
        voiceVolume:
          typeof data.voice_volume === "number"
            ? data.voice_volume
            : DEFAULT_PREFS.voiceVolume,
        narrationEnabled:
          typeof data.narration_enabled === "boolean"
            ? data.narration_enabled
            : DEFAULT_PREFS.narrationEnabled,
        narrationRate:
          typeof data.narration_rate === "number"
            ? data.narration_rate
            : DEFAULT_PREFS.narrationRate,
        subtitlesEnabled:
          typeof data.subtitles_enabled === "boolean"
            ? data.subtitles_enabled
            : DEFAULT_PREFS.subtitlesEnabled,
        autoplayEnabled:
          typeof data.autoplay_enabled === "boolean"
            ? data.autoplay_enabled
            : DEFAULT_PREFS.autoplayEnabled,
        loopEnabled:
          typeof data.loop_enabled === "boolean"
            ? data.loop_enabled
            : DEFAULT_PREFS.loopEnabled,
      });
    })();

    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = Math.max(0, Math.min(1, prefs.videoVolume));
    v.muted = isMuted;
    v.playbackRate = prefs.narrationRate;
    v.loop = prefs.loopEnabled;
  }, [prefs.videoVolume, prefs.narrationRate, prefs.loopEnabled, isMuted]);

  useEffect(() => {
    if (narrationAudioRef.current) {
      narrationAudioRef.current.volume = Math.max(
        0,
        Math.min(1, prefs.voiceVolume)
      );
      narrationAudioRef.current.playbackRate = prefs.narrationRate;
    }
  }, [prefs.voiceVolume, prefs.narrationRate]);

  useEffect(() => {
    return () => {
      if (narrationAudioRef.current) {
        narrationAudioRef.current.pause();
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  const activeStep = useMemo(() => {
    return (
      steps.find(
        (s) => currentTime >= s.startSec && currentTime < s.endSec
      ) || null
    );
  }, [steps, currentTime]);

  const speakText = useCallback(
    async (text: string, isPreview = false) => {
      if (!text.trim()) return;
      if (!isPreview && !prefs.narrationEnabled) return;

      setVoiceError(null);
      if (isPreview) setPreviewingVoice(true);

      try {
        const res = await fetch("/api/narration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            voiceId: prefs.voiceId,
            language: prefs.language,
            rate: prefs.narrationRate,
          }),
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error(
            payload?.error ||
              "Cette voix ou langue n'est pas disponible actuellement."
          );
        }

        const blob = await res.blob();
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        const objectUrl = URL.createObjectURL(blob);
        audioUrlRef.current = objectUrl;

        if (!narrationAudioRef.current) {
          narrationAudioRef.current = new Audio();
        }
        const audioEl = narrationAudioRef.current;
        audioEl.pause();
        audioEl.src = objectUrl;
        audioEl.volume = Math.max(0, Math.min(1, prefs.voiceVolume));
        audioEl.playbackRate = prefs.narrationRate;
        await audioEl.play();
      } catch (err) {
        setVoiceError(
          err instanceof Error
            ? err.message
            : "Erreur de lecture de la voix."
        );
      } finally {
        if (isPreview) setPreviewingVoice(false);
      }
    },
    [
      prefs.narrationEnabled,
      prefs.voiceId,
      prefs.language,
      prefs.narrationRate,
      prefs.voiceVolume,
    ]
  );

  useEffect(() => {
    if (!activeStep || !isPlaying || !prefs.narrationEnabled) return;
    if (lastSpokenStepIdRef.current === activeStep.id) return;

    lastSpokenStepIdRef.current = activeStep.id;
    const caption =
      activeStep.captions[prefs.language] || activeStep.captions.fr;
    speakText(caption, false);
  }, [
    activeStep,
    isPlaying,
    prefs.narrationEnabled,
    prefs.language,
    speakText,
  ]);

  const savePreferences = async (nextPrefs: PlayerPreferences) => {
    setPrefs(nextPrefs);
    setPrefsStatus(null);
    if (!userId) return;

    setSavingPrefs(true);
    try {
      const { error } = await supabase.from("user_player_preferences").upsert(
        {
          user_id: userId,
          voice_id: nextPrefs.voiceId,
          narration_lang: nextPrefs.language,
          video_volume: nextPrefs.videoVolume,
          voice_volume: nextPrefs.voiceVolume,
          narration_enabled: nextPrefs.narrationEnabled,
          narration_rate: nextPrefs.narrationRate,
          subtitles_enabled: nextPrefs.subtitlesEnabled,
          autoplay_enabled: nextPrefs.autoplayEnabled,
          loop_enabled: nextPrefs.loopEnabled,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
      if (error) {
        setPrefsStatus(error.message);
      } else {
        setPrefsStatus("Préférences enregistrées sur votre compte.");
      }
    } finally {
      setSavingPrefs(false);
    }
  };

  const togglePlayPause = async () => {
    const v = videoRef.current;
    if (!v || !videoUrl) return;
    if (v.paused) {
      try {
        await v.play();
        setIsPlaying(true);
      } catch {
        setVideoError(
          "La lecture automatique ou manuelle a été bloquée par le navigateur."
        );
      }
    } else {
      v.pause();
      narrationAudioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const seekBy = (deltaSec: number) => {
    const v = videoRef.current;
    if (!v) return;
    const nextTime = Math.max(0, v.currentTime + deltaSec);
    v.currentTime = nextTime;
    setCurrentTime(nextTime);
    lastSpokenStepIdRef.current = null;
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen().catch(() => null);
    } else {
      await document.exitFullscreen().catch(() => null);
    }
  };

  if (!videoUrl || videoError) {
    return (
      <div className="mt-4 rounded-2xl border border-amber-500/35 bg-black/70 p-5 text-sm text-amber-200">
        {videoError ||
          `Aucune vidéo réelle n'est disponible pour "${title}". Aucune fausse vidéo ni image fixe n'est utilisée en remplacement.`}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="mt-4 space-y-4">
      <div className="relative overflow-hidden rounded-2xl bg-black border border-white/10">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          autoPlay={prefs.autoplayEnabled}
          loop={prefs.loopEnabled}
          muted={isMuted}
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onError={() =>
            setVideoError(
              "Impossible de charger ou lire le fichier vidéo réel pour cet exercice."
            )
          }
          className="w-full max-h-[420px] object-cover"
        />

        {prefs.subtitlesEnabled && activeStep && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-xl bg-black/80 px-4 py-2.5 text-center text-sm text-white border border-white/10">
            <span className="block text-[11px] font-bold uppercase text-lime-400">
              {activeStep.label}
            </span>
            <span>
              {activeStep.captions[prefs.language] || activeStep.captions.fr}
            </span>
          </div>
        )}
      </div>

      {voiceError && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/50 px-4 py-2.5 text-xs text-red-200">
          {voiceError}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={togglePlayPause}
          className="rounded-xl bg-lime-400 px-4 py-2 text-xs font-black text-black"
        >
          {isPlaying ? "Pause" : "Lecture"}
        </button>
        <button
          type="button"
          onClick={() => seekBy(-10)}
          className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold"
        >
          -10s
        </button>
        <button
          type="button"
          onClick={() => seekBy(10)}
          className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold"
        >
          +10s
        </button>
        <button
          type="button"
          onClick={() => setIsMuted((m) => !m)}
          className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold"
        >
          {isMuted ? "Mode silencieux : ON" : "Mode silencieux : OFF"}
        </button>
        <button
          type="button"
          onClick={() =>
            savePreferences({
              ...prefs,
              autoplayEnabled: !prefs.autoplayEnabled,
            })
          }
          className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold"
        >
          Autoplay : {prefs.autoplayEnabled ? "ON" : "OFF"}
        </button>
        <button
          type="button"
          onClick={() =>
            savePreferences({ ...prefs, loopEnabled: !prefs.loopEnabled })
          }
          className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold"
        >
          Répétition : {prefs.loopEnabled ? "ON" : "OFF"}
        </button>
        <button
          type="button"
          onClick={() =>
            savePreferences({
              ...prefs,
              subtitlesEnabled: !prefs.subtitlesEnabled,
            })
          }
          className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold"
        >
          Sous-titres : {prefs.subtitlesEnabled ? "ON" : "OFF"}
        </button>
        <button
          type="button"
          onClick={() =>
            savePreferences({
              ...prefs,
              narrationEnabled: !prefs.narrationEnabled,
            })
          }
          className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold"
        >
          Narration : {prefs.narrationEnabled ? "ON" : "OFF"}
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold"
        >
          Plein écran
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-2xl border border-white/10 bg-[#1B1B1B] p-4 text-xs">
        <label className="space-y-1">
          <span className="block text-gray-300 font-semibold">
            Langue de narration
          </span>
          <select
            value={prefs.language}
            onChange={(e) => {
              lastSpokenStepIdRef.current = null;
              savePreferences({
                ...prefs,
                language: e.target.value as NarrationLanguage,
              });
            }}
            className="w-full rounded-lg bg-[#101010] border border-white/15 px-3 py-2 text-white"
          >
            {LANGUAGE_OPTIONS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="block text-gray-300 font-semibold">Voix</span>
          <select
            value={prefs.voiceId}
            onChange={(e) => {
              lastSpokenStepIdRef.current = null;
              savePreferences({
                ...prefs,
                voiceId: e.target.value as VoiceProfileId,
              });
            }}
            className="w-full rounded-lg bg-[#101010] border border-white/15 px-3 py-2 text-white"
          >
            {VOICE_OPTIONS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="block text-gray-300 font-semibold">
            Vitesse ({prefs.narrationRate.toFixed(2)}x)
          </span>
          <input
            type="range"
            min="0.75"
            max="1.5"
            step="0.05"
            value={prefs.narrationRate}
            onChange={(e) =>
              savePreferences({
                ...prefs,
                narrationRate: parseFloat(e.target.value),
              })
            }
            className="w-full accent-lime-400"
          />
        </label>

        <div className="flex items-end">
          <button
            type="button"
            disabled={previewingVoice}
            onClick={() =>
              speakText(
                steps[0]?.captions[prefs.language] ||
                  steps[0]?.captions.fr ||
                  title,
                true
              )
            }
            className="w-full rounded-lg bg-lime-400/15 border border-lime-400/40 px-3 py-2 font-bold text-lime-300"
          >
            {previewingVoice ? "Aperçu..." : "Aperçu de la voix"}
          </button>
        </div>

        <label className="space-y-1 sm:col-span-2">
          <span className="block text-gray-300 font-semibold">
            Volume vidéo ({Math.round(prefs.videoVolume * 100)}%)
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={prefs.videoVolume}
            onChange={(e) =>
              savePreferences({
                ...prefs,
                videoVolume: parseFloat(e.target.value),
              })
            }
            className="w-full accent-lime-400"
          />
        </label>

        <label className="space-y-1 sm:col-span-2">
          <span className="block text-gray-300 font-semibold">
            Volume voix ({Math.round(prefs.voiceVolume * 100)}%)
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={prefs.voiceVolume}
            onChange={(e) =>
              savePreferences({
                ...prefs,
                voiceVolume: parseFloat(e.target.value),
              })
            }
            className="w-full accent-lime-400"
          />
        </label>
      </div>

      {userId && (
        <p className="text-[11px] text-gray-400">
          {savingPrefs
            ? "Enregistrement des préférences..."
            : prefsStatus || "Préférences synchronisées avec votre compte."}
        </p>
      )}
    </div>
  );
   }
    
