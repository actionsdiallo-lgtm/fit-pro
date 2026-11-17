"use server";

import { hash } from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const registration = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(72).regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/)
});

export async function register(formData: FormData) {
  const parsed = registration.safeParse({
    name: formData.get("name"), email: formData.get("email"), password: formData.get("password")
  });
  if (!parsed.success) redirect("/register?error=invalid");
  const email = parsed.data.email.toLowerCase();
  if (await db.user.findUnique({ where: { email }, select: { id: true } })) redirect("/register?error=exists");
  const passwordHash = await hash(parsed.data.password, 12);
  await db.user.create({ data: { name: parsed.data.name, email, passwordHash, profile: { create: {} }, subscription: { create: {} } } });
  redirect("/login?registered=1");
}
