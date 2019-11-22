const SpmintToken = artifacts.require('./SpmintToken.sol');

contract('SpmintToken', (accounts) => {
  let tokenInstance
  before(async () => {
    tokenInstance = await SpmintToken.deployed();
  });

  it('initialises the contract with the correct values', async () => {
    const name = await tokenInstance.name();
    assert.equal(name, 'Spmint Token', 'has the correct name');

    const symbol = await tokenInstance.symbol();
    assert.equal(symbol, 'Spnt', 'has the correct symbol');

    const standard = await tokenInstance.standard();
    assert.equal(standard, 'Spmint Token v1.0', 'has the correct standard');
  });

  it('allocates the inital supply upon deployment', async () => {
    const totalSupply = await tokenInstance.totalSupply();
    assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');

    const adminBalance = await tokenInstance.balanceOf(accounts[0]);
    assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin account')
  });

  it('transfers token ownership', async() => {
    try {
      assert.fail(await tokenInstance.transfer.call(accounts[1], 9999999)); // using transfer.call does not trigger a transaction
    } catch (err) {
      assert(err.message.includes('revert'), 'error message must contain revert');
    }

    const returnValue = await tokenInstance.transfer.call(accounts[1], 250000, {from: accounts[0]});
    assert.equal(returnValue, true, 'it returns true');

    const receipt = await tokenInstance.transfer(accounts[1], 250000, {from: accounts[0]}); // not using transfer.call triggers a transaction and returns a transaction receipt
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
    assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are from');
    assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the accounts the token are for');
    assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');

    const balance = await tokenInstance.balanceOf(accounts[1]);
    assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');

    const senderBalance = await tokenInstance.balanceOf(accounts[0]);
    assert.equal(senderBalance.toNumber(), 750000, 'deducts the amount from the sending account');
  });

  it('approves tokens for delegated tansfer', async() => {
    const success = await tokenInstance.approve.call(accounts[1], 100);
    assert.equal(success, true, 'it returns true');

    const receipt = await tokenInstance.approve(accounts[1], 100);
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    assert.equal(receipt.logs[0].event, 'Approve', 'should be the "Approve" event');
    assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are from');
    assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the accounts the token are for');
    assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
  })
});
