import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Connectez-vous pour utiliser Fit Coach." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const message = String(body?.message || body?.prompt || "").trim();
    const lang = body?.lang === "en" ? "en" : "fr";

    if (!message) {
      return NextResponse.json(
        { error: "Message vide." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: "Mets ta clé Gemini dans Vercel pour activer la vraie IA.",
      });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Tu es Fit Coach, coach de l'appli Fit Pro au Sénégal. Tu parles ${
                    lang === "en" ? "anglais" : "français simple"
                  }. Tu réponds à TOUT : sport, école, vie, blagues, devoirs. Réponses TOUJOURS courtes : 1 à 3 phrases max. Style ami, simple, motivant. Question : ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Je n'ai pas compris, redis-moi ça autrement ?";

    return NextResponse.json({ reply: text });
  } catch (e) {
    console.error("Erreur /api/ai-coach:", e);
    return NextResponse.json({ reply: "Petit bug, réessaie." });
  }
}
  
