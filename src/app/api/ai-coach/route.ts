import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, lang } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ reply: "ERREUR: GROQ_API_KEY manquante dans Vercel." });

    const isEnglish = lang === "en";
    const systemPrompt = isEnglish
      ? "You are FIT PRO AI, a smart assistant like ChatGPT. You speak simple, clear, motivating English. You answer ALL questions: sport, nutrition, health, business, school, culture, technology, daily life. You give concrete examples and action plans."
      : "Tu es FIT PRO AI, un assistant intelligent comme ChatGPT. Tu parles en francais simple, clair, motivant. Tu reponds a TOUTES les questions: sport, nutrition, sante, business, ecole, culture, technologie, vie quotidienne. Tu donnes des exemples concrets et des plans d'action.";

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ reply: "ERREUR GROQ: " + (data.error?.message || "probleme") });
    const reply = data.choices?.[0]?.message?.content || "ERREUR GROQ";
    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json({ reply: "ERREUR SERVEUR: " + e.message });
  }
        }
