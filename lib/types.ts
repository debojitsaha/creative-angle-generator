import { z } from "zod";

export const CreativeAngleSchema = z.object({
  id: z.string().optional().nullish(),
  headline: z.string(),
  hook: z.string(),
  subheading: z.string(),
  cta: z.string(),
  insight: z.string(),
});

export type CreativeAngle = z.infer<typeof CreativeAngleSchema>;

export const CampaignSchema = z.object({
  id: z.string().optional().nullish(),
  name: z.string(),
  productDescription: z.string(),
  platform: z.string(),
  tone: z.string(),
  angles: z.array(CreativeAngleSchema),
});

export type Campaign = z.infer<typeof CampaignSchema>;

export const GenerationHistorySchema = z.object({
  id: z.string().optional().nullish(),
  campaign: CampaignSchema,
  generatedAngles: z.array(CreativeAngleSchema),
  timestamp: z.date(),
});

export type GenerationHistory = z.infer<typeof GenerationHistorySchema>;
