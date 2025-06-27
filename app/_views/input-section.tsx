import { BugIcon, ChevronDownIcon, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

import { mPlatforms } from "@/constants/platform";
import { mTones } from "@/constants/tone";
import type { Product } from "@/lib/types";
import { cn, hasUrl } from "@/lib/utils";

interface InputSectionProps {
  product: Product;
  isGenerating: boolean;
  generateThumbnail: boolean;
  onProductNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPlatformChange: (platforms: string[]) => void;
  onToneChange: (value: string) => void;
  onGenerate: () => void;
  onGenerateThumbnailChange: (value: boolean) => void;
}

export function InputSection({ product, isGenerating, generateThumbnail, onProductNameChange, onDescriptionChange, onPlatformChange, onToneChange, onGenerate, onGenerateThumbnailChange }: InputSectionProps) {
  const containsUrl = hasUrl(product.productDescription);

  const handlePlatformToggle = (platformValue: string, checked: boolean) => {
    if (checked) {
      onPlatformChange([...product.platform, platformValue]);
    } else {
      onPlatformChange(product.platform.filter((p) => p !== platformValue));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex flex-col gap-2">
          <CardTitle>Creative Angles</CardTitle>
          <CardDescription>Describe your product and we'll generate compelling marketing angles</CardDescription>
        </div>
        <BugIcon className={cn("w-7 h-7 flex-shrink-0", containsUrl ? "text-green-500" : "text-gray-500")} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Product Name</label>
          <Input placeholder="Enter your product name..." value={product.productName} onChange={(e) => onProductNameChange(e.target.value)} className="w-full" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Product Description (supports URLs)</label>
          <Textarea placeholder="Describe your product, its key features, and benefits..." value={product.productDescription} onChange={(e) => onDescriptionChange(e.target.value)} className="min-h-[100px]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Platforms</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {product.platform.length > 0 ? `${product.platform.length} platform${product.platform.length > 1 ? "s" : ""} selected` : "Select Platforms"}
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-3 max-h-48 overflow-y-auto space-y-2">
                {mPlatforms.map((platform) => (
                  <div key={platform.value} className="flex items-center space-x-2">
                    <Checkbox id={platform.value} checked={product.platform.includes(platform.value)} onCheckedChange={(checked) => handlePlatformToggle(platform.value, checked as boolean)} />
                    <label htmlFor={platform.value} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {platform.label}
                    </label>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Tone</label>
            <Select value={product.tone} onValueChange={onToneChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {mTones.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <div className="flex items-center flex-shrink-0 space-x-2 border border-gray-200 rounded-md p-2 w-full md:w-auto">
            <Switch id="generate-thumbnail" checked={generateThumbnail} onCheckedChange={onGenerateThumbnailChange} />
            <label htmlFor="generate-thumbnail" className={cn("text-sm font-medium text-gray-700", generateThumbnail ? "text-blue-500" : null)}>
              First Angle Thumbnail
            </label>
          </div>
          <Button size="lg" onClick={onGenerate} disabled={!product.productName.trim() || !product.productDescription.trim() || product.platform.length === 0 || !product.tone || isGenerating} className="w-full">
            {isGenerating ? <Loader2 className="h-7 w-7 animate-spin" /> : <Sparkles className="h-7 w-7" />}
            {isGenerating ? "Generating..." : "Generate Creative Angles"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
