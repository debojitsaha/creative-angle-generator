import { useState } from "react";
import { Image, Loader2, MessageCircle, RotateCcw, Save, Share, ThumbsUp, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CreativeAngle } from "@/lib/types";

interface FacebookCardProps {
  angle: CreativeAngle;
  onSave: (angle: CreativeAngle) => void;
  onRegenerate: (index: number) => void;
  onDiscard: (index: number) => void;
  onGenerateThumbnail: (index: number, angle: CreativeAngle) => Promise<void>;
  index: number;
}

export function FacebookCard({ angle, onSave, onRegenerate, onDiscard, onGenerateThumbnail, index }: FacebookCardProps) {
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
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">FB</span>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">{angle.product.productName}</p>
              <p className="text-xs text-gray-500">2h • 🌍</p>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-0 group flex-1 flex flex-col">
        <div className="p-3 space-y-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-base text-gray-900">{angle.headline}</h3>
            <p className="text-sm text-gray-700">{angle.hook}</p>
            <p className="text-sm text-gray-600">{angle.subheading}</p>
          </div>
        </div>

        {angle.thumbnail ? (
          <div className="relative overflow-hidden">
            <img src={angle.thumbnail} alt={`Thumbnail for ${angle.headline}`} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        ) : (
          <div className="h-48 bg-gray-100 flex items-center justify-center border-t border-b border-gray-100">
            <div className="text-center text-gray-500">
              <Image className="mx-auto h-8 w-8 mb-2" />
              <p className="text-sm">No thumbnail yet</p>
              {!angle.thumbnail && (
                <Button size="sm" variant="outline" onClick={handleGenerateThumbnail} disabled={isGeneratingThumbnail} className="mt-2">
                  {isGeneratingThumbnail ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : "Generate"}
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="p-3 space-y-3 flex-1">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Call to Action</p>
            <p className="text-sm text-blue-600 font-medium">{angle.cta}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Target Audience</p>
            <p className="text-sm text-gray-700">{angle.insight}</p>
          </div>
        </div>

        <div className="border-t border-gray-100">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <ThumbsUp className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="text-xs text-gray-500">124</span>
              </div>
              <span className="text-xs text-gray-500">8 comments</span>
            </div>
            <span className="text-xs text-gray-500">12 shares</span>
          </div>

          <div className="border-t border-gray-100 flex">
            <button className="flex-1 flex items-center justify-center py-2 hover:bg-gray-50 transition-colors">
              <ThumbsUp className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700 font-medium">Like</span>
            </button>
            <button className="flex-1 flex items-center justify-center py-2 hover:bg-gray-50 transition-colors border-l border-r border-gray-100">
              <MessageCircle className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700 font-medium">Comment</span>
            </button>
            <button className="flex-1 flex items-center justify-center py-2 hover:bg-gray-50 transition-colors">
              <Share className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700 font-medium">Share</span>
            </button>
          </div>
        </div>

        <div className="p-3 border-t border-gray-100 bg-gray-50">
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
