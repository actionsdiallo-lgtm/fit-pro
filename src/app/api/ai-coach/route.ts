import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const message = (body.message || "").toLowerCase();
  const lang = body.lang || "fr";

  function reply(fr: string, en: string) {
    return NextResponse.json({ reply: lang === "en" ? en : fr });
  }

  if (message.includes("salut") || message.includes("bonjour") || message.includes("hello") || message.includes("hi")) {
    return reply("Salut champion ! Tu veux perdre, prendre du muscle, ou mieux manger ?", "Hi champ! Do you want to lose, gain muscle, or eat better?");
  }

  if (message.includes("poids") || message.includes("maigrir") || message.includes("perdre") || message.includes("lose") || message.includes("weight")) {
    return reply("Pour perdre : 1. Moins de sucre. 2. Marche 30 min par jour. 3. Dors 7h.", "To lose: 1. Less sugar. 2. Walk 30 min per day. 3. Sleep 7h.");
  }

  if (message.includes("muscle") || message.includes("muscu") || message.includes("gain")) {
    return reply("Pour le muscle : Pompes, squats, tractions. 3 fois par semaine. Proteine a chaque repas.", "For muscle: Push-ups, squats, pull-ups. 3 times per week. Protein every meal.");
  }

  if (message.includes("manger") || message.includes("nourriture") || message.includes("eat") || message.includes("food")) {
    return reply("Simple : Eau + legumes + proteine. Pas de sodas, pas de fritures. 3 repas.", "Simple: Water + veggies + protein. No soda, no fried food. 3 meals.");
  }

  if (message.includes("merci") || message.includes("thank")) {
    return reply("De rien champion ! On lache rien", "You are welcome champ! Never give up");
  }

  return reply("Ok ! Dis-moi : tu veux perdre, prendre du muscle, ou mieux manger ?", "Ok! Tell me: lose, gain muscle, or eat better?");
}
