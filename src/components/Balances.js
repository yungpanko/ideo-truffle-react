import React from 'react';

const Balances = ({balance1, balance2}) => {
  // Create our number formatter.
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  // the default value for minimumFractionDigits depends on the currency
  // and is usually already 2
})

  return (
    <div>
      <ul>
        <li>Amy's Balance: {formatter.format(balance1)}</li>
        <li>Theo's Balance: {formatter.format(balance2)}</li>
      </ul>
    </div>
  )
}

export default Balances;
