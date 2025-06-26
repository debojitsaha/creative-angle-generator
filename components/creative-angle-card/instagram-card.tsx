import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, Save, Trash2, Image, Loader2, Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import type { CreativeAngle } from "@/lib/types";
import { mTones } from "@/constants/tone";
import { useState } from "react";

interface InstagramCardProps {
  angle: CreativeAngle;
  tone: string;
  onSave: (angle: CreativeAngle) => void;
  onRegenerate: (index: number) => void;
  onDiscard: (index: number) => void;
  onGenerateThumbnail: (index: number, angle: CreativeAngle) => Promise<void>;
  index: number;
}

export function InstagramCard({ angle, tone, onSave, onRegenerate, onDiscard, onGenerateThumbnail, index }: InstagramCardProps) {
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
    <Card className="flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden max-w-md mx-auto">
      {/* Instagram Header */}
        <div className="p-3 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-0.5">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-800">YB</span>
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">yourbrand</p>
            <p className="text-xs text-gray-500">Sponsored</p>
          </div>
      </div>

      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Instagram Square Image */}
        {angle.thumbnail ? (
          <div className="aspect-square relative">
            <img src={angle.thumbnail} alt={`Thumbnail for ${angle.headline}`} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Image className="mx-auto h-12 w-12 mb-2" />
              <p className="text-sm">No image yet</p>
              {!angle.thumbnail && (
                <Button size="sm" variant="outline" onClick={handleGenerateThumbnail} disabled={isGeneratingThumbnail} className="mt-2">
                  {isGeneratingThumbnail ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : "Generate"}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Instagram Actions */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <button className="hover:opacity-50 transition-opacity">
                <Heart className="h-6 w-6 text-gray-800" />
              </button>
              <button className="hover:opacity-50 transition-opacity">
                <MessageCircle className="h-6 w-6 text-gray-800" />
              </button>
              <button className="hover:opacity-50 transition-opacity">
                <Send className="h-6 w-6 text-gray-800" />
              </button>
            </div>
            <button className="hover:opacity-50 transition-opacity">
              <Bookmark className="h-6 w-6 text-gray-800" />
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-900">1,234 likes</p>

            <div className="space-y-1">
              <div className="flex items-start space-x-2">
                <span className="font-semibold text-sm text-gray-900">yourbrand</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{angle.headline}</p>
                </div>
              </div>

              <p className="text-sm text-gray-900 leading-relaxed">{angle.hook}</p>

              {angle.subheading && <p className="text-sm text-gray-700">{angle.subheading}</p>}

              <div className="pt-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Call to Action</p>
                <p className="text-sm text-blue-600 font-medium">{angle.cta}</p>
              </div>

              <div className="pt-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Target</p>
                <p className="text-sm text-gray-600">{angle.insight}</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 pt-1">View all 42 comments</p>
            <p className="text-xs text-gray-400 uppercase tracking-wide">2 HOURS AGO</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 bg-gray-50 mt-auto">
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onSave(angle)} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
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
