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
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <Card>
      <CardHeader className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <CardTitle className="flex items-center justify-between gap-2">Try These Examples</CardTitle>
          <CardDescription>Click on any example to get started quickly</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen((prev) => !prev)}>
          <ChevronDown size={18} className={cn("transition-transform duration-300 cursor-pointer", isOpen ? "rotate-180" : "rotate-0")} />
        </Button>
      </CardHeader>
      <div className={cn("overflow-y-auto transition-all duration-300 ease-in-out", isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
        <CardContent className="w-full flex flex-col items-start gap-4">
          {mSuggestedQueries.map((query, index) => {
            const isExpanded = expandedItems.has(index);
            return (
              <Button key={index} variant="outline" className="h-auto p-4 text-left w-full flex flex-col items-start justify-start whitespace-normal" onClick={() => onQuerySelect(query)}>
                <p className="font-semibold">{query.productName}</p>
                <div className="w-full">
                  <p className={cn("text-sm text-gray-600 break-words leading-relaxed transition-all duration-300 ease-in-out", isExpanded ? "line-clamp-none" : "line-clamp-2")}>{query.productDescription}</p>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(index);
                    }}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </span>
                </div>
              </Button>
            );
          })}
        </CardContent>
      </div>
    </Card>
  );
}
