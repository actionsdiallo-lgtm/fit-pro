import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // La vérification d'authentification est gérée côté application / session.
  // Aucune donnée utilisateur n'est modifiée ou supprimée ici.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/workouts/:path*", "/login", "/register"],
};
