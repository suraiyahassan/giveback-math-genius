
// Constants for Zakat calculation
export const GOLD_NISAB_GRAMS = 87.48; // 87.48 grams of gold
export const SILVER_NISAB_GRAMS = 612.36; // 612.36 grams of silver
export const ZAKAT_RATE = 0.025; // 2.5%

export type Currency = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD' | 'INR';

export interface MetalPrices {
  gold: number; // Price per gram
  silver: number; // Price per gram
}

// Sample metal prices - in a real app, these would be fetched from an API
export const DEFAULT_METAL_PRICES: MetalPrices = {
  gold: 62.5, // USD per gram
  silver: 0.78, // USD per gram
};

// Gold purity conversion factors
export const GOLD_PURITY_FACTORS = {
  '24k': 1.0,    // 100% pure gold
  '22k': 0.9167, // 91.67% pure gold
  '21k': 0.875,  // 87.5% pure gold
  '20k': 0.8333, // 83.33% pure gold
  '18k': 0.75,   // 75% pure gold
  '16k': 0.6667, // 66.67% pure gold
  '14k': 0.5833, // 58.33% pure gold
};

export type GoldPurity = keyof typeof GOLD_PURITY_FACTORS;

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

// Calculate the value of gold based on weight, rate, and purity
export const calculateGoldValue = (
  weightInGrams: number,
  ratePerGram: number,
  purity: GoldPurity = '24k'
): number => {
  return weightInGrams * ratePerGram * GOLD_PURITY_FACTORS[purity];
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
  const locales: Record<Currency, string> = {
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    AUD: 'en-AU',
    CAD: 'en-CA',
    INR: 'en-IN'
  };
  
  return new Intl.NumberFormat(locales[currency], {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  }).format(value);
};
