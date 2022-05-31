import { BigNumber, BigNumberish } from "ethers";
import { task, types } from "hardhat/config";

export const vestingPortionsUnlockTime: BigNumberish[] = [
  0, 2592000, 5184000, 7776000, 10368000, 12960000, 15552000, 18144000, 20736000, 23328000, 25920000, 28512000, 31104000, 33696000, 36288000, 38880000,
].map((m) => BigNumber.from(m));
export const vestingPercentPerPortion: BigNumberish[] = [10000, 0, 0, 0, 7500, 7500, 7500, 7500, 7500, 7500, 7500, 7500, 7500, 7500, 7500, 7500].map((m) => BigNumber.from(m));
export const vestingPercentPrecision: BigNumberish = BigNumber.from(100000);

task("deploy:karma_private_sale_vesting_vault", "Deploy KARMA Private sale Vesting vault")
  .addParam("karmatoken", "KARMA Token address", null, types.string)
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;
    const { karmatoken } = taskArgs;

    await hre.run("compile");

    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);

    const KarmaPrivateSaleVestingVault = await ethers.getContractFactory("KarmaPrivateSaleVestingVault");
    const karmaPrivateSaleVestingVault = await KarmaPrivateSaleVestingVault.connect(deployer).deploy(karmatoken, vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision);

    await karmaPrivateSaleVestingVault.deployed();
    console.log("KARMA Private sale Vesting vault address:", karmaPrivateSaleVestingVault.address);
  });
