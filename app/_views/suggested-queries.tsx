import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { mSuggestedQueries } from "@/constants/suggested-queries";

interface SuggestedQueriesProps {
  onQuerySelect: (query: string) => void;
}

export function SuggestedQueries({ onQuerySelect }: SuggestedQueriesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Try These Examples</CardTitle>
        <CardDescription>Click on any example to get started quickly</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {mSuggestedQueries.map((query, index) => (
            <Button key={index} variant="outline" className="text-left h-auto p-4 justify-start" onClick={() => onQuerySelect(query)}>
              <ExternalLink className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{query}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
