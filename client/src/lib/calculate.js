export const twoDecimals = (number) => Math.round((number + Number.EPSILON) * 100)/100;

export const getSWR = (amount) => twoDecimals(amount * .04 / 12); //Always 4%

export const findTotal = ({ principal = 0, years = 0, monthly = 0, rate = 0 }) => {
  const forPrincipal = principal * (1 + rate/100) ** years;
  const totalAmount = (rate > 0) 
    ? forPrincipal + (monthly * 12 * (((1 + rate/100)**years - 1) / (rate/100)))
    : forPrincipal + monthly * 12 * years;
  return twoDecimals(totalAmount);
};

export const findYears = ({ goal = 0, monthly = 0, rate = 0, swr }) => {
  const fixedGoal = (swr)
    ? goal / .04 * 12
    : goal;
  const totalYears = (rate > 0)
    ? Math.log(((rate/100)*(fixedGoal/(monthly*12)))+1)
      /Math.log(1+rate/100)
    : fixedGoal/(monthly*12);
  return (monthly > 0 && goal > 0)
    ? twoDecimals(totalYears)
    : 0; // Needs non-zero inputs
};

export const findMonthly = ({ goal = 0, years = 1, rate = 0, swr }) => {
  const fixedGoal = (swr) // result currency (instead of input)
    ? goal / .04 * 12
    : goal;
  const fixedYears = (years > 0) ? years : 1;
  const totalMonthly = (rate > 0) 
    ? fixedGoal / (((1 + rate/100)**fixedYears - 1) / (rate/100))
    : fixedGoal / fixedYears;
  return twoDecimals(totalMonthly/12);
};

export const findTotalRecursive = (arr, { principal = 0, years = 0, monthly = 0, rate = 0 }) => {
  arr.push(Number(principal));

  const currentAmount = {
    principal: twoDecimals(principal * (1+rate/ 100) + monthly * 12),
    years: years - 1,
    monthly: monthly,
    rate: rate
  };

  return (years > 0)
    ? findTotalRecursive(arr, currentAmount)
    : arr;
};

//M= P[r(1+r)^n/((1+r)^n)-1)]
export const findAmortization = ({ principal = 0, years = 0, rate = 0 }) => {
  const fixedRate = (rate/100)/12;
  const duration = 12*years;

  const dm = ((1+fixedRate)**duration)-1;
  const nm = fixedRate*((1+fixedRate)**duration);
  const monthly = principal*(nm/dm);

  return (years && principal && rate)
    ? { monthly: twoDecimals(monthly), interest: twoDecimals(monthly*duration - principal) }
    : { monthly: 0, interest: 0 }; // Needs non-zero inputs
};
