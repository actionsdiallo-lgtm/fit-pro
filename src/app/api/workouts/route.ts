import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SUPPORTED_LANGS = ["fr", "en", "es", "ar", "pt", "de", "it", "wo"] as const;
type LangCode = (typeof SUPPORTED_LANGS)[number];

function resolveLang(raw: string | null): LangCode {
  if (raw && (SUPPORTED_LANGS as readonly string[]).includes(raw)) {
    return raw as LangCode;
  }
  return "fr";
}

function pickWorkoutTitre(wk: Record<string, unknown>, lang: LangCode): string {
  const map: Record<LangCode, string> = {
    fr: String(wk.titreFr ?? ""),
    en: String(wk.titreEn ?? ""),
    es: String(wk.titreEs ?? ""),
    ar: String(wk.titreAr ?? ""),
    pt: String(wk.titrePt ?? ""),
    de: String(wk.titreDe ?? ""),
    it: String(wk.titreIt ?? ""),
    wo: String(wk.titreWo ?? ""),
  };
  return map[lang] || map.fr;
}

function pickWorkoutDescription(wk: Record<string, unknown>, lang: LangCode): string {
  const map: Record<LangCode, string> = {
    fr: String(wk.descriptionFr ?? ""),
    en: String(wk.descriptionEn ?? ""),
    es: String(wk.descriptionEs ?? ""),
    ar: String(wk.descriptionAr ?? ""),
    pt: String(wk.descriptionPt ?? ""),
    de: String(wk.descriptionDe ?? ""),
    it: String(wk.descriptionIt ?? ""),
    wo: String(wk.descriptionWo ?? ""),
  };
  return map[lang] || map.fr;
}

function pickExerciseNom(ex: Record<string, unknown>, lang: LangCode): string {
  const map: Record<LangCode, string> = {
    fr: String(ex.nomFr ?? ""),
    en: String(ex.nomEn ?? ""),
    es: String(ex.nomEs ?? ""),
    ar: String(ex.nomAr ?? ""),
    pt: String(ex.nomPt ?? ""),
    de: String(ex.nomDe ?? ""),
    it: String(ex.nomIt ?? ""),
    wo: String(ex.nomWo ?? ""),
  };
  return map[lang] || map.fr;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = resolveLang(searchParams.get("lang"));
    const onlySansSaut = searchParams.get("sansSaut") === "true";

    const programs = await prisma.workoutProgram.findMany({
      where: {
        actif: true,
        ...(onlySansSaut ? { isSansSaut: true } : {}),
      },
      orderBy: { ordreAffichage: "asc" },
    });

    const allExercises = await prisma.exercise.findMany({
      where: { actif: true },
      orderBy: { ordreExercice: "asc" },
    });

    const formatted = programs.map((wk) => {
      const wkRecord = wk as unknown as Record<string, unknown>;
      const exercises = allExercises
        .filter((ex) => ex.idWorkout === wk.idWorkout)
        .map((ex) => {
          const exRecord = ex as unknown as Record<string, unknown>;
          return {
            ...ex,
            nomLocalise: pickExerciseNom(exRecord, lang),
          };
        });

      return {
        ...wk,
        langue: lang,
        titreLocalise: pickWorkoutTitre(wkRecord, lang),
        descriptionLocalise: pickWorkoutDescription(wkRecord, lang),
        exercises,
      };
    });

    return NextResponse.json({
      count: formatted.length,
      totalExercises: allExercises.length,
      workouts: formatted,
    });
  } catch (error) {
    console.error("GET /api/workouts error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des programmes" },
      { status: 500 }
    );
  }
}
