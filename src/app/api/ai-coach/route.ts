import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const message = (body.message || "").toLowerCase();
  const lang = body.lang || "fr";

  function reply(fr: string, en: string) {
    return NextResponse.json({ reply: lang === "en" ? en : fr });
  }

  // --- CONVERSATION GENERALE ---
  if (message.includes("salut") || message.includes("bonjour") || message.includes("hello") || message.includes("hi") || message.includes("yo") || message.includes("coucou")) {
    return reply("Salut ! Ca va ? Tu veux parler de quoi ?", "Hi! How are you? What do you want to talk about?");
  }
  if (message.includes("ca va") || message.includes("comment") || message.includes("la forme") || message.includes("how are you")) {
    return reply("Moi ca va super ! Et toi ?", "I'm great! And you?");
  }
  if (message.includes("qui es") || message.includes("tu es qui") || message.includes("ton nom") || message.includes("t'appelles") || message.includes("who are you") || message.includes("your name")) {
    return reply("Moi c'est Fit Coach, ton coach et ton pote. Je peux t'aider pour le sport et pour tout le reste.", "I'm Fit Coach, your coach and your buddy. I can help with sport and everything else.");
  }
  if (message.includes("blague") || message.includes("drole") || message.includes("joke") || message.includes("funny")) {
    return reply("Pourquoi les plongeurs plongent toujours en arriere ? Parce que sinon ils tombent dans le bateau !", "Why do divers always dive backwards? Because otherwise they fall in the boat!");
  }
  if (message.includes("meteo") || message.includes("temps") || message.includes("pluie") || message.includes("weather") || message.includes("chaud") || message.includes("froid")) {
    return reply("Regarde par la fenetre : si tu vois le soleil, on s'entraine dehors. Sinon on s'entraine a la maison.", "Look outside: if you see sun, we train outside. If not, we train at home.");
  }
  if (message.includes("amour") || message.includes("copine") || message.includes("copain") || message.includes("crush") || message.includes("love") || message.includes("coeur")) {
    return reply("Le coeur c'est comme le muscle, ca se travaille. Sois toi-meme, sois gentil, le reste suit.", "Heart is like muscle, you train it. Be yourself, be kind, the rest follows.");
  }
  if (message.includes("ecole") || message.includes("etude") || message.includes("devoir") || message.includes("examen") || message.includes("school") || message.includes("study")) {
    return reply("Astuce : 25 min de travail, 5 min de pause. Et dors bien avant l'examen.", "Tip: 25 min work, 5 min break. And sleep well before exam.");
  }
  if (message.includes("travail") || message.includes("job") || message.includes("argent") || message.includes("money") || message.includes("business")) {
    return reply("Commence petit, tous les jours. Petit pas chaque jour = gros resultat.", "Start small, every day. Small step every day = big result.");
  }
  if (message.includes("triste") || message.includes("mal") || message.includes("stress") || message.includes("sad") || message.includes("deprim")) {
    return reply("Je suis la. Prends 3 grandes respirations. Raconte-moi ce qui te rend triste ?", "I'm here. Take 3 deep breaths. Tell me what's making you sad?");
  }
  if (message.includes("merci") || message.includes("thank")) {
    return reply("De rien, c'est normal !", "You're welcome!");
  }
  if (message.includes("au revoir") || message.includes("bye") || message.includes("a plus")) {
    return reply("A plus champion ! Reviens vite !", "See you champ! Come back soon!");
  }

  // --- SPORT - COURT ---
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
  if (message.includes("douleur") || message.includes("bless") || message.includes("pain") || message.includes("genou") || message.includes("dos")) {
    return reply("Stop 2 jours, repose-toi. Si ca continue, va voir un medecin.", "Rest 2 days. If it continues, see a doctor.");
  }
  if (message.includes("motiv") || message.includes("flemme") || message.includes("courage") || message.includes("motivation")) {
    return reply("Fais juste 5 min. Commencer, c'est le plus dur.", "Just do 5 min. Starting is the hardest part.");
  }
  if (message.includes("combien") || message.includes("longtemps") || message.includes("resultat")) {
    return reply("2-3 semaines pour sentir, 2 mois pour voir.", "2-3 weeks to feel, 2 months to see.");
  }
  if (message.includes("oui") || message.includes("ok") || message.includes("d'accord") || message.includes("yes")) {
    return reply("Super ! On continue ?", "Great! We continue?");
  }
  if (message.includes("non") || message.includes("no")) {
    return reply("Pas grave. On parle d'autre chose ?", "No problem. We talk about something else?");
  }
  if (message.includes("pourquoi") || message.includes("comment") || message.includes("quoi") || message.includes("why") || message.includes("how") || message.includes("what")) {
    return reply("Bonne question ! Ma reponse courte : fais simple, fais petit, fais tous les jours. Tu veux que je t'explique en detail ?", "Good question! My short answer: keep it simple, small, every day. Want me to explain more?");
  }

  // --- POUR TOUT LE RESTE : il repond quand meme ---
  return reply("J'ai compris. Dis-moi un peu plus, je t'aide. C'est pour le sport, l'ecole, ou autre chose ?", "I got it. Tell me a bit more, I'll help you. Is it for sport, school, or something else?");
      }
