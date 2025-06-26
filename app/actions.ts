"use server";

import type { CreativeAngle } from "@/lib/types";
import { openaiClient } from "@/config/openai";

interface GenerateAnglesInput {
  productDescription: string;
  platform: string;
  tone: string;
}

export async function generateCreativeAngles({ productDescription, platform, tone }: GenerateAnglesInput): Promise<CreativeAngle[]> {
  const prompt = `You are a performance marketing strategist with expertise in creating high-converting ad campaigns. 

Given the product description below, generate 4 creative campaign angles tailored to ${platform} audience with a ${tone} voice.

Product Description: ${productDescription}

For each angle, provide:
1. A powerful headline (max 60 characters)
2. A compelling hook/angle that grabs attention
3. A supporting subheading that reinforces the value
4. A strong call-to-action
5. A brief audience insight or emotion trigger

Format your response as a JSON array with this structure:
[
  {
    "headline": "string",
    "hook": "string", 
    "subheading": "string",
    "cta": "string",
    "insight": "string"
  }
]

Make each angle unique and focus on different value propositions or emotional triggers. Consider the ${platform} platform's best practices and the ${tone} tone throughout.`;

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    // Parse the JSON response
    const cleanedText = response.choices[0].message.content?.replace(/```json\n?|\n?```/g, "").trim();
    if (!cleanedText) {
      throw new Error("No response from AI");
    }
    const angles = JSON.parse(cleanedText) as CreativeAngle[];

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
