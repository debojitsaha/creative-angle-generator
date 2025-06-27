"use client";

import { CreativeAngleCard } from "@/components/creative-angle-cards/creative-angle-card";
import { mPlatforms } from "@/constants/platform";
import type { CreativeAngle } from "@/lib/types";

interface GeneratedAnglesProps {
  angles: CreativeAngle[];
  onSave: (angle: CreativeAngle) => void;
  onRegenerate: (index: number) => void;
  onDiscard: (index: number) => void;
  onGenerateThumbnail: (index: number, angle: CreativeAngle) => Promise<void>;
}

export function GeneratedAngles({ angles, onSave, onRegenerate, onDiscard, onGenerateThumbnail }: GeneratedAnglesProps) {
  if (!angles || angles.length === 0) return null;

  const anglesByPlatform = angles.reduce((acc, angle) => {
    const platforms = Array.isArray(angle.product.platform) ? angle.product.platform : [angle.product.platform];

    platforms.forEach((platform) => {
      if (!acc[platform]) {
        acc[platform] = [];
      }
      acc[platform].push(angle);
    });

    return acc;
  }, {} as Record<string, CreativeAngle[]>);

  const getPlatformLabel = (platformValue: string) => {
    return mPlatforms.find((p) => p.value === platformValue)?.label || platformValue;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Generated Angles</h2>

      {Object.entries(anglesByPlatform).map(([platform, platformAngles]) => (
        <div key={platform} className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800">{getPlatformLabel(platform)}</h3>
            <span className="text-sm text-gray-500">
              ({platformAngles.length} angle{platformAngles.length > 1 ? "s" : ""})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platformAngles.map((angle, index) => {
              const originalIndex = angles.findIndex((a) => a === angle);
              return (
                <div key={`${platform}-${index}`} className="h-full">
                  <CreativeAngleCard angle={angle} onSave={onSave} onRegenerate={onRegenerate} onDiscard={onDiscard} onGenerateThumbnail={onGenerateThumbnail} index={originalIndex} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
