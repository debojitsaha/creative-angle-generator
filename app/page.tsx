"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Save, RotateCcw, Trash2, Download, ExternalLink } from "lucide-react";
import { generateCreativeAngles } from "./actions";
import type { CreativeAngle } from "@/lib/types";

const platforms = [
  { value: "facebook", label: "Facebook Ads" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter/X" },
  { value: "google", label: "Google Ads" },
  { value: "tiktok", label: "TikTok" },
];

const tones = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "witty", label: "Witty" },
  { value: "urgent", label: "Urgent" },
  { value: "friendly", label: "Friendly" },
  { value: "authoritative", label: "Authoritative" },
];

const suggestedQueries = [
  "AI-powered project management tool that helps teams stay organized and meet deadlines",
  "Sustainable meal kit delivery service with locally sourced ingredients",
  "Mobile app for freelancers to track time and manage invoices",
  "Online course platform for learning coding skills",
  "Smart home security system with AI-powered alerts",
];

export default function HomePage() {
  const [productDescription, setProductDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAngles, setGeneratedAngles] = useState<CreativeAngle[]>([]);
  const [savedAngles, setSavedAngles] = useState<CreativeAngle[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  async function handleGenerate() {
    if (!productDescription.trim() || !platform || !tone) return;

    setIsGenerating(true);
    setShowSuggestions(false);

    try {
      const angles = await generateCreativeAngles({ productDescription, platform, tone });
      console.log(angles);
      setGeneratedAngles(angles);
    } catch (error) {
      console.error("Error generating angles:", error);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSaveAngle(angle: CreativeAngle) {
    setSavedAngles((prev) => [...prev, { ...angle, id: Date.now().toString() }]);
  }

  function handleRegenerateAngle(index: number) {
    // In a real app, you'd regenerate just this specific angle
    console.log("Regenerating angle at index:", index);
  }

  function handleDiscardAngle(index: number) {
    setGeneratedAngles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleRemoveSavedAngle(id: string) {
    setSavedAngles((prev) => prev.filter((angle) => angle.id !== id));
  }

  function handleExportSaved() {
    const csvContent = savedAngles.map((angle) => `"${angle.headline}","${angle.hook}","${angle.subheading}","${angle.cta}","${angle.insight}"`).join("\n");

    const blob = new Blob([`Headline,Hook,Subheading,CTA,Insight\n${csvContent}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "creative-angles.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleSuggestedQuery(query: string) {
    setProductDescription(query);
    setShowSuggestions(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Creative Angle Generator</h1>
          <p className="text-xl text-gray-600">Turn product features into viral campaigns in seconds</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Generate Creative Angles
                </CardTitle>
                <CardDescription>Describe your product and we'll generate compelling marketing angles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Product Description</label>
                  <Textarea
                    placeholder="Describe your product, its key features, and benefits..."
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Platform</label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Tone</label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {tones.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleGenerate} disabled={!productDescription.trim() || !platform || !tone || isGenerating} className="w-full bg-purple-600 hover:bg-purple-700">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Creative Angles
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Suggested Queries */}
            {showSuggestions && (
              <Card>
                <CardHeader>
                  <CardTitle>Try These Examples</CardTitle>
                  <CardDescription>Click on any example to get started quickly</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {suggestedQueries.map((query, index) => (
                      <Button key={index} variant="outline" className="text-left h-auto p-4 justify-start" onClick={() => handleSuggestedQuery(query)}>
                        <ExternalLink className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{query}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Angles */}
            {generatedAngles.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Generated Angles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedAngles.map((angle, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <Badge variant="secondary" className="mb-2">
                            {platforms.find((p) => p.value === platform)?.label}
                          </Badge>
                          <Badge variant="outline">{tones.find((t) => t.value === tone)?.label}</Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight">{angle.headline}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Hook:</p>
                          <p className="text-sm text-gray-600">{angle.hook}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Subheading:</p>
                          <p className="text-sm text-gray-600">{angle.subheading}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">CTA:</p>
                          <p className="text-sm text-gray-600 font-medium">{angle.cta}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Insight:</p>
                          <p className="text-sm text-gray-500 italic">{angle.insight}</p>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" onClick={() => handleSaveAngle(angle)} className="flex-1">
                            <Save className="mr-1 h-3 w-3" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRegenerateAngle(index)}>
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDiscardAngle(index)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Saved Angles Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Saved Angles</CardTitle>
                  {savedAngles.length > 0 && (
                    <Button size="sm" variant="outline" onClick={handleExportSaved}>
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  )}
                </div>
                <CardDescription>{savedAngles.length} saved</CardDescription>
              </CardHeader>
              <CardContent>
                {savedAngles.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No saved angles yet. Generate some angles and save your favorites!</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {savedAngles.map((angle) => (
                      <div key={angle.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-medium line-clamp-2">{angle.headline}</h4>
                          <Button size="sm" variant="ghost" onClick={() => handleRemoveSavedAngle(angle.id!)} className="h-6 w-6 p-0 ml-2 flex-shrink-0">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{angle.hook}</p>
                        <p className="text-xs font-medium text-purple-600 mt-1">{angle.cta}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
