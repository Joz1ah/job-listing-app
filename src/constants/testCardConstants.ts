// testCardConstants.ts
export const TEST_CARD_NUMBERS = [
  // Visa test cards
  '4111111111111111', 
  '4012888888881881', 
  '4000056655665556', 
  '4007000000000007',
  '4007000000000027', 
  '4012888888888881', 
  '4242424242424242', 
  '4000000000000002',
  '4000000000009995', 
  '4000000000009987', 
  '4000000000009979', 
  '4000000000000069',
  '4000000000000119', 
  '4000000000005126', 
  '4000000000000341', 
  '4000000000003055',
  '4000002500003155', 
  '4000111111111115', 
  '4000000000000101', 
  '4000000000000127',
  
  // MasterCard test cards
  '5555555555554444', 
  '5105105105105100', 
  '2223000048400011', 
  '2222400070000005',
  '5424000000000015', 
  '2223000010309703', 
  '2223000010309711', 
  '5500000000000004',
  
  // American Express test cards
  '378282246310005', 
  '371449635398431', 
  '370000000000002', 
  '378734493671000',
  
  // Discover test cards
  '6011111111111117', 
  '6011000990139424', 
  '6011000000000004', 
  '6011000000000012',
  
  // Diners Club test cards
  '30569309025904', 
  '38520000023237', 
  '38000000000006',
  
  // JCB test cards
  '3530111333300000', 
  '3566002020360505', 
  '3088000000000017',
  
  // China UnionPay test cards
  '6221499053360818', 
  '6221234567890000',
  
  // Maestro test cards
  '6759649826438453'
];

export const isTestCard = (cardNumber: string): boolean => {
  // Remove all spaces and non-numeric characters
  const cleanedNumber = cardNumber.replace(/\D/g, '');
  
  // Check if the cleaned card number matches any test card
  return TEST_CARD_NUMBERS.includes(cleanedNumber);
};

export const isProductionEnvironment = (): boolean => {
  const hostname = window.location.hostname;
  
  // Check for UAT and PROD environments based on hostname only
  return hostname === 'uat-akaza-app.akaza.io' || 
         hostname === 'akaza.io';
};

export const isUATEnvironment = (): boolean => {
  return window.location.hostname === 'uat-akaza-app.akaza.io';
};

export const isPRODEnvironment = (): boolean => {
  return window.location.hostname === 'akaza.io';
};