import crypto from "crypto";
import { z } from "zod";

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Gmail ou mot de passe incorrect.",
  INVALID_CODE: "Code incorrect, réessaie.",
  EXPIRED_CODE: "Code expiré, demande un nouveau code.",
  TOO_MANY_ATTEMPTS: "Trop de tentatives, réessaie dans 5 min.",
  NETWORK_ERROR: "Pas de connexion internet, vérifie ta connexion.",
} as const;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
}

export function isEmailInput(value: string): boolean {
  return value.includes("@");
}

export function hashSecret(value: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(value, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifySecret(value: string, stored: string | null | undefined): boolean {
  if (!stored || !stored.includes(":")) return false;
  const [salt, key] = stored.split(":");
  const derived = crypto.scryptSync(value, salt, 64);
  const keyBuf = Buffer.from(key, "hex");
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

export function generateSixDigitCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "Prénom requis").max(60),
  identifier: z.string().trim().min(3, "Gmail ou numéro requis"),
  password: z.string().min(8, "8 caractères minimum"),
  birthDate: z.string().refine((val) => !Number.isNaN(Date.parse(val)), "Date invalide"),
  healthAccepted: z.literal(true),
  primaryMethod: z.enum(["EMAIL", "PHONE"]).optional(),
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1),
  password: z.string().min(1),
  rememberMe: z.boolean().optional().default(true),
});

export const verifyCodeSchema = z.object({
  target: z.string().trim().min(1),
  code: z.string().trim().length(6),
  purpose: z.enum([
    "REGISTER",
    "PASSWORD_RESET",
    "CHANGE_EMAIL",
    "CHANGE_PHONE",
    "ADD_BACKUP",
  ]),
});

export const resetPasswordSchema = z.object({
  target: z.string().trim().min(1),
  code: z.string().trim().length(6),
  newPassword: z.string().min(8, "8 caractères minimum"),
  confirmPassword: z.string().min(8),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "8 caractères minimum"),
  confirmPassword: z.string().min(8),
});
  
