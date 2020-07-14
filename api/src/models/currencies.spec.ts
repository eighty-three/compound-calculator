import * as currencies from './currencies';
const testTable = 'currency_rates_test';

const oldData = [
  {
    id: 0,
    currency_name: 'USDPHP',
    rate: 60.075,
  },
  {
    id: 1,
    currency_name: 'USDEUR',
    rate: 1.967,
  },
  {
    id: 2,
    currency_name: 'USDJPY',
    rate: 107.248,
  }
];

const newData = [
  {
    id: 0,
    currency_name: 'USDPHP',
    rate: 61.075,
  },
  {
    id: 1,
    currency_name: 'USDEUR',
    rate: 1.867,
  },
  {
    id: 2,
    currency_name: 'USDJPY',
    rate: 108.248,
  }
];

beforeAll(async () => {
  await currencies.updateRates(oldData, testTable);
});

afterAll(async () => {
  await currencies.updateRates(oldData, testTable);
});

describe('for getRates', () => {
  test('to be true, currencies should exist in database', async () => {
    const response = await currencies.getRates(testTable);
    const names = response.map(rate => rate.currency_name);
    expect(names.includes('USDJPY')).toBe(true);
    expect(names.includes('USDEUR')).toBe(true);
    expect(names.includes('USDPHP')).toBe(true);
  });

  test('to be false, currency doesn\'t exist in database', async () => {
    const response = await currencies.getRates(testTable);
    const names = response.map(rate => rate.currency_name);
    expect(names.includes('USDAED')).toBe(false);
  });
  
  test('should return correct value', async () => {
    const response = await currencies.getRates(testTable);
    const names = response.map(rate => rate.currency_name);
    const index = names.indexOf('USDPHP'); 
    expect(response[index].rate).toEqual(60.075);
  });

  test('should return false, wrong value', async () => {
    const response = await currencies.getRates(testTable);
    const names = response.map(rate => rate.currency_name);
    const index = names.indexOf('USDJPY'); 
    expect(response[index].rate === 108.248).toEqual(false);
  });
});

describe('for updateRates', () => {
  test('should return new value when getting rates', async () => {
    await currencies.updateRates(newData, testTable);
    const response = await currencies.getRates(testTable);
    const names = response.map(rate => rate.currency_name);
    const index = names.indexOf('USDJPY'); 
    expect(response[index].rate).toEqual(108.248);
  });

  test('should return false when comparing old rates', async () => {
    const response = await currencies.getRates(testTable);
    const names = response.map(rate => rate.currency_name);
    const index = names.indexOf('USDPHP'); 
    expect(response[index].rate === 60.075).toEqual(false);
  });
});

