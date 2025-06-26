"use server";

import { z } from "zod";
import JsonSchema from "zod-to-json-schema";

import { openaiClient } from "@/config/openai";
import { CreativeAngleSchema, CreativeAngle } from "@/lib/types";
import { generateCreativeAnglesPrompt } from "@/lib/prompts";

interface GenerateAnglesInput {
  productDescription: string;
  platform: string;
  tone: string;
}

export async function generateCreativeAngles({ productDescription, platform, tone }: GenerateAnglesInput): Promise<CreativeAngle[]> {
  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: generateCreativeAnglesPrompt,
        },
        {
          role: "user",
          content: `Product Description: ${productDescription}, Platform: ${platform}, Tone: ${tone}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "pick_gpt_keywords_responses",
          description: "Gpt keywords response structure.",
          schema: JsonSchema(
            z.object({
              angles: z.array(CreativeAngleSchema),
            })
          ),
        },
      },
      temperature: 0.2,
    });

    if (!response.choices[0].message.content) {
      console.error("No response from AI", response);
      throw new Error("No response from AI");
    }

    const { angles } = JSON.parse(response.choices[0].message.content) as { angles: CreativeAngle[] };

    return angles;
  } catch (error) {
    console.error("Error generating creative angles:", error);

    // Return fallback angles if AI generation fails
    return [
      {
        headline: "Transform Your Workflow Today",
        hook: "Stop wasting time on manual tasks",
        subheading: "Join thousands who've already made the switch",
        cta: "Start Your Free Trial",
        insight: "Appeals to efficiency-focused professionals",
      },
      {
        headline: "The Secret Top Brands Use",
        hook: "What industry leaders don't want you to know",
        subheading: "Get insider access to proven strategies",
        cta: "Unlock the Secret",
        insight: "Leverages curiosity and exclusivity",
      },
    ];
  }
}

export async function scrapeWebsiteContent(url: string): Promise<string> {
  // This would integrate with Firecrawl in a real implementation
  // For now, return a placeholder
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Basic content extraction (in production, use Firecrawl)
    const textContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return textContent.substring(0, 1000); // Limit content length
  } catch (error) {
    console.error("Error scraping website:", error);
    throw new Error("Failed to scrape website content");
  }
}
