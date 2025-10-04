// SMS Parser for extracting transaction data from bank SMS messages

export function parseBOISMS(smsText, senderAddress = '') {
  try {
    // Remove extra spaces and normalize
    const text = smsText.replace(/\s+/g, ' ').trim();
    
    // Credit SMS Pattern: "BOI - Rs.9360.00 Credited to your Ac XX9326 on 03-10-25 by UPI ref No.112115898277.Avl Bal 21080.15"
    const creditPattern = /Rs\.?([\d,]+\.?\d*)\s*Credited\s*to\s*your\s*Ac\s*(\w+)\s*on\s*([\d-]+).*?ref\s*No\.?(\w+)/i;

    // Debit SMS Pattern: "Rs.24.00 debited A/cXX9326 and credited to amolkhot751@okicici via UPI Ref No 527362569052 on 30Sep25"
    const debitPattern = /Rs\.?([\d,]+\.?\d*)\s*debited\s*A\/c(\w+).*?(?:credited\s*to\s*([^@\s]+@[^@\s]+))?.*?(?:ref\s*No\.?\s*(\w+))?.*?on\s*([\d\w]+)/i;
    
    let match = text.match(creditPattern);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      const accountNumber = match[2];
      const date = parseDate(match[3]);
      const refNumber = match[4];
      
      return {
        id: `sms_${refNumber}_${Date.now()}`,
        type: 'income',
        amount: amount,
        description: extractCreditDescription(text),
        category: categorizeTransaction(extractCreditDescription(text), 'income'),
        accountNumber: accountNumber,
        date: date,
        source: 'sms',
        refNumber: refNumber,
        bank: 'BOI',
        rawSMS: smsText,
        senderAddress: senderAddress
      };
    }
    
    match = text.match(debitPattern);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      const accountNumber = match[2];
      const recipient = match[3] || '';
      const refNumber = match[4] || '';
      const date = parseDate(match[5]);
      
      return {
        id: `sms_${refNumber || Date.now()}_${Date.now()}`,
        type: 'expense',
        amount: amount,
        description: extractDebitDescription(text, recipient),
        category: categorizeTransaction(extractDebitDescription(text, recipient), 'expense'),
        accountNumber: accountNumber,
        date: date,
        source: 'sms',
        refNumber: refNumber,
        bank: 'BOI',
        rawSMS: smsText,
        senderAddress: senderAddress
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing BOI SMS:', error);
    return null;
  }
}

  // Parse date from various formats
  function parseDate(dateStr) {
    try {
      // Handle formats like "03-10-25", "30Sep25"
      if (dateStr.includes('-')) {
        // Format: 03-10-25 (DD-MM-YY)
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // Month is 0-indexed
          const year = 2000 + parseInt(parts[2]); // Assuming 20xx
          return new Date(year, month, day).toISOString();
        }
      } else {
        // Format: 30Sep25
        const monthMap = {
          'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
          'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
        };
        
        const match = dateStr.match(/(\d{1,2})(\w{3})(\d{2})/i);
        if (match) {
          const day = parseInt(match[1]);
          const month = monthMap[match[2].toLowerCase()];
          const year = 2000 + parseInt(match[3]);
          return new Date(year, month, day).toISOString();
        }
      }
      
      // Fallback to current date
      return new Date().toISOString();
    } catch (error) {
      console.error('Error parsing date:', error);
      return new Date().toISOString();
    }
  }

  // Extract description for credit transactions
  function extractCreditDescription(text) {
    // Look for UPI reference or transaction type
    if (text.includes('UPI')) {
      return 'UPI Credit Received';
    } else if (text.includes('NEFT')) {
      return 'NEFT Credit Received';
    } else if (text.includes('RTGS')) {
      return 'RTGS Credit Received';
    } else if (text.includes('Salary')) {
      return 'Salary Credit';
    } else {
      return 'Bank Credit';
    }
  }

  // Extract description for debit transactions
  function extractDebitDescription(text, recipient = '') {
    // Extract recipient or merchant info
    if (text.includes('UPI')) {
      if (recipient) {
        return `UPI to ${recipient}`;
      }
      return 'UPI Payment';
    } else if (text.includes('ATM')) {
      return 'ATM Withdrawal';
    } else if (text.includes('POS')) {
      return 'Card Payment';
    } else {
      return 'Bank Debit';
    }
  }

  // Categorize transaction based on description
  function categorizeTransaction(description, type) {
    const desc = description.toLowerCase();
    
    if (type === 'income') {
      if (desc.includes('salary')) return 'salary';
      if (desc.includes('business')) return 'business';
      return 'other_income';
    } else {
      // Expense categorization
      if (desc.includes('upi') || desc.includes('payment')) return 'other_expense';
      if (desc.includes('atm') || desc.includes('cash')) return 'other_expense';
      if (desc.includes('grocery') || desc.includes('mart')) return 'grocery';
      if (desc.includes('food') || desc.includes('restaurant')) return 'food';
      if (desc.includes('fuel') || desc.includes('petrol')) return 'transport';
      if (desc.includes('medicine') || desc.includes('hospital')) return 'health';
      return 'other_expense';
    }
  }

  // Main parsing function that tries different bank patterns
  export function parseAnySMS(smsText, bankPattern = null) {
    // If specific bank pattern is provided, use it
    if (bankPattern === 'BOI' || smsText.includes('BOI')) {
      return parseBOISMS(smsText);
    }
    
    // Try to detect bank and parse accordingly
    if (smsText.includes('BOI') || smsText.includes('Bank of India')) {
      return parseBOISMS(smsText);
    }
    
    // Add more bank parsers here in the future
    // if (smsText.includes('HDFC')) return parseHDFCSMS(smsText);
    // if (smsText.includes('SBI')) return parseSBISMS(smsText);
    
    return null;
  }

  // Test the parser with demo data
  export function testSMSParser() {
    const creditSMS = "BOI - Rs.9360.00 Credited to your Ac XX9326 on 03-10-25 by UPI ref No.112115898277.Avl Bal 21080.15";
    const debitSMS = "Rs.24.00 debited A/cXX9326 and credited to amolkhot751@okicici via UPI Ref No 527362569052 on 30Sep25. Call 18001031906, if not done by you. -BOI";
    
    console.log('Credit SMS parsed:', parseAnySMS(creditSMS));
    console.log('Debit SMS parsed:', parseAnySMS(debitSMS));
    
    return {
      credit: parseAnySMS(creditSMS),
      debit: parseAnySMS(debitSMS)
    };
  }
