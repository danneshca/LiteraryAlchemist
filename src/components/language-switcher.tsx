
"use client";

import { useLanguage, type SupportedLanguage } from '@/contexts/language-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as SupportedLanguage);
  };

  return (
    <div className="flex items-center space-x-2">
      <Languages className="h-5 w-5 text-primary-foreground" />
      <Label htmlFor="language-select" className="sr-only text-primary-foreground">
        {t('appLanguageLabel')}
      </Label>
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger 
          id="language-select" 
          className="w-[150px] bg-primary text-primary-foreground border-primary-foreground/50 hover:bg-primary/80 focus:ring-primary-foreground"
          aria-label={t('appLanguageLabel')}
        >
          <SelectValue placeholder={t('appLanguageLabel')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="zh-CN">{t('appLanguageZh')}</SelectItem>
          <SelectItem value="en-US">{t('appLanguageEn')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
