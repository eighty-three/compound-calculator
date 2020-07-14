import request from 'supertest';
import http from 'http';
import app from '../app';
import { fetchRates } from './currencies';
const server = http.createServer(app).listen(8090); // Different port for tests
const url = '/api/rates/getRates';
const currencies = 6;

afterAll( async () => {
  server.close();
});

describe('for getRates', () => {
  test('number of currencies in database', async () => {
    const arr = await request(server).get(url);
    expect(arr.body.length).toEqual(currencies); // Test if it's still the same currencies saved
  });
});

describe('for fetchRates', () => {
  test('number of currencies fetched', async () => {
    console.log('fetching rates from external API...');
    const newRates = await fetchRates();
    console.log('fetching success?');
    expect(newRates.length).toEqual(currencies); // Sufficient because of validations in place
  });
});
