
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateGoldValue, Currency, formatCurrency, GoldPurity, GOLD_PURITY_FACTORS } from '@/utils/zakatCalculations';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface GoldEntry {
  id: string;
  weight: number;
  purity: GoldPurity;
}

interface MetalInputProps {
  type: 'gold' | 'silver';
  value: number;
  onChange: (value: number) => void;
  currency: Currency;
}

const MetalInput: React.FC<MetalInputProps> = ({
  type,
  value,
  onChange,
  currency
}) => {
  const [rate, setRate] = useState<number>(type === 'gold' ? 62.5 : 0.78); // Default values
  
  // For silver
  const [weight, setWeight] = useState<number>(0);
  
  // For gold
  const [goldEntries, setGoldEntries] = useState<GoldEntry[]>([
    { id: '1', weight: 0, purity: '24k' }
  ]);

  useEffect(() => {
    if (type === 'gold') {
      // Calculate total gold value from all entries
      const calculatedValue = goldEntries.reduce((total, entry) => {
        return total + calculateGoldValue(entry.weight, rate, entry.purity);
      }, 0);
      onChange(calculatedValue);
    } else {
      // Silver doesn't need purity calculation
      const calculatedValue = weight * rate;
      onChange(calculatedValue);
    }
  }, [weight, goldEntries, rate, type, onChange]);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/[^0-9.]/g, '');
    const parts = cleanValue.split('.');
    const sanitizedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    const numericValue = sanitizedValue === '' ? 0 : parseFloat(sanitizedValue);
    setWeight(numericValue);
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/[^0-9.]/g, '');
    const parts = cleanValue.split('.');
    const sanitizedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    const numericValue = sanitizedValue === '' ? 0 : parseFloat(sanitizedValue);
    setRate(numericValue);
  };

  const handleGoldWeightChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/[^0-9.]/g, '');
    const parts = cleanValue.split('.');
    const sanitizedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    const numericValue = sanitizedValue === '' ? 0 : parseFloat(sanitizedValue);
    
    setGoldEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === id ? { ...entry, weight: numericValue } : entry
      )
    );
  };

  const handleGoldPurityChange = (id: string, newPurity: GoldPurity) => {
    setGoldEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === id ? { ...entry, purity: newPurity } : entry
      )
    );
  };

  const addGoldEntry = () => {
    const newId = String(Date.now());
    setGoldEntries(prev => [...prev, { id: newId, weight: 0, purity: '24k' }]);
  };

  const removeGoldEntry = (id: string) => {
    if (goldEntries.length > 1) {
      setGoldEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  // Calculate individual values for each gold entry
  const getEntryValue = (entry: GoldEntry) => {
    return calculateGoldValue(entry.weight, rate, entry.purity);
  };

  return (
    <Card className="p-4">
      <CardContent className="p-0 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            {type === 'gold' ? 'Gold Value' : 'Silver Value'}: {formatCurrency(value, currency)}
          </Label>
        </div>
        
        {type === 'silver' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="silver-weight" className="text-xs">
                Weight (grams)
              </Label>
              <Input
                id="silver-weight"
                type="text"
                value={weight === 0 ? '' : weight.toString()}
                onChange={handleWeightChange}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="silver-rate" className="text-xs">
                Rate per gram ({currency})
              </Label>
              <Input
                id="silver-rate"
                type="text"
                value={rate === 0 ? '' : rate.toString()}
                onChange={handleRateChange}
                placeholder="0.00"
              />
            </div>
          </div>
        )}
        
        {type === 'gold' && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="gold-rate" className="text-xs">
                  Rate per gram ({currency})
                </Label>
              </div>
              <Input
                id="gold-rate"
                type="text"
                value={rate === 0 ? '' : rate.toString()}
                onChange={handleRateChange}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-4">
              {goldEntries.map((entry, index) => (
                <div key={entry.id} className="border rounded-md p-3 space-y-3 bg-card/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">
                      Entry #{index + 1} - {formatCurrency(getEntryValue(entry), currency)}
                    </Label>
                    {goldEntries.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-destructive"
                        onClick={() => removeGoldEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`gold-weight-${entry.id}`} className="text-xs">
                        Weight (grams)
                      </Label>
                      <Input
                        id={`gold-weight-${entry.id}`}
                        type="text"
                        value={entry.weight === 0 ? '' : entry.weight.toString()}
                        onChange={(e) => handleGoldWeightChange(entry.id, e)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`gold-purity-${entry.id}`} className="text-xs">
                        Purity
                      </Label>
                      <Select 
                        value={entry.purity} 
                        onValueChange={(value) => handleGoldPurityChange(entry.id, value as GoldPurity)}
                      >
                        <SelectTrigger id={`gold-purity-${entry.id}`}>
                          <SelectValue placeholder="Select purity" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(GOLD_PURITY_FACTORS).map((p) => (
                            <SelectItem key={p} value={p}>
                              {p} ({Math.round(GOLD_PURITY_FACTORS[p as GoldPurity] * 100)}% pure)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2 flex items-center gap-2"
                onClick={addGoldEntry}
              >
                <Plus className="h-4 w-4" />
                <span>Add Another Gold Entry</span>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MetalInput;
