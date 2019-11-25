pragma solidity ^0.5.12;

import './SpmintToken.sol';

contract SpmintTokenSale {
    address admin;
    SpmintToken public tokenContract; // contract data type
    uint256 public tokenPrice;

    constructor(SpmintToken _tokenContract, uint256 _tokenPrice) public {
        // Assign an admin
        admin = msg.sender; // address of the person who deployed the contract
        // Assign Token Contract
        tokenContract = _tokenContract;
        // Set Token Price
        tokenPrice = _tokenPrice;
    }
}
