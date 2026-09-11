import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Resolved lazily (per request) so a missing secret fails on an actual request
// at runtime — not at module import/build time.
function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) {
    return new TextEncoder().encode(secret);
  }
  // Never silently fall back to a hardcoded secret in production — fail loudly instead.
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_SECRET is missing or too short (must be at least 32 characters). Refusing to run with an insecure default."
    );
  }
  // Development/test only: allow a fixed local secret so the app runs without configuration.
  return new TextEncoder().encode("zento-development-secret-key-at-least-32-chars-long");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("zento_session")?.value;

    if (!token) {
      const loginUrl = new URL("/ru/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, getJwtSecret());
      if (payload.role !== "ADMIN") {
        // Forbidden for standard USER
        return new NextResponse("Forbidden: Admin access required", { status: 403 });
      }
    } catch {
      const loginUrl = new URL("/ru/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
