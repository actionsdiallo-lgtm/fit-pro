import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pref = await prisma.userPreference.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        langue: "fr",
        unitePoids: "kg",
        uniteTaille: "cm",
        theme: "clair",
        tailleTexteEchelle: 1.0,
        bipActif: false,
        vibrationActive: false,
        compteAReboursSonore: false,
        garderEcranAllume: true,
        avertissementSanteAccepte: false,
      },
    });

    return NextResponse.json({ preferences: pref });
  } catch (error) {
    console.error("GET /api/preferences error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la lecture des préférences" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const updated = await prisma.userPreference.upsert({
      where: { id: 1 },
      update: {
        ...(typeof body.langue === "string" ? { langue: body.langue } : {}),
        ...(typeof body.unitePoids === "string" ? { unitePoids: body.unitePoids } : {}),
        ...(typeof body.uniteTaille === "string" ? { uniteTaille: body.uniteTaille } : {}),
        ...(typeof body.theme === "string" ? { theme: body.theme } : {}),
        ...(typeof body.tailleTexteEchelle === "number"
          ? { tailleTexteEchelle: body.tailleTexteEchelle }
          : {}),
        ...(typeof body.bipActif === "boolean" ? { bipActif: body.bipActif } : {}),
        ...(typeof body.vibrationActive === "boolean"
          ? { vibrationActive: body.vibrationActive }
          : {}),
        ...(typeof body.compteAReboursSonore === "boolean"
          ? { compteAReboursSonore: body.compteAReboursSonore }
          : {}),
        ...(typeof body.garderEcranAllume === "boolean"
          ? { garderEcranAllume: body.garderEcranAllume }
          : {}),
        ...(typeof body.avertissementSanteAccepte === "boolean"
          ? { avertissementSanteAccepte: body.avertissementSanteAccepte }
          : {}),
      },
      create: {
        id: 1,
        langue: typeof body.langue === "string" ? body.langue : "fr",
        unitePoids: typeof body.unitePoids === "string" ? body.unitePoids : "kg",
        uniteTaille: typeof body.uniteTaille === "string" ? body.uniteTaille : "cm",
        theme: typeof body.theme === "string" ? body.theme : "clair",
        tailleTexteEchelle:
          typeof body.tailleTexteEchelle === "number" ? body.tailleTexteEchelle : 1.0,
        bipActif: Boolean(body.bipActif),
        vibrationActive: Boolean(body.vibrationActive),
        compteAReboursSonore: Boolean(body.compteAReboursSonore),
        garderEcranAllume:
          typeof body.garderEcranAllume === "boolean" ? body.garderEcranAllume : true,
        avertissementSanteAccepte: Boolean(body.avertissementSanteAccepte),
      },
    });

    return NextResponse.json({ preferences: updated });
  } catch (error) {
    console.error("PATCH /api/preferences error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des préférences" },
      { status: 500 }
    );
  }
            }
            
