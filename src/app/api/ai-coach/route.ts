import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const raw = (body.message || "").toLowerCase();
  const message = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const lang = body.lang || "fr";

  function reply(fr: string, en: string) {
    return NextResponse.json({ reply: lang === "en" ? en : fr });
  }

  if (message.includes("connais") || message.includes("connaitre") || message.includes("fit pro")) {
    return reply("Oui je connais Fit Pro ! C'est ton appli. Moi je suis ton coach dedans.", "Yes I know Fit Pro! It's your app. I'm your coach inside.");
  }

  if (message.includes("salut") || message.includes("bonjour") || message.includes("hello") || message.includes("hi") || message.includes("yo") || message.includes("coucou")) {
    return reply("Salut ! Ca va ? Tu veux parler de quoi ?", "Hi! How are you? What do you want to talk about?");
  }
  if (message.includes("ca va") || message.includes("comment") || message.includes("la forme")) {
    return reply("Moi ca va super ! Et toi ?", "I'm great! And you?");
  }
  if (message.includes("qui es") || message.includes("tu es qui") || message.includes("ton nom") || message.includes("t'appelles")) {
    return reply("Moi c'est Fit Coach, ton coach et ton pote.", "I'm Fit Coach, your coach and your buddy.");
  }
  if (message.includes("blague") || message.includes("drole") || message.includes("joke")) {
    return reply("Pourquoi les plongeurs plongent en arriere ? Parce que sinon ils tombent dans le bateau !", "Why do divers dive backwards? Because otherwise they fall in the boat!");
  }
  if (message.includes("debut") || message.includes("commencer") || message.includes("apprendre") || message.includes("beginner") || message.includes("start")) {
    return reply("Commence simple : Marche 20 min + Pompes 10x + Squats 15x. 3x / semaine.", "Start simple: Walk 20 min + Push-ups 10x + Squats 15x. 3x / week.");
  }
  if (message.includes("perdre") || message.includes("maigrir") || message.includes("poids") || message.includes("lose") || message.includes("weight") || message.includes("ventre")) {
    return reply("Moins de sucre + Marche 30 min / jour + Dors 7h.", "Less sugar + Walk 30 min / day + Sleep 7h.");
  }
  if (message.includes("muscle") || message.includes("muscu") || message.includes("gain") || message.includes("fort") || message.includes("bras") || message.includes("abdo")) {
    return reply("Pompes, Squats, Gainage. 3x / semaine. Proteine a chaque repas.", "Push-ups, Squats, Plank. 3x / week. Protein every meal.");
  }
  if (message.includes("manger") || message.includes("nourriture") || message.includes("eat") || message.includes("food") || message.includes("repas")) {
    return reply("Eau + Legumes + Proteine. Pas de soda, pas de friture.", "Water + Veggies + Protein. No soda, no fried food.");
  }
  if (message.includes("programme") || message.includes("entrain") || message.includes("training") || message.includes("workout") || message.includes("sport")) {
    return reply("Lundi : Pompes + Squats. Mercredi : Marche. Vendredi : Pompes + Gainage.", "Mon: Push-ups + Squats. Wed: Walk. Fri: Push-ups + Plank.");
  }
  if (message.includes("eau") || message.includes("boire") || message.includes("water")) {
    return reply("Bois 2L d'eau par jour. Pas de soda.", "Drink 2L water per day. No soda.");
  }
  if (message.includes("dormir") || message.includes("sommeil") || message.includes("fatigu") || message.includes("sleep")) {
    return reply("Dors 7-8h. Pas de telephone 30 min avant de dormir.", "Sleep 7-8h. No phone 30 min before bed.");
  }
  if (message.includes("triste") || message.includes("stress") || message.includes("sad")) {
    return reply("Je suis la. Prends 3 grandes respirations. Raconte-moi ?", "I'm here. Take 3 deep breaths. Tell me?");
  }
  if (message.includes("merci") || message.includes("thank")) {
    return reply("De rien, c'est normal !", "You're welcome!");
  }
  if (message.includes("oui") || message.includes("ok") || message.includes("d'accord") || message.includes("yes")) {
    return reply("Super ! On continue ?", "Great! We continue?");
  }

  return reply("J'ai compris. Dis-moi un peu plus, je t'aide. C'est pour le sport, l'ecole, ou autre chose ?", "I got it. Tell me a bit more, I'll help you. Is it for sport, school, or something else?");
    }
