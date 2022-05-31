import "@nomiclabs/hardhat-ethers";
import { BigNumber } from "ethers";
import { task } from "hardhat/config";

task("verify:karma", "Verify KARMA ERC20", async (taskArgs, hre) => {
  await hre.run("verify:verify", {});
});
