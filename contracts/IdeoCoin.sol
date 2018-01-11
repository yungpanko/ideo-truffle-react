pragma solidity ^0.4.2;

import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract owned {
    address public owner;

    function owned() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}

contract IdeoCoin is owned {
  // public variables of the token
  string public name;
  string public symbol;
  uint8 public decimals = 18;
  uint256 public totalSupply;

  // array of all balances
  mapping (address => uint) public balanceOf;
  // public event on the blockchain that will notify clients
  event Transfer(address indexed from, address indexed to, uint256 value);

  // contstructor function
  function IdeoCoin(uint256 initialSupply, string tokenName, string tokenSymbol, uint8 decimalUnits, address centralMinter) public {
      balanceOf[msg.sender] = initialSupply;
      name = tokenName;                                   // Set the name for display purposes
      symbol = tokenSymbol;                               // Set the symbol for display purposes
      decimals = decimalUnits;                             // Amount of decimals for display purposes
      totalSupply = initialSupply * 10 ** uint256(decimals);
      if (centralMinter != 0 ) owner = centralMinter;
  }

  function sendCoin(address _to, uint256 _value) public {
      /* Check if sender has balance and for overflows */
      require(balanceOf[msg.sender] >= _value && balanceOf[_to] + _value >= balanceOf[_to]);

      /* Add and subtract new balances */
      balanceOf[msg.sender] -= _value;
      balanceOf[_to] += _value;
      /* Notify anyone listening that this transfer took place */
      Transfer(msg.sender, _to, _value);
  }

  /* Internal transfer, can only be called by this contract */
  function _transfer(address _from, address _to, uint _value) internal {
      require (_to != 0x0);                               // Prevent transfer to 0x0 address. Use burn() instead
      require (balanceOf[_from] >= _value);                // Check if the sender has enough
      require (balanceOf[_to] + _value > balanceOf[_to]); // Check for overflows
    //   require(!frozenAccount[_from]);                     // Check if sender is frozen
    //   require(!frozenAccount[_to]);                       // Check if recipient is frozen
      balanceOf[_from] -= _value;                         // Subtract from the sender
      balanceOf[_to] += _value;                           // Add the same to the recipient
      Transfer(_from, _to, _value);
  }

     function mintToken(address target, uint256 mintedAmount) onlyOwner public {
        balanceOf[target] += mintedAmount;
        totalSupply += mintedAmount;
        Transfer(0, this, mintedAmount);
        Transfer(this, target, mintedAmount);
    }

    function getBalanceInEth(address addr) public view returns(uint) {
      return ConvertLib.convert(getBalance(addr),2);
    }

    function getBalance(address addr) public view returns(uint) {
      return balanceOf[addr];
    }
  }
