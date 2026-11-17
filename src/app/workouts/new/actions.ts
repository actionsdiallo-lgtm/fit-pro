"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";

const workoutInput = z.object({
  title: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(40),
  durationMinutes: z.coerce.number().int().min(1).max(1440),
  distanceKm: z.union([z.literal(""), z.coerce.number().positive().max(1000)]).optional(),
  calories: z.union([z.literal(""), z.coerce.number().int().positive().max(10000)]).optional(),
  notes: z.string().trim().max(1000).optional()
});

export async function saveWorkout(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const parsed = workoutInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/workouts/new?error=invalid");
  const data = parsed.data;
  await db.workout.create({ data: {
    userId: session.user.id,
    title: data.title,
    category: data.category,
    durationMinutes: data.durationMinutes,
    distanceKm: data.distanceKm ? Number(data.distanceKm) : null,
    calories: data.calories ? Number(data.calories) : null,
    notes: data.notes || null
  }});
  redirect("/dashboard");
}
