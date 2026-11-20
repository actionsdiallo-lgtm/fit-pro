import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, lang } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ reply: "ERREUR: CLE API MANQUANTE" });

    const isEnglish = lang === "en";

    const systemPrompt = isEnglish
      ? "You are FIT PRO AI. Always answer very short: maximum 4 to 5 short sentences. No tables, no long lists. Simple and direct. Only give more details if user asks for more."
      : "Tu es FIT PRO AI. Reponds toujours tres court: maximum 4 a 5 phrases courtes et simples. Pas de tableaux, pas de longues listes. Direct et clair. Donne plus de details seulement si l'utilisateur te le demande.";

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "ERREUR: PAS DE REPONSE";
    return NextResponse.json({ reply });
  } catch (e) {
    return NextResponse.json({ reply: "ERREUR SERVEUR" });
  }
}
