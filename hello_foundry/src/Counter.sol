// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "solmate-utils/LibString.sol";

contract Counter {
    uint256 public number;

    event IncrementCounter(uint256 newNumber);
    event SetNewNumber(uint256 newNumber);

    constructor(uint256 startNumber) {
        number = startNumber;
    }

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;

        emit IncrementCounter(number);
    }
}
