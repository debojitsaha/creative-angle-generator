import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Save, Trash2 } from "lucide-react";
import type { CreativeAngle } from "@/lib/types";
import { mPlatforms } from "@/constants/platform";
import { mTones } from "@/constants/tone";

interface CreativeAngleCardProps {
  angle: CreativeAngle;
  platform: string;
  tone: string;
  onSave: (angle: CreativeAngle) => void;
  onRegenerate: (index: number) => void;
  onDiscard: (index: number) => void;
  index: number;
}

export function CreativeAngleCard({ angle, platform, tone, onSave, onRegenerate, onDiscard, index }: CreativeAngleCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className="mb-2">
            {mPlatforms.find((p) => p.value === platform)?.label}
          </Badge>
          <Badge variant="outline">{mTones.find((t) => t.value === tone)?.label}</Badge>
        </div>
        <CardTitle className="text-lg leading-tight">{angle.headline}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Hook:</p>
          <p className="text-sm text-gray-600">{angle.hook}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Subheading:</p>
          <p className="text-sm text-gray-600">{angle.subheading}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">CTA:</p>
          <p className="text-sm text-gray-600 font-medium">{angle.cta}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Insight:</p>
          <p className="text-sm text-gray-500 italic">{angle.insight}</p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={() => onSave(angle)} className="flex-1">
            <Save className="mr-1 h-3 w-3" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={() => onRegenerate(index)}>
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDiscard(index)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
