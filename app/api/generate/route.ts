import { type NextRequest, NextResponse } from "next/server";
import { generateCreativeAngles } from "@/app/actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName, productDescription, platform, tone } = body;

    if (!productName || !productDescription || !platform || !tone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const angles = await generateCreativeAngles({
      productName,
      productDescription,
      platform,
      tone,
    });

    return NextResponse.json({ angles });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to generate creative angles" }, { status: 500 });
  }
}
