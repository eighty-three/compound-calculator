# Compound Calculator
Just another compound calculator.\
https://eighty-three.dev/projects/compound-calculator/

Created 2020, removed commits due to credentials issue

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

* **Tabulate**
Keeps track of changes through the years, displaying the output in table form


## Technical Documentation
### Calculations
You can check [here](/src/lib/calculate.js) to see the (very simple) maths behind the calculations

### Rates
They are fetched from `freeforexapi.com`
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
