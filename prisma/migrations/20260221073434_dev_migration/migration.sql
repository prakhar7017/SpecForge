-- CreateTable
CREATE TABLE "Spec" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "inputGoal" TEXT NOT NULL,
    "inputUsers" TEXT NOT NULL,
    "inputConstraints" TEXT,
    "templateType" TEXT NOT NULL,
    "generatedJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Spec_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Spec_createdAt_idx" ON "Spec"("createdAt");
