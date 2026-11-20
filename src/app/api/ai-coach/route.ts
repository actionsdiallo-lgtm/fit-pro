import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, lang } = await req.json();
    const msg = (message || "").toLowerCase();
    const isEn = lang === "en";

    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: isEn ? "You are FIT PRO AI, short sport coach. Answer in max 5 lines." : "Tu es FIT PRO AI, coach sportif. Réponds en max 5 lignes, simple." },
              { role: "user", content: message },
            ],
            max_tokens: 300,
          }),
        });
        const data = await res.json();
        const reply = data?.choices?.[0]?.message?.content;
        if (reply) return NextResponse.json({ reply });
      } catch {}
    }

    let reply = "";
    if (msg.includes("ventre") || msg.includes("belly") || msg.includes("perdre") || msg.includes("lose")) {
      reply = isEn ? "To lose belly fat:\n1. Walk 30 min / day\n2. No sugary drinks\n3. Protein + vegetables\n4. Sleep 7h\nDo this 14 days." : "Pour perdre du ventre :\n1. Marche 30 min / jour\n2. Zéro boisson sucrée\n3. Protéine + légumes\n4. Dors 7h\nFais ça 14 jours.";
    } else if (msg.includes("muscle") || msg.includes("muscu") || msg.includes("gain")) {
      reply = isEn ? "To gain muscle:\n1. Train 3x / week\n2. Protein every meal\n3. Sleep 7-8h\n4. Be consistent." : "Pour prendre du muscle :\n1. Entraîne-toi 3x / semaine\n2. Protéine à chaque repas\n3. Dors 7-8h\n4. Sois régulier.";
    } else if (msg.includes("bonjour") || msg.includes("salut") || msg.includes("hello") || msg.includes("hi")) {
      reply = isEn ? "Hello champion! 💪 What is your goal? Lose weight, gain muscle, or eat better?" : "Salut champion ! 💪 C'est quoi ton objectif ? Perdre du poids, prendre du muscle, ou mieux manger ?";
    } else {
      reply = isEn ? "Got it. Tell me your goal: lose weight, gain muscle, or eat better? I will give you a simple plan." : "Compris. Dis-moi ton objectif : perdre du poids, prendre du muscle, ou mieux manger ? Je te donne un plan simple.";
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "Salut champion ! Dis-moi ton objectif ?" });
  }
    }
