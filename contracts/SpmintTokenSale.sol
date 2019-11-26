pragma solidity ^0.5.12;

import './SpmintToken.sol';

contract SpmintTokenSale {
    address payable admin;
    SpmintToken public tokenContract; // contract data type
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);
    event ConfirmSelfDestruct(bool destroyed);

    constructor(SpmintToken _tokenContract, uint256 _tokenPrice) public {
        // Assign an admin
        admin = msg.sender; // address of the person who deployed the contract
        // Assign Token Contract
        tokenContract = _tokenContract;
        // Set Token Price
        tokenPrice = _tokenPrice;
    }

    // multiply
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    // Buy Tokens
    function buyTokens(uint256 _numberOfTokens) public payable {
        // require that value is equal to tokens
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        // require that the contract has enough tokens
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        // require that a transfer is successful
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        // keep track of tokens sold
        tokensSold += _numberOfTokens;
        // emit sell event
        emit Sell(msg.sender, _numberOfTokens);
    }

    // Ending the token sale
    function endSale() public {
        // require only admin
        require(msg.sender == admin);
        // transfer the remaining amount of tokens in the sale back to the admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        // destroy the contract
        emit ConfirmSelfDestruct(true); // will revert if selfdestruct fails
        selfdestruct(admin);
    }
}
