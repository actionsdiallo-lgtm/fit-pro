import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function getAuthenticatedUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;
  const cookieToken = req.cookies.get("session_token")?.value ?? null;
  const rawToken = bearerToken || cookieToken;

  if (!rawToken) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    include: { user: true },
  });

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    return null;
  }

  return session.user;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const body = await req.json();
    const title = String(body.title ?? body.nom ?? "Séance sans équipement").trim();
    const category = body.category ? String(body.category).trim() : null;
    const durationMinutes = Number(body.durationMinutes ?? body.duration ?? 0) || 0;
    const calories = body.calories != null ? Number(body.calories) || 0 : null;
    const repetitions =
      body.repetitions != null ? Math.max(0, Number(body.repetitions) || 0) : null;
    const series =
      body.series != null ? Math.max(0, Number(body.series) || 0) : null;
    const notes =
      body.notes != null
        ? String(body.notes)
        : body.niveau != null
          ? String(body.niveau)
          : null;
    const performedAt = body.performedAt ? new Date(body.performedAt) : new Date();

    const created = await prisma.workout.create({
      data: {
        userId: user.id,
        title,
        category,
        duration: durationMinutes,
        durationMinutes,
        calories,
        repetitions,
        series,
        notes,
        performedAt: Number.isNaN(performedAt.getTime()) ? new Date() : performedAt,
      },
    });

    return NextResponse.json(
      {
        workout: {
          id: created.id,
          userId: created.userId,
          title: created.title,
          category: created.category,
          duration: created.duration,
          durationMinutes: created.durationMinutes,
          calories: created.calories,
          repetitions: created.repetitions,
          series: created.series,
          notes: created.notes,
          createdAt: (created.performedAt ?? created.createdAt).toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Workout creation error:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'enregistrement de la séance." },
      { status: 500 }
    );
  }
}
  
