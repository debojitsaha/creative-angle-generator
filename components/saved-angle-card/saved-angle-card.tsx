import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { CreativeAngle } from "@/lib/types";

interface SavedAngleCardProps {
  angle: CreativeAngle;
  onRemove: (id: string) => void;
}

export function SavedAngleCard({ angle, onRemove }: SavedAngleCardProps) {
  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium line-clamp-2">{angle.headline}</h4>
        <Button size="sm" variant="ghost" onClick={() => onRemove(angle.id!)} className="h-6 w-6 p-0 ml-2 flex-shrink-0">
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      <p className="text-xs text-gray-600 line-clamp-2">{angle.hook}</p>
      <p className="text-xs font-medium text-purple-600 mt-1">{angle.cta}</p>
    </div>
  );
}
