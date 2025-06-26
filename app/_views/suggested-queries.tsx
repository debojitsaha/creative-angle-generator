import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mSuggestedQueries } from "@/constants/suggested-queries";
import { cn } from "@/lib/utils";

interface SuggestedQueriesProps {
  onQuerySelect: (query: string) => void;
}

export function SuggestedQueries({ onQuerySelect }: SuggestedQueriesProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card>
      <CardHeader className="w-full flex flex-row items-center justify-between cursor-pointer" onClick={() => setIsOpen((prev) => !prev)}>
        <div className="flex flex-col gap-1.5">
          <CardTitle className="flex items-center justify-between gap-2">Try These Examples</CardTitle>
          <CardDescription>Click on any example to get started quickly</CardDescription>
        </div>
        <ChevronDown size={18} className={cn("transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0")} />
      </CardHeader>
      <div className={cn("overflow-y-auto transition-all duration-300 ease-in-out", isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-3">
            {mSuggestedQueries.map((query, index) => (
              <Button key={index} variant="outline" className="text-left h-auto p-4 justify-start whitespace-normal" onClick={() => onQuerySelect(query)}>
                <ExternalLink className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="text-sm break-words leading-relaxed">{query}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
