"use client";

import { useState } from "react";
import { generateCreativeAngles, generateCreativeAnglesThumbnail } from "@/app/actions";

import { InputSection } from "@/app/_views/input-section";
import { SavedAngles } from "@/app/_views/saved-angles";
import { SuggestedQueries } from "@/app/_views/suggested-queries";
import { GeneratedAngles } from "@/app/_views/generated-angles";

import type { CreativeAngle } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeView() {
  const [productDescription, setProductDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAngles, setGeneratedAngles] = useState<CreativeAngle[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("generatedAngles");
      return stored ? JSON.parse(stored) : [];
    }
  });
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

      let updatedAngles = [...angles];

      // Automatically generate thumbnail for the first angle
      if (angles.length > 0) {
        try {
          const thumbnailUrl = await generateCreativeAnglesThumbnail({
            productDescription,
            platform,
            tone,
            angle: angles[0],
          });

          updatedAngles = updatedAngles.map((angle, index) => (index === 0 ? { ...angle, thumbnail: thumbnailUrl } : angle));
        } catch (error) {
          console.error("Error generating thumbnail for first angle:", error);
        }
      }

      // Handle localStorage update — prepend to existing
      const stored = localStorage.getItem("generatedAngles");
      console.log("stored", stored);
      const existing = stored ? JSON.parse(stored) : [];
      console.log("existing", existing);
      const newList = [...updatedAngles, ...existing];
      console.log("newList", newList);  
      setGeneratedAngles(newList);
      localStorage.setItem("generatedAngles", JSON.stringify(newList));
    } catch (error) {
      console.error("Error generating angles:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateThumbnail = async (index: number, angle: CreativeAngle) => {
    try {
      const thumbnailUrl = await generateCreativeAnglesThumbnail({
        productDescription,
        platform,
        tone,
        angle,
      });

      // Compute the updated angles list
      const updatedAngles = generatedAngles.map((a, i) => (i === index ? { ...a, thumbnail: thumbnailUrl } : a));

      // Update the state
      setGeneratedAngles(updatedAngles);

      // Update localStorage with the new state
      localStorage.setItem("generatedAngles", JSON.stringify(updatedAngles));
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      throw error; // Re-throw to handle in the component
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
    const csvContent = savedAngles.map((angle) => `"${angle.headline}","${angle.hook}","${angle.subheading}","${angle.cta}","${angle.insight}","${angle.thumbnail || ""}"`).join("\n");

    const blob = new Blob([`Headline,Hook,Subheading,CTA,Insight,Thumbnail\n${csvContent}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "creative-angles.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSuggestedQuery = (query: string) => setProductDescription(query);

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

            {isGenerating ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="w-full h-full max-h-72 aspect-square rounded-lg bg-white" />
                ))}
              </div>
            ) : (
              <GeneratedAngles angles={generatedAngles} platform={platform} tone={tone} onSave={handleSaveAngle} onRegenerate={handleRegenerateAngle} onDiscard={handleDiscardAngle} onGenerateThumbnail={handleGenerateThumbnail} />
            )}
          </div>

          <div className="lg:col-span-2">
            <SavedAngles angles={savedAngles} onRemove={handleRemoveSavedAngle} onExport={handleExportSaved} />
          </div>
        </div>
      </div>
    </div>
  );
}
