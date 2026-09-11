import { NextResponse } from "next/server";
import { createOrder } from "../../../../services/orders/order-service";
import { enforceRateLimit, getClientIp, tooManyRequests } from "../../../../lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Limit automated/spam order submissions from a single source.
    const ip = getClientIp(request);
    const ipLimit = await enforceRateLimit("orders-ip", ip, 10, "1 h");
    if (!ipLimit.ok) return tooManyRequests(ipLimit.retryAfterSeconds);

    const body = await request.json();
    const result = await createOrder(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.message === "EMPTY_CART") {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (error.message === "STOCK_VALIDATION_FAILED") {
      return NextResponse.json({ error: "Stock validation failed for items in cart" }, { status: 400 });
    }
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
