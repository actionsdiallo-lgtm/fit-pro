"use client";

import React from "react";
import type { MotionType } from "@/data/trainingCatalog";

interface ExerciseAnimatorProps {
  motionType: MotionType;
  exerciseName: string;
  isPlaying: boolean;
  phaseLabel?: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
}

export default function ExerciseAnimator({
  motionType,
  exerciseName,
  isPlaying,
  phaseLabel,
  primaryMuscles,
  secondaryMuscles,
}: ExerciseAnimatorProps) {
  const isUpperFocus = [
    "pushup",
    "incline_pushup",
    "bench_press",
    "chest_fly",
    "chest_stretch",
    "bicep_curl",
    "tricep_dip",
    "wrist_curl",
    "shoulder_press",
    "lateral_raise",
  ].includes(motionType);

  const isCoreFocus = ["crunch", "plank", "leg_raise"].includes(motionType);
  const isBackFocus = ["superman", "back_extension"].includes(motionType);
  const isLowerFocus = [
    "squat",
    "lunge",
    "glute_bridge",
    "donkey_kick",
    "calf_raise",
    "hamstring_stretch",
  ].includes(motionType);

  const isHorizontalPose = [
    "pushup",
    "incline_pushup",
    "plank",
    "superman",
    "back_extension",
    "glute_bridge",
    "donkey_kick",
    "crunch",
    "leg_raise",
  ].includes(motionType);

  return (
    <div className="relative w-full rounded-2xl border border-emerald-500/35 bg-gradient-to-b from-[#0b1811] via-[#07110b] to-[#050a07] p-4 overflow-hidden">
      <style jsx>{`
        @keyframes fitproCycle {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(8px) scale(0.985);
          }
        }
        @keyframes fitproArms {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-14deg);
          }
        }
        @keyframes fitproLegs {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(6px);
          }
        }
        .anim-active-body {
          animation: fitproCycle 2.2s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .anim-active-arms {
          animation: fitproArms 2.2s ease-in-out infinite;
          transform-origin: 110px 86px;
        }
        .anim-active-legs {
          animation: fitproLegs 2.2s ease-in-out infinite;
          transform-origin: 110px 145px;
        }
      `}</style>

      <div className="flex items-center justify-between gap-2 mb-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#39ff49]">
            Animation du mouvement
          </span>
          <div className="text-xs text-emerald-100/80">
            {isPlaying
              ? phaseLabel || "Exécution en boucle continue"
              : "En pause — démarrez ou reprenez la séance"}
          </div>
        </div>
        <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-[#39ff49]">
          {motionType.replaceAll("_", " ")}
        </span>
      </div>

      <div className="flex items-center justify-center py-2">
        <svg
          viewBox="0 0 220 230"
          className="w-52 h-56 select-none"
          role="img"
          aria-label={`Personnage animé exécutant ${exerciseName}`}
        >
          <ellipse cx="110" cy="212" rx="54" ry="8" fill="#162b1f" />

          <g
            className={isPlaying ? "anim-active-body" : ""}
            transform={isHorizontalPose ? "translate(0, 12)" : "translate(0, 0)"}
          >
            <g className={isPlaying ? "anim-active-arms" : ""}>
              <path
                d="M84 82 L32 94 L18 96"
                stroke="#e5b39b"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <ellipse cx="15" cy="96" rx="6" ry="4.5" fill="#e5b39b" />

              <path
                d="M136 82 L188 94 L202 96"
                stroke="#e5b39b"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <ellipse cx="205" cy="96" rx="6" ry="4.5" fill="#e5b39b" />
            </g>

            <rect x="102" y="64" width="16" height="14" rx="5" fill="#e5b39b" />

            <ellipse cx="110" cy="46" rx="20" ry="23" fill="#e5b39b" />
            <path
              d="M91 40 C92 24, 128 24, 129 40 C123 33, 97 33, 91 40 Z"
              fill="#5d646b"
            />
            <ellipse cx="89" cy="48" rx="3.5" ry="6" fill="#d9a38a" />
            <ellipse cx="131" cy="48" rx="3.5" ry="6" fill="#d9a38a" />

            <path
              d="M84 78 L136 78 L131 134 L89 134 Z"
              rx="10"
              fill="#2c82c9"
            />
            <path
              d="M92 84 L128 84 L125 128 L95 128 Z"
              fill={
                isUpperFocus || isBackFocus || isCoreFocus
                  ? "#39ff49"
                  : "#3498db"
              }
              fillOpacity={
                isUpperFocus || isBackFocus || isCoreFocus ? 0.25 : 0.1
              }
            />

            <path
              d="M88 134 L132 134 L136 164 L114 164 L110 148 L106 164 L84 164 Z"
              fill="#22272e"
            />

            <g className={isPlaying ? "anim-active-legs" : ""}>
              <rect
                x="91"
                y="162"
                width="13"
                height="36"
                rx="6"
                fill={isLowerFocus ? "#eab390" : "#e5b39b"}
              />
              <path
                d="M87 196 L106 196 L108 208 L84 208 Z"
                fill="#525860"
              />

              <rect
                x="116"
                y="162"
                width="13"
                height="36"
                rx="6"
                fill={isLowerFocus ? "#eab390" : "#e5b39b"}
              />
              <path
                d="M114 196 L133 196 L136 208 L112 208 Z"
                fill="#525860"
              />
            </g>
          </g>
        </svg>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-1.5 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-bold text-[#39ff49]">Muscles principaux :</span>
          <span className="text-white">{primaryMuscles.join(", ")}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-bold text-emerald-300">Secondaires :</span>
          <span className="text-emerald-100/80">{secondaryMuscles.join(", ")}</span>
        </div>
      </div>
    </div>
  );
      }
            
