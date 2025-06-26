import { Button } from "@/components/ui/button";
import { Image, XIcon } from "lucide-react";
import type { CreativeAngle } from "@/lib/types";

interface SavedAngleCardProps {
  angle: CreativeAngle;
  onRemove: (id: string) => void;
}

export function SavedAngleCard({ angle, onRemove }: SavedAngleCardProps) {
  return (
    <div className="group flex items-center justify-center gap-4 w-full border border-gray-200 rounded-lg p-3 relative">
      <Button size="icon" variant="ghost" onClick={() => onRemove(angle.id!)} className="absolute top-2 right-2">
        <XIcon className="h-6 w-6 text-gray-400" />
      </Button>
      <div className="w-48 h-44 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
        {angle.thumbnail ? (
          <img src={angle.thumbnail} alt={angle.headline} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="text-center text-gray-500">
            <Image className="mx-auto h-16 w-16 mb-2 text-gray-300" />
            <p className="text-sm">No image yet</p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-px flex-1">
        <h3 className="text-sm text-gray-600">
          {angle.product.productName} • {angle.product.platform}
        </h3>
        <h4 className="text-lg font-medium line-clamp-2">{angle.headline}</h4>
        <p className="text-sm text-gray-600 line-clamp-2">{angle.hook}</p>
        <p className="text-sm text-gray-600 line-clamp-2 mt-2">{angle.insight}</p>
        <p className="mt-2.5 text-primary font-medium tracking-wider">{angle.cta}</p>
      </div>
    </div>
  );
}
