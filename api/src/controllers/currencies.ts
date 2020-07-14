import ky from 'ky-universal';
import { Request, Response } from 'express';
import { currencies } from '../models';
import { Currency } from './currencies.types';
import { currencySchema } from './currencies.schema';

export const getRates = async (req: Request, res: Response): Promise<void> => {
  const rates = await currencies.getRates();
  for (let i=0; i < rates.length; i++) {
    rates[i].currency_name = rates[i].currency_name.split('USD')[1];
  }

  res.json(rates);
};

export const fetchRates = async (): Promise<Currency[]> => {
  const url = 'https://www.freeforexapi.com/api/live?pairs=USDEUR,USDJPY,USDPHP,USDAUD,USDNZD,USDAED';
  console.log('Fetching rates...');
  const response = await ky(url);
  const result = await response.json();
  const newRates = result.rates;

  const newRatesSorted = [];
  for (const currency in newRates) {
    const newCurrency: Currency = {
      id: newRatesSorted.length,
      currency_name: currency,
      rate: newRates[currency].rate 
    };

    const { error } = currencySchema.validate(newCurrency);
    if (error == null) newRatesSorted.push(newCurrency);
  }

  return newRatesSorted;
};

export const updateRates = async (): Promise<void> => {
  try {
    const newRates = await fetchRates();
    await currencies.updateRates(newRates);
  } catch (err) {
    console.log(err);
  }
};

