import { NextResponse } from "next/server";
import { registerUser } from "../../../../services/auth/auth-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await registerUser(body);
    return NextResponse.json(result, { status: 201 });
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
