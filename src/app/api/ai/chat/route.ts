import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { processAiChat } from "../../../../services/ai/deepseek-service";

const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().min(1).max(2000),
    })
  ),
  locale: z.string().optional().default("ru"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid chat payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { messages, locale } = parsed.data;
    const result = await processAiChat(messages, locale);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Chat API handler error:", error);
    return NextResponse.json(
      { error: "Internal Server Error in AI Chat" },
      { status: 500 }
    );
  }
}
