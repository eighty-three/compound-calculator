# Compound Calculator
Just another compound calculator.\
https://eightythree.dev/projects/compound-calculator/

## Usage
You can choose between 3 different modes: `Total`, `Years`, `Monthly`.
* **Total**
  * Set the principal, number of years, monthly contributions, and the interest rate
  * The output includes both the total amount and the expected monthly income given a 4% withdrawal rate (`Total * .04 / 12`)

* **Years**
  * Set the goal amount, monthly contributions, and the interest rate
  * The output is how long it'll take for you to reach the goal amount

* **Monthly**
  * Set the goal amount, number of years, and the interest rate
  * The output is how much you'll need to contribute monthly for you to reach the goal amount

### Other toggles
* **Goal**
  * In `Years` and `Monthly` mode, you can toggle the `Goal` mode
  * You can choose between `Total` and `SWR` where SWR is the expected monthly income given a 4% withdrawal rate (`Goal / .04 * 12`)
![Goal](/docs/goal.png)

* **Currency**
  * You can toggle the currency of both the `input` and the `result` (limited selection only)
  * In `Years` mode, the `input` is the monthly contributions, while the `result` is the goal amount
  * The currency rates have USD as the base. 
  * The rates are from `freeforexapi.com`, updated every 6 hours
![Currency](/docs/currency.png)

## Technical Documentation
### Calculations
You can check `/src/lib/calculate.js` to see the (very simple) maths behind the calculations.\
There are some conditionals included for when `inputs === 0`. For example:
```javascript
  // If interest rate is included or not
  const totalAmount = (rate > 0) 
    ? forPrincipal + (monthly * 12 * (((1 + rate/100)**years - 1) / (rate/100)))
    : forPrincipal + monthly * 12 * years;
```
For `Goal` mode toggle:
```javascript
  const fixedGoal = (swr)
    ? goal / .04 * 12
    : goal;
```
### Rates
They are fetched from `freeforexapi.com`
```
export const fetchRates = async (): Promise<Currency[]> => {
  const url = 'https://www.freeforexapi.com/api/live?pairs=USDEUR,USDJPY,USDPHP,USDAUD,USDNZD,USDAED';
  const response = await ky(url);

  //Validate the response, sort it into preferred structure..

  return newRatesSorted;
};

export const updateRates = async (): Promise<void> => {
  ...
  const newRates = await fetchRates();
  await currencies.updateRates(newRates);
  ...
};
```

And stored in the following table:
```
CREATE TABLE currency_rates (
  id int PRIMARY KEY NOT NULL,
  currency_name char(6) UNIQUE NOT NULL,
  rate real NOT NULL
);
```
They are updated every 6 hours via `node-cron`:
```javascript
if (config.NODE_ENV === 'production') {
  const task = cron.schedule('* */6 * * *', () => {
    console.log('Starting cron...');
    updateRates(); 
  });

  updateRates();
  task.start();
}
```

In the client, these rates are used via a `useContext` hook.
First, fetch the rates from the server. There are modifications
I added in this step of the process instead of doing them when 
updating the rates because I am still unsure how I want to store 
the rates, if I want to do something else with them in the future
```javascript
  // /api/src/controllers/currencies.ts
  export const getRates = async (req: Request, res: Response): Promise<void> => {
    const rates = await currencies.getRates();
    for (let i=0; i < rates.length; i++) {
      rates[i].currency_name = rates[i].currency_name.split('USD')[1];
    }

    res.json(rates);
  };
```
A base USD currency is included
```javascript
  // /client/src/lib/rates.js
  export const getRates = async () => {
    const request = await ky.get(`${api}/getRates`);
    const rates = await request.json();
    rates.unshift({ currency_name: 'USD', rate: 1 });

    return rates;
  };
```

In the client, setting the currency:
```javascript
  // /client/src/lib/CurrenciesContext.js
  const CurrenciesContext = React.createContext(null);
  export default CurrenciesContext;

  // The context is used
  const [ currencies, setCurrencies ] = useState({ 
    input: { ...rates[0] },
    result: { ...rates[0] }
  });

  ...

  <CurrenciesContext.Provider value={currencies}>
  	<ComputeModes />
  </CurrenciesContext.Provider>

  // /client/components/CurrencyRates.jsx
  const toggleMode = () => {
    (mode === 'input')
      ? setMode('result')
      : setMode('input');
  };

  const setRate = (mode, currency) => {
    setCurrencies({
      ...currencies,
      [mode]: {...currency}
    });
  };

  ...

  onClick={() =>
    setRate(mode, { 
      'currency_name': currency.currency_name, 
      'rate': currency.rate 
    })
  }
```
Using the currency:
```javascript
  // /client/src/components/Forms/TotalForm.jsx
  const currencies = useContext(CurrenciesContext);

  const convertedResult = new Intl.NumberFormat('en-US', 
    { style: 'currency', currency: currencies.result.currency_name })
    .format(twoDecimals(result / currencies.input.rate * currencies.result.rate));

  ...

  {convertedResult}
```
### Updating results upon form input change
I passed down a the `setFormInputs` to the `Field` component
```javascript
  // /client/src/components/Forms/TotalForm.jsx
  const [ formInputs, setFormInputs ] = useState({});

  const result = findTotal(formInputs);

  const handleChange = ({ target }) => setFormInputs({ 
    ...formInputs, 
    [target.name]: target.value 
  });

  const fieldProps = { handleChange, register };

  ...
  <PrincipalField {...fieldProps}/>
  //There were other keys included initially before I managed to simplify it, hence the spread
  ...
  {result}
```
And attached that function to the `onChange` property of the form
```javascript
  // /client/src/components/Forms/IndividualFields/PrincipalField.jsx
  const PrincipalField = ({ handleChange, register }) => {
    ...
    onChange={handleChange}
    ...
  }
```
