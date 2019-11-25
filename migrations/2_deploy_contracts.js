const SpmintToken = artifacts.require("SpmintToken");
const SpmintTokenSale = artifacts.require("SpmintTokenSale");

module.exports = async function(deployer) {
  const tokenPrice = 1000000000000000; // Token Price is 0.001 ether
  await deployer.deploy(SpmintToken, 1000000);
  await deployer.deploy(SpmintTokenSale, SpmintToken.address, tokenPrice);
};
