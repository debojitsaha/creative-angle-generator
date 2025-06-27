import { useState } from "react";
import { RotateCcw, Save, Trash2, Image, Loader2, Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { CreativeAngle } from "@/lib/types";
import TwitterIcon from "@/assets/twitter.png";

interface TwitterCardProps {
  angle: CreativeAngle;
  onSave: (angle: CreativeAngle) => void;
  onRegenerate: (index: number) => void;
  onDiscard: (index: number) => void;
  onGenerateThumbnail: (index: number, angle: CreativeAngle) => Promise<void>;
  index: number;
}

export function TwitterCard({ angle, onSave, onRegenerate, onDiscard, onGenerateThumbnail, index }: TwitterCardProps) {
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

  const tweetText = `${angle.headline}\n\n${angle.hook}\n\n${angle.subheading}\n\n${angle.cta}`;
  const characterCount = tweetText.length;

  return (
    <Card className="flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden">
      <CardContent className="p-0 group flex-1 flex flex-col">
        <div className="p-4 flex items-start space-x-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src={TwitterIcon.src} alt="Twitter" className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <div className="flex items-center space-x-1">
                <p className="font-bold text-base text-gray-900">{angle.product.productName}</p>
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <span className="text-gray-500">{angle.product.productName}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500 text-sm">2h</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <h3 className="font-bold text-xl text-gray-900 leading-tight">{angle.headline}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{angle.subheading}</p>
                <p className="text-base text-gray-900 leading-relaxed font-medium italic">{angle.hook}</p>
              </div>

              {angle.thumbnail ? (
                <div className="rounded-2xl overflow-hidden border border-gray-200 mt-3">
                  <img src={angle.thumbnail} alt={`Thumbnail for ${angle.headline}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : (
                <div className="h-48 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200 mt-3">
                  <div className="text-center text-gray-500">
                    <Image className="mx-auto h-10 w-10 mb-2" />
                    <p className="text-sm">No media yet</p>
                    {!angle.thumbnail && (
                      <Button size="sm" variant="outline" onClick={handleGenerateThumbnail} disabled={isGeneratingThumbnail} className="mt-2">
                        {isGeneratingThumbnail ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : "Generate"}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <p className="text-blue-500 font-medium tracking-wider">{angle.cta}</p>

                <div className="text-sm text-gray-600">
                  <span className="font-medium">Best suited for:</span> {angle.insight}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                  <span>Character count: {characterCount}/280</span>
                  {characterCount > 280 && <span className="text-red-500 font-medium">Over limit!</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 max-w-md">
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <span className="text-sm">12</span>
              </button>

              <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                  <Repeat2 className="h-5 w-5" />
                </div>
                <span className="text-sm">8</span>
              </button>

              <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                  <Heart className="h-5 w-5" />
                </div>
                <span className="text-sm">42</span>
              </button>

              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                  <Share className="h-5 w-5" />
                </div>
              </button>

              <Button variant="ghost" size="sm" className="p-2">
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 mt-auto">
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onSave(angle)} className="flex-1 bg-black hover:bg-gray-800 text-white">
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
