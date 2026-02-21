import { describe, it, expect } from "vitest";
import { featureInputSchema, generatedSpecSchema } from "./validators";

describe("validators", () => {
  describe("featureInputSchema", () => {
    it("should validate correct input", () => {
      const input = {
        goal: "Build a task management system with at least 10 characters",
        users: "Product managers and developers",
        constraints: "Must work offline",
        risks: "Data sync issues",
        templateType: "web" as const,
      };

      const result = featureInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("should reject goal shorter than 10 characters", () => {
      const input = {
        goal: "short",
        users: "Product managers",
        templateType: "web" as const,
      };

      const result = featureInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject users shorter than 5 characters", () => {
      const input = {
        goal: "Build a comprehensive task management system",
        users: "PMs",
        templateType: "web" as const,
      };

      const result = featureInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("generatedSpecSchema", () => {
    it("should validate correct spec", () => {
      const spec = {
        title: "Test Feature",
        summary: "Test summary",
        userStories: [
          {
            id: "1",
            story: "As a user, I want to...",
            priority: "P0" as const,
            complexity: "M" as const,
            tasks: [
              { id: "t1", description: "Task 1" },
            ],
          },
        ],
        risks: ["Risk 1"],
        unknowns: ["Unknown 1"],
      };

      const result = generatedSpecSchema.safeParse(spec);
      expect(result.success).toBe(true);
    });
  });
});