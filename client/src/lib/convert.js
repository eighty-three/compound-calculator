export const findTotal = ({ principal, years, monthly, rate }) => {
  const totalAmount = 
    (principal * (1 + rate/100)**years) +
    (monthly * 12 * (((1 + rate/100)**years - 1) / (rate/100)));
  return Math.trunc(totalAmount); 
};

