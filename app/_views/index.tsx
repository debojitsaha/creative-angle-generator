import { useState } from "react";
import type { CreativeAngle } from "@/lib/types";
import { generateCreativeAngles } from "../actions";
import { InputSection } from "./input-section";
import { SuggestedQueries } from "./suggested-queries";
import { GeneratedAngles } from "./generated-angles";
import { SavedAngles } from "./saved-angles";

export function HomeView() {
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
            <InputSection
              productDescription={productDescription}
              platform={platform}
              tone={tone}
              isGenerating={isGenerating}
              onDescriptionChange={setProductDescription}
              onPlatformChange={setPlatform}
              onToneChange={setTone}
              onGenerate={handleGenerate}
            />

            {showSuggestions && <SuggestedQueries onQuerySelect={handleSuggestedQuery} />}

            <GeneratedAngles
              angles={generatedAngles}
              platform={platform}
              tone={tone}
              onSave={handleSaveAngle}
              onRegenerate={handleRegenerateAngle}
              onDiscard={handleDiscardAngle}
            />
          </div>

          {/* Saved Angles Sidebar */}
          <div className="lg:col-span-1">
            <SavedAngles angles={savedAngles} onRemove={handleRemoveSavedAngle} onExport={handleExportSaved} />
          </div>
        </div>
      </div>
    </div>
  );
}
