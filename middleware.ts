// Middleware Next.js : protège toutes les routes /admin/* sauf /admin/login
import { NextRequest, NextResponse } from "next/server";
import { verifyToken, ADMIN_COOKIE } from "@/lib/adminAuth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Laisse passer la page de login et les routes API d'auth
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/logout") ||
    pathname.startsWith("/api/admin/verify")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const redirect = () => {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  };

  if (!token) return redirect();

  const result = await verifyToken(token);
  if (!result.valid) return redirect();

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
