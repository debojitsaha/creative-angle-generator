import FirecrawlApp from "@mendable/firecrawl-js";

export const firecrawlClient = new FirecrawlApp({ apiKey: process.env.NEXT_PUBLIC_FIRECRAWL_API });
