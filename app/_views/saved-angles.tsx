import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, LayoutDashboard } from "lucide-react";
import type { CreativeAngle } from "@/lib/types";
import { SavedAngleCard } from "@/components/saved-angle-card/saved-angle-card";

interface SavedAnglesProps {
  angles: CreativeAngle[];
  onShiftToDashboard: () => void;
  onRemove: (id: string) => void;
  onExport: () => void;
}

export function SavedAngles({ angles, onRemove, onExport, onShiftToDashboard }: SavedAnglesProps) {
  return (
    <Card className="sticky top-4 h-full max-h-screen overflow-y-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Saved Angles</CardTitle>
          <Button size="sm" variant="outline" disabled={angles.length === 0} onClick={onExport} className="ml-auto">
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
          <Button size="sm" variant="gradient" disabled={angles.length === 0} onClick={onShiftToDashboard}>
            <LayoutDashboard className="h-3 w-3" />
            View in Grid
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
