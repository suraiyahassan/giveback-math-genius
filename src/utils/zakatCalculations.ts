
// Constants for Zakat calculation
export const GOLD_NISAB_GRAMS = 87.48; // 87.48 grams of gold
export const SILVER_NISAB_GRAMS = 612.36; // 612.36 grams of silver
export const ZAKAT_RATE = 0.025; // 2.5%

export type Currency = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD';

export interface MetalPrices {
  gold: number; // Price per gram
  silver: number; // Price per gram
}

// Sample metal prices - in a real app, these would be fetched from an API
export const DEFAULT_METAL_PRICES: MetalPrices = {
  gold: 62.5, // USD per gram
  silver: 0.78, // USD per gram
};

// Calculate Nisab threshold in currency based on gold and silver prices
export const calculateNisab = (
  metalPrices: MetalPrices = DEFAULT_METAL_PRICES,
  preferredMetal: 'gold' | 'silver' = 'silver'
): number => {
  const goldNisab = GOLD_NISAB_GRAMS * metalPrices.gold;
  const silverNisab = SILVER_NISAB_GRAMS * metalPrices.silver;
  
  // Islamic scholars often recommend using the lower value (usually silver)
  // to ensure more people can give Zakat
  return preferredMetal === 'gold' ? goldNisab : silverNisab;
};

export interface AssetValues {
  cash: number;
  gold: number;
  silver: number;
  stocks: number;
  cryptocurrency: number;
  businessAssets: number;
  receivables: number;
  otherInvestments: number;
}

export interface Liabilities {
  debts: number;
  expenses: number;
}

export interface ZakatResult {
  nisabThreshold: number;
  totalAssets: number;
  totalLiabilities: number;
  netZakatableAssets: number;
  zakatPayable: number;
  isEligible: boolean;
  breakdown: {
    category: string;
    amount: number;
    zakatAmount: number;
  }[];
}

export const calculateZakat = (
  assets: AssetValues,
  liabilities: Liabilities,
  metalPrices: MetalPrices = DEFAULT_METAL_PRICES,
  preferredMetal: 'gold' | 'silver' = 'silver'
): ZakatResult => {
  // Calculate nisab threshold
  const nisabThreshold = calculateNisab(metalPrices, preferredMetal);
  
  // Calculate total assets
  const totalAssets = Object.values(assets).reduce((sum, value) => sum + value, 0);
  
  // Calculate total liabilities
  const totalLiabilities = Object.values(liabilities).reduce((sum, value) => sum + value, 0);
  
  // Calculate net zakatable wealth
  const netZakatableAssets = totalAssets - totalLiabilities;
  
  // Check if wealth exceeds nisab threshold
  const isEligible = netZakatableAssets >= nisabThreshold;
  
  // Calculate zakat payable (2.5% of net wealth if eligible)
  const zakatPayable = isEligible ? netZakatableAssets * ZAKAT_RATE : 0;
  
  // Prepare breakdown of zakat by asset category
  const breakdown = Object.entries(assets).map(([category, amount]) => ({
    category: formatCategoryName(category),
    amount,
    zakatAmount: isEligible ? amount * ZAKAT_RATE : 0
  }));
  
  return {
    nisabThreshold,
    totalAssets,
    totalLiabilities,
    netZakatableAssets,
    zakatPayable,
    isEligible,
    breakdown
  };
};

// Helper function to format category names for display
const formatCategoryName = (category: string): string => {
  // Convert camelCase to Title Case with spaces
  const result = category.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

// Format currency values
export const formatCurrency = (
  value: number, 
  currency: Currency = 'USD',
  options: Intl.NumberFormatOptions = {}
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  }).format(value);
};
