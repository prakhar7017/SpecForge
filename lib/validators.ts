import { z } from "zod";

export const featureInputSchema = z.object({
  goal: z.string().min(10, "Goal must be at least 10 characters"),
  users: z.string().min(5, "Users must be at least 5 characters"),
  constraints: z.string().optional(),
  risks: z.string().optional(),
  templateType: z.enum(["web", "mobile", "internal", "api"]),
});

export type FeatureInput = z.infer<typeof featureInputSchema>;

export const taskSchema = z.object({
  id: z.string(),
  description: z.string(),
});

export const userStorySchema = z.object({
  id: z.string(),
  story: z.string(),
  priority: z.enum(["P0", "P1", "P2"]),
  complexity: z.enum(["S", "M", "L"]),
  tasks: z.array(taskSchema),
});

export const generatedSpecSchema = z.object({
  title: z.string(),
  summary: z.string(),
  userStories: z.array(userStorySchema),
  risks: z.array(z.string()),
  unknowns: z.array(z.string()),
});

export type GeneratedSpec = z.infer<typeof generatedSpecSchema>;
export type UserStory = z.infer<typeof userStorySchema>;
export type Task = z.infer<typeof taskSchema>;