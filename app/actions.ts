"use server";

import { z } from "zod";
import JsonSchema from "zod-to-json-schema";

import { openaiClient } from "@/config/openai";
import { CreativeAngleSchema, CreativeAngle, Product } from "@/lib/types";
import { generateCreativeAnglesPrompt, generateThumbnailPrompt } from "@/lib/prompts";

export async function generateCreativeAngles(product: Product): Promise<CreativeAngle[]> {
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
          content: `Product Name: ${product.productName}, Product Description: ${product.productDescription}, Platform: ${product.platform}, Tone: ${product.tone}`,
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
    throw new Error("Failed to generate creative angles");
  }
}

export async function generateCreativeAnglesThumbnail({ product, angle }: { product: Product; angle: CreativeAngle }): Promise<string> {
  try {
    // Step 1: Generate image prompt using GPT-4o
    const promptResponse = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: generateThumbnailPrompt,
        },
        {
          role: "user",
          content: `Product Name: ${product.productName}
          Product Description: ${product.productDescription}
          Platform: ${product.platform}
          Tone: ${product.tone}
          Creative Angle:
          - Headline: ${angle.headline}
          - Hook: ${angle.hook}
          - Subheading: ${angle.subheading}
          - CTA: ${angle.cta}
          - Insight: ${angle.insight}`,
        },
      ],
      temperature: 0.2,
    });

    const imagePrompt = promptResponse.choices[0].message.content;
    console.log("imagePrompt", imagePrompt);

    if (!imagePrompt) {
      throw new Error("Failed to generate image prompt");
    }

    // Step 2: Generate image using DALL-E
    const imageResponse = await openaiClient.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const imageUrl = imageResponse.data?.[0]?.url;

    if (!imageUrl) {
      console.error("Failed to generate image", imageResponse);
      throw new Error("Failed to generate image");
    }

    return imageUrl;
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    throw new Error("Failed to generate thumbnail");
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
