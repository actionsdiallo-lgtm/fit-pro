import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json(
        { error: "Non authentifié." },
        { status: 401 }
      );
    }

    const whereClause = session.user.id
      ? { id: session.user.id }
      : { email: session.user.email! };

    const existingUser = await prisma.user.findUnique({
      where: whereClause,
      select: { id: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: existingUser.id },
    });

    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error("Erreur suppression compte:", err);
    return NextResponse.json(
      { error: "Impossible de supprimer le compte pour le moment." },
      { status: 500 }
    );
  }
}
