import React from 'react';

const Balances = ({balance1, balance2}) => {
  return (
    <div>
      <ul>
        <li>Coin Owner Balance: {balance1}</li>
        <li>Index 1 Balance: {balance2}</li>
      </ul>
    </div>
  )
}

export default Balances;
