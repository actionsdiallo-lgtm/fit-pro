import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Non authentifié." },
        { status: 401 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true },
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

    return NextResponse.json(
      { message: "Compte supprimé avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur suppression compte:", error);
    return NextResponse.json(
      { error: "Impossible de supprimer le compte." },
      { status: 500 }
    );
  }
}
