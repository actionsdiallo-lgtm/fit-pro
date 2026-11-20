import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, lang } = await req.json();
  const msg = (message || "").toLowerCase();
  const isFr = lang !== "en";

  function reply(fr: string, en: string) {
    return NextResponse.json({ reply: isFr ? fr : en });
  }

  if (msg.includes("bonjour") || msg.includes("salut") || msg.includes("hello") || msg.includes("hi")) {
    return reply("Salut champion ! 💪 Ton objectif ? Perdre, prendre du muscle, ou mieux manger ?", "Hey champ! 💪 Your goal? Lose, gain muscle, or eat better?");
  }
  if (msg.includes("bien") || msg.includes("ca va") || msg.includes("ça va") || msg.includes("how are")) {
    return reply("Je vais super bien ! Et toi, tu t'es entraîné aujourd'hui ?", "I'm great! And you, did you train today?");
  }
  if (msg.includes("debutant") || msg.includes("débutant") || msg.includes("commencer") || msg.includes("beginner")) {
    return reply("Parfait. On commence simple : 3 séances / semaine, 30 min. Marche + pompes + squats.", "Perfect. Start simple: 3 sessions / week, 30 min. Walk + push-ups + squats.");
  }
