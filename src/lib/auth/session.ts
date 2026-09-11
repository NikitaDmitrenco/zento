import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type UserRole = "USER" | "ADMIN";

export interface UserSessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

const AUTH_COOKIE_NAME = "zento_session";

// Resolved lazily (per call) so a missing secret fails on an actual auth operation
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

export async function createSessionToken(payload: UserSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<UserSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAuth(requiredRole?: UserRole): Promise<UserSessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  if (requiredRole && session.role !== requiredRole) {
    throw new Error("FORBIDDEN");
  }
  return session;
}
