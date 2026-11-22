import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const globalForPg = globalThis as unknown as { pgPool?: Pool };

function getPool(): Pool {
  if (!globalForPg.pgPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL manquante");
    }
    globalForPg.pgPool = new Pool({
      connectionString,
      ssl: connectionString.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
    });
  }
  return globalForPg.pgPool;
}

function getAppUrl(req: NextRequest): string {
  const configured = process.env.APP_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }
  const origin = req.headers.get("origin")?.trim();
  if (origin) {
    return origin.replace(/\/+$/, "");
  }
  return `https://${req.headers.get("host") ?? "localhost:3000"}`;
}

async function sendResetEmail(params: {
  to: string;
  resetUrl: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY manquante");
  }

  const from =
    process.env.EMAIL_FROM?.trim() || "FIT PRO <noreply@fitpro.app>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: "FIT PRO — Réinitialisation de votre mot de passe",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
          <h2>Réinitialisation de mot de passe — FIT PRO</h2>
          <p>Vous avez demandé à réinitialiser le mot de passe de votre compte FIT PRO.</p>
          <p>
            <a href="${params.resetUrl}" style="display:inline-block;padding:12px 20px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">
              Choisir un nouveau mot de passe
            </a>
          </p>
          <p>Ce lien est valable 1 heure et à usage unique. Vos programmes, votre historique et votre compte restent inchangés.</p>
          <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Échec d'envoi Resend (${response.status}): ${errorText}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const rawEmail = typeof body?.email === "string" ? body.email : "";
    const email = rawEmail.trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Veuillez saisir une adresse e-mail valide." },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Réponse neutre par défaut pour ne pas divulguer l'existence d'un compte
    const genericOkResponse = NextResponse.json({
      ok: true,
      message:
        "Si un compte est associé à cette adresse, un lien de réinitialisation a été envoyé.",
    });

    const userResult = await pool.query<{ id: string; email: string }>(
      `select id, email from public.app_users where lower(email) = $1 limit 1`,
      [email]
    );

    const user = userResult.rows[0];
    if (!user) {
      return genericOkResponse;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await pool.query(
      `insert into public.password_reset_tokens (user_id, token_hash, expires_at)
       values ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt]
    );

    const appUrl = getAppUrl(req);
    const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;

    await sendResetEmail({
      to: user.email,
      resetUrl,
    });

    return genericOkResponse;
  } catch (err) {
    console.error("Erreur /api/auth/forgot-password:", err);
    return NextResponse.json(
      { error: "Impossible de traiter la demande pour le moment." },
      { status: 500 }
    );
  }
}
  
