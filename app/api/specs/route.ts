import { NextRequest, NextResponse } from "next/server";
import { prisma, maintainSpecLimit } from "@/lib/db";
import { featureInputSchema, generatedSpecSchema } from "@/lib/validators";

export async function GET() {
  try {
    const specs = await prisma.spec.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    return NextResponse.json({ success: true, specs });
  } catch (error) {
    console.error("Error fetching specs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch specs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, spec } = body;

    if (!input || !spec) {
      return NextResponse.json(
        { success: false, error: "Missing input or spec data" },
        { status: 400 }
      );
    }

    const validatedInput = featureInputSchema.parse(input);
    const validatedSpec = generatedSpecSchema.parse(spec);

    const created = await prisma.spec.create({
      data: {
        title: validatedSpec.title,
        inputGoal: validatedInput.goal,
        inputUsers: validatedInput.users,
        inputConstraints: validatedInput.constraints || null,
        templateType: validatedInput.templateType,
        generatedJson: validatedSpec as any,
      },
    });

    await maintainSpecLimit();

    return NextResponse.json({ success: true, spec: created });
  } catch (error) {
    console.error("Error creating spec:", error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      
      // Check if it's a validation error
      if (error.message.includes("parse") || error.message.includes("Invalid")) {
        return NextResponse.json(
          { success: false, error: `Validation error: ${error.message}` },
          { status: 400 }
        );
      }
      
      // Check if it's a database error
      if (error.message.includes("database") || error.message.includes("connection")) {
        return NextResponse.json(
          { success: false, error: "Database connection error. Please check your DATABASE_URL." },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to create spec. Please check server logs." },
      { status: 500 }
    );
  }
}