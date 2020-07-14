export const twoDecimals = (number) => Math.round((number + Number.EPSILON) * 100)/100;

export const getSWR = (amount) => twoDecimals(amount * .04 / 12); //Always 4%

export const findTotal = ({ principal = 0, years = 0, monthly = 0, rate = 0, swr }) => {
  const forPrincipal = principal * (1 + rate/100) ** years;
  const totalAmount = (rate > 0) 
    ? forPrincipal + (monthly * 12 * (((1 + rate/100)**years - 1) / (rate/100)))
    : forPrincipal + monthly * 12 * years;
  return (swr)
    ? getSWR(totalAmount)
    : twoDecimals(totalAmount);
};

export const findYears = ({ goal = 0, monthly = 0, rate = 0, swr }) => {
  const fixedGoal = (swr)
    ? goal / .04 * 12
    : goal;
  const totalYears = 
    Math.log(((rate/100)*(fixedGoal/(monthly*12)))+1)
    /Math.log(1+rate/100);
  return (monthly > 0 && rate > 0)
    ? twoDecimals(totalYears)
    : 0; //Needs non-zero inputs for `monthly` and `rate`
};

export const findMonthly = ({ goal = 0, years = 1, rate = 0, swr }) => {
  const fixedGoal = (swr) //result
    ? goal / .04 * 12
    : goal;
  const fixedYears = (years > 0) ? years : 1;
  const totalMonthly = (rate > 0) 
    ? fixedGoal / (((1 + rate/100)**fixedYears - 1) / (rate/100))
    : fixedGoal / fixedYears;
  return twoDecimals(totalMonthly/12);
};

