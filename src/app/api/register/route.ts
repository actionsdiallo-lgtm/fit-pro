import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

function hashPasswordScrypt(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Mot de passe trop court (6 caractères minimum)" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ce compte existe déjà avec cet email" },
        { status: 409 }
      );
    }

    const passwordHash = hashPasswordScrypt(password);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: unknown) {
    const prismaCode =
      typeof e === "object" && e !== null && "code" in e
        ? String((e as { code?: unknown }).code)
        : "";

    if (prismaCode === "P2002") {
      return NextResponse.json(
        { error: "Ce compte existe déjà avec cet email" },
        { status: 409 }
      );
    }

    console.error("Erreur /api/register:", e);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
    }
