import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  if (!request.auth) {
    const login = new URL("/login", request.nextUrl);
    login.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
});

export const config = { matcher: ["/dashboard/:path*"] };
