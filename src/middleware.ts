import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // On ne bloque plus personne ici.
  // La vérification du login se fait dans l'appli elle-même.
  // Ça corrige le bug qui renvoyait tout le monde au /login en boucle.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/workouts/:path*", "/login", "/register"],
};
