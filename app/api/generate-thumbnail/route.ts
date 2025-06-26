import { NextRequest, NextResponse } from "next/server";
import { generateCreativeAnglesThumbnail } from "@/app/actions";
import { CreativeAngle } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productDescription, platform, tone, angle } = body;

    if (!productDescription || !platform || !tone || !angle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const thumbnailUrl = await generateCreativeAnglesThumbnail({
      productDescription,
      platform,
      tone,
      angle: angle as CreativeAngle,
    });

    return NextResponse.json({ thumbnailUrl });
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    return NextResponse.json({ error: "Failed to generate thumbnail" }, { status: 500 });
  }
}
