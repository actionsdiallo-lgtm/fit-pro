"use server";

import crypto from "crypto";
import { z } from "zod";
import prisma from "@/lib/prisma";

const registrationSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères.").max(80),
  email: z.string().trim().email("Adresse e-mail invalide.").max(254),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères.").max(72),
  goal: z.string().trim().max(80).optional(),
});

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export async function registerAction(input: {
  name: string;
  email: string;
  password: string;
  goal?: string;
}) {
  const parsed = registrationSchema.safeParse({
    name: input?.name,
    email: input?.email,
    password: input?.password,
    goal: input?.goal,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Informations d'inscription invalides.",
    };
  }

  const email = parsed.data.email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      ok: false,
      error: "Cet e-mail est déjà associé à un compte FIT PRO.",
    };
  }

  const passwordHash = hashPassword(parsed.data.password);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash,
    },
  });

  return {
    ok: true,
    email,
  };
    }
