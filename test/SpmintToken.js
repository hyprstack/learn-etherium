const SpmintToken = artifacts.require('./SpmintToken.sol');

contract('SpmintToken', (accounts) => {
  it('sets the total supply upon deployment', async () => {
    const tokenInstance = await SpmintToken.deployed();
    const totalSupply = await tokenInstance.totalSupply();
    assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
  });
});
