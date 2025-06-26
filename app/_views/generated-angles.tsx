import type { CreativeAngle } from "@/lib/types";
import { CreativeAngleCard } from "@/components/creative-angle-card/creative-angle-card";

interface GeneratedAnglesProps {
  angles: CreativeAngle[];
  platform: string;
  tone: string;
  onSave: (angle: CreativeAngle) => void;
  onRegenerate: (index: number) => void;
  onDiscard: (index: number) => void;
}

export function GeneratedAngles({ angles, platform, tone, onSave, onRegenerate, onDiscard }: GeneratedAnglesProps) {
  if (angles.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Generated Angles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {angles.map((angle, index) => (
          <CreativeAngleCard key={index} angle={angle} platform={platform} tone={tone} onSave={onSave} onRegenerate={onRegenerate} onDiscard={onDiscard} index={index} />
        ))}
      </div>
    </div>
  );
}
