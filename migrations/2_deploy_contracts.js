const SpmintToken = artifacts.require("SpmintToken");

module.exports = function(deployer) {
  deployer.deploy(SpmintToken);
};
