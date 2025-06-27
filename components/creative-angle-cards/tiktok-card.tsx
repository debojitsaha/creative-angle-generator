import { useState } from "react";
import { RotateCcw, Save, Trash2, Image, Loader2, Heart, MessageCircle, Share, Bookmark, Play, Music, MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { CreativeAngle } from "@/lib/types";
import TiktokIcon from "@/assets/tiktok.jpg";

interface TiktokCardProps {
  angle: CreativeAngle;
  onSave: (angle: CreativeAngle) => void;
  onRegenerate: (index: number) => void;
  onDiscard: (index: number) => void;
  onGenerateThumbnail: (index: number, angle: CreativeAngle) => Promise<void>;
  index: number;
}

export function TiktokCard({ angle, onSave, onRegenerate, onDiscard, onGenerateThumbnail, index }: TiktokCardProps) {
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
    <Card className="flex flex-col h-full bg-black text-white rounded-2xl overflow-hidden relative mx-auto">
      <CardContent className="p-0 group flex-1 flex flex-col relative">
        <div className="relative flex-1 bg-black">
          {angle.thumbnail ? (
            <div className="relative h-full max-h-96 overflow-hidden rounded-lg">
              <img src={angle.thumbnail} alt={`Thumbnail for ${angle.headline}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black bg-opacity-20" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 bg-gray-900 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Image className="mx-auto h-12 w-12 mb-4" />
                <p className="text-sm mb-3">No video yet</p>
                {!angle.thumbnail && (
                  <Button size="sm" variant="outline" onClick={handleGenerateThumbnail} disabled={isGeneratingThumbnail} className="relative z-10 border-gray-600 text-gray-300 hover:bg-gray-200">
                    {isGeneratingThumbnail ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : "Generate"}
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">For You</span>
              <span className="text-gray-400 text-sm">Following</span>
            </div>
          </div>

          <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full p-0.5 overflow-hidden">
                  <img src={TiktokIcon.src} alt="Tiktok" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-1">
              <button className="p-3 rounded-full">
                <Heart className="h-8 w-8 text-white" />
              </button>
              <span className="text-white text-xs">12.3K</span>
            </div>

            <div className="flex flex-col items-center space-y-1">
              <button className="p-3 rounded-full">
                <MessageCircle className="h-8 w-8 text-white" />
              </button>
              <span className="text-white text-xs">1,234</span>
            </div>

            <div className="flex flex-col items-center space-y-1">
              <button className="p-3 rounded-full">
                <Share className="h-8 w-8 text-white" />
              </button>
              <span className="text-white text-xs">856</span>
            </div>

            <div className="flex flex-col items-center space-y-1">
              <button className="p-3 rounded-full">
                <Bookmark className="h-8 w-8 text-white" />
              </button>
            </div>

            <Button variant="ghost" size="sm" className="p-2 text-white">
              <MoreHorizontal className="h-6 w-6" />
            </Button>

            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center animate-spin-slow">
              <Music className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-20">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold">{angle.product.productName}</span>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <span className="text-gray-300 text-sm">Follow</span>
              </div>

              <div className="space-y-2">
                <p className="text-white font-semibold text-base leading-tight">{angle.headline}</p>
                <p className="text-gray-300 text-sm">{angle.subheading}</p>
                <p className="text-white text-sm leading-relaxed font-medium italic">{angle.hook}</p>
              </div>

              <div className="space-y-2">
                <p className="text-blue-400 text-sm">#{angle.cta.replace(/\s+/g, "")} #fyp #trending</p>
                <div className="text-xs text-gray-400">
                  <span className="font-medium">Connect if you are:</span> {angle.insight}
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <Music className="h-4 w-4 text-white" />
                <span className="text-white">Original Audio - {angle.product.productName}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-900 border-t border-gray-700">
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onSave(angle)} className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white border-none">
              <Save className="mr-1 h-3 w-3" />
              Save
            </Button>
            <Button size="sm" variant="outline" disabled onClick={() => onRegenerate(index)} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDiscard(index)} className="bg-red-600 hover:bg-red-700">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
