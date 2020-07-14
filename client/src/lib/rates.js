import ky from 'ky-universal';
import HOST from '@/lib/host';
const api = `${HOST}/api/rates`;

export const getRates = async () => {
  const request = await ky.get(`${api}/getRates`);
  const rates = await request.json();
  rates.unshift({ currency_name: 'USD', rate: 1 });

  return rates;
};
