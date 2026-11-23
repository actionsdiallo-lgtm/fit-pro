import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ sessions: [] }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ sessions: [] }, { status: 200 });
    }

    const workouts = await prisma.workoutSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    const sessions = workouts.map((w) => ({
      id: w.id,
      programmeTitre: w.title,
      categorie: w.category,
      niveau: w.level,
      dureeSecondes: w.durationSeconds,
      caloriesEstimees: w.calories,
      repetitions: w.repetitions,
      series: w.sets,
      createdAt: w.createdAt.toISOString(),
    }));

    return NextResponse.json({ sessions }, { status: 200 });
  } catch (error) {
    console.error("GET /api/entrainement/seances error:", error);
    return NextResponse.json({ sessions: [] }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Connecte-toi pour enregistrer ta séance en base de données." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const body = await req.json();

    const created = await prisma.workoutSession.create({
      data: {
        userId: user.id,
        title: String(body.programmeTitre || body.categorie || "Séance d'entraînement"),
        category: String(body.categorie || "Entraînement"),
        level: String(body.niveau || "Débutant"),
        durationSeconds: Math.max(0, Number(body.dureeSecondes) || 0),
        calories: Math.max(0, Number(body.caloriesEstimees) || 0),
        repetitions: Math.max(0, Number(body.repetitions) || 0),
        sets: Math.max(1, Number(body.series) || 1),
      },
    });

    return NextResponse.json(
      {
        ok: true,
        session: {
          id: created.id,
          programmeTitre: created.title,
          categorie: created.category,
          niveau: created.level,
          dureeSecondes: created.durationSeconds,
          caloriesEstimees: created.calories,
          repetitions: created.repetitions,
          series: created.sets,
          createdAt: created.createdAt.toISOString(),
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
