import { task, types } from "hardhat/config";
import { vestingPercentPerPortion, vestingPercentPrecision, vestingPortionsUnlockTime } from "../deploy/deployKarmaPrivateVesting";

task("verify:karma_private_sale_vesting_vault", "Verify KARMA Private sale Vesting vault")
  .addParam("address", "Vesting vault address")
  .addParam("karmatoken", "KARMA Token address", null, types.string)
  .setAction(async (taskArgs, hre) => {
    const { address, karmatoken } = taskArgs;
    await hre.run("verify:verify", {
      address,
      contract: "contracts/privateSale/KarmaPrivateSaleVestingVault.sol:KarmaPrivateSaleVestingVault",
      constructorArguments: [karmatoken, vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision],
    });
  });
