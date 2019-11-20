pragma solidity ^0.5.12;

contract SpmintToken {
    // Constructor
    // Set the total number of tokens
    // Read the total number of tokens
    uint256 public totalSupply; // declare a variable

    constructor() public {
        totalSupply = 1000000; // state variable - accessable to the entire contract
    }
}
