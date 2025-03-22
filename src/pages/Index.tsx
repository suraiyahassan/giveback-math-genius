
import React from 'react';
import Header from '@/components/Header';
import ZakatCalculator from '@/components/ZakatCalculator';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main>
        <ZakatCalculator />
      </main>
    </div>
  );
};

export default Index;
