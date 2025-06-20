
// src/components/literary-alchemist-client.tsx
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Palette, LayoutList, Waves, Wand2, Brain } from "lucide-react";
import { processText, type AiTool, type TargetStyle, type ProcessTextOutput } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";

const AIToolOptions: { value: AiTool; label: string; icon: React.ElementType }[] = [
  { value: "style-transformer", label: "风格转换", icon: Palette },
  { value: "structure-advisor", label: "结构建议", icon: LayoutList },
  { value: "rhythm-adjuster", label: "节奏调整", icon: Waves },
  { value: "de-ai-text", label: "文字去AI化", icon: Brain },
];

const TargetStyleOptions: { value: TargetStyle; label: string }[] = [
  { value: "Lu Xun", label: "鲁迅风格" },
  { value: "Hayao Miyazaki", label: "宫崎骏风格" },
  { value: "Shakespeare", label: "莎士比亚风格" },
  { value: "Edgar Allan Poe", label: "爱伦坡风格" },
];

export default function LiteraryAlchemistClient() {
  const [inputText, setInputText] = useState<string>("");
  const [selectedTool, setSelectedTool] = useState<AiTool>("style-transformer");
  const [selectedStyle, setSelectedStyle] = useState<TargetStyle | undefined>(TargetStyleOptions[0].value);
  const [output, setOutput] = useState<ProcessTextOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!inputText.trim()) {
      toast({
        title: "输入错误",
        description: "请输入需要处理的文本。",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setOutput(null);

    const result = await processText({
      text: inputText,
      tool: selectedTool,
      targetStyle: selectedTool === "style-transformer" ? selectedStyle : undefined,
    });

    setIsLoading(false);

    if ('error' in result) {
      toast({
        title: "处理失败",
        description: result.error,
        variant: "destructive",
      });
    } else {
      setOutput(result);
    }
  };

  const renderOutput = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">炼金中，请稍候...</p>
        </div>
      );
    }

    if (!output) {
      return (
         <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Wand2 className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">您的文学炼金成果将在此展现。</p>
          </div>
      );
    }

    switch (output.tool) {
      case "style-transformer":
        return (
          <Textarea
            value={output.data.transformedText}
            readOnly
            className="min-h-[200px] text-base bg-background/70"
            aria-label="转换后的文本"
          />
        );
      case "structure-advisor":
        return (
          <div className="space-y-2">
            <h3 className="font-headline text-lg text-primary">结构建议:</h3>
            <ul className="list-disc list-inside space-y-1 text-base">
              {output.data.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        );
      case "rhythm-adjuster":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-headline text-lg text-primary">调整后的文本:</h3>
              <Textarea
                value={output.data.adjustedText}
                readOnly
                className="min-h-[150px] text-base mt-1 bg-background/70"
                aria-label="调整节奏后的文本"
              />
            </div>
            <div>
              <h3 className="font-headline text-lg text-primary">节奏建议:</h3>
              <ul className="list-disc list-inside space-y-1 text-base mt-1">
                {output.data.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      case "de-ai-text":
        return (
          <div>
            <h3 className="font-headline text-lg text-primary">去AI化文本:</h3>
            <Textarea
              value={output.data.deAIText}
              readOnly
              className="min-h-[200px] text-base mt-1 bg-background/70"
              aria-label="去AI化后的文本"
            />
          </div>
        );
      default:
        // This case should ideally not be reached if types are correct
        const exhaustiveCheck: never = output; 
        return <p>未知输出类型: {exhaustiveCheck}</p>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 flex-grow">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary">输入与选项</CardTitle>
            <CardDescription>在此处粘贴您的文本，并选择您希望的炼金术。</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="inputText" className="text-lg font-headline">您的文本</Label>
                <Textarea
                  id="inputText"
                  placeholder="在此输入您的写作片段..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] mt-2 text-base focus:ring-accent"
                  aria-label="文本输入区域"
                />
              </div>

              <div>
                <Label className="text-lg font-headline">选择功能</Label>
                <RadioGroup
                  value={selectedTool}
                  onValueChange={(value) => {
                    const newTool = value as AiTool;
                    setSelectedTool(newTool);
                    if (newTool !== "style-transformer") {
                      setSelectedStyle(undefined);
                    } else if (!selectedStyle && TargetStyleOptions.length > 0) {
                      setSelectedStyle(TargetStyleOptions[0].value);
                    }
                  }}
                  className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {AIToolOptions.map(tool => (
                    <Label
                      key={tool.value}
                      htmlFor={tool.value}
                      className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer transition-all hover:shadow-md ${selectedTool === tool.value ? 'border-primary ring-2 ring-primary bg-primary/10' : 'border-border'}`}
                    >
                       <RadioGroupItem value={tool.value} id={tool.value} className="sr-only" />
                      <tool.icon className={`h-8 w-8 mb-2 ${selectedTool === tool.value ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`text-center text-sm ${selectedTool === tool.value ? 'text-primary font-medium' : ''}`}>{tool.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {selectedTool === "style-transformer" && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label htmlFor="targetStyle" className="text-lg font-headline">选择风格</Label>
                   <Select
                    value={selectedStyle}
                    onValueChange={(value) => setSelectedStyle(value as TargetStyle)}
                    required={selectedTool === "style-transformer"}
                  >
                    <SelectTrigger id="targetStyle" className="mt-2 text-base focus:ring-accent" aria-label="选择目标风格">
                      <SelectValue placeholder="选择一种风格" />
                    </SelectTrigger>
                    <SelectContent>
                      {TargetStyleOptions.map(style => (
                        <SelectItem key={style.value} value={style.value} className="text-base">
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 bg-accent hover:bg-accent/90">
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-5 w-5" />
                )}
                开始炼制
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary">炼金成果</CardTitle>
            <CardDescription>AI增强后的文本或建议将在此显示。</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] prose prose-lg max-w-none prose-p:text-base prose-li:text-base">
            {renderOutput()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
