import { NextRequest, NextResponse } from "next/server";
import { generateSpec } from "@/lib/llm";
import { featureInputSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = featureInputSchema.parse(body);

    const spec = await generateSpec(input);

    return NextResponse.json({ success: true, spec });
  } catch (error) {
    console.error("Generation error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to generate spec" },
      { status: 500 }
    );
  }
}