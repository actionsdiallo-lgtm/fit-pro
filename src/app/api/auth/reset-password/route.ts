import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

function getSupabaseServerConfig() {
  const url = (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    ""
  )
    .trim()
    .replace(/\/+$/, "");
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  if (!url || !serviceKey) {
    throw new Error(
      "Configuration serveur base incomplète (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)"
    );
  }

  return { url, serviceKey };
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const rawToken = typeof body?.token === "string" ? body.token.trim() : "";
    const newPassword =
      typeof body?.password === "string" ? body.password : "";

    if (!rawToken) {
      return NextResponse.json(
        { error: "Lien ou jeton de réinitialisation invalide." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          error:
            "Le nouveau mot de passe doit contenir au moins 8 caractères.",
        },
        { status: 400 }
      );
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const { url, serviceKey } = getSupabaseServerConfig();
    const headers = {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    };

    const tokenRes = await fetch(
      `${url}/rest/v1/password_reset_tokens?select=id,user_id,expires_at,used_at&token_hash=eq.${encodeURIComponent(
        tokenHash
      )}&limit=1`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        cache: "no-store",
      }
    );

    if (!tokenRes.ok) {
      throw new Error(
        `Erreur lecture password_reset_tokens: ${await tokenRes.text()}`
      );
    }

    const tokenRows = (await tokenRes.json()) as Array<{
      id: string;
      user_id: string;
      expires_at: string;
      used_at: string | null;
    }>;

    const resetRow = tokenRows[0];
    if (!resetRow) {
      return NextResponse.json(
        { error: "Ce lien de réinitialisation est invalide ou a expiré." },
        { status: 400 }
      );
    }

    if (resetRow.used_at) {
      return NextResponse.json(
        { error: "Ce lien de réinitialisation a déjà été utilisé." },
        { status: 400 }
      );
    }

    if (new Date(resetRow.expires_at).getTime() <= Date.now()) {
      return NextResponse.json(
        { error: "Ce lien de réinitialisation a expiré." },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(newPassword);

    const updateUserRes = await fetch(
      `${url}/rest/v1/app_users?id=eq.${encodeURIComponent(resetRow.user_id)}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          password_hash: passwordHash,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!updateUserRes.ok) {
      throw new Error(
        `Erreur mise à jour app_users: ${await updateUserRes.text()}`
      );
    }

    const ensureDataRes = await fetch(`${url}/rest/v1/user_account_data`, {
      method: "POST",
      headers: {
        ...headers,
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify({
        user_id: resetRow.user_id,
      }),
    });

    if (!ensureDataRes.ok) {
      throw new Error(
        `Erreur vérification user_account_data: ${await ensureDataRes.text()}`
      );
    }

    const markUsedRes = await fetch(
      `${url}/rest/v1/password_reset_tokens?id=eq.${encodeURIComponent(
        resetRow.id
      )}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          used_at: new Date().toISOString(),
        }),
      }
    );

    if (!markUsedRes.ok) {
      throw new Error(
        `Erreur marquage jeton utilisé: ${await markUsedRes.text()}`
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "Votre mot de passe a bien été mis à jour. Vos données et votre compte sont conservés.",
    });
  } catch (err) {
    console.error("Erreur /api/auth/reset-password:", err);
    return NextResponse.json(
      {
        error:
          "Impossible de réinitialiser le mot de passe pour le moment.",
      },
      { status: 500 }
    );
  }
        }
    
