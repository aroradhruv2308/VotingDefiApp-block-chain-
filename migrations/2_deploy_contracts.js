// the migration is basically used to deplow our smart contract
//here we have declared an artifact for the given election contract and now we can use this 

var Election = artifacts.require("./Election.sol");

module.exports = function(deployer) {
  deployer.deploy(Election);
};
