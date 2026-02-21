import { NextRequest, NextResponse } from "next/server";
import { prisma, maintainSpecLimit } from "@/lib/db";
import { generatedSpecSchema } from "@/lib/validators";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const spec = await prisma.spec.findUnique({
      where: { id },
    });

    if (!spec) {
      return NextResponse.json(
        { success: false, error: "Spec not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, spec });
  } catch (error) {
    console.error("Error fetching spec:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch spec" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { spec, input } = body;

    if (!spec) {
      return NextResponse.json(
        { success: false, error: "Spec data is required" },
        { status: 400 }
      );
    }

    const validatedSpec = generatedSpecSchema.parse(spec);

    // Build update data
    const updateData: any = {
      generatedJson: validatedSpec as any,
      title: validatedSpec.title,
    };

    // Update input fields if provided
    if (input) {
      updateData.inputGoal = input.goal;
      updateData.inputUsers = input.users;
      updateData.inputConstraints = input.constraints || null;
      if (input.templateType) {
        updateData.templateType = input.templateType;
      }
    }

    const updated = await prisma.spec.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, spec: updated });
  } catch (error) {
    console.error("Error updating spec:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update spec" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.spec.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting spec:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete spec" },
      { status: 500 }
    );
  }
}