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

    const workouts = await prisma.workout.findMany({
      where: { userId: user.id },
      orderBy: { performedAt: "desc" },
      take: 30,
    });

    const sessions = workouts.map((w) => ({
      id: w.id,
      programmeTitre: w.title,
      categorie: w.category,
      niveau: w.notes || "Séance enregistrée",
      dureeSecondes: (w.durationMinutes || 0) * 60,
      caloriesEstimees: w.calories ?? 0,
      repetitions: 0,
      series: 1,
      createdAt: w.performedAt.toISOString(),
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
    const dureeSecondes = Math.max(0, Number(body.dureeSecondes) || 0);
    const durationMinutes = Math.max(
      1,
      Number(body.durationMinutes) || Math.round(dureeSecondes / 60) || 1
    );

    const created = await prisma.workout.create({
      data: {
        userId: user.id,
        title: String(body.programmeTitre || body.categorie || "Séance d'entraînement"),
        category: String(body.categorie || "Entraînement"),
        durationMinutes,
        calories: Math.max(0, Math.round(Number(body.caloriesEstimees) || 0)),
        notes: body.niveau ? String(body.niveau) : null,
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
          dureeSecondes: created.durationMinutes * 60,
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
          
