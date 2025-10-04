// Currency utility functions
export const CURRENCY_SYMBOL = '₹';

export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    return `${CURRENCY_SYMBOL}0.00`;
  }
  
  // Format for Indian numbering system (lakhs, crores)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};

export const formatAmount = (amount) => {
  if (typeof amount !== 'number') {
    return '0.00';
  }
  
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;
  
  // Remove currency symbol and commas, then parse
  const numericString = currencyString
    .replace(/[₹,\s]/g, '')
    .replace(/[^0-9.-]/g, '');
  
  return parseFloat(numericString) || 0;
};
