
"use client";

import { useState, type FormEvent, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Palette, LayoutList, Waves, Wand2, Brain } from "lucide-react";
import { processText, type AiTool, type TargetStyle, type ProcessTextOutput } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/contexts/language-context';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIToolOption {
  value: AiTool;
  labelKey: string; // Key for translation
  icon: React.ElementType;
}

interface TargetStyleOption {
  value: TargetStyle;
  labelKey: string; // Key for translation
}

export default function LiteraryAlchemistClient() {
  const { t, getLabel, language } = useLanguage(); // language dependency for memoization
  const [inputText, setInputText] = useState<string>("");
  const [selectedTool, setSelectedTool] = useState<AiTool>("style-transformer");
  const [selectedStyle, setSelectedStyle] = useState<TargetStyle | undefined>(undefined);
  const [output, setOutput] = useState<ProcessTextOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const AIToolOptions: AIToolOption[] = useMemo(() => [
    { value: "style-transformer", labelKey: "inputCard.aiTool.styleTransformer", icon: Palette },
    { value: "structure-advisor", labelKey: "inputCard.aiTool.structureAdvisor", icon: LayoutList },
    { value: "rhythm-adjuster", labelKey: "inputCard.aiTool.rhythmAdjuster", icon: Waves },
    { value: "de-ai-text", labelKey: "inputCard.aiTool.deAiText", icon: Brain },
  ], []);

  const TargetStyleOptions: TargetStyleOption[] = useMemo(() => [
    { value: "Lu Xun", labelKey: "inputCard.style.luXun" },
    { value: "Hayao Miyazaki", labelKey: "inputCard.style.hayaoMiyazaki" },
    { value: "Shakespeare", labelKey: "inputCard.style.shakespeare" },
    { value: "Edgar Allan Poe", labelKey: "inputCard.style.edgarAllanPoe" },
  ], []);
  
  // Set default style when options are available and tool is style-transformer
  useState(() => {
    if (TargetStyleOptions.length > 0) {
        setSelectedStyle(TargetStyleOptions[0].value);
    }
  });


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!inputText.trim()) {
      toast({
        title: t('toast.inputErrorTitle'),
        description: t('toast.inputErrorDescription'),
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
        title: t('toast.processingErrorTitle'),
        description: t('toast.processingErrorDescription', { error: result.error }),
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
          <p className="ml-4 text-lg text-muted-foreground">{t('outputCard.loadingText')}</p>
        </div>
      );
    }

    if (!output) {
      return (
         <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Wand2 className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">{t('outputCard.initialPlaceholderText')}</p>
          </div>
      );
    }

    const markdownContainerClasses = "min-h-[250px] text-base bg-background/70 p-3 rounded-md overflow-auto";

    switch (output.tool) {
      case "style-transformer":
        return (
          <div 
            className={markdownContainerClasses}
            aria-label={t('outputCard.styleTransformer.ariaLabel')}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{output.data.transformedText}</ReactMarkdown>
          </div>
        );
      case "structure-advisor":
        return (
          <div className="space-y-2">
            <h3 className="font-headline text-lg text-primary">{t('outputCard.structureAdvisor.title')}</h3>
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
              <h3 className="font-headline text-lg text-primary">{t('outputCard.rhythmAdjuster.adjustedTextTitle')}</h3>
               <div 
                className="min-h-[200px] text-base mt-1 bg-background/70 p-3 rounded-md overflow-auto"
                aria-label={t('outputCard.rhythmAdjuster.adjustedTextAriaLabel')}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{output.data.adjustedText}</ReactMarkdown>
              </div>
            </div>
            <div>
              <h3 className="font-headline text-lg text-primary">{t('outputCard.rhythmAdjuster.suggestionsTitle')}</h3>
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
            <h3 className="font-headline text-lg text-primary">{t('outputCard.deAiText.title')}</h3>
            <div
              className={`${markdownContainerClasses} mt-1`}
              aria-label={t('outputCard.deAiText.ariaLabel')}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{output.data.deAIText}</ReactMarkdown>
            </div>
          </div>
        );
      default:
        const exhaustiveCheck: never = output; 
        return <p>{t('outputCard.unknownOutputError', { type: (exhaustiveCheck as any)?.tool || 'unknown' })}</p>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 flex-grow">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary">{t('inputCard.title')}</CardTitle>
            <CardDescription className="text-sm">{t('inputCard.description')}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="inputText" className="text-lg font-headline">{t('inputCard.inputTextLabel')}</Label>
                <Textarea
                  id="inputText"
                  placeholder={t('inputCard.inputTextPlaceholder')}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[250px] mt-2 text-base focus:ring-accent"
                  aria-label={t('inputCard.inputTextLabel')}
                />
              </div>

              <div>
                <Label className="text-lg font-headline">{t('inputCard.selectToolLabel')}</Label>
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
                      <span className={`text-center text-sm ${selectedTool === tool.value ? 'text-primary font-medium' : ''}`}>{getLabel(tool.labelKey)}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {selectedTool === "style-transformer" && (
                <div className="transition-all duration-300 ease-in-out">
                  <Label htmlFor="targetStyle" className="text-lg font-headline">{t('inputCard.selectStyleLabel')}</Label>
                   <Select
                    value={selectedStyle}
                    onValueChange={(value) => setSelectedStyle(value as TargetStyle)}
                    required={selectedTool === "style-transformer"}
                  >
                    <SelectTrigger id="targetStyle" className="mt-2 text-base focus:ring-accent" aria-label={t('inputCard.selectStyleLabel')}>
                      <SelectValue placeholder={t('inputCard.selectStylePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {TargetStyleOptions.map(style => (
                        <SelectItem key={style.value} value={style.value} className="text-base">
                          {getLabel(style.labelKey)}
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
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('inputCard.submitButtonLoading')}
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    {t('inputCard.submitButton')}
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary">{t('outputCard.title')}</CardTitle>
            <CardDescription className="text-sm">{t('outputCard.description')}</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] prose prose-lg max-w-none prose-p:text-base prose-li:text-base">
            {renderOutput()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
