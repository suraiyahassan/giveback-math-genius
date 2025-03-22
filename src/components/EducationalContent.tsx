
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartHandshake, BookOpen, Calculator, HelpCircle, CalendarClock } from 'lucide-react';

const EducationalContent: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Understanding Zakat</h2>
        <p className="text-muted-foreground">
          Zakat is one of the Five Pillars of Islam, a mandatory charitable contribution that purifies wealth and brings blessings.
        </p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-primary" />
              What is Zakat?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Zakat is an annual obligation on Muslims who possess wealth above a minimum threshold (Nisab). It is a purification of wealth, not a tax, and represents the right of the poor to a share in the wealth of the community.
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              How is it Calculated?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Zakat is typically calculated at 2.5% of eligible assets that have been held for one lunar year. The calculation applies to cash, gold, silver, investments, business assets, and receivables, minus certain liabilities.
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Who Must Pay Zakat?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Zakat is obligatory for every adult Muslim who possesses wealth above the Nisab threshold for one lunar year. The Nisab is typically calculated based on the value of gold (87.48g) or silver (612.36g).
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Who Can Receive Zakat?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The Quran (9:60) specifies eight categories of recipients: the poor, the needy, administrators of Zakat, those whose hearts are to be reconciled, those in bondage, those in debt, those in the cause of Allah, and the wayfarers.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-start gap-3">
          <CalendarClock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-sm">Zakat al-Fitr</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Note that this calculator helps with Zakat al-Mal (wealth). Zakat al-Fitr is a separate obligation due at the end of Ramadan, calculated differently as a food provision for the poor. Please consult with your local mosque for Zakat al-Fitr rates.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-muted-foreground mt-4">
        <p>
          This calculator is provided as a guide. For complex financial situations, please consult with a knowledgeable scholar.
        </p>
      </div>
    </div>
  );
};

export default EducationalContent;
