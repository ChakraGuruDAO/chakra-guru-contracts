import { BigNumber } from "ethers";
import { task } from "hardhat/config";

task("deploy:karma", "Deploy KARMA ERC20", async (taskArgs, hre) => {
  const { ethers } = hre;

  await hre.run("compile");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const KarmaToken = await ethers.getContractFactory("KarmaToken");
  const karmaToken = await KarmaToken.connect(deployer).deploy();

  await karmaToken.deployed();

  console.log("KARMA Token address:", karmaToken.address);
});
