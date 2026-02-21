# AI Development Notes

## AI Usage

This project was built with assistance from AI (Claude Sonnet 4.5 via Cursor).

## What AI Was Used For

- **Initial project structure**: Set up Next.js, Prisma, and folder organization
- **Component implementation**: Built React components for forms, task editing, and UI
- **API route development**: Created all API endpoints for generation, CRUD operations, and status checks
- **Database schema design**: Designed Prisma schema for Spec model
- **LLM integration**: Implemented OpenAI API integration with error handling
- **Validation logic**: Created Zod schemas for input/output validation
- **Utility functions**: Built scope analyzer, export functions, and database utilities
- **Test setup**: Created basic test files for API routes, validators, and database functions
- **Documentation**: Generated README and other documentation files

## What Was Manually Reviewed

- **LLM prompt engineering**: The prompt template was carefully crafted to ensure structured JSON output
- **Error handling**: All error cases were reviewed to ensure graceful degradation
- **UI/UX decisions**: Layout, styling, and user flow were reviewed for clarity
- **Security considerations**: Environment variable handling and API key management
- **Performance**: Database query optimization and auto-save debouncing

## LLM Provider

**OpenAI GPT-4o-mini**

### Why GPT-4o-mini?

- Cost-effective for generation tasks
- Fast response times
- Good JSON structure adherence
- Sufficient quality for structured output
- Can be upgraded to GPT-4o if needed

## Prompt Strategy

### Key Decisions

1. **Strict JSON format**: Used `response_format: { type: "json_object" }` to ensure valid JSON
2. **System message**: Instructed model to return JSON only, no markdown formatting
3. **Dynamic prompts**: Template type, constraints, and risks are injected into the prompt
4. **Retry logic**: Single retry on invalid JSON (handled in error handling)
5. **Temperature**: Set to 0.7 for balance between creativity and consistency

### Prompt Template Structure

```
System: "You are a senior product manager and tech lead. Always return valid JSON only..."
User: [Dynamic prompt with feature details]
```

The user prompt includes:
- Feature goal
- Target users
- Constraints (if provided)
- Risks/Unknowns (if provided)
- Template type context
- Expected JSON structure

## Challenges & Solutions

1. **JSON parsing errors**: Added fallback to strip markdown code blocks if present
2. **Timeout handling**: Implemented 30s timeout with AbortController
3. **Database limit**: Auto-delete oldest specs when count exceeds 5
4. **Drag & drop**: Used @dnd-kit for reliable reordering
5. **Auto-save**: Debounced to 30 seconds to avoid excessive API calls

## Future Improvements

- Fine-tune prompts based on user feedback
- Add prompt templates for different industries
- Implement streaming responses for better UX
- Cache common patterns to reduce LLM calls