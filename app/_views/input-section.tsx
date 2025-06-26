import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { mPlatforms } from "@/constants/platform";
import { mTones } from "@/constants/tone";
import type { Product } from "@/lib/types";

interface InputSectionProps {
  product: Product;
  isGenerating: boolean;
  onProductNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
  onToneChange: (value: string) => void;
  onGenerate: () => void;
}

export function InputSection({ product, isGenerating, onProductNameChange, onDescriptionChange, onPlatformChange, onToneChange, onGenerate }: InputSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Creative Angles for {product.productName}</CardTitle>
        <CardDescription>Describe your product and we'll generate compelling marketing angles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Product Name</label>
          <Input placeholder="Enter your product name..." value={product.productName} onChange={(e) => onProductNameChange(e.target.value)} className="w-full" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Product Description</label>
          <Textarea placeholder="Describe your product, its key features, and benefits..." value={product.productDescription} onChange={(e) => onDescriptionChange(e.target.value)} className="min-h-[100px]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Platform</label>
            <Select value={product.platform} onValueChange={onPlatformChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {mPlatforms.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

        <Button size="lg" onClick={onGenerate} disabled={!product.productName.trim() || !product.productDescription.trim() || !product.platform || !product.tone || isGenerating} className="w-full">
          {isGenerating ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
          {isGenerating ? "Generating..." : "Generate Creative Angles"}
        </Button>
      </CardContent>
    </Card>
  );
}
