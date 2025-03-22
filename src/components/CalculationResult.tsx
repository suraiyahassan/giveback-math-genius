
import React from 'react';
import { ZakatResult, formatCurrency, Currency } from '@/utils/zakatCalculations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

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
  // Show/hide detailed breakdown
  const [showDetailedBreakdown, setShowDetailedBreakdown] = React.useState(false);
  
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Asset Breakdown</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
              className="flex items-center gap-1"
            >
              {showDetailedBreakdown ? (
                <>
                  <span>Simple View</span>
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>Detailed View</span>
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          
          {!showDetailedBreakdown ? (
            // Simple breakdown view
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
          ) : (
            // Detailed breakdown view
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Zakat Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.detailedBreakdown?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell>
                        {item.details || (
                          item.category === 'Gold' && item.entries ? (
                            <div className="text-xs text-muted-foreground space-y-1">
                              {item.entries.map((entry, i) => (
                                <div key={i}>
                                  Entry #{i+1}: {entry.weight}g of {entry.purity} 
                                  at {formatCurrency(entry.rate, currency)}/g
                                </div>
                              ))}
                            </div>
                          ) : null
                        )}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(item.amount, currency)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.zakatAmount, currency)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-primary/5">
                    <TableCell colSpan={2} className="font-medium">Total</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(result.totalAssets, currency)}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(result.zakatPayable, currency)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      )}
      
      {result.isEligible && (
        <div className="mt-6 p-4 bg-primary/10 rounded-lg border">
          <h3 className="text-base font-medium mb-2">Zakat Payment Report</h3>
          <p className="text-sm mb-3">
            The total Zakat payable is {formatCurrency(result.zakatPayable, currency)}, 
            which is 2.5% of your net zakatable assets {formatCurrency(result.netZakatableAssets, currency)}.
          </p>
          
          <div className="text-sm space-y-2">
            <p className="font-medium">Breakdown by asset:</p>
            {result.detailedBreakdown?.filter(item => item.amount > 0).map((item, index) => (
              <div key={index} className="pl-2 border-l-2 border-primary/30">
                <p><span className="font-medium">{item.category}:</span> {formatCurrency(item.zakatAmount, currency)}</p>
                
                {item.category === 'Gold' && item.entries && (
                  <div className="pl-3 mt-1 text-xs text-muted-foreground space-y-1">
                    {item.entries.map((entry, i) => (
                      <div key={i}>
                        Entry #{i+1} ({entry.weight}g of {entry.purity}): {formatCurrency(entry.zakatAmount, currency)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculationResult;
