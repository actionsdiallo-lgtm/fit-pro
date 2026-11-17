import { describe, expect, it } from "vitest";
import { z } from "zod";

const workoutInput = z.object({
  title: z.string().trim().min(2).max(100),
  durationMinutes: z.coerce.number().int().min(1).max(1440),
  calories: z.union([z.literal(""), z.coerce.number().int().positive().max(10000)]).optional()
});

describe("workout input validation", () => {
  it("accepts measured workout data and leaves optional calories empty", () => {
    expect(workoutInput.safeParse({ title: "Run", durationMinutes: "30", calories: "" }).success).toBe(true);
  });
  it("rejects a zero or implausibly long session", () => {
    expect(workoutInput.safeParse({ title: "Run", durationMinutes: "0" }).success).toBe(false);
    expect(workoutInput.safeParse({ title: "Run", durationMinutes: "1441" }).success).toBe(false);
  });
  it("rejects invented negative calorie values", () => {
    expect(workoutInput.safeParse({ title: "Run", durationMinutes: "30", calories: "-2" }).success).toBe(false);
  });
});
