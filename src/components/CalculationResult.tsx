
import React from 'react';
import { ZakatResult, formatCurrency, Currency } from '@/utils/zakatCalculations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, AlertCircle } from 'lucide-react';

interface CalculationResultProps {
  result: ZakatResult;
  currency?: Currency;
}

const CalculationResult: React.FC<CalculationResultProps> = ({
  result,
  currency = 'USD'
}) => {
  // Animation when results change
  const [animate, setAnimate] = React.useState(false);
  
  React.useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [result]);
  
  // Calculate percentage of nisab
  const nisabPercentage = Math.min(100, Math.round((result.netZakatableAssets / result.nisabThreshold) * 100));
  
  return (
    <div className={`space-y-6 ${animate ? 'section-enter' : ''}`}>
      <Card className="glass-panel overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-medium flex items-center gap-2">
            Zakat Calculation
            {result.isEligible && <Check className="h-5 w-5 text-green-500" />}
          </CardTitle>
          <CardDescription>
            Based on your wealth and liabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-muted-foreground">Nisab Threshold</span>
                <span className="font-medium">{formatCurrency(result.nisabThreshold, currency)}</span>
              </div>
              <Progress 
                value={nisabPercentage} 
                className="h-2 bg-muted" 
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span className={result.isEligible ? 'text-primary font-medium' : ''}>
                  {nisabPercentage}% of Nisab
                </span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="grid gap-4 grid-cols-2">
              <div className="bg-secondary/50 rounded-md p-3">
                <h4 className="text-xs text-muted-foreground mb-1">Total Assets</h4>
                <p className="text-lg font-medium">
                  {formatCurrency(result.totalAssets, currency)}
                </p>
              </div>
              <div className="bg-secondary/50 rounded-md p-3">
                <h4 className="text-xs text-muted-foreground mb-1">Total Liabilities</h4>
                <p className="text-lg font-medium">
                  {formatCurrency(result.totalLiabilities, currency)}
                </p>
              </div>
            </div>
            
            <div className="pt-4 pb-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Net Zakatable Assets</span>
                <span className="text-lg font-semibold">
                  {formatCurrency(result.netZakatableAssets, currency)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-primary/5 border-t">
          <div className="w-full flex justify-between items-center py-2">
            <span className="text-base font-medium">Zakat Payable</span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(result.zakatPayable, currency)}
            </span>
          </div>
        </CardFooter>
      </Card>
      
      {!result.isEligible && result.netZakatableAssets > 0 && (
        <div className="rounded-lg border bg-card p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-sm">No Zakat Due</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your net wealth of {formatCurrency(result.netZakatableAssets, currency)} is below the Nisab threshold of {formatCurrency(result.nisabThreshold, currency)}. Zakat is not obligatory, but voluntary charity (Sadaqah) is always encouraged.
            </p>
          </div>
        </div>
      )}
      
      {result.isEligible && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Breakdown by Asset Category</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.breakdown
              .filter(item => item.amount > 0) // Only show categories with values
              .map((item, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded-md bg-card border"
                >
                  <h4 className="text-sm font-medium">{item.category}</h4>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(item.amount, currency)}
                    </span>
                    <span className="text-sm font-medium">
                      {formatCurrency(item.zakatAmount, currency)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculationResult;
