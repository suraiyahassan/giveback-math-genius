
import React from 'react';
import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [mounted, setMounted] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
    // Check for system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };
  
  if (!mounted) return null;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-md border-b border-border py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {toggleSidebar && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          <div className="flex items-center">
            <h1 className="text-lg font-medium bg-gradient-to-r from-primary to-zakat-dark bg-clip-text text-transparent">
              Zakat <span className="font-light">Calculator</span>
            </h1>
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/" className="text-sm font-medium hover:text-primary transition-colors">Calculator</a>
          <a href="/learn" className="text-sm font-medium hover:text-primary transition-colors">Learn</a>
          <a href="/resources" className="text-sm font-medium hover:text-primary transition-colors">Resources</a>
        </nav>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="ml-2">
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
