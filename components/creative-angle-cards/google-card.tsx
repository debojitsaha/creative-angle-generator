import { useState } from "react";
import { ExternalLink, Image, Loader2, RotateCcw, Save, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CreativeAngle } from "@/lib/types";

interface GoogleCardProps {
  angle: CreativeAngle;
  onSave: (angle: CreativeAngle) => void;
  onRegenerate: (index: number) => void;
  onDiscard: (index: number) => void;
  onGenerateThumbnail: (index: number, angle: CreativeAngle) => Promise<void>;
  index: number;
}

export function GoogleCard({ angle, onSave, onRegenerate, onDiscard, onGenerateThumbnail, index }: GoogleCardProps) {
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);

  const handleGenerateThumbnail = async () => {
    setIsGeneratingThumbnail(true);
    try {
      await onGenerateThumbnail(index, angle);
    } catch (error) {
      console.error("Failed to generate thumbnail:", error);
    }
    setIsGeneratingThumbnail(false);
  };

  return (
    <Card className="flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <CardContent className="p-0 group flex-1 flex flex-col">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <p className="px-2 py-1 bg-yellow-100 border border-yellow-300 rounded text-xs font-medium text-yellow-800">Ad</p>
            </div>
            <p className="flex items-center text-xs text-gray-500">
              <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
              <span>4.5</span>
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
              <p className="text-sm text-green-700">{angle.product.productName}.com</p>
              <ExternalLink className="h-3 w-3 text-gray-400" />
            </div>

            <div>
              <h3 className="text-xl text-blue-600 hover:underline cursor-pointer font-normal leading-tight">{angle.headline}</h3>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-700 leading-relaxed">{angle.hook}</p>
              {angle.subheading && <p className="text-sm text-gray-600 leading-relaxed">{angle.subheading}</p>}
            </div>

            {angle.thumbnail ? (
              <div className="rounded-lg overflow-hidden border border-gray-200 mt-3">
                <img src={angle.thumbnail} alt={`Thumbnail for ${angle.headline}`} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ) : (
              <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 mt-3">
                <div className="text-center text-gray-500">
                  <Image className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">No image yet</p>
                  {!angle.thumbnail && (
                    <Button size="sm" variant="outline" onClick={handleGenerateThumbnail} disabled={isGeneratingThumbnail} className="mt-2">
                      {isGeneratingThumbnail ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : "Generate"}
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2">
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  About Us
                </a>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Products
                </a>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Contact
                </a>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Support
                </a>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">{angle.cta}</p>
                  <p className="text-xs text-blue-700 mt-1">Special offer - Limited time</p>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Learn More
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 mt-4">
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Target Audience</p>
                  <p className="text-sm text-gray-700">{angle.insight}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-3 w-3 text-yellow-500 fill-current" />
                ))}
              </div>
              <span className="text-xs text-gray-600">Based on 247 reviews</span>
            </div>
            <p className="text-xs text-gray-600">"Great service and results!" - Verified Customer</p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onSave(angle)} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Save className="mr-1 h-3 w-3" />
              Save
            </Button>
            <Button size="sm" variant="outline" disabled onClick={() => onRegenerate(index)}>
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDiscard(index)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
