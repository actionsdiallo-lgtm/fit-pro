import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const rawToken = typeof body?.token === "string" ? body.token.trim() : "";
    const newPassword =
      typeof body?.password === "string" ? body.password : "";

    if (!rawToken) {
      return NextResponse.json(
        { error: "Lien ou jeton de réinitialisation invalide." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          error:
            "Le nouveau mot de passe doit contenir au moins 6 caractères.",
        },
        { status: 400 }
      );
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: tokenHash,
      },
      select: {
        id: true,
        resetPasswordExpires: true,
      },
    });

    if (!user || !user.resetPasswordExpires) {
      return NextResponse.json(
        { error: "Ce lien de réinitialisation est invalide ou a déjà été utilisé." },
        { status: 400 }
      );
    }

    if (new Date(user.resetPasswordExpires).getTime() <= Date.now()) {
      return NextResponse.json(
        { error: "Ce lien de réinitialisation a expiré. Demandez un nouveau lien." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashed,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return NextResponse.json({
      ok: true,
      message:
        "Votre mot de passe a bien été modifié. Toutes vos données et votre compte sont conservés.",
    });
  } catch (err) {
    console.error("Erreur /api/auth/reset-password:", err);
    return NextResponse.json(
      {
        error: "Impossible de réinitialiser le mot de passe pour le moment.",
      },
      { status: 500 }
    );
  }
      }
