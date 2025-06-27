# 🧠 Creative Angle Generator

A smart and sleek marketing ideation tool that uses AI to generate campaign angles, ad copy, and creative hooks — just from your product description or website URL.

---

## ✨ Features

- 🔍 **Paste a Website URL** – Scrape content with [Firecrawl](https://firecrawl.dev)
- 🧠 **AI-Powered Generation** – Uses OpenAI to create:
  - Creative campaign angles
  - Hook headlines and CTAs
  - Platform-specific messaging (e.g. Instagram, LinkedIn, etc.)
- 💾 **Save & Export Ideas** – Save top angles and export as CSV
- 🖼️ **Image Generation** – Visual concepts via OpenAI DALL·E
- 📜 **History Panel** – Browse and reuse past prompts and generations
- ⚡ **Modern UI** – Built with Next.js App Router + Tailwind CSS

---

## 🧱 Tech Stack

| Layer    | Tech                             |
| -------- | -------------------------------- |
| Frontend | React + Next.js (App Router)     |
| Styling  | Tailwind CSS + ShadCN UI         |
| AI Layer | OpenAI GPT-4 Turbo + DALL·E 3    |
| Scraping | Firecrawl JS SDK (client-side)   |
| Backend  | Supabase (auth + DB + history)   |
| Hosting  | Vercel (Edge + Server Functions) |

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/creative-angle-generator.git
cd creative-angle-generator
```

````

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file and add:

```env
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_FIRECRAWL_API_KEY=your_firecrawl_key
```

> 🔐 Never expose your OpenAI key in the frontend. All image and generation requests go through the `/api/` layer.

### 4. Run the Dev Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
app/
├─ api/
│  ├─ generate-angle/        → OpenAI text generation API
│  ├─ generate-image/        → OpenAI image generation (server-side only)
├─ components/
│  ├─ PromptForm.tsx         → Form input for product/URL
│  ├─ OutputGrid.tsx         → Grid view for generated ideas
│  ├─ SavedCampaigns.tsx     → View + export saved ideas
│  ├─ ScrapeButton.tsx       → Firecrawl integration
├─ lib/
│  ├─ prompts.ts             → Prompt templates for AI
│  ├─ utils.ts               → Firecrawl & helper methods
```

---

## ✅ How It Works

1. User pastes a **product URL** or types a description
2. Firecrawl extracts site content (client-side)
3. Prompt is generated + sent to OpenAI
4. UI renders multiple creative ideas
5. User can **Save**, or **Export** ideas

---

## 🧑‍💻 Author

Made by [Debojit Saha](https://github.com/debojitsaha)
Built for a solo hackathon challenge with a focus on **AI x UI**.

---
````
