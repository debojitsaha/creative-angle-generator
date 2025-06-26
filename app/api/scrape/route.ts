import { type NextRequest, NextResponse } from "next/server"
import { scrapeWebsiteContent } from "@/app/actions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    const content = await scrapeWebsiteContent(url)

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Scraping Error:", error)
    return NextResponse.json({ error: "Failed to scrape website content" }, { status: 500 })
  }
}
