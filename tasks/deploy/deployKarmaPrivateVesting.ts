import { BigNumber, BigNumberish } from "ethers";
import { task, types } from "hardhat/config";
import { Duration } from "~/test/_base";

export const vestingPortionsUnlockTime: BigNumberish[] = [
  0,
  Duration().days(30).toNumber(),
  Duration().days(60).toNumber(),
  Duration().days(90).toNumber(),
  Duration().days(120).toNumber(),
  Duration().days(150).toNumber(),
  Duration().days(180).toNumber(),
  Duration().days(210).toNumber(),
  Duration().days(240).toNumber(),
  Duration().days(270).toNumber(),
  Duration().days(300).toNumber(),
  Duration().days(330).toNumber(),
  Duration().days(360).toNumber(),
  Duration().days(390).toNumber(),
  Duration().days(420).toNumber(),
  Duration().days(450).toNumber(),
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
