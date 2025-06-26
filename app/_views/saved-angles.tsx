import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { CreativeAngle } from "@/lib/types";
import { SavedAngleCard } from "@/components/saved-angle-card/saved-angle-card";

interface SavedAnglesProps {
  angles: CreativeAngle[];
  onRemove: (id: string) => void;
  onExport: () => void;
}

export function SavedAngles({ angles, onRemove, onExport }: SavedAnglesProps) {
  return (
    <Card className="sticky top-4 h-full max-h-screen overflow-y-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Saved Angles</CardTitle>
          <Button size="sm" variant="outline" disabled={angles.length === 0} onClick={onExport}>
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </div>
        <CardDescription>{angles.length} saved</CardDescription>
      </CardHeader>
      <CardContent>
        {angles.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No saved angles yet. Generate some angles and save your favorites!</p>
        ) : (
          <div className="space-y-3">
            {angles.map((angle) => (
              <SavedAngleCard key={angle.id} angle={angle} onRemove={onRemove} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
