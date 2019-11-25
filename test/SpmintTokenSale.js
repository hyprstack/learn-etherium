const SpmintTokenSale = artifacts.require('./SpmintTokenSale.sol');
const SpmintToken = artifacts.require('./SpmintToken.sol');

contract('SpmintTokenSale', (accounts) => {
  let tokenSaleInstance;
  let tokenInstance;

  const tokenPrice = 1000000000000000; // in wei - smallest subdivion of ether to avoid using floats
  const admin = accounts[0];
  const buyer = accounts[1];
  const tokensAvailable = 750000;

  before(async () => {
    tokenInstance = await SpmintToken.deployed();
    tokenSaleInstance = await SpmintTokenSale.deployed();
  });

  it('initialises the contract with the correct values', async () => {
    const address = tokenSaleInstance.address;
    assert.notEqual(address, 0x0, 'has contract address');

    const tokenContractAddress = await tokenSaleInstance.tokenContract();
    assert.notEqual(tokenContractAddress, 0x0, 'has token contract address');

    const price = await tokenSaleInstance.tokenPrice();
    assert.equal(price, tokenPrice, 'token price is correct');
  });

  it('facilitates token buying', async () => {
    const numberOfTokens = 10;
    const value = numberOfTokens * tokenPrice;

    // provision 75% of all tokens to token sale
    await tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin});

    const receipt = await tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value});
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
    assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
    assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');


    const amount = await tokenSaleInstance.tokensSold();
    assert.equal(amount.toNumber(), numberOfTokens, 'check the number of tokens sold is the same amount bought');

    const buyersBalance = await tokenInstance.balanceOf(buyer);
    assert.equal(buyersBalance.toNumber(), numberOfTokens, 'buyers tokens increases');

    const balance = await tokenInstance.balanceOf(tokenSaleInstance.address);
    assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens, 'tokenInstance token decreases');
    // try to buy token different from the ether value
    try {
      assert.fail(await tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: 1}));
    } catch (err) {
      assert(err.message.includes('revert'), 'msg.value must equal number of tokens in wei');
    }

    // try to purchase more tokens than there are available in the contract
    try {
      assert.fail(await tokenSaleInstance.buyTokens(800000, {from: buyer, value: numberOfTokens * tokenPrice}));
    } catch (err) {
      assert(err.message.includes('revert'), 'cannot purchase more tokens than available');
    }
  });
});
