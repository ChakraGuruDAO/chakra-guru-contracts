import "@nomiclabs/hardhat-ethers";
import { BigNumber } from "ethers";
import { task } from "hardhat/config";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address, await account.getBalance().then((balance) => balance.div(BigNumber.from(10).pow(18)).toString()));
  }
});
