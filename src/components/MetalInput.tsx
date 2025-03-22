
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateGoldValue, Currency, formatCurrency, GoldPurity, GOLD_PURITY_FACTORS } from '@/utils/zakatCalculations';

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
  const [weight, setWeight] = useState<number>(0);
  const [rate, setRate] = useState<number>(type === 'gold' ? 62.5 : 0.78); // Default values
  const [purity, setPurity] = useState<GoldPurity>('24k');

  useEffect(() => {
    if (type === 'gold') {
      const calculatedValue = calculateGoldValue(weight, rate, purity);
      onChange(calculatedValue);
    } else {
      // Silver doesn't need purity calculation
      const calculatedValue = weight * rate;
      onChange(calculatedValue);
    }
  }, [weight, rate, purity, type, onChange]);

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

  const handlePurityChange = (newPurity: string) => {
    setPurity(newPurity as GoldPurity);
  };

  return (
    <Card className="p-4">
      <CardContent className="p-0 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            {type === 'gold' ? 'Gold Value' : 'Silver Value'}: {formatCurrency(value, currency)}
          </Label>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${type}-weight`} className="text-xs">
              Weight (grams)
            </Label>
            <Input
              id={`${type}-weight`}
              type="text"
              value={weight === 0 ? '' : weight.toString()}
              onChange={handleWeightChange}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`${type}-rate`} className="text-xs">
              Rate per gram ({currency})
            </Label>
            <Input
              id={`${type}-rate`}
              type="text"
              value={rate === 0 ? '' : rate.toString()}
              onChange={handleRateChange}
              placeholder="0.00"
            />
          </div>
        </div>
        
        {type === 'gold' && (
          <div className="space-y-2">
            <Label htmlFor="gold-purity" className="text-xs">
              Purity
            </Label>
            <Select value={purity} onValueChange={handlePurityChange}>
              <SelectTrigger id="gold-purity">
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
        )}
      </CardContent>
    </Card>
  );
};

export default MetalInput;
