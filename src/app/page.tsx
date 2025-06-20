import LiteraryAlchemistClient from '@/components/literary-alchemist-client';
import { BookOpenText } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-6 bg-primary shadow-md">
        <div className="container mx-auto px-4 flex items-center">
          <BookOpenText className="h-10 w-10 text-primary-foreground mr-3" />
          <h1 className="font-headline text-4xl text-primary-foreground">
            文学炼金术士
          </h1>
        </div>
      </header>
      <main className="flex-grow">
        <LiteraryAlchemistClient />
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t border-border">
        <p>&copy; {new Date().getFullYear()} 文学炼金术士. All rights reserved.</p>
      </footer>
    </div>
  );
}
