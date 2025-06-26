"use server";

import { z } from "zod";
import JsonSchema from "zod-to-json-schema";
import axios from "axios";

import { openaiClient } from "@/config/openai";
import { CreativeAngleSchema, CreativeAngle, Product } from "@/lib/types";
import { generateCreativeAnglesPrompt, generateThumbnailPrompt } from "@/lib/prompts";
import { firecrawlClient } from "@/config/firecrawl";
import { extractUrls } from "@/lib/utils";

export async function generateCreativeAngles(product: Product): Promise<CreativeAngle[]> {
  try {
    const urls = extractUrls(product.productDescription);
    let scrapedData: { markdown: string; json: any; metadata: any } = { markdown: "", json: {}, metadata: {} };

    if (urls.length > 0) {
      try {
        for (const url of urls) {
          const data = await scrapeWebsiteContent(url);
          scrapedData.markdown += data.markdown;
          scrapedData.json = { ...scrapedData.json, ...data.json };
          scrapedData.metadata = { ...scrapedData.metadata, ...data.metadata };
        }
      } catch (error) {
        console.warn("Failed to scrape website content:", error);
      }
    }

    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: generateCreativeAnglesPrompt,
        },
        {
          role: "user",
          content: `Product Name: ${product.productName}, Product Description: ${product.productDescription}, Platform: ${product.platform}, Tone: ${product.tone}, Website Scraped Content: ${JSON.stringify(scrapedData)}`,
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

export async function generateCreativeAnglesThumbnail(angle: CreativeAngle): Promise<string> {
  try {
    const promptResponse = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: generateThumbnailPrompt,
        },
        {
          role: "user",
          content: `Product Name: ${angle.product.productName}
          Product Description: ${angle.product.productDescription}
          Platform: ${angle.product.platform}
          Tone: ${angle.product.tone}
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
    if (!imagePrompt) {
      throw new Error("Failed to generate image prompt");
    }

    const imageResponse = await openaiClient.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      size: angle.product.platform === "linkedin" ? "1792x1024" : "1024x1792",
      quality: "standard",
      n: 1,
    });

    const baseImageUrl = imageResponse.data?.[0]?.url;
    if (!baseImageUrl) {
      throw new Error("Failed to get image from DALL-E");
    }

    const response = await axios.get(baseImageUrl, { responseType: "arraybuffer" });
    const baseImageBuffer = Buffer.from(response.data);
    const base64Image = `data:image/png;base64,${baseImageBuffer.toString("base64")}`;

    const base64Response = await fetch(base64Image);
    const imageBlob = await base64Response.blob();

    const formData = new FormData();
    const filename = `thumbnail-${Date.now()}.${imageBlob.type.split("/")[1]}`;
    formData.append("template_file", imageBlob, filename);

    const uploadResponse = await axios.post("https://prod.zocket.com//engine/ads/api/v1/upload_template_S3", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    if (!uploadResponse.data?.url) {
      throw new Error("Failed to get upload URL from S3");
    }

    return uploadResponse.data.url;
  } catch (error) {
    console.error("Error generating hybrid thumbnail:", error);
    if (axios.isAxiosError(error)) {
      console.error("API Error details:", error.response?.data);
    }
    throw new Error("Failed to generate thumbnail");
  }
}

export async function scrapeWebsiteContent(url: string): Promise<{ markdown: string; json: any; metadata: any }> {
  try {
    const response = await firecrawlClient.scrapeUrl(url, {
      formats: ["markdown", "json"],
      jsonOptions: {
        schema: z.object({
          title: z.string(),
          description: z.string(),
          image: z.string(),
          company_mission: z.string(),
          company_values: z.string(),
          company_products: z.string(),
          company_services: z.string(),
        }),
      },
    });

    if (!response.success || !response.markdown || !response.json) {
      console.error("Failed to get markdown from Firecrawl", response);
      throw new Error("Failed to get markdown from Firecrawl");
    }

    return {
      markdown: response.markdown,
      json: response.json,
      metadata: response.metadata,
    };
  } catch (error) {
    console.error("Error scraping website:", error);
    throw new Error("Failed to scrape website content");
  }
}
