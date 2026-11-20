import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const SYSTEM_PROMPT = `
Tu es FIT PRO AI COACH, coach sportif personnel, assistant nutritionnel et accompagnateur de progression.
Langues : Français et Anglais.
Règles : Ne jamais poser de diagnostic médical, ne jamais prescrire de médicaments, ne jamais recommander de pratiques dangereuses ou régimes extrêmes, ne jamais garantir des résultats. Si douleur ou malaise : conseiller de consulter un professionnel de santé. Ne jamais inventer de statistiques.
`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
    }
    const { messages } = await req.json();
    return NextResponse.json({
      reply: "Salut ! Je suis ton FIT PRO AI COACH. Dis-moi ton objectif : prise de masse, perte de poids, endurance, renforcement ? Et ton niveau ?",
      system: SYSTEM_PROMPT,
      received: messages?.length || 0,
    });
  } catch {
    return NextResponse.json({ error: "Erreur du coach, réessaie." }, { status: 500 });
  }
}
