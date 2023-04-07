import * as calculate from './calculate';

expect.extend({
  // https://jestjs.io/docs/en/expect#expectextendmatchers
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

describe('for twoDecimals and getSWR', () => {
  test('two decimals', () => {
    const result = calculate.twoDecimals(100.123);
    expect(result).toEqual(100.12);
  });

  test('two decimals rounded up', () => {
    const result = calculate.twoDecimals(100.125);
    expect(result).toEqual(100.13);
  });

  test('getSWR', () => {
    const result = calculate.getSWR(30000);
    expect(result).toEqual(100);
  });

  test('getSWR with decimals', () => {
    const result = calculate.getSWR(5000);
    expect(result).toEqual(16.67);
  });
});

describe('for findTotal', () => {
  test('empty object', () => { 
    // Can't send non-object because of the way the forms work
    // Empty object is also the default state
    const result = calculate.findTotal({});
    expect(result).toEqual(0);
  });

  test('rate = 0', () => { 
    const result = calculate.findTotal({
      principal: 10000,
      years: 5,
      monthly: 1000,
      rate: 0
    });

    expect(result).toEqual(70000);
  });

  test('normal behavior', () => { 
    const result = calculate.findTotal({
      principal: 10000,
      years: 1,
      monthly: 1000,
      rate: 5
    });

    expect(result).toEqual(22500);
  });

  test('with decimals', () => { 
    const result = calculate.findTotal({
      principal: 10000,
      years: 2,
      monthly: 1000,
      rate: 3.5
    });

    expect(result).toEqual(35132.25);
  });
});

describe('for findYears', () => {
  test('empty object', () => { 
    // Can't send non-object because of the way the forms work
    // Empty object is also the default state
    const result = calculate.findYears({});
    expect(result).toEqual(0);
  });

  test('rate = 0', () => { 
    const result = calculate.findYears({
      goal: 12000,
      monthly: 1000,
      rate: 0
    });

    expect(result).toEqual(1);
  });

  test('goal = 0', () => { 
    const result = calculate.findYears({
      goal: 0,
      monthly: 1000,
      rate: 5
    });

    expect(result).toEqual(0);
  });

  test('monthly = 0', () => { 
    const result = calculate.findYears({
      goal: 12000,
      monthly: 0,
      rate: 5
    });

    expect(result).toEqual(0);
  });

  test('normal behavior', () => { 
    const result = calculate.findYears({
      goal: 12000,
      monthly: 1000,
      rate: 5
    });

    expect(result).toEqual(1);
  });

  test('with decimals', () => { 
    const result = calculate.findYears({
      goal: 12000,
      monthly: 500,
      rate: 5
    });

    expect(result).toEqual(1.95);
  });

  test('with swr', () => { 
    const result = calculate.findYears({
      goal: 1000,
      monthly: 10000,
      rate: 5,
      swr: true
    });

    expect(result).toBeWithinRange(2.40, 2.42);

    const check = calculate.findTotal({
      principal: 0,
      years: 2.41,
      monthly: 10000,
      rate: 5
    });

    expect(check).toBeWithinRange(299000, 300100);
  });
});

//export const findMonthly = ({ goal = 0, years = 1, rate = 0, swr }) => {
describe('for findMonthly', () => {
  test('empty object', () => { 
    // Can't send non-object because of the way the forms work
    // Empty object is also the default state
    const result = calculate.findMonthly({});
    expect(result).toEqual(0);
  });

  test('rate = 0', () => { 
    const result = calculate.findMonthly({
      goal: 12000,
      years: 1,
      rate: 0
    });

    expect(result).toEqual(1000);
  });

  test('goal = 0', () => { 
    const result = calculate.findMonthly({
      goal: 0,
      years: 1,
      rate: 5
    });

    expect(result).toEqual(0);
  });

  test('years = 0', () => { 
    const result = calculate.findMonthly({
      goal: 12000,
      years: 0, // Defaults to 1
      rate: 5
    });

    expect(result).toEqual(1000);
  });

  test('normal behavior', () => { 
    const result = calculate.findMonthly({
      goal: 12000,
      years: 1,
      rate: 5
    });

    expect(result).toEqual(1000);
  });

  test('with decimals', () => { 
    const result = calculate.findMonthly({
      goal: 15000,
      years: 2,
      rate: 5
    });

    expect(result).toEqual(609.76);

    const check = calculate.findTotal({
      principal: 0,
      years: 2,
      monthly: 609.76,
      rate: 5
    });

    expect(check).toBeWithinRange(14900, 15100);
  });

  test('with swr', () => { 
    const result = calculate.findMonthly({
      goal: 1000,
      years: 2,
      rate: 5,
      swr: true
    });

    expect(result).toBeWithinRange(12100, 12200);

    const check = calculate.findTotal({
      principal: 0,
      years: 2,
      monthly: 12180,
      rate: 5
    });

    expect(check).toBeWithinRange(299000, 300100);
  });
});

describe('for findTotalRecursive', () => {
  test('empty args', () => { 
    const result = calculate.findTotalRecursive([], {});
    expect(result).toEqual([0]);
  });

  test('rate = 0', () => { 
    const result = calculate.findTotalRecursive([], {
      principal: 10000,
      years: 3,
      monthly: 1,
      rate: 0
    });

    expect(result).toEqual([10000, 10012, 10024, 10036]);
  });

  test('monthly = 0', () => { 
    const result = calculate.findTotalRecursive([], {
      principal: 10000,
      years: 3,
      monthly: 0,
      rate: 5
    });

    expect(result).toEqual([10000, 10500, 11025, 11576.25]);
  });

  test('year = 1', () => { 
    const result = calculate.findTotalRecursive([], {
      principal: 10000,
      years: 1,
      monthly: 1000,
      rate: 5
    });

    expect(result).toEqual([10000, 22500]);
  });
});
