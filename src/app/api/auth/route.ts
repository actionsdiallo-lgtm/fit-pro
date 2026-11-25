
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const identifier = String(body.identifier ?? "").trim();
    const password = String(body.password ?? "");
    const rememberMe = body.rememberMe !== false;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Identifiant et mot de passe requis." },
        { status: 400 }
      );
    }

    const isEmail = identifier.includes("@");

    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: identifier.toLowerCase() }
        : { phone: identifier.replace(/\s+/g, "") },
    });

    if (!user || !user.passwordHash || user.isGuest) {
      return NextResponse.json(
        { error: "Identifiant ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Identifiant ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    if (user.primaryMethod === "GMAIL" && !user.emailVerified) {
      return NextResponse.json(
        { error: "Vérifie d'abord ton adresse Gmail." },
        { status: 403 }
      );
    }

    if (user.primaryMethod === "PHONE" && !user.phoneVerified) {
      return NextResponse.json(
        { error: "Vérifie d'abord ton numéro de téléphone." },
        { status: 403 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const expiresAt = new Date(
      Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000
    );

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const response = NextResponse.json({
      message: "Connexion réussie.",
      user: {
        id: user.id,
        firstName: user.firstName,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

    response.cookies.set("fitpro_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Erreur serveur lors de la connexion." },
      { status: 500 }
    );
  }
}
