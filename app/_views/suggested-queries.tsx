import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mSuggestedQueries, type SuggestedQuery } from "@/constants/suggested-queries";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface SuggestedQueriesProps {
  onQuerySelect: (query: SuggestedQuery) => void;
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
        <CardContent className="w-full flex flex-col items-start gap-4">
          {mSuggestedQueries.map((query, index) => (
            <Button key={index} variant="outline" className="h-auto p-4 text-left w-full justify-start" onClick={() => onQuerySelect(query)}>
              <p className="font-semibold">{query.productName}</p>
              <p className="text-sm text-gray-600">{query.productDescription}</p>
            </Button>
          ))}
        </CardContent>
      </div>
    </Card>
  );
}
