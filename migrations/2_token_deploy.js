var RToken = artifacts.require("./RToken.sol");

module.exports = function(deployer) {
  deployer.deploy(RToken);
};
