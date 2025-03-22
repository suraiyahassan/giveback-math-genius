
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { formatCurrency, Currency } from '@/utils/zakatCalculations';

interface AssetInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  description?: string;
  currency?: Currency;
  className?: string;
}

const AssetInput: React.FC<AssetInputProps> = ({
  id,
  label,
  value,
  onChange,
  description,
  currency = 'USD',
  className = '',
}) => {
  // Handle numeric input with formatting
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters except decimal point
    const cleanValue = e.target.value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleanValue.split('.');
    const sanitizedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    
    // Convert to number or default to 0
    const numericValue = sanitizedValue === '' ? 0 : parseFloat(sanitizedValue);
    
    // Update state
    onChange(numericValue);
  };

  // Increment and decrement handlers
  const increment = () => {
    onChange(value + 100); // Increment by 100 units
  };
  
  const decrement = () => {
    const newValue = Math.max(0, value - 100); // Prevent negative values
    onChange(newValue);
  };

  return (
    <div className={`relative stagger-item space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <span className="text-xs text-muted-foreground">
          {formatCurrency(value, currency)}
        </span>
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={decrement}
          className="absolute left-2 z-10 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Decrease value"
        >
          <MinusCircle className="h-4 w-4" />
        </button>
        
        <Input
          id={id}
          type="text"
          value={value === 0 ? '' : value.toString()}
          onChange={handleChange}
          placeholder="0.00"
          className="pl-10 pr-10 text-center focus-visible:ring-primary"
        />
        
        <button
          type="button"
          onClick={increment}
          className="absolute right-2 z-10 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Increase value"
        >
          <PlusCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AssetInput;
