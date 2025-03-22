
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AssetValues, 
  Liabilities, 
  calculateZakat, 
  ZakatResult, 
  DEFAULT_METAL_PRICES,
  Currency,
  GoldEntry
} from '@/utils/zakatCalculations';
import AssetInput from './AssetInput';
import MetalInput from './MetalInput';
import CalculationResult from './CalculationResult';
import EducationalContent from './EducationalContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Calculator, BookOpen } from 'lucide-react';

const ZakatCalculator: React.FC = () => {
  // State for assets
  const [assets, setAssets] = useState<AssetValues>({
    cash: 0,
    gold: 0,
    silver: 0,
    stocks: 0,
    cryptocurrency: 0,
    businessAssets: 0,
    receivables: 0,
    otherInvestments: 0
  });
  
  // State for liabilities
  const [liabilities, setLiabilities] = useState<Liabilities>({
    debts: 0,
    expenses: 0
  });
  
  // State for calculation results
  const [result, setResult] = useState<ZakatResult | null>(null);
  
  // State for currency
  const [currency, setCurrency] = useState<Currency>('USD');
  
  // State for nisab metal preference
  const [preferredMetal, setPreferredMetal] = useState<'gold' | 'silver'>('silver');
  
  // State for gold entries (needed for detailed report)
  const [goldEntries, setGoldEntries] = useState<GoldEntry[]>([
    { id: '1', weight: 0, purity: '24k', rate: 62.5 }
  ]);
  
  // State for silver details (needed for detailed report)
  const [silverWeight, setSilverWeight] = useState<number>(0);
  const [silverRate, setSilverRate] = useState<number>(0.78);
  
  // Calculate zakat when inputs change
  useEffect(() => {
    const zakatResult = calculateZakat(
      assets, 
      liabilities, 
      DEFAULT_METAL_PRICES, 
      preferredMetal,
      goldEntries,
      silverWeight,
      silverRate
    );
    setResult(zakatResult);
  }, [assets, liabilities, preferredMetal, goldEntries, silverWeight, silverRate]);
  
  // Handle asset change
  const handleAssetChange = (key: keyof AssetValues, value: number) => {
    setAssets(prev => ({ ...prev, [key]: value }));
  };
  
  // Handle liability change
  const handleLiabilityChange = (key: keyof Liabilities, value: number) => {
    setLiabilities(prev => ({ ...prev, [key]: value }));
  };
  
  // Reset all values
  const handleReset = () => {
    setAssets({
      cash: 0,
      gold: 0,
      silver: 0,
      stocks: 0,
      cryptocurrency: 0,
      businessAssets: 0,
      receivables: 0,
      otherInvestments: 0
    });
    
    setLiabilities({
      debts: 0,
      expenses: 0
    });
    
    setGoldEntries([
      { id: '1', weight: 0, purity: '24k', rate: 62.5 }
    ]);
    
    setSilverWeight(0);
    setSilverRate(0.78);
  };
  
  // Handle metal input changes
  const handleGoldChange = (value: number, entries: GoldEntry[]) => {
    handleAssetChange('gold', value);
    setGoldEntries(entries);
  };
  
  const handleSilverChange = (value: number, weight: number, rate: number) => {
    handleAssetChange('silver', value);
    setSilverWeight(weight);
    setSilverRate(rate);
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-8 max-w-2xl mx-auto lg:mx-0">
            <h1 className="text-3xl font-medium tracking-tight mb-3 bg-gradient-to-r from-primary to-zakat-dark bg-clip-text text-transparent">
              Calculate Your Zakat
            </h1>
            <p className="text-muted-foreground">
              Enter your assets and liabilities to calculate your Zakat obligation according to Islamic principles. 
              This calculator uses the Nisab threshold based on the current value of silver or gold.
            </p>
          </div>
          
          <Tabs defaultValue="calculator" className="max-w-2xl mx-auto lg:mx-0">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="calculator" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span>Calculator</span>
              </TabsTrigger>
              <TabsTrigger value="learn" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Learn About Zakat</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator" className="space-y-8 animate-fade-in">
              <Card className="glass-panel">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Assets</CardTitle>
                      <CardDescription>Enter all wealth that you have possessed for one lunar year</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="AUD">AUD ($)</SelectItem>
                          <SelectItem value="CAD">CAD ($)</SelectItem>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <AssetInput
                      id="cash"
                      label="Cash & Bank Balances"
                      value={assets.cash}
                      onChange={(value) => handleAssetChange('cash', value)}
                      currency={currency}
                    />
                    
                    {/* Gold Input with Metal Component */}
                    <div className="space-y-2">
                      <Label htmlFor="gold" className="text-sm font-medium">Gold</Label>
                      <MetalInput
                        type="gold"
                        value={assets.gold}
                        onChange={(value, entries) => handleGoldChange(value, entries as GoldEntry[])}
                        currency={currency}
                      />
                    </div>
                    
                    {/* Silver Input with Metal Component */}
                    <div className="space-y-2">
                      <Label htmlFor="silver" className="text-sm font-medium">Silver</Label>
                      <MetalInput
                        type="silver"
                        value={assets.silver}
                        onChange={(value, weight, rate) => handleSilverChange(value, weight as number, rate as number)}
                        currency={currency}
                      />
                    </div>
                    
                    <AssetInput
                      id="stocks"
                      label="Stocks & Shares"
                      value={assets.stocks}
                      onChange={(value) => handleAssetChange('stocks', value)}
                      description="Current market value"
                      currency={currency}
                    />
                    <AssetInput
                      id="cryptocurrency"
                      label="Cryptocurrency"
                      value={assets.cryptocurrency}
                      onChange={(value) => handleAssetChange('cryptocurrency', value)}
                      description="Current market value"
                      currency={currency}
                    />
                    <AssetInput
                      id="businessAssets"
                      label="Business Assets"
                      value={assets.businessAssets}
                      onChange={(value) => handleAssetChange('businessAssets', value)}
                      description="Merchandise, inventory, etc."
                      currency={currency}
                    />
                    <AssetInput
                      id="receivables"
                      label="Receivables"
                      value={assets.receivables}
                      onChange={(value) => handleAssetChange('receivables', value)}
                      description="Money owed to you that you expect to receive"
                      currency={currency}
                    />
                    <AssetInput
                      id="otherInvestments"
                      label="Other Investments"
                      value={assets.otherInvestments}
                      onChange={(value) => handleAssetChange('otherInvestments', value)}
                      description="Other zakatable investments"
                      currency={currency}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle>Liabilities</CardTitle>
                  <CardDescription>
                    Enter your immediate debts and expenses due
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <AssetInput
                      id="debts"
                      label="Debts Due"
                      value={liabilities.debts}
                      onChange={(value) => handleLiabilityChange('debts', value)}
                      description="Immediate debts you need to pay"
                      currency={currency}
                    />
                    <AssetInput
                      id="expenses"
                      label="Due Expenses"
                      value={liabilities.expenses}
                      onChange={(value) => handleLiabilityChange('expenses', value)}
                      description="Immediate expenses, bills, etc."
                      currency={currency}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm">Nisab based on:</div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={preferredMetal === 'silver' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreferredMetal('silver')}
                      className="h-8 px-3"
                    >
                      Silver
                    </Button>
                    <Button
                      variant={preferredMetal === 'gold' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreferredMetal('gold')}
                      className="h-8 px-3"
                    >
                      Gold
                    </Button>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset</span>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="learn" className="animate-fade-in">
              <EducationalContent />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:sticky lg:top-24 self-start">
          {result && (
            <CalculationResult result={result} currency={currency} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ZakatCalculator;
