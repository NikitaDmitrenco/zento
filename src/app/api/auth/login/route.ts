import { NextResponse } from "next/server";
import { loginUser } from "../../../../services/auth/auth-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await loginUser(body);
    return NextResponse.json(result, { status: 200 });
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
