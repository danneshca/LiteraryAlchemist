
"use client";

import LiteraryAlchemistClient from '@/components/literary-alchemist-client';
import LanguageSwitcher from '@/components/language-switcher';
import { useLanguage } from '@/contexts/language-context';
import { BookOpenText } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-6 bg-primary shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <BookOpenText className="h-10 w-10 text-primary-foreground mr-3" />
            <h1 className="font-headline text-4xl text-primary-foreground">
              {t('header.title')}
            </h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="flex-grow">
        <LiteraryAlchemistClient />
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border">
        <p dangerouslySetInnerHTML={{ __html: t('footer.copyright', { year: new Date().getFullYear() }) }} />
      </footer>
    </div>
  );
}
