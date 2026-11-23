import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    const body = await req.json();
    const rawMinutes = Number(body.durationMinutes);
    const rawSeconds = Number(body.dureeSecondes);
    const durationMinutes =
      Number.isFinite(rawMinutes) && rawMinutes > 0
        ? Math.round(rawMinutes)
        : Number.isFinite(rawSeconds) && rawSeconds > 0
        ? Math.max(1, Math.round(rawSeconds / 60))
        : 1;

    const rawCalories = Number(body.calories ?? body.caloriesEstimees);
    const calories =
      Number.isFinite(rawCalories) && rawCalories > 0
        ? Math.round(rawCalories)
        : 0;

    const created = await prisma.workout.create({
      data: {
        userId: user.id,
        title: String(body.programmeTitre || body.title || "Séance d'entraînement"),
        category: String(body.categorie || body.category || "Entraînement"),
        durationMinutes,
        calories,
        notes: body.niveau ? String(body.niveau) : body.notes ? String(body.notes) : null,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        session: {
          id: created.id,
          programmeTitre: created.title,
          categorie: created.category,
          niveau: created.notes || "Séance enregistrée",
          dureeSecondes: (created.durationMinutes ?? 0) * 60,
          caloriesEstimees: created.calories ?? 0,
          repetitions: Math.max(0, Number(body.repetitions) || 0),
          series: Math.max(1, Number(body.series) || 1),
          createdAt: created.performedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/entrainement/seances error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement en base." },
      { status: 500 }
    );
  }
                         }
