"use server";

import { PrismaClient, AuthMethod } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const registerSchema = z.object({
  name: z.string().trim().min(1, "Le prénom est requis."),
  email: z.string().trim().email("Adresse email invalide."),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  birthDate: z.string().optional(),
  healthAccepted: z.boolean().optional(),
  primaryMethod: z.enum(["GMAIL", "PHONE"]).optional(),
});

export type RegisterState = {
  error?: string;
  success?: boolean;
};

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  try {
    const raw = {
      name: String(formData.get("name") ?? formData.get("firstName") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      birthDate: formData.get("birthDate") ? String(formData.get("birthDate")) : undefined,
      healthAccepted:
        formData.get("healthAccepted") === "true" ||
        formData.get("healthAccepted") === "on",
      primaryMethod: formData.get("primaryMethod")
        ? (String(formData.get("primaryMethod")).toUpperCase() as "GMAIL" | "PHONE")
        : "GMAIL",
    };

    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? "Données d'inscription invalides.",
      };
    }

    const normalizedEmail = parsed.data.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, isGuest: true },
    });

    if (existingUser && !existingUser.isGuest) {
      return { error: "Un compte existe déjà avec cet email." };
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const parsedBirthDate = parsed.data.birthDate
      ? new Date(parsed.data.birthDate)
      : new Date("2000-01-01");
    const birthDate = Number.isNaN(parsedBirthDate.getTime())
      ? new Date("2000-01-01")
      : parsedBirthDate;
    const primaryMethod: AuthMethod =
      parsed.data.primaryMethod === "PHONE" ? AuthMethod.PHONE : AuthMethod.GMAIL;
    const healthAccepted = Boolean(parsed.data.healthAccepted);

    if (existingUser?.isGuest) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          firstName: parsed.data.name,
          email: normalizedEmail,
          passwordHash,
          birthDate,
          healthAccepted,
          healthAcceptedAt: healthAccepted ? new Date() : null,
          primaryMethod,
          isGuest: false,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          firstName: parsed.data.name,
          email: normalizedEmail,
          passwordHash,
          birthDate,
          healthAccepted,
          healthAcceptedAt: healthAccepted ? new Date() : null,
          primaryMethod,
          isGuest: false,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Register action error:", error);
    return { error: "Erreur serveur lors de la création du compte." };
  }
  }
      
