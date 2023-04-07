import db from './db';
import { Currency } from './currencies.types';
const dbTable = 'currency_rates';

export const getRates = async (table: string = dbTable): Promise<Currency[]> => {
  return await db.many('SELECT currency_name, rate from $1:name', [table]);
};

export const updateRates = async (arr: Currency[], table: string = dbTable ): Promise<void> => {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    const id = arr[i].id; //Fields are declared one by one because of syntax errors when I use the object
    const currencyName = arr[i].currency_name;
    const rate = String(arr[i].rate);
    await db.none('INSERT INTO $1:name (id, currency_name, rate) VALUES ($2, $3, $4)\
            ON CONFLICT (currency_name) DO UPDATE SET rate=$4 WHERE $1^.currency_name=$3', [table, id, currencyName, rate]);
  }
};

