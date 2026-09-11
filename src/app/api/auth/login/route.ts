import { NextResponse } from "next/server";
import { loginUser } from "../../../../services/auth/auth-service";
import { enforceRateLimit, getClientIp, tooManyRequests } from "../../../../lib/rate-limit";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Throttle brute-force attempts both per source IP and per targeted account.
    const ip = getClientIp(request);
    const ipLimit = await enforceRateLimit("login-ip", ip, 10, "5 m");
    if (!ipLimit.ok) return tooManyRequests(ipLimit.retryAfterSeconds);
    if (typeof body?.email === "string") {
      const emailLimit = await enforceRateLimit("login-email", body.email.toLowerCase(), 5, "15 m");
      if (!emailLimit.ok) return tooManyRequests(emailLimit.retryAfterSeconds);
    }

    const result = await loginUser(body);
    // Session is delivered via httpOnly cookie only; never expose the raw token in the body.
    return NextResponse.json({ user: result.user }, { status: 200 });
  } catch (error: any) {
    if (error.message === "INVALID_CREDENTIALS") {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
