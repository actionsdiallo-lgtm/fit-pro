import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function hashPasswordScrypt(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const goal =
      typeof body?.goal === "string" && body.goal.trim()
        ? body.goal.trim()
        : "Prise de masse";

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nom, email et mot de passe sont requis." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email." },
        { status: 409 }
      );
    }

    const passwordHash = hashPasswordScrypt(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        goal,
      },
      select: {
        id: true,
        name: true,
        email: true,
        goal: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err: unknown) {
    const prismaCode =
      typeof err === "object" && err !== null && "code" in err
        ? String((err as { code?: unknown }).code)
        : "";

    if (prismaCode === "P2002") {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email." },
        { status: 409 }
      );
    }

    console.error("Erreur /api/register:", err);
    return NextResponse.json(
      { error: "Impossible de créer le compte pour le moment." },
      { status: 500 }
    );
  }
  }
  
