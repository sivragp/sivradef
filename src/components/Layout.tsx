import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CustomCursor } from './CustomCursor';
import { CookieBanner } from './CookieBanner';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-sm focus:bg-accent focus:text-black focus:font-bold"
      >
        Salta al contenuto
      </a>
      <CustomCursor />
      <Navbar />
      <main id="main-content" className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
