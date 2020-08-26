import ky from 'ky-universal';
import { RequestHandler } from 'express';
import { currencies } from '../models';
import { Currency } from './currencies.types';
import { currencySchema } from './currencies.schema';

export const getRates: RequestHandler = async (req, res) => {
  const rates = await currencies.getRates();
  for (let i=0; i < rates.length; i++) {
    rates[i].currency_name = rates[i].currency_name.split('USD')[1];
  } 

  /* From { currency_name: 'USDEUR', rate: 0.844131 } 
   * to { currency_name: 'EUR', rate: 0844131 }
   * I (initially) wanted to add other pairs which is why
   * the naming scheme I saved in the database is like so
   */

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

