import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") ?? "30d";
    const email =
      req.headers.get("x-user-email")?.trim().toLowerCase() ||
      searchParams.get("email")?.trim().toLowerCase() ||
      "";

    if (!email) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        workouts: {
          orderBy: { performedAt: "desc" },
          select: {
            id: true,
            title: true,
            category: true,
            durationMinutes: true,
            distanceKm: true,
            calories: true,
            repetitions: true,
            series: true,
            notes: true,
            performedAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    const caloriesBurned = user.workouts.reduce((s, w) => s + (w.calories ?? 0), 0);
    const totalMinutes = user.workouts.reduce((s, w) => s + (w.durationMinutes ?? 0), 0);

    return NextResponse.json({
      range,
      summary: {
        caloriesBurned,
        caloriesDeltaPct: null,
        workoutsCount: user.workouts.length,
        workoutsDeltaPct: null,
        totalMinutes,
        totalDurationLabel: `${totalMinutes} min`,
        durationDeltaPct: null,
        currentWeightKg: null,
        weightDeltaKg: null,
      },
      series: [],
      goals: { completionPct: 0, items: [] },
      records: {
        maxCalories: user.workouts.reduce((m, w) => Math.max(m, w.calories ?? 0), 0),
        maxDurationMinutes: user.workouts.reduce((m, w) => Math.max(m, w.durationMinutes ?? 0), 0),
        maxDistanceKm: user.workouts.reduce((m, w) => Math.max(m, w.distanceKm ?? 0), 0),
      },
    });
  } catch (error) {
    console.error("Progress route error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement de la progression." },
      { status: 500 }
    );
  }
                                          }
