import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export type VoiceProfileId =
  | "male_natural"
  | "female_natural"
  | "male_energetic"
  | "female_soft"
  | "coach_pro";

export type NarrationLanguage = "fr" | "en" | "es" | "pt" | "ar" | "de" | "it";

interface NarrationRequestBody {
  text?: string;
  voiceId?: VoiceProfileId;
  language?: NarrationLanguage;
  rate?: number;
}

const VOICE_ENV_MAP: Record<VoiceProfileId, string> = {
  male_natural: "ELEVENLABS_VOICE_MALE_NATURAL",
  female_natural: "ELEVENLABS_VOICE_FEMALE_NATURAL",
  male_energetic: "ELEVENLABS_VOICE_MALE_ENERGETIC",
  female_soft: "ELEVENLABS_VOICE_FEMALE_SOFT",
  coach_pro: "ELEVENLABS_VOICE_COACH_PRO",
};

const SUPPORTED_LANGUAGES: NarrationLanguage[] = [
  "fr",
  "en",
  "es",
  "pt",
  "ar",
  "de",
  "it",
];

const MAX_NARRATION_LENGTH = 2500;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Connectez-vous pour utiliser la narration vocale." },
        { status: 401 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as NarrationRequestBody;
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const voiceId = body.voiceId;
    const language = body.language;

    if (!text) {
      return NextResponse.json(
        { error: "Texte de narration manquant." },
        { status: 400 }
      );
    }

    if (text.length > MAX_NARRATION_LENGTH) {
      return NextResponse.json(
        {
          error: `Le texte de narration dépasse la limite autorisée (${MAX_NARRATION_LENGTH} caractères).`,
        },
        { status: 400 }
      );
    }

    if (!voiceId || !(voiceId in VOICE_ENV_MAP)) {
      return NextResponse.json(
        { error: "Voix non reconnue ou indisponible." },
        { status: 422 }
      );
    }

    if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
      return NextResponse.json(
        { error: "Langue de narration non disponible." },
        { status: 422 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const providerVoiceId = process.env[VOICE_ENV_MAP[voiceId]];

    if (!apiKey || !providerVoiceId) {
      return NextResponse.json(
        {
          error:
            "Service vocal non configuré côté serveur pour cette voix ou cette langue. Aucune simulation n'est effectuée.",
          unavailable: true,
        },
        { status: 503 }
      );
    }

    const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(
        providerVoiceId
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: {
            stability: voiceId === "female_soft" ? 0.65 : 0.45,
            similarity_boost: 0.75,
            style:
              voiceId === "male_energetic" || voiceId === "coach_pro"
                ? 0.45
                : 0.15,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const errText = await ttsResponse.text().catch(() => "");
      return NextResponse.json(
        {
          error:
            errText ||
            "La synthèse vocale a refusé ou n'a pas pu produire cette voix/langue.",
          unavailable: true,
        },
        { status: ttsResponse.status }
      );
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Erreur serveur lors de la génération audio.",
      },
      { status: 500 }
    );
  }
    }
        
