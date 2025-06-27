"use client";

import { useState } from "react";
import { toast } from "sonner";
import { generateCreativeAngles, generateCreativeAnglesThumbnail } from "@/app/api/creative-angles";

import { Skeleton } from "@/components/ui/skeleton";
import { InputSection } from "@/app/_views/input-section";
import { SavedAngles } from "@/app/_views/saved-angles";
import { SuggestedQueries } from "@/app/_views/suggested-queries";
import { GeneratedAngles } from "@/app/_views/generated-angles";

import type { CreativeAngle, Product } from "@/lib/types";

export function HomeView() {
  const [product, setProduct] = useState<Product>({
    productName: "",
    productDescription: "",
    platform: "",
    tone: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAngles, setGeneratedAngles] = useState<CreativeAngle[]>([]);
  const [savedAngles, setSavedAngles] = useState<CreativeAngle[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("savedAngles");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [generateThumbnail, setGenerateThumbnail] = useState(false);

  const handleGenerate = async () => {
    if (!product.productName.trim() || !product.productDescription.trim() || !product.platform || !product.tone) return;

    setIsGenerating(true);
    setShowSuggestions(false);

    try {
      const angles = await generateCreativeAngles(product);
      console.log("angles", angles);
      setGeneratedAngles(angles);

      let updatedAngles = [...angles];

      if (angles.length > 0 && generateThumbnail) {
        try {
          const thumbnailUrl = await generateCreativeAnglesThumbnail(angles[0]);

          updatedAngles = updatedAngles.map((angle, index) => (index === 0 ? { ...angle, thumbnail: thumbnailUrl } : angle));
        } catch (error) {
          console.error("Error generating thumbnail for first angle:", error);
          toast.error("Error generating thumbnail");
        }
      }

      const stored = localStorage.getItem("generatedAngles");
      const existing = stored ? JSON.parse(stored) : [];
      const newList = [...updatedAngles, ...existing];
      setGeneratedAngles(newList);
    } catch (error) {
      console.error("Error generating angles:", error);
      toast.error("Error generating angles");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateThumbnail = async (index: number, angle: CreativeAngle) => {
    try {
      const thumbnailUrl = await generateCreativeAnglesThumbnail(angle);

      setGeneratedAngles((prev) => prev.map((a, i) => (i === index ? { ...a, thumbnail: thumbnailUrl } : a)));
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      toast.error("Error generating thumbnail");
      throw error;
    }
  };

  const handleSaveAngle = (angle: CreativeAngle) => {
    setSavedAngles((prev) => [...prev, { ...angle, id: Date.now().toString() }]);
    localStorage.setItem("savedAngles", JSON.stringify([...savedAngles, { ...angle, id: Date.now().toString() }]));
  };

  const handleRegenerateAngle = (index: number) => {
    // TODO: Regenerate the angle at the given index
    console.log("Regenerating angle at index:", index);
  };

  const handleDiscardAngle = (index: number) => {
    setGeneratedAngles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveSavedAngle = (id: string) => {
    setSavedAngles((prev) => prev.filter((angle) => angle.id !== id));
    localStorage.setItem("savedAngles", JSON.stringify(savedAngles.filter((angle) => angle.id !== id)));
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

  const handleShiftToDashboard = () => {
    setGeneratedAngles(savedAngles);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-start md:items-center gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Creative Angle Generator</h1>
          <p className="text-base md:text-xl text-gray-600">Turn product features into viral creatives in seconds</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <InputSection
              product={product}
              isGenerating={isGenerating}
              generateThumbnail={generateThumbnail}
              onProductNameChange={(value) => setProduct({ ...product, productName: value })}
              onDescriptionChange={(value) => setProduct({ ...product, productDescription: value })}
              onPlatformChange={(value) => setProduct({ ...product, platform: value })}
              onToneChange={(value) => setProduct({ ...product, tone: value })}
              onGenerate={handleGenerate}
              onGenerateThumbnailChange={(value) => setGenerateThumbnail(value)}
            />

            {showSuggestions ? (
              <SuggestedQueries
                onQuerySelect={(query) => {
                  setProduct({ ...product, productName: query.productName, productDescription: query.productDescription });
                }}
              />
            ) : null}

            {isGenerating ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="w-full h-full max-h-72 aspect-square rounded-lg bg-white" />
                ))}
              </div>
            ) : (
              <GeneratedAngles angles={generatedAngles} onSave={handleSaveAngle} onRegenerate={handleRegenerateAngle} onDiscard={handleDiscardAngle} onGenerateThumbnail={handleGenerateThumbnail} />
            )}
          </div>

          <div className="lg:col-span-2">
            <SavedAngles angles={savedAngles} onRemove={handleRemoveSavedAngle} onExport={handleExportSaved} onShiftToDashboard={handleShiftToDashboard} />
          </div>
        </div>
      </div>
    </div>
  );
}
