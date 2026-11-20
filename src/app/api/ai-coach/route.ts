import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Tu es FIT PRO AI COACH, coach sportif personnel, assistant nutritionnel et accompagnateur de progression. Tu parles français simple, tu es motivant, tu donnes des programmes courts et pratiques.`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: "Message vide" }, { status: 400 });
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: "Salut champion ! Je suis ton AI Coach. Dis-moi ton objectif : perdre du poids, prendre du muscle ou rester en forme ?" });
    }
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
      }),
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Je n'ai pas
