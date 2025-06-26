import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { mPlatforms } from "@/constants/platform";
import { mTones } from "@/constants/tone";

interface InputSectionProps {
  productDescription: string;
  platform: string;
  tone: string;
  isGenerating: boolean;
  onDescriptionChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
  onToneChange: (value: string) => void;
  onGenerate: () => void;
}

export function InputSection({ productDescription, platform, tone, isGenerating, onDescriptionChange, onPlatformChange, onToneChange, onGenerate }: InputSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2 text-xl">
          <Sparkles className="h-6 w-6 text-purple-600" />
          Generate Creative Angles
        </CardTitle>
        <CardDescription>Describe your product and we'll generate compelling marketing angles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Product Description</label>
          <Textarea
            placeholder="Describe your product, its key features, and benefits..."
            value={productDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Platform</label>
            <Select value={platform} onValueChange={onPlatformChange}>
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
            <Select value={tone} onValueChange={onToneChange}>
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

        <Button size="lg" onClick={onGenerate} disabled={!productDescription.trim() || !platform || !tone || isGenerating} className="w-full">
          {isGenerating ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
          {isGenerating ? "Generating..." : "Generate Creative Angles"}
        </Button>
      </CardContent>
    </Card>
  );
}
