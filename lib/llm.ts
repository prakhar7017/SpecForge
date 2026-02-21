import OpenAI from "openai";
import { z } from "zod";
import { generatedSpecSchema, type FeatureInput } from "./validators";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TIMEOUT_MS = 30000; // 30 seconds

function buildPrompt(input: FeatureInput): string {
  const templateContext = {
    web: "a web application",
    mobile: "a mobile application",
    internal: "an internal tool",
    api: "an API-only service",
  }[input.templateType];

  return `You are a senior product manager and tech lead.
Generate structured product planning output in strict JSON format.
Be realistic, not generic. Avoid fluff.

Feature Goal: ${input.goal}
Target Users: ${input.users}
${input.constraints ? `Constraints: ${input.constraints}` : ""}
${input.risks ? `Risks/Unknowns: ${input.risks}` : ""}
Template Type: ${templateContext}

Generate:
1. A clear title
2. A concise summary (2-3 sentences)
3. User stories grouped by feature area
4. Each story should have:
   - A clear description
   - Priority: P0 (critical), P1 (important), P2 (nice-to-have)
   - Complexity: S (small, 1-3 days), M (medium, 1 week), L (large, 2+ weeks)
   - Engineering tasks (specific, actionable)
5. List any risks
6. List any unknowns

Return ONLY valid JSON matching this exact structure:
{
  "title": "string",
  "summary": "string",
  "userStories": [
    {
      "id": "unique-id",
      "story": "As a [user], I want [goal] so that [benefit]",
      "priority": "P0" | "P1" | "P2",
      "complexity": "S" | "M" | "L",
      "tasks": [
        {
          "id": "unique-id",
          "description": "Specific engineering task"
        }
      ]
    }
  ],
  "risks": ["risk1", "risk2"],
  "unknowns": ["unknown1", "unknown2"]
}`;
}

export async function generateSpec(input: FeatureInput): Promise<typeof generatedSpecSchema._type> {
  const prompt = buildPrompt(input);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const completion = await openai.chat.completions.create(
      {
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a senior product manager and tech lead. Always return valid JSON only, no markdown formatting, no code blocks.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      },
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in LLM response");
    }

    // Parse JSON (handle markdown code blocks if present)
    let jsonContent = content.trim();
    if (jsonContent.startsWith("```")) {
      jsonContent = jsonContent.replace(/^```json\n?/, "").replace(/```$/, "");
    }

    const parsed = JSON.parse(jsonContent);
    const validated = generatedSpecSchema.parse(parsed);

    return validated;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("LLM request timed out after 30 seconds");
    }
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid LLM response format: ${error.message}`);
    }
    throw error;
  }
}

// Test LLM connectivity
export async function testLLMConnection(): Promise<{ success: boolean; latency: number; error?: string }> {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    await openai.chat.completions.create(
      {
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: "Say 'OK'" }],
        max_tokens: 5,
      },
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;
    return { success: true, latency };
  } catch (error) {
    const latency = Date.now() - startTime;
    return {
      success: false,
      latency,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}