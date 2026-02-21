import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { generateSpec } from "@/lib/llm";
import { featureInputSchema } from "@/lib/validators";

vi.mock("@/lib/llm");
vi.mock("@/lib/validators");

describe("POST /api/generate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate spec successfully", async () => {
    const mockSpec = {
      title: "Test Feature",
      summary: "Test summary",
      userStories: [],
      risks: [],
      unknowns: [],
    };

    vi.mocked(generateSpec).mockResolvedValue(mockSpec as any);

    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({
        goal: "Test goal with enough characters",
        users: "Test users with enough characters",
        templateType: "web",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.spec).toEqual(mockSpec);
  });

  it("should return error for invalid input", async () => {
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({
        goal: "short",
        users: "test",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});