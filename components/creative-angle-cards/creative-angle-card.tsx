import { useState } from "react";
import { RotateCcw, Save, Trash2, Image, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FacebookCard } from "./facebook-card";
import { InstagramCard } from "./instagram-card";
import { LinkedinCard } from "./linkedin-card";
import { TwitterCard } from "./twitter-card";
import { GoogleCard } from "./google-card";
import { TiktokCard } from "./tiktok-card";

import type { CreativeAngle, Product } from "@/lib/types";
import { mPlatforms } from "@/constants/platform";
import { mTones } from "@/constants/tone";

interface CreativeAngleCardProps {
  angle: CreativeAngle;
  onSave: (angle: CreativeAngle) => void;
  onRegenerate: (index: number) => void;
  onDiscard: (index: number) => void;
  onGenerateThumbnail: (index: number, angle: CreativeAngle) => Promise<void>;
  index: number;
}

export function CreativeAngleCard({ angle, onSave, onRegenerate, onDiscard, onGenerateThumbnail, index }: CreativeAngleCardProps) {
  // Handle both array and string platforms for backward compatibility
  const platform = Array.isArray(angle.product.platform) ? angle.product.platform[0] : angle.product.platform;

  switch (platform) {
    case "facebook":
      return <FacebookCard angle={angle} onSave={onSave} onRegenerate={onRegenerate} onDiscard={onDiscard} onGenerateThumbnail={onGenerateThumbnail} index={index} />;
    case "instagram":
      return <InstagramCard angle={angle} onSave={onSave} onRegenerate={onRegenerate} onDiscard={onDiscard} onGenerateThumbnail={onGenerateThumbnail} index={index} />;
    case "linkedin":
      return <LinkedinCard angle={angle} onSave={onSave} onRegenerate={onRegenerate} onDiscard={onDiscard} onGenerateThumbnail={onGenerateThumbnail} index={index} />;
    case "twitter":
      return <TwitterCard angle={angle} onSave={onSave} onRegenerate={onRegenerate} onDiscard={onDiscard} onGenerateThumbnail={onGenerateThumbnail} index={index} />;
    case "google":
      return <GoogleCard angle={angle} onSave={onSave} onRegenerate={onRegenerate} onDiscard={onDiscard} onGenerateThumbnail={onGenerateThumbnail} index={index} />;
    case "tiktok":
      return <TiktokCard angle={angle} onSave={onSave} onRegenerate={onRegenerate} onDiscard={onDiscard} onGenerateThumbnail={onGenerateThumbnail} index={index} />;
    default:
      return <DefaultCard angle={angle} onSave={onSave} onRegenerate={onRegenerate} onDiscard={onDiscard} onGenerateThumbnail={onGenerateThumbnail} index={index} />;
  }
}

// Default card component (original design)
function DefaultCard({ angle, onSave, onRegenerate, onDiscard, onGenerateThumbnail, index }: CreativeAngleCardProps) {
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

  // Handle both array and string platforms for backward compatibility
  const platform = Array.isArray(angle.product.platform) ? angle.product.platform[0] : angle.product.platform;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          {platform ? (
            <Badge variant="secondary" className="mb-2">
              {mPlatforms.find((p) => p.value === platform)?.label}
            </Badge>
          ) : null}
          {angle.product.tone ? <Badge variant="outline">{mTones.find((t) => t.value === angle.product.tone)?.label}</Badge> : null}
        </div>
        <CardTitle className="text-lg leading-tight">{angle.headline}</CardTitle>
      </CardHeader>
      <CardContent className="group flex-1 flex flex-col">
        {angle.thumbnail ? (
          <div className="mb-4 overflow-hidden rounded-lg border">
            <img src={angle.thumbnail} alt={`Thumbnail for ${angle.headline}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        ) : (
          <div className="mb-4 h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Image className="mx-auto h-8 w-8 mb-2" />
              <p className="text-sm">No thumbnail yet</p>
              {!angle.thumbnail && (
                <Button size="sm" variant="outline" onClick={handleGenerateThumbnail} disabled={isGeneratingThumbnail} className="flex-1 mt-2.5">
                  {isGeneratingThumbnail ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : "Generate"}
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4 flex-1">
          <div>
            <p className="text-sm font-medium text-gray-700">Hook Line:</p>
            <p className="text-base text-gray-600 font-medium">{angle.hook}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Subheading:</p>
            <p className="text-base text-gray-600 font-medium">{angle.subheading}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">CTA:</p>
            <p className="text-base text-gray-600 font-medium">{angle.cta}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Target Audience:</p>
            <p className="text-base text-primary font-medium">{angle.insight}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-4 mt-auto">
          <Button size="sm" onClick={() => onSave(angle)} className="flex-1">
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
      </CardContent>
    </Card>
  );
}
