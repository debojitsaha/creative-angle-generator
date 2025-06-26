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

  const handleGenerate = async () => {
    if (!productDescription.trim() || !platform || !tone) return;

    setIsGenerating(true);
    setShowSuggestions(false);

    try {
      const angles = await generateCreativeAngles({ productDescription, platform, tone });
      console.log("Generated angles", angles);
      setGeneratedAngles(angles);
    } catch (error) {
      console.error("Error generating angles:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAngle = (angle: CreativeAngle) => {
    setSavedAngles((prev) => [...prev, { ...angle, id: Date.now().toString() }]);
  };

  const handleRegenerateAngle = (index: number) => {
    // In a real app, you'd regenerate just this specific angle
    console.log("Regenerating angle at index:", index);
  };

  const handleDiscardAngle = (index: number) => {
    setGeneratedAngles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveSavedAngle = (id: string) => {
    setSavedAngles((prev) => prev.filter((angle) => angle.id !== id));
  };

  const handleExportSaved = () => {
    const csvContent = savedAngles.map((angle) => `"${angle.headline}","${angle.hook}","${angle.subheading}","${angle.cta}","${angle.insight}"`).join("\n");

    const blob = new Blob([`Headline,Hook,Subheading,CTA,Insight\n${csvContent}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "creative-angles.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSuggestedQuery = (query: string) => {
    setProductDescription(query);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 flex flex-col items-center gap-1">
          <h1 className="text-3xl font-bold text-gray-900">Creative Angle Generator</h1>
          <p className="text-xl text-gray-600">Turn product features into viral campaigns in seconds</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
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

            {showSuggestions ? <SuggestedQueries onQuerySelect={handleSuggestedQuery} /> : null}

            <GeneratedAngles
              angles={generatedAngles}
              platform={platform}
              tone={tone}
              onSave={handleSaveAngle}
              onRegenerate={handleRegenerateAngle}
              onDiscard={handleDiscardAngle}
            />
          </div>

          <div className="lg:col-span-2">
            <SavedAngles angles={savedAngles} onRemove={handleRemoveSavedAngle} onExport={handleExportSaved} />
          </div>
        </div>
      </div>
    </div>
  );
}
