import { z } from "zod";

export const CreativeAngleSchema = z.object({
  id: z.string().optional().nullish(),
  platform: z.string(),
  headline: z.string(),
  hook: z.string(),
  subheading: z.string(),
  cta: z.string(),
  insight: z.string(),
  thumbnail: z.string().optional().nullish(),
});

export type CreativeAngle = z.infer<typeof CreativeAngleSchema>;

export const ProductSchema = z.object({
  productName: z.string(),
  productDescription: z.string(),
  platform: z.string(),
  tone: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;
