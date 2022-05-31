import { task, types } from "hardhat/config";

task("verify:karma_private_sale_crowdsale", "Verify KARMA Private sale Vesting vault")
  .addParam("address", "Crowdsale vault address")
  .addParam("karmatoken", "KARMA Token address", null, types.string)
  .addParam("raisetoken", "BUSD Token address", null, types.string)
  .addParam("raisewallet", "BUSD Raise Token address", null, types.string)
  .setAction(async (taskArgs, hre) => {
    const { address, karmatoken, raisetoken, raisewallet } = taskArgs;

    await hre.run("verify:verify", {
      address,
      contract: "contracts/privateSale/KarmaPrivateCrowdsale.sol:KarmaPrivateCrowdsale",
      constructorArguments: [karmatoken, raisetoken, raisewallet],
    });
  });
