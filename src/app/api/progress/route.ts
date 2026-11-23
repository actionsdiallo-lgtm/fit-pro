import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RangeKey = "7d" | "30d" | "3m" | "1y";

function parseRange(raw: string | null): { key: RangeKey; days: number } {
  switch (raw) {
    case "7d":
      return { key: "7d", days: 7 };
    case "3m":
      return { key: "3m", days: 90 };
    case "1y":
      return { key: "1y", days: 365 };
    case "30d":
    default:
      return { key: "30d", days: 30 };
  }
}

function formatDuration(totalMinutes: number): string {
  if (!totalMinutes || totalMinutes <= 0) return "0 min";
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${String(mins).padStart(2, "0")}min`;
}

function calcDeltaPct(current: number, previous: number): number | null {
  if (previous <= 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { key: range, days } = parseRange(searchParams.get("range"));
    const emailParam = searchParams.get("email")?.trim().toLowerCase();
    const userIdParam = searchParams.get("userId")?.trim();

    const emptyPayload = {
      range,
      isEmpty: true,
      stats: {
        caloriesBurned: 0,
        caloriesDeltaPct: null,
        workoutsCount: 0,
        workoutsDeltaPct: null,
        totalMinutes: 0,
        totalDurationLabel: "0 min",
        durationDeltaPct: null,
        currentWeightKg: null,
        weightDeltaKg: null,
      },
      series: [],
      goals: { completionPct: 0, items: [] },
      records: [],
    };

    if (!emailParam && !userIdParam) {
      return NextResponse.json(emptyPayload);
    }

    const user = await prisma.user.findUnique({
      where: userIdParam ? { id: userIdParam } : { email: emailParam! },
      select: {
        id: true,
        profile: { select: { weightKg: true } },
        goals: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            target: true,
            current: true,
            completedAt: true,
          },
        },
        workouts: {
          orderBy: { performedAt: "asc" },
          select: {
            id: true,
            title: true,
            durationMinutes: true,
            distanceKm: true,
            calories: true,
            performedAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(emptyPayload);
    }

    const now = new Date();
    const nowMs = now.getTime();
    const periodStart = new Date(nowMs - days * 24 * 60 * 60 * 1000);
    const prevPeriodStart = new Date(nowMs - days * 2 * 24 * 60 * 60 * 1000);

    const currentWorkouts = user.workouts.filter(
      (w) => new Date(w.performedAt) >= periodStart
    );
    const previousWorkouts = user.workouts.filter((w) => {
      const d = new Date(w.performedAt);
      return d >= prevPeriodStart && d < periodStart;
    });

    const caloriesBurned = currentWorkouts.reduce((acc, w) => acc + (w.calories ?? 0), 0);
    const prevCalories = previousWorkouts.reduce((acc, w) => acc + (w.calories ?? 0), 0);

    const workoutsCount = currentWorkouts.length;
    const prevWorkoutsCount = previousWorkouts.length;

    const totalMinutes = currentWorkouts.reduce(
      (acc, w) => acc + (w.durationMinutes ?? 0),
      0
    );
    const prevMinutes = previousWorkouts.reduce(
      (acc, w) => acc + (w.durationMinutes ?? 0),
      0
    );

    const currentWeightKg = user.profile?.weightKg ?? null;

    const bucketCount = 4;
    const bucketSpanMs = (nowMs - periodStart.getTime()) / bucketCount;
    const series = Array.from({ length: bucketCount }, (_, idx) => {
      const bStart = periodStart.getTime() + idx * bucketSpanMs;
      const bEnd = idx === bucketCount - 1 ? nowMs + 1 : bStart + bucketSpanMs;
      const bucketWorkouts = currentWorkouts.filter((w) => {
        const t = new Date(w.performedAt).getTime();
        return t >= bStart && t < bEnd;
      });
      const bucketCalories = bucketWorkouts.reduce((s, w) => s + (w.calories ?? 0), 0);
      return {
        label: `S${idx + 1}`,
        calories: bucketCalories,
        weightKg: currentWeightKg,
      };
    });

    const goalItems = user.goals.slice(0, 3).map((g) => {
      const pct = g.target > 0 ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;
      return {
        id: g.id,
        title: g.title,
        completed: Boolean(g.completedAt) || pct >= 100,
        progressPct: pct,
      };
    });

    const completionPct =
      user.goals.length > 0
        ? Math.round(
            user.goals.reduce((acc, g) => {
              const pct = g.target > 0 ? Math.min(100, (g.current / g.target) * 100) : 0;
              return acc + pct;
            }, 0) / user.goals.length
          )
        : 0;

    const maxDistanceKm = user.workouts.reduce(
      (max, w) => (w.distanceKm && w.distanceKm > max ? w.distanceKm : max),
      0
    );
    const maxCaloriesSession = user.workouts.reduce(
      (max, w) => (w.calories && w.calories > max ? w.calories : max),
      0
    );
    const maxDurationMin = user.workouts.reduce(
      (max, w) => (w.durationMinutes && w.durationMinutes > max ? w.durationMinutes : max),
      0
    );

    const records: Array<{ id: string; label: string; value: string }> = [];
    if (maxDistanceKm > 0) {
      records.push({ id: "distance", label: "Meilleure distance", value: `${maxDistanceKm} km` });
    }
    if (maxCaloriesSession > 0) {
      records.push({ id: "calories", label: "Record calories", value: `${maxCaloriesSession} kcal` });
    }
    if (maxDurationMin > 0) {
      records.push({
        id: "duration",
        label: "Séance la plus longue",
        value: formatDuration(maxDurationMin),
      });
    }

    const isEmpty =
      user.workouts.length === 0 && user.goals.length === 0 && currentWeightKg === null;

    return NextResponse.json({
      range,
      isEmpty,
      stats: {
        caloriesBurned,
        caloriesDeltaPct: calcDeltaPct(caloriesBurned, prevCalories),
        workoutsCount,
        workoutsDeltaPct: calcDeltaPct(workoutsCount, prevWorkoutsCount),
        totalMinutes,
        totalDurationLabel: formatDuration(totalMinutes),
        durationDeltaPct: calcDeltaPct(totalMinutes, prevMinutes),
        currentWeightKg,
        weightDeltaKg: null,
      },
      series,
      goals: { completionPct, items: goalItems },
      records,
    });
  } catch (error) {
    console.error("Progress route error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement de la progression." },
      { status: 500 }
    );
  }
  }

    
