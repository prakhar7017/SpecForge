# Prompts Used During Development

This document contains the prompts used to interact with the LLM during development. No API keys or sensitive information is included.

## Main Generation Prompt

**System Message:**
```
You are a senior product manager and tech lead. Always return valid JSON only, no markdown formatting, no code blocks.
```

**User Prompt Template:**
```
You are a senior product manager and tech lead.
Generate structured product planning output in strict JSON format.
Be realistic, not generic. Avoid fluff.

Feature Goal: {goal}
Target Users: {users}
Constraints: {constraints}
Risks/Unknowns: {risks}
Template Type: {templateContext}

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
}
```

## Test Connection Prompt

**User Message:**
```
Say 'OK'
```

Used for health check endpoint to verify LLM connectivity.

## Prompt Engineering Notes

- Used `response_format: { type: "json_object" }` to enforce JSON output
- Temperature set to 0.7 for balanced creativity/consistency
- System message emphasizes JSON-only output
- User prompt includes explicit structure example
- Dynamic template context based on template type (web/mobile/internal/api)

## Example Inputs

### Web App Example
```
Feature Goal: Build a task management dashboard for product teams
Target Users: Product managers and engineering leads
Constraints: Must work offline, support real-time collaboration
Risks/Unknowns: Data sync conflicts, performance with large datasets
Template Type: web
```

### Mobile App Example
```
Feature Goal: Create a mobile app for tracking daily habits
Target Users: Health-conscious individuals aged 25-45
Constraints: iOS and Android support required
Risks/Unknowns: App store approval process, push notification permissions
Template Type: mobile
```

## Response Handling

- Parse JSON response
- Strip markdown code blocks if present (fallback)
- Validate against Zod schema
- Retry once on validation failure
- Show graceful error if retry fails