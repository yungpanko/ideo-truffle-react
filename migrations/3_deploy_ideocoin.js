var ConvertLib = artifacts.require("./ConvertLib.sol");
var IdeoCoin = artifacts.require("IdeoCoin");
var Owned = artifacts.require("owned");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.deploy(Owned);
  deployer.link(ConvertLib, IdeoCoin);
  deployer.deploy(IdeoCoin, 21000000, "IdeoCoin", "IDC", 18, '0x627306090abaB3A6e1400e9345bC60c78a8BEf57');
};
