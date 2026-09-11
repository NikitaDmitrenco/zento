import { NextResponse } from "next/server";
import { registerUser } from "../../../../services/auth/auth-service";
import { enforceRateLimit, getClientIp, tooManyRequests } from "../../../../lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Limit mass account creation from a single source.
    const ip = getClientIp(request);
    const ipLimit = await enforceRateLimit("register-ip", ip, 5, "1 h");
    if (!ipLimit.ok) return tooManyRequests(ipLimit.retryAfterSeconds);

    const body = await request.json();
    const result = await registerUser(body);
    // Session is delivered via httpOnly cookie only; never expose the raw token in the body.
    return NextResponse.json({ user: result.user }, { status: 201 });
  } catch (error: any) {
    if (error.message === "EMAIL_EXISTS") {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
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
