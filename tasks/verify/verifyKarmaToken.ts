import { task } from "hardhat/config";

task("verify:karma", "Verify KARMA ERC20")
  .addParam("address", "Token address")
  .setAction(async (taskArgs, hre) => {
    const { address } = taskArgs;
    await hre.run("verify:verify", {
      address,
      contract: "contracts/common/KarmaToken.sol:KarmaToken",
      constructorArguments: [],
    });
  });
