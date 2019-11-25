const SpmintTokenSale = artifacts.require('./SpmintTokenSale.sol');

contract('SpmintTokenSale', (accounts) => {
  let tokenInstance;
  let tokenPrice = 1000000000000000; // in wei - smallest subdivion of ether to avoid using floats
  before(async () => {
    tokenInstance = await SpmintTokenSale.deployed();
  });

  it('initialises the contract with the correct values', async () => {
    const address = tokenInstance.address;
    assert.notEqual(address, 0x0, 'has contract address');

    const tokenContractAddress = await tokenInstance.tokenContract();
    assert.notEqual(tokenContractAddress, 0x0, 'has token contract address');

    const price = await tokenInstance.tokenPrice();
    assert.equal(price, tokenPrice, 'token price is correct');
  });
});
